import type { TemplateAnalysisSeed } from './template-analysis-seed.schema';
import type {
  TemplateProductionPublishConfirmation,
  TemplateProductionQaIssue,
  TemplateProductionQaReport,
  TemplateProductionQaStatus,
  TemplateProductionReviewReason,
} from './template-production-qa.schema';

export const TEMPLATE_PRODUCTION_BATCH_SCHEMA_VERSION =
  'template-production-batch-v0.1' as const;

export type TemplateProductionSource =
  | 'source-image-package'
  | 'template-analysis-seed'
  | 'manual';

export type TemplateProductionArtifactState =
  | 'missing'
  | 'needs_artifact_binding'
  | 'bound'
  | 'validated'
  | 'unsupported';

export type TemplateProductionReviewState =
  | 'not_requested'
  | 'ready_for_review'
  | 'approved'
  | 'rejected'
  | 'published';

export type TemplateProductionTaskStatus =
  | 'draft'
  | 'blocked_by_source_image'
  | 'needs_artifact_binding'
  | 'ready_for_analysis'
  | 'analyzing'
  | 'analysis_failed'
  | 'analysis_complete'
  | 'needs_mask_review'
  | 'needs_human_correction'
  | 'correction_complete'
  | 'evidence_ready'
  | 'ready_for_template_review'
  | 'approved'
  | 'rejected'
  | 'published';

export interface TemplateProductionTaskIssue {
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
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
}

export interface TemplateProductionTaskEvent {
  eventId: string;
  eventType:
    | 'batch-created'
    | 'task-created'
    | 'artifact-bound'
    | 'seed-created'
    | 'analysis-started'
    | 'analysis-completed'
    | 'mask-review-requested'
    | 'human-correction-requested'
    | 'correction-completed'
    | 'evidence-ready'
    | 'template-review-ready'
    | 'approved'
    | 'reject-reason-recorded'
    | 'rejected'
    | 'publish-confirmed'
    | 'published'
    | 'rebinding-needed'
    | 'qa-evaluated'
    | 'status-updated';
  status: TemplateProductionTaskStatus;
  timestamp: string;
  message: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface TemplateProductionTask {
  taskId: string;
  sourceImageId: string;
  originalFileName: string;
  sourceImageStatus: string;
  sourceImageReadiness: string;
  templateAnalysisSeed?: TemplateAnalysisSeed;
  artifactBindingStatus: TemplateProductionArtifactState;
  analysisStatus:
    | 'not_started'
    | 'ready'
    | 'analyzing'
    | 'failed'
    | 'complete';
  maskReviewStatus:
    | 'not_requested'
    | 'needs_review'
    | 'reviewing'
    | 'needs_human_correction'
    | 'correction_complete';
  humanCorrectionStatus:
    | 'not_requested'
    | 'needs_human_correction'
    | 'in_progress'
    | 'complete';
  evidenceStatus:
    | 'missing'
    | 'building'
    | 'ready';
  templateReviewStatus: TemplateProductionReviewState;
  publishStatus: TemplateProductionReviewState;
  currentStatus: TemplateProductionTaskStatus;
  issues: TemplateProductionTaskIssue[];
  events: TemplateProductionTaskEvent[];
  createdAt: string;
  updatedAt: string;
  analysisSummary?: {
    templateId?: string;
    previewId?: string;
    traceSummary?: string[];
    evidenceReady?: boolean;
    sourceImageId?: string;
    seedId?: string;
  };
  qaStatus?: TemplateProductionQaStatus;
  qaIssues?: TemplateProductionQaIssue[];
  qaReport?: TemplateProductionQaReport;
  blockingIssueCount?: number;
  warningIssueCount?: number;
  nextOperatorAction?: string;
  needsRebinding?: boolean;
  reviewReason?: TemplateProductionReviewReason;
  rejectReason?: TemplateProductionReviewReason;
  rejectNote?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  publishConfirmation?: TemplateProductionPublishConfirmation;
  publishedAt?: string;
  publishedBy?: string;
}

export interface TemplateProductionBatchIssue {
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface TemplateProductionBatchValidationResult {
  valid: boolean;
  issues: TemplateProductionBatchIssue[];
}

export interface TemplateProductionBatchReadiness {
  readyForAnalysis: number;
  needsArtifactBinding: number;
  blockedBySourceImage: number;
  analyzing: number;
  analysisComplete: number;
  needsMaskReview: number;
  needsHumanCorrection: number;
  evidenceReady: number;
  readyForTemplateReview: number;
  approved: number;
  rejected: number;
  published: number;
}

export interface TemplateProductionBatchSummary extends TemplateProductionBatchReadiness {
  totalTasks: number;
  sourceImageCount: number;
  readySourceImageCount: number;
  blockedSourceImageCount: number;
  failedSourceImageCount: number;
  validTasks: number;
  invalidTasks: number;
  taskStatusCounts: Record<TemplateProductionTaskStatus, number>;
  artifactBindingCounts: Record<TemplateProductionArtifactState, number>;
  reviewStateCounts: Record<TemplateProductionReviewState, number>;
  nextActions: string[];
}

export interface TemplateProductionBatchMetadata {
  sourceImageManifestReference: string;
  createdBy: 'template-studio';
  notes?: string[];
  source?: TemplateProductionSource;
}

export interface TemplateProductionBatch {
  schemaVersion: typeof TEMPLATE_PRODUCTION_BATCH_SCHEMA_VERSION;
  batchId: string;
  name: string;
  sourceImagePackageId: string;
  sourceImageManifestReference: string;
  createdAt: string;
  updatedAt: string;
  tasks: TemplateProductionTask[];
  summary: TemplateProductionBatchSummary;
  status: 'draft' | 'active' | 'blocked' | 'completed' | 'archived';
  issues: TemplateProductionTaskIssue[];
  metadata: TemplateProductionBatchMetadata;
}
