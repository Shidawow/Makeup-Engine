import type { CosmeticSegmentationTarget } from '../../vision';
import type { TrainerConfigVersion } from '../config';
import type { PixelFeatureExtractionConfig, PixelFeatureVector } from '../features';

export const IMAGE_CONDITIONED_MODEL_SCHEMA_VERSION =
  'image-conditioned-segmentation-model-v0.1' as const;

export type ImageConditionedReadinessStatus =
  | 'trained-image-conditioned-baseline'
  | 'evaluated-image-conditioned-baseline'
  | 'insufficient-pixel-data'
  | 'failed-pixel-validation';

export interface RegionFeatureStatistics {
  count: number;
  means: Record<keyof PixelFeatureVector, number>;
  variances: Record<keyof PixelFeatureVector, number>;
}

export interface PixelClassifierThresholds {
  scoreThreshold: number;
  alphaPositiveThreshold: number;
  alphaNegativeThreshold: number;
}

export interface PixelFeatureModel {
  positive: RegionFeatureStatistics;
  negative: RegionFeatureStatistics;
  alphaWeightedMeans: Partial<Record<keyof PixelFeatureVector, number>>;
  scoreWeights: Partial<Record<keyof PixelFeatureVector, number>>;
  thresholds: PixelClassifierThresholds;
}

export interface ImageConditionedRegionModel {
  regionId: CosmeticSegmentationTarget;
  sampleCount: number;
  positivePixelCount: number;
  negativePixelCount: number;
  featureModel: PixelFeatureModel;
  positionPrior: {
    centerX: number;
    centerY: number;
    boundsWidth: number;
    boundsHeight: number;
  };
  skinRelativeColorPrior: {
    deltaMean: number;
    saturationMean: number;
    brightnessMean: number;
  };
  confidencePrior: number;
  warnings: string[];
}

export interface ImageConditionedTrainingSummary {
  sampleCount: number;
  trainedRegionCount: number;
  pixelArtifactCount: number;
  positivePixelCount: number;
  negativePixelCount: number;
  warnings: string[];
}

export interface ImageConditionedEvaluationSummary {
  evaluatedSampleCount: number;
  evaluatedRegionCount: number;
  meanHardIoU: number;
  meanSoftIoU: number;
  meanDice: number;
  meanAlphaMAE: number;
  meanAlphaRMSE: number;
  missingPixelArtifactCount: number;
  readinessStatus: ImageConditionedReadinessStatus;
}

export interface ImageConditionedSegmentationModel {
  modelId: string;
  modelVersion: string;
  schemaVersion: typeof IMAGE_CONDITIONED_MODEL_SCHEMA_VERSION;
  createdAt: string;
  sourceDatasetId: string;
  sourcePackageId: string;
  trainingRunId: string;
  trainerConfigVersion: TrainerConfigVersion;
  trainedRegions: CosmeticSegmentationTarget[];
  regionModels: Record<string, ImageConditionedRegionModel>;
  featureConfig: PixelFeatureExtractionConfig;
  trainingSummary: ImageConditionedTrainingSummary;
  evaluationSummary: ImageConditionedEvaluationSummary;
  readinessStatus: ImageConditionedReadinessStatus;
  artifactChecksum: string;
}

export interface ImageConditionedModelArtifact {
  model: ImageConditionedSegmentationModel;
  relativePath: string;
  checksum: string;
  byteSize: number;
}
