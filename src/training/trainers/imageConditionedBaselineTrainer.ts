import { stableStringify } from '../../templates/storage/datasetExport';
import type { CosmeticSegmentationTarget } from '../../vision';
import type { ImagePixelData, ImageConditionedRegionModel, ImageConditionedSegmentationModel } from '../schema';
import { IMAGE_CONDITIONED_MODEL_SCHEMA_VERSION } from '../schema';
import type { LoadedTrainingDataset, LoadedTrainingSample } from '../schema';
import type { TrainerConfig } from '../config';
import { createDefaultTrainerConfig } from '../config';
import {
  extractPixelFeaturesForMask,
  extractPositiveNegativePixelSamples,
  type PixelFeatureExtractionConfig,
  type PixelFeatureVector,
  type RegionPixelFeatureSample,
} from '../features';
import { createMaskTensorFromArtifact } from '../tensors';
import type { TrainingMaskArtifactPayload } from '../artifacts';

const DEFAULT_FEATURE_CONFIG: PixelFeatureExtractionConfig = {
  featureStride: 1,
  alphaPositiveThreshold: 0.4,
  alphaNegativeThreshold: 0.05,
  localContrastWindow: 1,
};

const round4 = (value: number): number => Number(value.toFixed(4));
const average = (values: readonly number[]): number =>
  values.length === 0 ? 0 : round4(values.reduce((sum, value) => sum + value, 0) / values.length);
