import type { CosmeticSegmentationTarget } from '../../vision';
import type { DatasetSplit } from '../../templates/schema';

export const EVALUATION_REPORT_SCHEMA_VERSION =
  'segmentation-evaluation-report-v0.1' as const;

export type EvaluationReadinessStatus = 'pass' | 'warning' | 'fail' | 'placeholder';

export interface EvaluationDatasetSummary {
  datasetId: string;
  sampleCount: number;
  splitBalance: Record<DatasetSplit, number>;
}

export interface RegionEvaluationSummary {
  regionId: CosmeticSegmentationTarget;
  sampleCount: number;
  maskAreaMean: number;
  diffAreaMean: number;
}

export interface MaskEvaluationMetricSummary {
  metricName:
    | 'dry_run_proxy_mask_area'
    | 'dry_run_proxy_diff_area'
    | 'baseline_hard_iou'
    | 'baseline_soft_iou'
    | 'baseline_dice'
    | 'baseline_alpha_mae'
    | 'baseline_alpha_rmse'
    | 'lightweight_classifier_f1'
    | 'lightweight_classifier_iou';
  value: number;
  note: string;
}

export interface BaselineRegionEvaluationMetrics {
  regionId: CosmeticSegmentationTarget;
  sampleCount: number;
  hardIoU: number;
  softIoU: number;
  dice: number;
  alphaMAE: number;
  alphaRMSE: number;
  boundsOverlap: number;
  areaError: number;
}

export interface BaselineModelEvaluationBlock {
  metricType: 'baseline-mask-prior';
  note: string;
  evaluationSplit: string;
  evaluationSampleCount: number;
  perRegionMetrics: BaselineRegionEvaluationMetrics[];
  hardIoU: number;
  softIoU: number;
  dice: number;
  alphaMAE: number;
  alphaRMSE: number;
  boundsOverlap: number;
  areaError: number;
}

export interface ImageConditionedModelEvaluationBlock {
  metricType: 'image-conditioned-pixel-prior';
  note: string;
  pixelFeatureSummary: {
    featureStride: number;
    positivePixelCount: number;
    negativePixelCount: number;
  };
  pixelArtifactCoverage: {
    requiredSampleCount: number;
    availablePixelArtifactCount: number;
  };
  perRegionImageConditionedMetrics: Array<{
    regionId: string;
    sampleCount: number;
    hardIoU: number;
    softIoU: number;
    dice: number;
    alphaMAE: number;
    alphaRMSE: number;
    precision: number;
    recall: number;
    falsePositiveRatio: number;
    falseNegativeRatio: number;
  }>;
  missingPixelArtifactSummary: {
    missingPixelArtifactCount: number;
  };
  hardIoU: number;
  softIoU: number;
  dice: number;
  alphaMAE: number;
  alphaRMSE: number;
}

export interface LightweightClassifierEvaluationBlock {
  metricType: 'lightweight-segmentation-classifier';
  note: string;
  classifierMetrics: {
    classifierKind: string;
    hardIoU: number;
    softIoU: number;
    dice: number;
  };
  pixelClassificationMetrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
  };
  featureSeparationSummary: {
    meanFeatureSeparation: number;
  };
  classifierRegionMetrics: Array<{
    regionId: string;
    sampleCount: number;
    positivePixelCount: number;
    negativePixelCount: number;
    hardIoU: number;
    dice: number;
    f1: number;
    featureSeparationScore: number;
  }>;
  artifactMaterializationSummary: {
    binaryMaskReady: boolean;
    binaryDiffReady: boolean;
  };
}

export interface FailedSampleSummary {
  failedSampleCount: number;
  sampleIds: string[];
}

export interface SegmentationEvaluationReport {
  schemaVersion: typeof EVALUATION_REPORT_SCHEMA_VERSION;
  reportId: string;
  trainingRunId: string;
  createdAt: string;
  datasetSummary: EvaluationDatasetSummary;
  regionSummaries: RegionEvaluationSummary[];
  maskMetricSummary: MaskEvaluationMetricSummary[];
  failedSampleSummary: FailedSampleSummary;
  qualityWeightedSampleCount: number;
  readinessStatus: EvaluationReadinessStatus;
  baselineModelEvaluation?: BaselineModelEvaluationBlock;
  imageConditionedModelEvaluation?: ImageConditionedModelEvaluationBlock;
  lightweightClassifierEvaluation?: LightweightClassifierEvaluationBlock;
}
