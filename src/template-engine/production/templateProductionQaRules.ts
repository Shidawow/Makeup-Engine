import type {
  TemplateProductionBatch,
  TemplateProductionTask,
} from '../../templates/schema/template-production-batch.schema';
import type {
  TemplateProductionOperatorChecklist,
  TemplateProductionQaIssue,
  TemplateProductionQaItem,
  TemplateProductionQaRecommendation,
  TemplateProductionQaReport,
  TemplateProductionQaStatus,
} from '../../templates/schema/template-production-qa.schema';
import {
  TEMPLATE_PRODUCTION_QA_SCHEMA_VERSION,
} from '../../templates/schema/template-production-qa.schema';
import { loadTemplateAnalysisSeedImageData } from '../../templates/storage/sourceImagePackageStorage';

const issue = (
  code: string,
  message: string,
  severity: TemplateProductionQaIssue['severity'],
  source: TemplateProductionQaIssue['source'],
  nextAction: string,
  reason?: TemplateProductionQaIssue['reason'],
): TemplateProductionQaIssue => ({
  code,
  message,
  severity,
  source,
  nextAction,
  reason,
});

const hasBrowserUsableSeed = (task: TemplateProductionTask): boolean => {
  if (!task.templateAnalysisSeed) {
    return false;
  }

  return loadTemplateAnalysisSeedImageData(task.templateAnalysisSeed).canRunBrowserAnalysis;
};

export const taskNeedsRebinding = (task: TemplateProductionTask): boolean =>
  task.sourceImageStatus === 'ready_for_template_analysis' &&
  task.artifactBindingStatus === 'validated' &&
  task.currentStatus === 'ready_for_analysis' &&
  !hasBrowserUsableSeed(task);

const qaStatusFromIssues = (
  task: TemplateProductionTask,
  issues: readonly TemplateProductionQaIssue[],
): TemplateProductionQaStatus => {
  if (issues.some((entry) => entry.severity === 'blocking')) {
    return 'blocked';
  }

  if (task.currentStatus === 'approved') {
    return task.publishConfirmation ? 'ready_for_publish' : 'needs_operator_action';
  }

  if (task.currentStatus === 'evidence_ready' || task.currentStatus === 'ready_for_template_review') {
    return 'ready_for_review';
  }

  if (task.needsRebinding) {
    return 'needs_operator_action';
  }

  if (issues.length > 0) {
    return 'warning';
  }

  return 'pass';
};

