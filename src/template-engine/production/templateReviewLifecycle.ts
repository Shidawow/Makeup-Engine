import type { TemplateProductionTask } from '../../templates/schema/template-production-batch.schema';
import type {
  TemplateProductionPublishConfirmation,
  TemplateProductionQaIssue,
  TemplateProductionReviewReason,
} from '../../templates/schema/template-production-qa.schema';
import {
  TEMPLATE_PRODUCTION_REVIEW_REASON_LABELS,
  TEMPLATE_PRODUCTION_REVIEW_REASONS,
} from '../../templates/schema/template-production-qa.schema';
import { stableHash } from '../../templates/storage/datasetExport';
import {
  appendProductionTaskEvent,
  markTaskApproved,
  markTaskPublished,
  updateProductionTaskStatus,
  validateProductionStatusTransition,
} from './templateProductionStateMachine';

export interface TemplateReviewSummary {
  reviewStatus: TemplateProductionTask['templateReviewStatus'];
  publishStatus: TemplateProductionTask['publishStatus'];
  nextAction: string;
  rejectReason?: TemplateProductionReviewReason;
  rejectReasonText?: string;
  publishConfirmation?: TemplateProductionPublishConfirmation;
}

export interface RejectReasonSummary {
  reason: TemplateProductionReviewReason;
  label: string;
  count: number;
}

const now = () => new Date().toISOString();

const qaIssue = (
  code: string,
  message: string,
  source: TemplateProductionQaIssue['source'],
  reason?: TemplateProductionReviewReason,
): TemplateProductionQaIssue => ({
  code,
  message,
  severity: 'blocking',
  source,
  nextAction: message,
  reason,
});

export const validateRejectReason = (
  reason: string | undefined,
): { valid: boolean; reason?: TemplateProductionReviewReason; issues: TemplateProductionQaIssue[] } => {
  if (!reason) {
    return {
      valid: false,
      issues: [
        qaIssue(
          'reject-reason-required',
          'reject 必须选择固定 taxonomy 中的原因',
          'template-review',
          'operator_rejected_quality',
        ),
      ],
    };
  }

  if (!TEMPLATE_PRODUCTION_REVIEW_REASONS.includes(reason as TemplateProductionReviewReason)) {
    return {
      valid: false,
      issues: [
        qaIssue(
          'reject-reason-invalid',
          `reject reason ${reason} 不在固定 taxonomy 中`,
          'template-review',
          'operator_rejected_quality',
        ),
      ],
    };
  }

  return {
    valid: true,
    reason: reason as TemplateProductionReviewReason,
    issues: [],
  };
};

export const getRejectReasonDisplayText = (
  reason: TemplateProductionReviewReason,
): string => TEMPLATE_PRODUCTION_REVIEW_REASON_LABELS[reason];

export const rejectTemplateProductionTaskWithReason = (
  task: TemplateProductionTask,
  input: {
    reason?: TemplateProductionReviewReason;
    note?: string;
    rejectedBy?: string;
    rejectedAt?: string;
  },
): TemplateProductionTask => {
  const validation = validateRejectReason(input.reason);

  if (!validation.valid || !validation.reason) {
    return {
      ...task,
      qaIssues: [...(task.qaIssues ?? []), ...validation.issues],
      issues: [
        ...task.issues,
        ...validation.issues.map((issueEntry) => ({
          code: issueEntry.code,
          message: issueEntry.message,
          severity: 'error' as const,
          source: 'template-review' as const,
        })),
      ],
    };
  }

  const rejectedAt = input.rejectedAt ?? now();
  const withReason = appendProductionTaskEvent(
    {
      ...task,
      currentStatus: 'rejected',
      templateReviewStatus: 'rejected',
      publishStatus: 'rejected',
      rejectReason: validation.reason,
      rejectNote: input.note,
      rejectedAt,
      rejectedBy: input.rejectedBy,
      updatedAt: rejectedAt,
    },
    {
      eventType: 'reject-reason-recorded',
      status: 'rejected',
      timestamp: rejectedAt,
      message: `reject reason: ${validation.reason}`,
      metadata: {
        reason: validation.reason,
        note: input.note ?? null,
        rejectedBy: input.rejectedBy ?? null,
      },
    },
  );

  return appendProductionTaskEvent(withReason, {
    eventType: 'rejected',
    status: 'rejected',
    timestamp: rejectedAt,
    message: 'template rejected by operator',
    metadata: {
      reason: validation.reason,
      note: input.note ?? null,
      rejectedBy: input.rejectedBy ?? null,
    },
  });
};

export const rejectTemplateProductionTask = (
  task: TemplateProductionTask,
  reason: TemplateProductionReviewReason,
  note?: string,
): TemplateProductionTask =>
  rejectTemplateProductionTaskWithReason(task, { reason, note });

export const markTemplateReadyForReview = (
  task: TemplateProductionTask,
): TemplateProductionTask =>
  updateProductionTaskStatus(task, 'ready_for_template_review', 'template ready for review');

export const approveTemplateProductionTask = (
  task: TemplateProductionTask,
): TemplateProductionTask => markTaskApproved(task);

export const createPublishConfirmation = (input: {
  taskId: string;
  confirmedAt?: string;
  confirmedBy?: string;
  operatorNote?: string;
}): TemplateProductionPublishConfirmation => {
  const confirmedAt = input.confirmedAt ?? now();

  return {
    confirmationId: `template-production-publish-confirmation-${stableHash({
      taskId: input.taskId,
      confirmedAt,
      confirmedBy: input.confirmedBy ?? 'operator',
      operatorNote: input.operatorNote ?? '',
    })}`,
    confirmedAt,
    confirmedBy: input.confirmedBy,
    operatorNote: input.operatorNote,
    localPublished: true,
    notOnlineRelease: true,
    noTrainingDataset: true,
  };
};

