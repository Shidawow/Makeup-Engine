import type { CosmeticSegmentationTarget } from '../../vision';
import type { DatasetSplit } from './dataset-review.schema';

export const TRAINING_ADAPTER_SCHEMA_VERSION =
  'segmentation-training-adapter-v0.1' as const;

export interface TrainingDatasetAdapterConfig {
  schemaVersion: typeof TRAINING_ADAPTER_SCHEMA_VERSION;
  includeRegions: CosmeticSegmentationTarget[];
  minQualityScore: number;
  includeDiffHeatmap: boolean;
  allowTrainTestLeakage: boolean;
}

export interface TrainingMaskTarget {
  regionId: CosmeticSegmentationTarget;
  originalMaskId: string;
  humanEditedMaskId: string;
  diffHeatmapId: string;
  maskDiffSummary: {
    changedAreaRatio: number;
    edgeShiftScore: number;
    alphaDeltaMean: number;
  };
}

export interface TrainingSampleReference {
  sampleId: string;
  imageId: string;
  templateId: string;
  split: DatasetSplit;
  qualityScore: number;
  sampleWeight: number;
  imageReference: string;
  maskTarget: TrainingMaskTarget;
  excludeReasons: string[];
}

export interface TrainingSplitBundle {
  split: DatasetSplit;
  sampleCount: number;
  samples: TrainingSampleReference[];
}

export interface TrainingTargetSummary {
  totalSamples: number;
  regionCounts: Record<CosmeticSegmentationTarget, number>;
  averageSampleWeight: number;
  excludedSampleIds: string[];
}

export interface TrainingLoaderValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  leakageValidation: {
    valid: boolean;
    issues: string[];
  };
}

export interface SegmentationTrainingManifest {
  schemaVersion: typeof TRAINING_ADAPTER_SCHEMA_VERSION;
  manifestId: string;
  sourceDatasetId: string;
  sourceQueueId: string;
  createdAt: string;
  config: TrainingDatasetAdapterConfig;
  train: TrainingSplitBundle;
  validation: TrainingSplitBundle;
  test: TrainingSplitBundle;
  holdout: TrainingSplitBundle;
  unassigned: TrainingSplitBundle;
  targetSummary: TrainingTargetSummary;
  validationResult: TrainingLoaderValidationResult;
}
