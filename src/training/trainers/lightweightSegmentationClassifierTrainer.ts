import { stableStringify } from '../../templates/storage/datasetExport';
import type { CosmeticSegmentationTarget } from '../../vision';
import type { TrainerConfig } from '../config';
import { createDefaultTrainerConfig } from '../config';
import type {
  ImagePixelData,
  LightweightClassifierKind,
  LightweightRegionClassifier,
  LightweightSegmentationClassifier,
} from '../schema';
import { LIGHTWEIGHT_CLASSIFIER_SCHEMA_VERSION } from '../schema';
import type { LoadedTrainingDataset } from '../schema';
import type { PixelFeatureExtractionConfig, PixelFeatureVector, RegionPixelFeatureSample } from '../features';
import { extractPixelFeaturesForMask } from '../features';
import { createMaskTensorFromArtifact } from '../tensors';
import type { TrainingMaskArtifactPayload } from '../artifacts';

const DEFAULT_FEATURE_NAMES: Array<keyof PixelFeatureVector> = [
  'r',
  'g',
  'b',
  'h',
  's',
  'v',
  'brightness',
  'saturation',
  'skinRelativeDelta',
  'localContrast',
  'normalizedX',
  'normalizedY',
  'distanceToRegionCenter',
  'distanceToRegionBounds',
];

const round4 = (value: number): number => Number(value.toFixed(4));
const sigmoid = (value: number): number => 1 / (1 + Math.exp(-value));
const average = (values: readonly number[]): number =>
  values.length === 0 ? 0 : round4(values.reduce((sum, value) => sum + value, 0) / values.length);