export const validatePublishConfirmation = (
  task: TemplateProductionTask,
  confirmation?: TemplateProductionPublishConfirmation,
): { valid: boolean; issues: TemplateProductionQaIssue[] } => {
  const issues: TemplateProductionQaIssue[] = [];

  if (task.currentStatus !== 'approved') {
    issues.push(
      qaIssue(
        'approval-required',
        'publish confirmation 前必须先 approved',
        'publish',
        'publish_without_approval_blocked',
      ),
    );
  }

  if (task.currentStatus === 'rejected' || task.templateReviewStatus === 'rejected') {
    issues.push(
      qaIssue(
        'rejected-task-not-publishable',
        'rejected task 不能创建 publish confirmation',
        'publish',
        'publish_without_approval_blocked',
      ),
    );
  }

  if (!confirmation) {
    issues.push(
      qaIssue(
        'publish-confirmation-required',
        'publish 前必须确认本地状态、非线上发布、不会上传服务器、不会生成 training dataset',
        'publish',
        'publish_without_approval_blocked',
      ),
    );
  } else if (
    confirmation.localPublished !== true ||
    confirmation.notOnlineRelease !== true ||
    confirmation.noTrainingDataset !== true
  ) {
    issues.push(
      qaIssue(
        'publish-confirmation-incomplete',
        'publish confirmation 必须同时确认 local-only、not online release、no training dataset',
        'publish',
        'publish_without_approval_blocked',
      ),
    );
  }

  return {
    valid: issues.length === 0,
    issues,
  };
};

export const confirmPublishProductionTask = (
  task: TemplateProductionTask,
  input: {
    confirmedBy?: string;
    operatorNote?: string;
    confirmedAt?: string;
  } = {},
): TemplateProductionTask => {
  const confirmation = createPublishConfirmation({
    taskId: task.taskId,
    confirmedAt: input.confirmedAt,
    confirmedBy: input.confirmedBy,
    operatorNote: input.operatorNote,
  });
  const validation = validatePublishConfirmation(task, confirmation);

  if (!validation.valid) {
    return {
      ...task,
      qaIssues: [...(task.qaIssues ?? []), ...validation.issues],
      issues: [
        ...task.issues,
        ...validation.issues.map((issueEntry) => ({
          code: issueEntry.code,
          message: issueEntry.message,
          severity: 'error' as const,
          source: 'publish' as const,
        })),
      ],
    };
  }

  return appendProductionTaskEvent(
    {
      ...task,
      publishConfirmation: confirmation,
      updatedAt: confirmation.confirmedAt,
    },
    {
      eventType: 'publish-confirmed',
      status: task.currentStatus,
      timestamp: confirmation.confirmedAt,
      message: 'local publish confirmation recorded',
      metadata: {
        confirmationId: confirmation.confirmationId,
        localPublished: true,
        notOnlineRelease: true,
        noTrainingDataset: true,
      },
    },
  );
};

export const publishTemplateProductionTask = (
  task: TemplateProductionTask,
): TemplateProductionTask => markTaskPublished(task);

export const summarizePublishConfirmation = (
  confirmation?: TemplateProductionPublishConfirmation,
): string =>
  confirmation
    ? `已确认本地 published 状态：${confirmation.confirmationId}`
    : '尚未确认本地 published 状态';

export const summarizeRejectReasons = (
  tasks: readonly TemplateProductionTask[],
): RejectReasonSummary[] =>
  TEMPLATE_PRODUCTION_REVIEW_REASONS
    .map((reason) => ({
      reason,
      label: getRejectReasonDisplayText(reason),
      count: tasks.filter((task) => task.rejectReason === reason).length,
    }))
    .filter((entry) => entry.count > 0);

export const validateTemplateReviewTransition = (
  task: TemplateProductionTask,
  nextStatus: TemplateProductionTask['templateReviewStatus'],
) => {
  if (nextStatus === 'approved' && task.evidenceStatus !== 'ready') {
    return {
      valid: false,
      issues: [
        {
          code: 'evidence-required',
          message: '只有 evidence_ready 或 ready_for_template_review 才能 approve',
          severity: 'error' as const,
          source: 'template-review' as const,
        },
      ],
    };
  }

  const nextTaskStatus =
    nextStatus === 'approved'
      ? 'approved'
      : nextStatus === 'rejected'
        ? 'rejected'
        : nextStatus === 'published'
          ? 'published'
          : 'ready_for_template_review';

  return validateProductionStatusTransition(task, nextTaskStatus);
};

export const summarizeTemplateReviewState = (
  task: TemplateProductionTask,
): TemplateReviewSummary => ({
  reviewStatus: task.templateReviewStatus,
  publishStatus: task.publishStatus,
  rejectReason: task.rejectReason,
  rejectReasonText: task.rejectReason
    ? getRejectReasonDisplayText(task.rejectReason)
    : undefined,
  publishConfirmation: task.publishConfirmation,
  nextAction:
    task.templateReviewStatus === 'approved'
      ? task.publishConfirmation
        ? '可以发布本地 production 状态'
        : '先完成本地 publish confirmation'
      : task.templateReviewStatus === 'rejected'
        ? '保留 rejection reason，不能发布'
        : '审核、批准或拒绝模板',
});
