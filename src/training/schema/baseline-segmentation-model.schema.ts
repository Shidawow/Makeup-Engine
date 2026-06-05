import type { CosmeticSegmentationTarget, SegmentationMaskGrid } from '../../vision';
import type { TrainerConfigVersion } from '../config';

export const BASELINE_SEGMENTATION_MODEL_SCHEMA_VERSION =
  'baseline-segmentation-model-v0.1' as const;

export type BaselineModelReadinessStatus =
  | 'trained-baseline'
  | 'evaluated-baseline'
  | 'insufficient-data'
  | 'failed-validation';

export interface BaselineAlphaPrior {
  width: number;
  height: number;
  meanAlphaGrid: SegmentationMaskGrid;
  min: number;
  max: number;
  mean: number;
  activeRatio: number;
}

export interface BaselineBoundsPrior {
  meanBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
    space: 'normalized-image';
  } | null;
  minArea: number;
  maxArea: number;
  meanArea: number;
}

export interface BaselineEdgePrior {
  meanEdgeSoftness: number;
  minEdgeSoftness: number;
  maxEdgeSoftness: number;
}

export interface BaselineRegionPrior {
  regionId: CosmeticSegmentationTarget;
  target: CosmeticSegmentationTarget;
  sampleCount: number;
  width: number;
  height: number;
  meanAlphaGrid: number[];
  meanAlphaStats: {
    min: number;
    max: number;
    mean: number;
    activeRatio: number;
  };
  areaDistribution: {
    min: number;
    max: number;
    mean: number;
  };
  boundsDistribution: BaselineBoundsPrior;
  edgeSoftnessPrior: BaselineEdgePrior;
  confidencePrior: {
    min: number;
    max: number;
    mean: number;
  };
  qualityWeightedSampleCount: number;
  warnings: string[];
}

export interface BaselineTrainingSummary {
  sampleCount: number;
  trainedRegionCount: number;
  skippedRegionCount: number;
  qualityWeightedSampleCount: number;
  warnings: string[];
}

export interface BaselineEvaluationSummary {
  evaluatedSampleCount: number;
  evaluatedRegionCount: number;
  meanHardIoU: number;
  meanSoftIoU: number;
  meanDice: number;
  meanAlphaMAE: number;
  meanAlphaRMSE: number;
  readinessStatus: BaselineModelReadinessStatus;
}

export interface BaselineSegmentationModelMetadata {
  modelId: string;
  modelVersion: string;
  schemaVersion: typeof BASELINE_SEGMENTATION_MODEL_SCHEMA_VERSION;
  createdAt: string;
  sourceDatasetId: string;
  sourcePackageId: string;
  trainingRunId: string;
  trainerConfigVersion: TrainerConfigVersion;
}

export interface BaselineSegmentationModel {
  modelId: string;
  modelVersion: string;
  schemaVersion: typeof BASELINE_SEGMENTATION_MODEL_SCHEMA_VERSION;
  createdAt: string;
  sourceDatasetId: string;
  sourcePackageId: string;
  trainingRunId: string;
  trainerConfigVersion: TrainerConfigVersion;
  trainedRegions: CosmeticSegmentationTarget[];
  regionPriors: Record<string, BaselineRegionPrior>;
  trainingSummary: BaselineTrainingSummary;
  evaluationSummary: BaselineEvaluationSummary;
  readinessStatus: BaselineModelReadinessStatus;
  artifactChecksum: string;
}

export interface BaselineModelValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface BaselineModelArtifact {
  model: BaselineSegmentationModel;
  relativePath: string;
  checksum: string;
  byteSize: number;
}