export const evaluateProductionTaskQa = (
  task: TemplateProductionTask,
): TemplateProductionQaItem => {
  const issues: TemplateProductionQaIssue[] = [];

  if (task.sourceImageStatus !== 'ready_for_template_analysis') {
    issues.push(
      issue(
        'source-image-blocked',
        '源图未通过导入或质量门禁，不能进入模板生产。',
        'blocking',
        'source-image-package',
        '先处理源图隔离原因，或从批次中跳过该任务。',
        'source_image_blocked',
      ),
    );
  }

  if (task.artifactBindingStatus !== 'validated') {
    issues.push(
      issue(
        'artifact-binding-required',
        '缺少可用的 bound artifact，任务必须先绑定 normalized PNG 或 JSON RGBA。',
        'blocking',
        'artifact-binding',
        '回到 artifact binding 面板，显式选择对应文件后刷新批次状态。',
        'artifact_missing',
      ),
    );
  }

  if (taskNeedsRebinding(task)) {
    issues.push(
      issue(
        'artifact-rebinding-required',
        '浏览器运行时 object URL 已失效，需要重新绑定 artifact。',
        'blocking',
        'rebinding',
        '重新选择 normalized PNG 或 JSON RGBA 文件，恢复 BrowserArtifactResource。',
        'artifact_missing',
      ),
    );
  }

  if (task.currentStatus === 'analysis_failed' || task.analysisStatus === 'failed') {
    issues.push(
      issue(
        'analysis-failed',
        'Vision Analysis 失败，不能进入审核。',
        'blocking',
        'analysis',
        '检查分析错误，重新绑定或重新运行 Vision Analysis。',
        'analysis_failed',
      ),
    );
  }

  if (
    ['ready_for_template_review', 'approved', 'published'].includes(task.currentStatus) &&
    task.analysisStatus !== 'complete'
  ) {
    issues.push(
      issue(
        'analysis-complete-required',
        '没有 analysis_complete 的任务不能进入模板审核。',
        'blocking',
        'analysis',
        '先完成 Vision Analysis，再进入 mask review 和 evidence。',
        'analysis_not_run',
      ),
    );
  }

  if (
    ['approved', 'published'].includes(task.currentStatus) &&
    task.evidenceStatus !== 'ready'
  ) {
    issues.push(
      issue(
        'evidence-required',
        '没有 evidence 的任务不能批准。',
        'blocking',
        'evidence',
        '完成 mask review、人工修正和 evidence 汇总后再批准。',
        'evidence_missing',
      ),
    );
  }

  if (task.currentStatus === 'rejected' && task.publishStatus === 'published') {
    issues.push(
      issue(
        'rejected-task-published',
        'rejected task 不能发布。',
        'blocking',
        'publish',
        '保持 rejected 状态，或重新创建任务并重新走审核流程。',
        'publish_without_approval_blocked',
      ),
    );
  }

  if (task.currentStatus === 'published' && !task.publishConfirmation) {
    issues.push(
      issue(
        'publish-confirmation-missing',
        'published 任务必须记录本地发布确认。',
        'blocking',
        'publish',
        '补充本地 publish confirmation，确认不是线上发布且不会生成训练数据集。',
        'publish_without_approval_blocked',
      ),
    );
  }

  if (task.currentStatus === 'approved' && !task.publishConfirmation) {
    issues.push(
      issue(
        'publish-confirmation-needed',
        '任务已批准，但发布前仍需本地 publish confirmation。',
        'warning',
        'publish',
        '确认这是本地状态、不是线上发布、不会上传服务器、不会生成 training dataset。',
        'accepted_minor_issue',
      ),
    );
  }

  if (task.currentStatus === 'rejected' && !task.rejectReason) {
    issues.push(
      issue(
        'reject-reason-missing',
        'rejected task 必须保留固定 taxonomy 中的 reject reason。',
        'blocking',
        'template-review',
        '选择拒绝原因并保存 optional note。',
        'operator_rejected_quality',
      ),
    );
  }

  const blockingIssues = issues.filter((entry) => entry.severity === 'blocking');
  const warningIssues = issues.filter((entry) => entry.severity === 'warning');
  const qaStatus = qaStatusFromIssues(task, issues);
  const nextOperatorAction =
    blockingIssues[0]?.nextAction ??
    warningIssues[0]?.nextAction ??
    (qaStatus === 'ready_for_review'
      ? '进入模板审核，选择 approve 或 reject。'
      : qaStatus === 'ready_for_publish'
        ? '完成 publish confirmation 后发布本地状态。'
        : qaStatus === 'needs_operator_action'
          ? '需要 operator 处理绑定、确认或恢复问题。'
          : '继续当前生产任务。');

  return {
    taskId: task.taskId,
    sourceImageId: task.sourceImageId,
    originalFileName: task.originalFileName,
    currentStatus: task.currentStatus,
    qaStatus,
    blockingIssueCount: blockingIssues.length,
    warningCount: warningIssues.length,
    blockingIssues,
    warningIssues,
    nextOperatorAction,
    reviewReason: task.reviewReason,
    rejectReason: task.rejectReason,
    rejectNote: task.rejectNote,
    publishConfirmation: task.publishConfirmation,
    needsRebinding: taskNeedsRebinding(task),
  };
};

export const getBlockingIssuesForProductionTask = (
  task: TemplateProductionTask,
): TemplateProductionQaIssue[] => evaluateProductionTaskQa(task).blockingIssues;

export const getWarningsForProductionTask = (
  task: TemplateProductionTask,
): TemplateProductionQaIssue[] => evaluateProductionTaskQa(task).warningIssues;

export const getNextOperatorActionForTask = (
  task: TemplateProductionTask,
): string => evaluateProductionTaskQa(task).nextOperatorAction;

export const validateTaskReadyForReview = (
  task: TemplateProductionTask,
): { valid: boolean; issues: TemplateProductionQaIssue[] } => {
  const qa = evaluateProductionTaskQa(task);
  const issues = [
    ...qa.blockingIssues,
    ...(task.analysisStatus === 'complete'
      ? []
      : [
          issue(
            'analysis-complete-required',
            '没有 analysis_complete 的任务不能进入 review。',
            'blocking',
            'analysis',
            '先完成 Vision Analysis。',
            'analysis_not_run',
          ),
        ]),
  ];

  return {
    valid: issues.length === 0,
    issues,
  };
};

export const validateTaskReadyForPublish = (
  task: TemplateProductionTask,
): { valid: boolean; issues: TemplateProductionQaIssue[] } => {
  const qa = evaluateProductionTaskQa(task);
  const issues = [
    ...qa.blockingIssues,
    ...(task.currentStatus === 'approved'
      ? []
      : [
          issue(
            'approval-required',
            'publish 前必须先 approved。',
            'blocking',
            'publish',
            '先完成 evidence 和 template review approval。',
            'publish_without_approval_blocked',
          ),
        ]),
    ...(task.publishConfirmation
      ? []
      : [
          issue(
            'publish-confirmation-required',
            'publish 前必须确认这是本地状态，不是线上发布，也不会生成 training dataset。',
            'blocking',
            'publish',
            '勾选 publish confirmation 后再发布。',
            'publish_without_approval_blocked',
          ),
        ]),
  ];

  return {
    valid: issues.length === 0,
    issues,
  };
};

