import type { CosmeticSegmentationTarget } from '../../vision';
import type { HumanVerificationStatus } from './evidence.schema';

export const DATASET_REVIEW_SCHEMA_VERSION = 'dataset-review-v0.1' as const;

export const DATASET_QUALITY_STATUSES = [
  'pending_review',
  'accepted',
  'rejected',
  'needs_second_review',
  'ready_for_training',
  'excluded',
] as const;

export const DATASET_SPLITS = [
  'train',
  'validation',
  'test',
  'holdout',
  'unassigned',
] as const;

export const DATASET_REVIEW_REASONS = [
  'mask_boundary_error',
  'wrong_region',
  'low_confidence',
  'semantic_drift',
  'bad_source_image',
  'duplicate_sample',
  'insufficient_makeup_signal',
  'editor_uncertain',
  'accepted_clean',
  'accepted_minor_issue',
] as const;

export type DatasetQualityStatus = (typeof DATASET_QUALITY_STATUSES)[number];

export type DatasetSplit = (typeof DATASET_SPLITS)[number];

export type DatasetReviewReason = (typeof DATASET_REVIEW_REASONS)[number];

export interface DatasetReviewerMetadata {
  reviewerId: string;
  reviewedAt: string;
  notes: string[];
}

export interface DatasetReviewDecision {
  status: DatasetQualityStatus;
  reasons: DatasetReviewReason[];
  reviewerMetadata: DatasetReviewerMetadata;
  decidedAt: string;
  notes: string[];
}

export interface DatasetEvidenceSummary {
  correctionConfidence: number;
  changedAreaRatio: number;
  edgeShiftScore: number;
  alphaDeltaMean: number;
  semanticDrift: number;
  evidenceConfidence: number;
  humanVerificationStatus: HumanVerificationStatus;
  sourceImageQuality: number;
  suggestedDecision: DatasetQualityStatus;
  suggestedReasons: DatasetReviewReason[];
  needsSecondReview: boolean;
  isTrainingReady: boolean;
}

export interface DatasetReviewItem {
  schemaVersion: typeof DATASET_REVIEW_SCHEMA_VERSION;
  reviewItemId: string;
  sampleId: string;
  imageId: string;
  templateId: string;
  regionId: CosmeticSegmentationTarget;
  currentDecision: DatasetReviewDecision;
  qualityScore: number;
  reviewerMetadata: DatasetReviewerMetadata;
  reviewHistory: DatasetReviewDecision[];
  assignedSplit: DatasetSplit;
  reviewReasons: DatasetReviewReason[];
  evidenceSummary: DatasetEvidenceSummary;
  createdAt: string;
  updatedAt: string;
}

export interface DatasetReviewQueue {
  schemaVersion: typeof DATASET_REVIEW_SCHEMA_VERSION;
  queueId: string;
  datasetId: string;
  createdAt: string;
  updatedAt: string;
  items: DatasetReviewItem[];
  summary: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    needsSecondReview: number;
    readyForTraining: number;
  };
}
