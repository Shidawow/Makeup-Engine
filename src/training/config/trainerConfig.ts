import { stableStringify } from '../../templates/storage/datasetExport';
import type { TrainerConfig } from './trainerConfig.schema';
import { TRAINER_CONFIG_SCHEMA_VERSION } from './trainerConfig.schema';

const DEFAULT_REGIONS = [
  'lips',
  'blush',
  'eyeshadow',
  'eyeliner',
  'contour',
  'highlight',
] as const;

export const createDefaultTrainerConfig = (): TrainerConfig => ({
  schemaVersion: TRAINER_CONFIG_SCHEMA_VERSION,
  configId: 'trainer-config-default-v0.1',
  batchSize: 8,
  regions: {
    enabledRegions: [...DEFAULT_REGIONS],
    minSamplesPerRegion: 1,
  },
  artifacts: {
    maskFormat: 'json-alpha-grid',
    diffFormat: 'json-diff-grid',
  },
  splitPolicy: {
    requireTrainValidationTest: true,
    allowTrainTestLeakage: false,
  },
  quality: {
    minQualityScore: 0.7,
    excludeLowQuality: true,
  },
  runtime: {
    runtimeKind: 'dry-run',
    runtimeVersion: 'dry-run-v0.1',
  },
  baseline: {
    trainerKind: 'baseline-mask-prior',
    regions: [...DEFAULT_REGIONS],
    qualityThreshold: 0.7,
    minSamplesPerRegion: 1,
    artifactFormat: 'baseline-mask-prior-json',
    evaluationSplits: ['validation', 'test'],
    modelOutputFormat: 'baseline-mask-prior-json',
    missingRegionPolicy: 'warn',
    alphaThreshold: 0.5,
    resizePolicy: 'nearest',
    confidencePolicy: 'quality-weighted',
  },
  imageConditioned: {
    trainerKind: 'image-conditioned-pixel-prior',
    regions: [...DEFAULT_REGIONS],
    pixelArtifactRequired: true,
    alphaPositiveThreshold: 0.4,
    alphaNegativeThreshold: 0.05,
    featureStride: 1,
    positiveNegativeBalancePolicy: 'all-deterministic',
    skinBaselinePolicy: 'mask-negative-pixels',
    localContrastWindow: 1,
    scoreThresholdPolicy: 'midpoint',
    missingPixelArtifactPolicy: 'fail',
    imageConditionedFeatureConfig: {
      rgb: true,
      hsv: true,
      skinRelative: true,
      localContrast: true,
      position: true,
    },
  },
  lightweight: {
    trainerKind: 'lightweight-segmentation-classifier',
    regions: [...DEFAULT_REGIONS],
    classifierKind: 'nearest-centroid',
    featureSet: ['rgb', 'hsv', 'skin-relative', 'local-contrast', 'position'],
    featureNormalization: 'range',
    alphaPositiveThreshold: 0.4,
    alphaNegativeThreshold: 0.05,
    featureStride: 1,
    maxIterations: 8,
    learningRate: 0.05,
    regularization: 0,
    thresholdPolicy: 'centroid-midpoint',
    missingPixelArtifactPolicy: 'fail',
    missingBinaryMaskPolicy: 'warn',
    artifactFormatPreference: 'json-alpha-grid',
    postProcessingPolicy: 'smooth-4-neighborhood',
  },
});

export const validateTrainerConfig = (config: TrainerConfig): string[] => [
  ...(config.schemaVersion !== TRAINER_CONFIG_SCHEMA_VERSION
    ? ['unsupported trainer config schemaVersion']
    : []),
  ...(config.batchSize <= 0 ? ['batchSize must be positive'] : []),
  ...(config.regions.enabledRegions.length === 0 ? ['at least one region is required'] : []),
  ...(config.quality.minQualityScore < 0 || config.quality.minQualityScore > 1
    ? ['minQualityScore must stay in 0..1']
    : []),
  ...(config.baseline &&
  (config.baseline.qualityThreshold < 0 || config.baseline.qualityThreshold > 1)
    ? ['baseline qualityThreshold must stay in 0..1']
    : []),
  ...(config.baseline && config.baseline.minSamplesPerRegion <= 0
    ? ['baseline minSamplesPerRegion must be positive']
    : []),
  ...(config.imageConditioned &&
  (config.imageConditioned.alphaPositiveThreshold < 0 ||
    config.imageConditioned.alphaPositiveThreshold > 1)
    ? ['image-conditioned alphaPositiveThreshold must stay in 0..1']
    : []),
  ...(config.imageConditioned &&
  (config.imageConditioned.alphaNegativeThreshold < 0 ||
    config.imageConditioned.alphaNegativeThreshold > 1)
    ? ['image-conditioned alphaNegativeThreshold must stay in 0..1']
    : []),
  ...(config.imageConditioned && config.imageConditioned.featureStride <= 0
    ? ['image-conditioned featureStride must be positive']
    : []),
  ...(config.lightweight &&
  (config.lightweight.alphaPositiveThreshold < 0 || config.lightweight.alphaPositiveThreshold > 1)
    ? ['lightweight alphaPositiveThreshold must stay in 0..1']
    : []),
  ...(config.lightweight &&
  (config.lightweight.alphaNegativeThreshold < 0 || config.lightweight.alphaNegativeThreshold > 1)
    ? ['lightweight alphaNegativeThreshold must stay in 0..1']
    : []),
  ...(config.lightweight && config.lightweight.featureStride <= 0
    ? ['lightweight featureStride must be positive']
    : []),
  ...(config.lightweight && config.lightweight.maxIterations <= 0
    ? ['lightweight maxIterations must be positive']
    : []),
  ...(config.lightweight && config.lightweight.learningRate <= 0
    ? ['lightweight learningRate must be positive']
    : []),
];

export const migrateTrainerConfig = (config: TrainerConfig): TrainerConfig => ({
  ...createDefaultTrainerConfig(),
  ...config,
  schemaVersion: TRAINER_CONFIG_SCHEMA_VERSION,
});

export const summarizeTrainerConfig = (config: TrainerConfig): string =>
  [
    `config:${config.configId}`,
    `runtime:${config.runtime.runtimeKind}`,
    `batchSize:${config.batchSize}`,
    `quality>=${config.quality.minQualityScore}`,
    `regions:${config.regions.enabledRegions.join(',')}`,
  ].join('\n');

export const exportTrainerConfigJson = (config: TrainerConfig): string =>
  stableStringify(config);
