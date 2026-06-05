import type { CosmeticSegmentationTarget } from '../../vision';
import type { TrainingRuntimeKind } from '../runtime';
import type { DiffArtifactFormat, MaskArtifactFormat } from '../artifacts';

export const TRAINER_CONFIG_SCHEMA_VERSION = 'trainer-config-v0.1' as const;
export type TrainerConfigVersion = typeof TRAINER_CONFIG_SCHEMA_VERSION;

export interface RegionTrainerConfig {
  enabledRegions: CosmeticSegmentationTarget[];
  minSamplesPerRegion: number;
}

export interface ArtifactFormatConfig {
  maskFormat: MaskArtifactFormat;
  diffFormat: DiffArtifactFormat;
}

export interface SplitPolicyConfig {
  requireTrainValidationTest: boolean;
  allowTrainTestLeakage: boolean;
}

export interface QualityFilterConfig {
  minQualityScore: number;
  excludeLowQuality: boolean;
}

export interface RuntimeAdapterConfig {
  runtimeKind: TrainingRuntimeKind;
  runtimeVersion: string;
}

export interface BaselineTrainerConfig {
  trainerKind: 'baseline-mask-prior' | 'image-conditioned-pixel-prior' | 'lightweight-segmentation-classifier' | 'dry-run';
  regions: CosmeticSegmentationTarget[];
  qualityThreshold: number;
  minSamplesPerRegion: number;
  artifactFormat: 'baseline-mask-prior-json';
  evaluationSplits: Array<'validation' | 'test' | 'train'>;
  modelOutputFormat: 'baseline-mask-prior-json';
  missingRegionPolicy: 'warn' | 'fail' | 'skip';
  alphaThreshold: number;
  resizePolicy: 'nearest';
  confidencePolicy: 'quality-weighted';
}

export interface ImageConditionedTrainerConfig {
  trainerKind: 'image-conditioned-pixel-prior';
  regions: CosmeticSegmentationTarget[];
  pixelArtifactRequired: boolean;
  alphaPositiveThreshold: number;
  alphaNegativeThreshold: number;
  featureStride: number;
  positiveNegativeBalancePolicy: 'all-deterministic';
  skinBaselinePolicy: 'mask-negative-pixels' | 'global-average';
  localContrastWindow: number;
  scoreThresholdPolicy: 'midpoint';
  missingPixelArtifactPolicy: 'warn' | 'fail' | 'skip';
  imageConditionedFeatureConfig: {
    rgb: boolean;
    hsv: boolean;
    skinRelative: boolean;
    localContrast: boolean;
    position: boolean;
  };
}

export interface LightweightTrainerConfig {
  trainerKind: 'lightweight-segmentation-classifier';
  regions: CosmeticSegmentationTarget[];
  classifierKind: 'nearest-centroid' | 'logistic-linear' | 'hybrid-threshold';
  featureSet: Array<
    | 'rgb'
    | 'hsv'
    | 'skin-relative'
    | 'local-contrast'
    | 'position'
  >;
  featureNormalization: 'none' | 'z-score-placeholder' | 'range';
  alphaPositiveThreshold: number;
  alphaNegativeThreshold: number;
  featureStride: number;
  maxIterations: number;
  learningRate: number;
  regularization: number;
  thresholdPolicy: 'centroid-midpoint' | 'logistic-0.5';
  missingPixelArtifactPolicy: 'warn' | 'fail' | 'skip';
  missingBinaryMaskPolicy: 'warn' | 'fail' | 'skip';
  artifactFormatPreference: 'json-alpha-grid' | 'binary-alpha-mask';
  postProcessingPolicy: 'smooth-4-neighborhood' | 'none';
}

export interface SegmentationTrainerConfigV1 {
  schemaVersion: TrainerConfigVersion;
  configId: string;
  batchSize: number;
  regions: RegionTrainerConfig;
  artifacts: ArtifactFormatConfig;
  splitPolicy: SplitPolicyConfig;
  quality: QualityFilterConfig;
  runtime: RuntimeAdapterConfig;
  baseline?: BaselineTrainerConfig;
  imageConditioned?: ImageConditionedTrainerConfig;
  lightweight?: LightweightTrainerConfig;
}

export type TrainerConfig = SegmentationTrainerConfigV1;
