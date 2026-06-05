import type {
  TemplateProductionTask,
  TemplateProductionTaskEvent,
  TemplateProductionTaskIssue,
  TemplateProductionTaskStatus,
} from '../../templates/schema/template-production-batch.schema';

export interface TemplateProductionTransitionResult {
  valid: boolean;
  nextStatus: TemplateProductionTaskStatus;
  issues: TemplateProductionTaskIssue[];
}

const issue = (
  code: string,
  message: string,
  severity: TemplateProductionTaskIssue['severity'] = 'error',
  source: TemplateProductionTaskIssue['source'] = 'analysis',
): TemplateProductionTaskIssue => ({ code, message, severity, source });

const now = () => new Date().toISOString();

const transitionAllowed = (
  from: TemplateProductionTaskStatus,
  to: TemplateProductionTaskStatus,
): boolean => {
  const allowed: Record<TemplateProductionTaskStatus, readonly TemplateProductionTaskStatus[]> = {
    draft: ['blocked_by_source_image', 'needs_artifact_binding', 'ready_for_analysis'],
    blocked_by_source_image: ['needs_artifact_binding'],
    needs_artifact_binding: ['ready_for_analysis', 'blocked_by_source_image'],
    ready_for_analysis: ['analyzing', 'analysis_failed', 'analysis_complete', 'needs_artifact_binding'],
    analyzing: ['analysis_failed', 'analysis_complete'],
    analysis_failed: ['needs_artifact_binding', 'ready_for_analysis'],
    analysis_complete: ['needs_mask_review', 'needs_human_correction', 'evidence_ready'],
    needs_mask_review: ['needs_human_correction', 'correction_complete', 'evidence_ready'],
    needs_human_correction: ['correction_complete', 'evidence_ready'],
    correction_complete: ['evidence_ready', 'ready_for_template_review'],
    evidence_ready: ['ready_for_template_review', 'approved'],
    ready_for_template_review: ['approved', 'rejected'],
    approved: ['published'],
    rejected: [],
    published: [],
  };

  return allowed[from].includes(to);
};

export const validateProductionStatusTransition = (
  task: TemplateProductionTask,
  nextStatus: TemplateProductionTaskStatus,
): TemplateProductionTransitionResult => {
  const issues: TemplateProductionTaskIssue[] = [];

  if (task.currentStatus === nextStatus) {
    return {
      valid: true,
      nextStatus,
      issues,
    };
  }

  if (!transitionAllowed(task.currentStatus, nextStatus)) {
    issues.push(
      issue(
        'invalid-transition',
        `状态 ${task.currentStatus} 不能直接转换到 ${nextStatus}`,
        'error',
        'template-review',
      ),
    );
  }

  if (nextStatus === 'ready_for_analysis') {
    if (task.sourceImageStatus !== 'ready_for_template_analysis') {
      issues.push(
        issue(
          'source-image-not-ready',
          'blocked source image 不能进入 ready_for_analysis',
          'error',
          'source-image-package',
        ),
      );
    }

    if (task.artifactBindingStatus !== 'validated') {
      issues.push(
        issue(
          'artifact-binding-required',
          '没有可用 bound artifact 的 task 必须停留在 needs_artifact_binding',
          'error',
          'artifact-binding',
        ),
      );
    }

    if (task.templateAnalysisSeed?.readiness !== 'ready_for_vision_analysis') {
      issues.push(
        issue(
          'seed-not-ready',
          '只有 ready_for_vision_analysis seed 才能进入 ready_for_analysis',
          'error',
          'seed',
        ),
      );
    }
  }

  if (nextStatus === 'needs_mask_review' && task.currentStatus !== 'analysis_complete') {
    issues.push(
      issue(
        'analysis-required',
        'analysis_complete 后才能进入 needs_mask_review',
        'error',
        'analysis',
      ),
    );
  }

  if (nextStatus === 'approved' && task.evidenceStatus !== 'ready') {
    issues.push(issue('evidence-required', '没有 evidence 的 task 不能 approved', 'error', 'evidence'));
  }

  if (nextStatus === 'published') {
    if (task.currentStatus !== 'approved') {
      issues.push(issue('approval-required', 'publish 前必须先 approved', 'error', 'publish'));
    }

    if (task.currentStatus === 'rejected') {
      issues.push(issue('rejected-not-publishable', 'rejected task 不能 published', 'error', 'publish'));
    }

    if (task.publishStatus === 'published') {
      issues.push(issue('already-published', 'published task 不能重复发布或直接回到 draft', 'error', 'publish'));
    }

    if (!task.publishConfirmation) {
      issues.push(
        issue(
          'publish-confirmation-required',
          'publish 前必须确认这是本地 production 状态，不是线上发布，也不会生成 training dataset',
          'error',
          'publish',
        ),
      );
    }
  }

  if (nextStatus === 'draft' && task.currentStatus === 'published') {
    issues.push(issue('published-to-draft-forbidden', 'published task 不能直接回到 draft', 'error', 'publish'));
  }

  return {
    valid: issues.every((entry) => entry.severity !== 'error'),
    nextStatus,
    issues,
  };
};

