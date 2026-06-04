import type { CosmeticSegmentationTarget } from '../../vision';
import type {
  DatasetQualityStatus,
  DatasetReviewReason,
  DatasetSplit,
} from './dataset-review.schema';

export const DATASET_METRICS_SCHEMA_VERSION = 'dataset-metrics-v0.1' as const;

export interface RegionDistributionMetrics {
  totalByRegion: Record<CosmeticSegmentationTarget, number>;
  acceptedByRegion: Record<CosmeticSegmentationTarget, number>;
  trainingReadyByRegion: Record<CosmeticSegmentationTarget, number>;
  missingRegions: CosmeticSegmentationTarget[];
  dominantRegion: CosmeticSegmentationTarget | null;
}

export interface ReviewReasonMetrics {
  totalByReason: Record<DatasetReviewReason, number>;
  rejectionReasons: DatasetReviewReason[];
  secondReviewReasons: DatasetReviewReason[];
}

export interface QualityDistributionMetrics {
  totalByStatus: Record<DatasetQualityStatus, number>;
  scoreBuckets: {
    low: number;
    medium: number;
    high: number;
  };
  averageQualityScore: number;
  averageEvidenceConfidence: number;
}

export interface ReviewerConsistencyMetrics {
  reviewerCount: number;
  decisionsByReviewer: Record<string, number>;
  acceptanceRateByReviewer: Record<string, number>;
  secondReviewRate: number;
}

export interface SplitBalanceMetrics {
  splitDistribution: Record<DatasetSplit, number>;
  trainRatio: number;
  validationRatio: number;
  testRatio: number;
  imbalanceWarnings: string[];
}

export interface TrainingReadinessMetrics {
  trainingReadySamples: number;
  acceptedSamples: number;
  rejectedSamples: number;
  readinessRatio: number;
  trainingReadinessScore: number;
  blockingReasons: string[];
}

export interface ImageQualityMetrics {
  assessedSamples: number;
  averageOverallImageQualityScore: number;
  lowQualityImageIds: string[];
  reasons: string[];
}

export interface DatasetRiskSummary {
  duplicateRiskSummary: {
    duplicateImageIds: string[];
    duplicateTemplateIds: string[];
    duplicateRiskScore: number;
  };
  leakageRiskSummary: {
    hasTrainTestLeakage: boolean;
    leakageIds: string[];
  };
  imbalanceWarnings: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface DatasetCurationMetrics {
  schemaVersion: typeof DATASET_METRICS_SCHEMA_VERSION;
  datasetId: string;
  queueId: string;
  createdAt: string;
  totalSamples: number;
  acceptedSamples: number;
  rejectedSamples: number;
  trainingReadySamples: number;
  regionDistribution: RegionDistributionMetrics;
  reviewReasonDistribution: ReviewReasonMetrics;
  splitDistribution: SplitBalanceMetrics;
  qualityScoreDistribution: QualityDistributionMetrics;
  evidenceConfidenceDistribution: {
    average: number;
    lowConfidenceSamples: string[];
  };
  reviewerCorrectionStats: ReviewerConsistencyMetrics;
  imageQualitySummary: ImageQualityMetrics;
  duplicateRiskSummary: DatasetRiskSummary['duplicateRiskSummary'];
  leakageRiskSummary: DatasetRiskSummary['leakageRiskSummary'];
  imbalanceWarnings: string[];
  trainingReadinessScore: number;
  riskSummary: DatasetRiskSummary;
}
