export const TEMPLATE_PRODUCTION_QA_SCHEMA_VERSION =
  'template-production-qa-v0.1' as const;

export type TemplateProductionQaStatus =
  | 'pass'
  | 'warning'
  | 'blocked'
  | 'needs_operator_action'
  | 'ready_for_review'
  | 'ready_for_publish';

export type TemplateProductionQaIssueSeverity = 'info' | 'warning' | 'blocking';

export const TEMPLATE_PRODUCTION_REVIEW_REASONS = [
  'artifact_missing',
  'artifact_binding_mismatch',
  'source_image_blocked',
  'analysis_not_run',
  'analysis_failed',
  'mask_review_missing',
  'human_correction_missing',
  'evidence_missing',
  'low_confidence',
  'semantic_uncertain',
  'operator_rejected_quality',
  'duplicate_template',
  'wrong_makeup_region',
  'bad_source_image',
  'publish_without_approval_blocked',
  'accepted_minor_issue',
] as const;

export type TemplateProductionReviewReason =
  (typeof TEMPLATE_PRODUCTION_REVIEW_REASONS)[number];

export const TEMPLATE_PRODUCTION_REVIEW_REASON_LABELS: Record<
  TemplateProductionReviewReason,
  string
> = {
  artifact_missing: '缺少 artifact',
  artifact_binding_mismatch: 'artifact 绑定不匹配',
  source_image_blocked: '源图被阻断',
  analysis_not_run: '尚未运行分析',
  analysis_failed: '分析失败',
  mask_review_missing: '缺少蒙版审核',
  human_correction_missing: '缺少人工修正',
  evidence_missing: '缺少证据',
  low_confidence: '置信度过低',
  semantic_uncertain: '语义不确定',
  operator_rejected_quality: '管理员判定质量不足',
  duplicate_template: '重复模板',
  wrong_makeup_region: '妆区错误',
  bad_source_image: '源图质量差',
  publish_without_approval_blocked: '未批准禁止发布',
  accepted_minor_issue: '接受轻微问题',
};

export interface TemplateProductionQaIssue {
  code: string;
  message: string;
  severity: TemplateProductionQaIssueSeverity;
  source:
    | 'source-image-package'
    | 'artifact-binding'
    | 'seed'
    | 'analysis'
    | 'mask-review'
    | 'human-correction'
    | 'evidence'
    | 'template-review'
    | 'publish'
    | 'rebinding'
    | 'qa';
  nextAction: string;
  reason?: TemplateProductionReviewReason;
}

export interface TemplateProductionQaRecommendation {
  code: string;
  message: string;
  priority: number;
}

export interface TemplateProductionPublishConfirmation {
  confirmationId: string;
  confirmedAt: string;
  confirmedBy?: string;
  operatorNote?: string;
  localPublished: true;
  notOnlineRelease: true;
  noTrainingDataset: true;
}

export interface TemplateProductionOperatorChecklist {
  sourceImageManifestImported: boolean;
  productionBatchCreated: boolean;
  tasksCreated: boolean;
  artifactBindingVisible: boolean;
  readyTaskCanHandoffToAnalysis: boolean;
  analysisStatusCanUpdate: boolean;
  evidenceReadyTaskCanApprove: boolean;
  rejectedTaskCannotPublish: boolean;
  publishRequiresConfirmation: boolean;
  exportExcludesRuntimeResources: boolean;
  sourceImagePackageCannotBecomeTrainingDataset: boolean;
}

export interface TemplateProductionQaItem {
  taskId: string;
  sourceImageId: string;
  originalFileName: string;
  currentStatus: string;
  qaStatus: TemplateProductionQaStatus;
  blockingIssueCount: number;
  warningCount: number;
  blockingIssues: TemplateProductionQaIssue[];
  warningIssues: TemplateProductionQaIssue[];
  nextOperatorAction: string;
  reviewReason?: TemplateProductionReviewReason;
  rejectReason?: TemplateProductionReviewReason;
  rejectNote?: string;
  publishConfirmation?: TemplateProductionPublishConfirmation;
  needsRebinding: boolean;
}

export interface TemplateProductionQaReport {
  schemaVersion: typeof TEMPLATE_PRODUCTION_QA_SCHEMA_VERSION;
  batchId: string;
  batchName: string;
  batchStatus: string;
  totalTasks: number;
  readyForAnalysisCount: number;
  blockingCount: number;
  warningCount: number;
  needsOperatorActionCount: number;
  readyForReviewCount: number;
  readyForPublishCount: number;
  approvedCount: number;
  rejectedCount: number;
  publishedCount: number;
  items: TemplateProductionQaItem[];
  issues: TemplateProductionQaIssue[];
  recommendations: TemplateProductionQaRecommendation[];
  operatorChecklist: TemplateProductionOperatorChecklist;
}