export const appendProductionTaskEvent = (
  task: TemplateProductionTask,
  event: Omit<TemplateProductionTaskEvent, 'eventId' | 'timestamp'> & {
    timestamp?: string;
  },
): TemplateProductionTask => {
  const timestamp = event.timestamp ?? now();

  return {
    ...task,
    events: [
      ...task.events,
      {
        ...event,
        eventId: `${task.taskId}-${task.events.length + 1}`,
        timestamp,
      },
    ],
    updatedAt: timestamp,
  };
};

export const updateProductionTaskStatus = (
  task: TemplateProductionTask,
  nextStatus: TemplateProductionTaskStatus,
  message: string,
  metadata?: Record<string, string | number | boolean | null>,
): TemplateProductionTask => {
  const transition = validateProductionStatusTransition(task, nextStatus);

  if (!transition.valid) {
    return {
      ...task,
      issues: [...task.issues, ...transition.issues],
    };
  }

  const updated = appendProductionTaskEvent(task, {
    eventType: 'status-updated',
    status: nextStatus,
    message,
    metadata,
  });

  return {
    ...updated,
    currentStatus: nextStatus,
    artifactBindingStatus:
      nextStatus === 'ready_for_analysis'
        ? 'validated'
        : task.artifactBindingStatus,
    analysisStatus:
      nextStatus === 'analyzing'
        ? 'analyzing'
        : nextStatus === 'analysis_failed'
          ? 'failed'
          : nextStatus === 'analysis_complete'
            ? 'complete'
            : task.analysisStatus,
    maskReviewStatus:
      nextStatus === 'needs_mask_review'
        ? 'needs_review'
        : nextStatus === 'needs_human_correction'
          ? 'needs_human_correction'
          : nextStatus === 'correction_complete'
            ? 'correction_complete'
            : task.maskReviewStatus,
    humanCorrectionStatus:
      nextStatus === 'needs_human_correction'
        ? 'needs_human_correction'
        : nextStatus === 'correction_complete'
          ? 'complete'
          : task.humanCorrectionStatus,
    evidenceStatus:
      nextStatus === 'evidence_ready'
        ? 'ready'
        : nextStatus === 'ready_for_template_review'
          ? 'ready'
          : task.evidenceStatus,
    templateReviewStatus:
      nextStatus === 'ready_for_template_review'
        ? 'ready_for_review'
        : nextStatus === 'approved'
          ? 'approved'
          : nextStatus === 'rejected'
            ? 'rejected'
            : nextStatus === 'published'
              ? 'published'
              : task.templateReviewStatus,
    publishStatus:
      nextStatus === 'published'
        ? 'published'
        : nextStatus === 'rejected'
          ? 'rejected'
          : task.publishStatus,
  };
};