const checksum = (value: unknown): string => {
  const text = stableStringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

const maskPayloadFromSample = (sample: LoadedTrainingDataset['samples'][number]): TrainingMaskArtifactPayload => ({
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

export const collectLightweightFeatureSamples = (input: {
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

const centroid = (
  samples: readonly RegionPixelFeatureSample[],
  featureNames: readonly (keyof PixelFeatureVector)[],
): Record<string, number> =>
  Object.fromEntries(
    featureNames.map((feature) => [feature, average(samples.map((sample) => sample.features[feature]))]),
  );

export const computeFeatureNormalizationStats = (
  samples: readonly RegionPixelFeatureSample[],
  featureNames: readonly (keyof PixelFeatureVector)[] = DEFAULT_FEATURE_NAMES,
): Record<string, { mean: number; range: number }> =>
  Object.fromEntries(
    featureNames.map((feature) => {
      const values = samples.map((sample) => sample.features[feature]);
      const min = values.length ? Math.min(...values) : 0;
      const max = values.length ? Math.max(...values) : 1;
      return [feature, { mean: average(values), range: round4(Math.max(0.001, max - min)) }];
    }),
  );

export const normalizeClassifierFeatures = (
  features: PixelFeatureVector,
  normalization: Record<string, { mean: number; range: number }>,
): Record<string, number> =>
  Object.fromEntries(
    DEFAULT_FEATURE_NAMES.map((feature) => [
      feature,
      round4((features[feature] - (normalization[feature]?.mean ?? 0)) / (normalization[feature]?.range ?? 1)),
    ]),
  );

export const computeClassifierSampleWeights = (
  samples: readonly RegionPixelFeatureSample[],
): number[] => samples.map((sample) => round4(0.5 + sample.features.alphaTarget * 0.5));

export const trainNearestCentroidClassifier = (input: {
  regionId: CosmeticSegmentationTarget;
  samples: readonly RegionPixelFeatureSample[];
  featureNames?: readonly (keyof PixelFeatureVector)[];
}): LightweightRegionClassifier => {
  const featureNames = input.featureNames ?? DEFAULT_FEATURE_NAMES;
  const positive = input.samples.filter((sample) => sample.label === 'positive');
  const negative = input.samples.filter((sample) => sample.label === 'negative');
  const positiveCentroid = centroid(positive, featureNames);
  const negativeCentroid = centroid(negative, featureNames);
  const featureWeights = Object.fromEntries(
    featureNames.map((feature) => [
      feature,
      round4((positiveCentroid[feature] ?? 0) - (negativeCentroid[feature] ?? 0)),
    ]),
  );
  return {
    regionId: input.regionId,
    classifierKind: 'nearest-centroid',
    positiveCentroid,
    negativeCentroid,
    featureWeights,
    bias: 0,
    threshold: 0,
    positiveSampleCount: positive.length,
    negativeSampleCount: negative.length,
    qualityWeightedSampleCount: round4(computeClassifierSampleWeights(input.samples).reduce((sum, value) => sum + value, 0)),
    featureNames: featureNames.map(String),
    nearestCentroid: {
      featureNames: featureNames.map(String),
      positiveCentroid,
      negativeCentroid,
      distanceMetric: 'squared-euclidean',
    },
    warnings: [
      ...(positive.length === 0 ? [`insufficient classifier positive samples:${input.regionId}`] : []),
      ...(negative.length === 0 ? [`insufficient classifier negative samples:${input.regionId}`] : []),
    ],
  };
};

export const trainLogisticLinearClassifier = (input: {
  base: LightweightRegionClassifier;
  samples: readonly RegionPixelFeatureSample[];
  maxIterations: number;
  learningRate: number;
}): LightweightRegionClassifier => {
  let bias = 0;
  const weights = Object.fromEntries(input.base.featureNames.map((feature) => [feature, 0]));
  for (let iteration = 0; iteration < input.maxIterations; iteration += 1) {
    for (const sample of input.samples) {
      const label = sample.label === 'positive' ? 1 : 0;
      const linear = input.base.featureNames.reduce(
        (sum, feature) => sum + (sample.features[feature as keyof PixelFeatureVector] ?? 0) * (weights[feature] ?? 0),
        bias,
      );
      const error = sigmoid(linear) - label;
      for (const feature of input.base.featureNames) {
        weights[feature] = round4((weights[feature] ?? 0) - input.learningRate * error * (sample.features[feature as keyof PixelFeatureVector] ?? 0));
      }
      bias = round4(bias - input.learningRate * error);
    }
  }
  return {
    ...input.base,
    classifierKind: 'logistic-linear',
    featureWeights: weights,
    bias,
    threshold: 0.5,
    logistic: {
      featureNames: input.base.featureNames,
      weights,
      bias,
      iterations: input.maxIterations,
      learningRate: input.learningRate,
    },
  };
};

export const trainRegionLightweightClassifier = (input: {
  regionId: CosmeticSegmentationTarget;
  samples: readonly RegionPixelFeatureSample[];
  classifierKind: LightweightClassifierKind;
  maxIterations?: number;
  learningRate?: number;
}): LightweightRegionClassifier => {
  const nearest = trainNearestCentroidClassifier(input);
  if (input.classifierKind === 'logistic-linear') {
    return trainLogisticLinearClassifier({
      base: nearest,
      samples: input.samples,
      maxIterations: input.maxIterations ?? 8,
      learningRate: input.learningRate ?? 0.05,
    });
  }
  return nearest;
};

export const validateLightweightClassifierTrainingInput = (input: {
  dataset: LoadedTrainingDataset;
  imagePixelsByImageId: ReadonlyMap<string, ImagePixelData>;
}): string[] =>
  input.dataset.samples
    .filter((sample) => !input.imagePixelsByImageId.has(sample.imageId))
    .map((sample) => `missing pixel artifact:${sample.sampleId}`)
    .sort();

export const trainLightweightSegmentationClassifier = (input: {
  dataset: LoadedTrainingDataset;
  imagePixelsByImageId: ReadonlyMap<string, ImagePixelData>;
  config?: TrainerConfig;
  regions?: readonly CosmeticSegmentationTarget[];
  classifierKind?: LightweightClassifierKind;
  featureConfig?: PixelFeatureExtractionConfig;
  maxIterations?: number;
  learningRate?: number;
  createdAt?: string;
  trainingRunId?: string;
}): LightweightSegmentationClassifier => {
  const config = input.config ?? createDefaultTrainerConfig();
  const lightweight = config.lightweight;
  const classifierKind = input.classifierKind ?? lightweight?.classifierKind ?? 'nearest-centroid';
  const featureConfig = input.featureConfig ?? {
    featureStride: lightweight?.featureStride ?? config.imageConditioned?.featureStride ?? 1,
    alphaPositiveThreshold: lightweight?.alphaPositiveThreshold ?? config.imageConditioned?.alphaPositiveThreshold ?? 0.4,
    alphaNegativeThreshold: lightweight?.alphaNegativeThreshold ?? config.imageConditioned?.alphaNegativeThreshold ?? 0.05,
    localContrastWindow: config.imageConditioned?.localContrastWindow ?? 1,
  };
  const regions = [...(input.regions ?? lightweight?.regions ?? config.regions.enabledRegions)].sort();
  const regionClassifiers = regions
    .map((regionId) => {
      const samples = collectLightweightFeatureSamples({
        dataset: input.dataset,
        imagePixelsByImageId: input.imagePixelsByImageId,
        regionId,
        featureConfig,
      });
      return trainRegionLightweightClassifier({
        regionId,
        samples,
        classifierKind,
        maxIterations: input.maxIterations ?? lightweight?.maxIterations,
        learningRate: input.learningRate ?? lightweight?.learningRate,
      });
    })
    .filter((model) => model.positiveSampleCount > 0 && model.negativeSampleCount > 0);
  const warnings = [
    ...validateLightweightClassifierTrainingInput(input),
    ...regionClassifiers.flatMap((model) => model.warnings),
  ].sort();
  const trainingRunId = input.trainingRunId ?? `lightweight-classifier-run-${input.dataset.summary.datasetId}`;
  const base = {
    modelId: `lightweight-classifier-${input.dataset.summary.datasetId}`,
    modelVersion: `${input.dataset.summary.datasetVersion}-lightweight-v0.1`,
    schemaVersion: LIGHTWEIGHT_CLASSIFIER_SCHEMA_VERSION,
    classifierKind,
    createdAt: input.createdAt ?? input.dataset.dataset.createdAt,
    sourceDatasetId: input.dataset.summary.datasetId,
    sourcePackageId: input.dataset.summary.sourcePackageId,
    trainingRunId,
    trainerConfigVersion: config.schemaVersion,
    trainedRegions: regionClassifiers.map((model) => model.regionId).sort(),
    featureConfig: {
      featureStride: featureConfig.featureStride,
      alphaPositiveThreshold: featureConfig.alphaPositiveThreshold,
      alphaNegativeThreshold: featureConfig.alphaNegativeThreshold,
      featureNames: DEFAULT_FEATURE_NAMES.map(String),
    },
    regionClassifiers: Object.fromEntries(regionClassifiers.map((model) => [model.regionId, model])),
    trainingSummary: {
      sampleCount: input.dataset.samples.length,
      trainedRegionCount: regionClassifiers.length,
      positivePixelCount: regionClassifiers.reduce((sum, model) => sum + model.positiveSampleCount, 0),
      negativePixelCount: regionClassifiers.reduce((sum, model) => sum + model.negativeSampleCount, 0),
      classifierKind,
      warnings,
    },
    evaluationSummary: {
      evaluatedSampleCount: 0,
      evaluatedRegionCount: 0,
      meanHardIoU: 0,
      meanDice: 0,
      meanPixelF1: 0,
      readinessStatus: regionClassifiers.length === 0 ? 'insufficient-feature-data' as const : 'trained-lightweight-classifier' as const,
    },
    readinessStatus: regionClassifiers.length === 0 ? 'insufficient-feature-data' as const : 'trained-lightweight-classifier' as const,
  };
  return {
    ...base,
    artifactChecksum: checksum(base),
  };
};

export const summarizeLightweightClassifierTraining = (
  model: LightweightSegmentationClassifier,
): string =>
  `${model.modelId}:${model.classifierKind}:regions=${model.trainedRegions.join(',')}:positive=${model.trainingSummary.positivePixelCount}:negative=${model.trainingSummary.negativePixelCount}`;