const createOperatorChecklist = (
  batch: TemplateProductionBatch,
  items: readonly TemplateProductionQaItem[],
): TemplateProductionOperatorChecklist => ({
  sourceImageManifestImported: Boolean(batch.sourceImageManifestReference),
  productionBatchCreated: Boolean(batch.batchId),
  tasksCreated: batch.tasks.length > 0,
  artifactBindingVisible: batch.tasks.some((task) => task.artifactBindingStatus !== 'missing'),
  readyTaskCanHandoffToAnalysis: batch.tasks.some((task) => task.currentStatus === 'ready_for_analysis'),
  analysisStatusCanUpdate: batch.tasks.some((task) =>
    ['analysis_complete', 'needs_mask_review', 'evidence_ready', 'approved', 'published'].includes(task.currentStatus),
  ),
  evidenceReadyTaskCanApprove: batch.tasks.some((task) => task.evidenceStatus === 'ready'),
  rejectedTaskCannotPublish: batch.tasks.every((task) =>
    task.currentStatus !== 'rejected' || task.publishStatus !== 'published',
  ),
  publishRequiresConfirmation: batch.tasks.every((task) =>
    task.currentStatus !== 'published' || Boolean(task.publishConfirmation),
  ),
  exportExcludesRuntimeResources: true,
  sourceImagePackageCannotBecomeTrainingDataset: true,
});

export const getBatchQaRecommendations = (
  report: Pick<TemplateProductionQaReport, 'blockingCount' | 'warningCount' | 'readyForPublishCount'>,
): TemplateProductionQaRecommendation[] => [
  ...(report.blockingCount > 0
    ? [
        {
          code: 'resolve-blocking-issues',
          message: '先处理 blocking issue，再进入模板库管理或发布包阶段。',
          priority: 1,
        },
      ]
    : []),
  ...(report.warningCount > 0
    ? [
        {
          code: 'review-warnings',
          message: '检查 warning，确认是否属于 accepted_minor_issue。',
          priority: 2,
        },
      ]
    : []),
  ...(report.readyForPublishCount > 0
    ? [
        {
          code: 'confirm-local-publish',
          message: 'ready_for_publish 任务需要本地 publish confirmation。',
          priority: 1,
        },
      ]
    : []),
];

export const summarizeProductionBatchQa = (
  items: readonly TemplateProductionQaItem[],
) => ({
  totalTasks: items.length,
  blockingCount: items.filter((item) => item.blockingIssueCount > 0).length,
  warningCount: items.filter((item) => item.warningCount > 0).length,
  needsOperatorActionCount: items.filter((item) =>
    ['blocked', 'needs_operator_action'].includes(item.qaStatus),
  ).length,
  readyForReviewCount: items.filter((item) => item.qaStatus === 'ready_for_review').length,
  readyForPublishCount: items.filter((item) => item.qaStatus === 'ready_for_publish').length,
});

export const evaluateProductionBatchQa = (
  batch: TemplateProductionBatch,
): TemplateProductionQaReport => {
  const items = batch.tasks.map(evaluateProductionTaskQa);
  const summary = summarizeProductionBatchQa(items);
  const reportBase = {
    blockingCount: summary.blockingCount,
    warningCount: summary.warningCount,
    readyForPublishCount: summary.readyForPublishCount,
  };

  return {
    schemaVersion: TEMPLATE_PRODUCTION_QA_SCHEMA_VERSION,
    batchId: batch.batchId,
    batchName: batch.name,
    batchStatus: batch.status,
    totalTasks: items.length,
    readyForAnalysisCount: batch.tasks.filter((task) => task.currentStatus === 'ready_for_analysis').length,
    blockingCount: summary.blockingCount,
    warningCount: summary.warningCount,
    needsOperatorActionCount: summary.needsOperatorActionCount,
    readyForReviewCount: summary.readyForReviewCount,
    readyForPublishCount: summary.readyForPublishCount,
    approvedCount: batch.tasks.filter((task) => task.currentStatus === 'approved').length,
    rejectedCount: batch.tasks.filter((task) => task.currentStatus === 'rejected').length,
    publishedCount: batch.tasks.filter((task) => task.currentStatus === 'published').length,
    items,
    issues: items.flatMap((item) => [...item.blockingIssues, ...item.warningIssues]),
    recommendations: getBatchQaRecommendations(reportBase),
    operatorChecklist: createOperatorChecklist(batch, items),
  };
};