export const filterProductionTasksByStatus = (
  tasks: readonly TemplateProductionTask[],
  statuses: readonly TemplateProductionTaskStatus[],
): TemplateProductionTask[] =>
  tasks.filter((task) => statuses.includes(task.currentStatus));

export const getNextActionForProductionTask = (
  task: TemplateProductionTask,
): string => {
  switch (task.currentStatus) {
    case 'draft':
      return '从 ready source images 创建生产任务';
    case 'blocked_by_source_image':
      return '检查被阻断的 source image';
    case 'needs_artifact_binding':
      return task.needsRebinding
        ? '重新绑定 normalized PNG 或 JSON RGBA artifact'
        : '绑定 normalized PNG 或 JSON RGBA artifact';
    case 'ready_for_analysis':
      return '发送到 Vision Analysis';
    case 'analyzing':
      return '等待分析完成';
    case 'analysis_failed':
      return '检查分析失败原因后重试';
    case 'analysis_complete':
      return '进入 mask review';
    case 'needs_mask_review':
      return '打开 mask editing';
    case 'needs_human_correction':
      return '完成人工 correction';
    case 'correction_complete':
      return '标记 evidence ready';
    case 'evidence_ready':
      return '进入 template review';
    case 'ready_for_template_review':
      return 'approve 或 reject';
    case 'approved':
      return task.publishConfirmation
        ? '发布本地 production 状态'
        : '先完成本地 publish confirmation';
    case 'rejected':
      return '保留 rejection reason，不可 publish';
    case 'published':
      return '本地 production 状态已 published';
    default:
      return '无下一步动作';
  }
};

export const markTaskReadyForAnalysis = (task: TemplateProductionTask): TemplateProductionTask =>
  updateProductionTaskStatus(task, 'ready_for_analysis', 'task marked ready_for_analysis');

export const markTaskAnalysisComplete = (task: TemplateProductionTask): TemplateProductionTask =>
  updateProductionTaskStatus(task, 'analysis_complete', 'task analysis complete');

export const markTaskNeedsMaskReview = (task: TemplateProductionTask): TemplateProductionTask =>
  updateProductionTaskStatus(task, 'needs_mask_review', 'task enters mask review');

export const markTaskCorrectionComplete = (task: TemplateProductionTask): TemplateProductionTask =>
  updateProductionTaskStatus(task, 'correction_complete', 'human correction complete');

export const markTaskEvidenceReady = (task: TemplateProductionTask): TemplateProductionTask =>
  updateProductionTaskStatus(task, 'evidence_ready', 'evidence ready');

export const markTaskApproved = (task: TemplateProductionTask): TemplateProductionTask =>
  updateProductionTaskStatus(task, 'approved', 'template approved');

export const markTaskRejected = (
  task: TemplateProductionTask,
  reason = 'rejected by operator',
): TemplateProductionTask =>
  appendProductionTaskEvent(
    {
      ...task,
      currentStatus: 'rejected',
      templateReviewStatus: 'rejected',
      publishStatus: 'rejected',
      updatedAt: now(),
    },
    {
      eventType: 'rejected',
      status: 'rejected',
      message: reason,
      metadata: { reason },
    },
  );

export const markTaskPublished = (task: TemplateProductionTask): TemplateProductionTask =>
  updateProductionTaskStatus(task, 'published', 'template published locally');

export const appendTaskIssue = (
  task: TemplateProductionTask,
  nextIssue: TemplateProductionTaskIssue,
): TemplateProductionTask => ({
  ...task,
  issues: [...task.issues, nextIssue],
  updatedAt: now(),
});

export const summarizeBatchTaskIssues = (
  tasks: readonly TemplateProductionTask[],
): TemplateProductionTaskIssue[] =>
  tasks
    .flatMap((task) => task.issues)
    .filter(
      (issueEntry, index, list) =>
        list.findIndex(
          (candidate) =>
            candidate.code === issueEntry.code && candidate.message === issueEntry.message,
        ) === index,
    );
