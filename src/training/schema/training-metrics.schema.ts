import type { CosmeticSegmentationTarget } from '../../vision';
import type { DatasetSplit } from '../../templates/schema';

export const TRAINING_METRICS_SCHEMA_VERSION =
  'segmentation-training-metrics-v0.1' as const;

export interface MaskQualityMetric {
  regionId: CosmeticSegmentationTarget;
  sampleCount: number;
  meanActiveRatio: number;
  meanAlpha: number;
}

export interface RegionEvaluationMetrics {
  regionId: CosmeticSegmentationTarget;
  sampleCount: number;
  batchCount: number;
  averageQualityScore: number;
  averageSampleWeight: number;
}

export interface TrainingReadinessMetric {
  readinessScore: number;
  pass: boolean;
  warnings: string[];
  errors: string[];
}

export interface TrainingDryRunMetrics {
  schemaVersion: typeof TRAINING_METRICS_SCHEMA_VERSION;
  sampleCount: number;
  batchCount: number;
  regionCoverage: Record<CosmeticSegmentationTarget, number>;
  qualityWeightedSampleCount: number;
  maskAreaDistribution: Record<CosmeticSegmentationTarget, number>;
  diffAreaDistribution: Record<CosmeticSegmentationTarget, number>;
  edgeShiftDistribution: Record<CosmeticSegmentationTarget, number>;
  splitBalance: Record<DatasetSplit, number>;
  excludedSampleSummary: {
    excludedCount: number;
    reasons: string[];
  };
  readinessScore: number;
}

export interface SegmentationTrainingMetrics extends TrainingDryRunMetrics {
  trainingRunId: string;
  createdAt: string;
}

export interface SegmentationEvaluationMetrics {
  schemaVersion: typeof TRAINING_METRICS_SCHEMA_VERSION;
  evaluationRunId: string;
  sampleCount: number;
  regionMetrics: RegionEvaluationMetrics[];
  maskQualityMetrics: MaskQualityMetric[];
  readiness: TrainingReadinessMetric;
}