const variance = (values: readonly number[]): number => {
  const mean = average(values);
  return values.length === 0
    ? 0
    : round4(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length);
};
const checksum = (value: unknown): string => {
  const text = stableStringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

const FEATURE_KEYS: Array<keyof PixelFeatureVector> = [
  'r', 'g', 'b', 'h', 's', 'v', 'brightness', 'saturation',
  'skinRelativeR', 'skinRelativeG', 'skinRelativeB', 'skinRelativeDelta',
  'localContrast', 'normalizedX', 'normalizedY', 'distanceToRegionCenter',
  'distanceToRegionBounds', 'alphaTarget',
];

const maskPayloadFromSample = (sample: LoadedTrainingSample): TrainingMaskArtifactPayload => ({
  format: 'json-alpha-grid',
  width: sample.target.humanEditedMask.width,
  height: sample.target.humanEditedMask.height,
  regionId: sample.regionId,
  target: sample.regionId,
  alphaGrid: null,
  alphaStats: sample.target.humanEditedMask.alphaStats,
  bounds: sample.target.humanEditedMask.bounds,
  checksum: sample.target.humanEditedMask.checksum,
  sourceArtifactUri: `materialized://masks/${sample.target.humanEditedMask.artifactId}.json`,
});

const statsFor = (samples: readonly RegionPixelFeatureSample[]) => ({
  count: samples.length,
  means: Object.fromEntries(
    FEATURE_KEYS.map((key) => [key, average(samples.map((sample) => sample.features[key]))]),
  ) as Record<keyof PixelFeatureVector, number>,
  variances: Object.fromEntries(
    FEATURE_KEYS.map((key) => [key, variance(samples.map((sample) => sample.features[key]))]),
  ) as Record<keyof PixelFeatureVector, number>,
});

export const collectRegionPixelTrainingSamples = (input: {
  dataset: LoadedTrainingDataset;
  imagePixelsByImageId: ReadonlyMap<string, ImagePixelData>;
  regionId: CosmeticSegmentationTarget;
  featureConfig: PixelFeatureExtractionConfig;
}): RegionPixelFeatureSample[] =>
  input.dataset.samples
    .filter((sample) => sample.regionId === input.regionId && sample.accepted && sample.trainingReady)
    .flatMap((sample) => {
      const image = input.imagePixelsByImageId.get(sample.imageId);
      if (!image) return [];
      return extractPixelFeaturesForMask({
        image,
        mask: createMaskTensorFromArtifact(maskPayloadFromSample(sample)),
        sampleId: sample.sampleId,
        regionId: sample.regionId,
        config: input.featureConfig,
      });
    });

export const computePositiveFeatureStats = (samples: readonly RegionPixelFeatureSample[]) =>
  statsFor(samples.filter((sample) => sample.label === 'positive'));

export const computeNegativeFeatureStats = (samples: readonly RegionPixelFeatureSample[]) =>
  statsFor(samples.filter((sample) => sample.label === 'negative'));

export const computeFeatureScoreWeights = (input: {
  positive: ReturnType<typeof statsFor>;
  negative: ReturnType<typeof statsFor>;
}): Partial<Record<keyof PixelFeatureVector, number>> =>
  Object.fromEntries(
    FEATURE_KEYS.map((key) => [
      key,
      round4((input.positive.means[key] ?? 0) - (input.negative.means[key] ?? 0)),
    ]),
  );

export const computeRegionDecisionThreshold = (input: {
  positive: ReturnType<typeof statsFor>;
  negative: ReturnType<typeof statsFor>;
  weights: Partial<Record<keyof PixelFeatureVector, number>>;
}): number => {
  const score = (means: Record<keyof PixelFeatureVector, number>) =>
    FEATURE_KEYS.reduce((sum, key) => sum + means[key] * (input.weights[key] ?? 0), 0);
  return round4((score(input.positive.means) + score(input.negative.means)) / 2);
};

export const trainImageConditionedRegionModel = (input: {
  regionId: CosmeticSegmentationTarget;
  dataset: LoadedTrainingDataset;
  imagePixelsByImageId: ReadonlyMap<string, ImagePixelData>;
  featureConfig: PixelFeatureExtractionConfig;
}): ImageConditionedRegionModel => {
  const samples = collectRegionPixelTrainingSamples(input);
  const grouped = extractPositiveNegativePixelSamples(samples);
  const positive = computePositiveFeatureStats(grouped.positive);
  const negative = computeNegativeFeatureStats(grouped.negative);
  const scoreWeights = computeFeatureScoreWeights({ positive, negative });
  const threshold = computeRegionDecisionThreshold({ positive, negative, weights: scoreWeights });
  const regionSamples = input.dataset.samples.filter((sample) => sample.regionId === input.regionId);
  return {
    regionId: input.regionId,
    sampleCount: regionSamples.length,
    positivePixelCount: grouped.positive.length,
    negativePixelCount: grouped.negative.length,
    featureModel: {
      positive,
      negative,
      alphaWeightedMeans: positive.means,
      scoreWeights,
      thresholds: {
        scoreThreshold: threshold,
        alphaPositiveThreshold: input.featureConfig.alphaPositiveThreshold,
        alphaNegativeThreshold: input.featureConfig.alphaNegativeThreshold,
      },
    },
    positionPrior: {
      centerX: average(samples.map((sample) => sample.features.normalizedX)),
      centerY: average(samples.map((sample) => sample.features.normalizedY)),
      boundsWidth: average(regionSamples.map((sample) => sample.target.humanEditedMask.bounds?.width ?? 0)),
      boundsHeight: average(regionSamples.map((sample) => sample.target.humanEditedMask.bounds?.height ?? 0)),
    },
    skinRelativeColorPrior: {
      deltaMean: average(samples.map((sample) => sample.features.skinRelativeDelta)),
      saturationMean: average(samples.map((sample) => sample.features.saturation)),
      brightnessMean: average(samples.map((sample) => sample.features.brightness)),
    },
    confidencePrior: average(regionSamples.map((sample) => sample.qualityScore)),
    warnings: [
      ...(grouped.positive.length === 0 ? [`insufficient positive pixels:${input.regionId}`] : []),
      ...(grouped.negative.length === 0 ? [`insufficient negative pixels:${input.regionId}`] : []),
    ],
  };
};

export const validateImageConditionedTrainingInput = (input: {
  dataset: LoadedTrainingDataset;
  imagePixelsByImageId: ReadonlyMap<string, ImagePixelData>;
}): string[] =>
  input.dataset.samples
    .filter((sample) => !input.imagePixelsByImageId.has(sample.imageId))
    .map((sample) => `missing pixel artifact:${sample.sampleId}`)
    .sort();

export const trainImageConditionedSegmentationModel = (input: {
  dataset: LoadedTrainingDataset;
  imagePixelsByImageId: ReadonlyMap<string, ImagePixelData>;
  config?: TrainerConfig;
  regions?: readonly CosmeticSegmentationTarget[];
  featureConfig?: PixelFeatureExtractionConfig;
  trainingRunId?: string;
  createdAt?: string;
}): ImageConditionedSegmentationModel => {
  const config = input.config ?? createDefaultTrainerConfig();
  const featureConfig = input.featureConfig ?? {
    ...DEFAULT_FEATURE_CONFIG,
    featureStride: config.imageConditioned?.featureStride ?? DEFAULT_FEATURE_CONFIG.featureStride,
    alphaPositiveThreshold: config.imageConditioned?.alphaPositiveThreshold ?? DEFAULT_FEATURE_CONFIG.alphaPositiveThreshold,
    alphaNegativeThreshold: config.imageConditioned?.alphaNegativeThreshold ?? DEFAULT_FEATURE_CONFIG.alphaNegativeThreshold,
    localContrastWindow: config.imageConditioned?.localContrastWindow ?? DEFAULT_FEATURE_CONFIG.localContrastWindow,
  };
  const regions = [...(input.regions ?? config.imageConditioned?.regions ?? config.regions.enabledRegions)].sort();
  const regionModels = regions
    .map((regionId) =>
      trainImageConditionedRegionModel({
        regionId,
        dataset: input.dataset,
        imagePixelsByImageId: input.imagePixelsByImageId,
        featureConfig,
      }),
    )
    .filter((model) => model.positivePixelCount > 0 && model.negativePixelCount > 0);
  const warnings = [
    ...validateImageConditionedTrainingInput(input),
    ...regionModels.flatMap((model) => model.warnings),
  ].sort();
  const trainingRunId = input.trainingRunId ?? `image-conditioned-run-${input.dataset.summary.datasetId}`;
  const base = {
    modelId: `image-conditioned-pixel-prior-${input.dataset.summary.datasetId}`,
    modelVersion: `${input.dataset.summary.datasetVersion}-image-conditioned-v0.1`,
    schemaVersion: IMAGE_CONDITIONED_MODEL_SCHEMA_VERSION,
    createdAt: input.createdAt ?? input.dataset.dataset.createdAt,
    sourceDatasetId: input.dataset.summary.datasetId,
    sourcePackageId: input.dataset.summary.sourcePackageId,
    trainingRunId,
    trainerConfigVersion: config.schemaVersion,
    trainedRegions: regionModels.map((model) => model.regionId).sort(),
    regionModels: Object.fromEntries(regionModels.map((model) => [model.regionId, model])),
    featureConfig,
    trainingSummary: {
      sampleCount: input.dataset.samples.length,
      trainedRegionCount: regionModels.length,
      pixelArtifactCount: input.imagePixelsByImageId.size,
      positivePixelCount: regionModels.reduce((sum, model) => sum + model.positivePixelCount, 0),
      negativePixelCount: regionModels.reduce((sum, model) => sum + model.negativePixelCount, 0),
      warnings,
    },
    evaluationSummary: {
      evaluatedSampleCount: 0,
      evaluatedRegionCount: 0,
      meanHardIoU: 0,
      meanSoftIoU: 0,
      meanDice: 0,
      meanAlphaMAE: 0,
      meanAlphaRMSE: 0,
      missingPixelArtifactCount: warnings.filter((warning) => warning.startsWith('missing pixel artifact')).length,
      readinessStatus: regionModels.length === 0 ? 'insufficient-pixel-data' as const : 'trained-image-conditioned-baseline' as const,
    },
    readinessStatus: regionModels.length === 0 ? 'insufficient-pixel-data' as const : 'trained-image-conditioned-baseline' as const,
  };
  return {
    ...base,
    artifactChecksum: checksum(base),
  };
};

export const summarizeImageConditionedTraining = (
  model: ImageConditionedSegmentationModel,
): string =>
  `${model.modelId}:regions=${model.trainedRegions.join(',')}:positive=${model.trainingSummary.positivePixelCount}:negative=${model.trainingSummary.negativePixelCount}:status=${model.readinessStatus}`;
