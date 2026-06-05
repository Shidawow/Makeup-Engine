import { stableStringify } from '../../templates/storage/datasetExport';
import type { CosmeticSegmentationTarget } from '../../vision';
import type { TrainingMaskArtifactPayload } from '../artifacts';
import type { TrainerConfig } from '../config';
import { createDefaultTrainerConfig } from '../config';
import type {
  BaselineRegionPrior,
  BaselineSegmentationModel,
} from '../schema/baseline-segmentation-model.schema';
import { BASELINE_SEGMENTATION_MODEL_SCHEMA_VERSION } from '../schema/baseline-segmentation-model.schema';
import type { LoadedMaskTarget, LoadedTrainingDataset, LoadedTrainingSample } from '../schema';
import {
  createMaskTensorFromArtifact,
  normalizeAlphaGridToTensor,
  type TrainingMaskTensor,
} from '../tensors';

const ALL_REGIONS: CosmeticSegmentationTarget[] = [
  'lips',
  'blush',
  'eyeshadow',
  'eyeliner',
  'contour',
  'highlight',
];

const round4 = (value: number): number => Number(value.toFixed(4));

const average = (values: readonly number[]): number =>
  values.length === 0
    ? 0
    : round4(values.reduce((sum, value) => sum + value, 0) / values.length);

const weightedAverage = (
  values: readonly number[],
  weights: readonly number[],
): number => {
  const weightSum = weights.reduce((sum, value) => sum + value, 0);
  if (values.length === 0 || weightSum === 0) return 0;
  return round4(
    values.reduce((sum, value, index) => sum + value * (weights[index] ?? 0), 0) /
      weightSum,
  );
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

const maskPayloadFromTarget = (
  target: LoadedMaskTarget,
): TrainingMaskArtifactPayload => ({
  format: 'json-alpha-grid',
  width: target.width,
  height: target.height,
  regionId: target.regionId,
  target: target.regionId,
  alphaGrid: null,
  alphaStats: target.alphaStats,
  bounds: target.bounds,
  checksum: target.checksum,
  sourceArtifactUri: `materialized://masks/${target.artifactId}.json`,
});

const resizeTensor = (
  tensor: TrainingMaskTensor,
  width: number,
  height: number,
): TrainingMaskTensor =>
  normalizeAlphaGridToTensor({
    width: tensor.width,
    height: tensor.height,
    values: tensor.values,
    targetWidth: width,
    targetHeight: height,
  });

export const aggregateAlphaGrids = (
  tensors: readonly TrainingMaskTensor[],
  weights: readonly number[],
): number[] => {
  if (tensors.length === 0) return [];
  const width = tensors[0].width;
  const height = tensors[0].height;
  const normalized = tensors.map((tensor) => resizeTensor(tensor, width, height));
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0) || tensors.length;

  return Array.from({ length: width * height }, (_, index) =>
    round4(
      normalized.reduce(
        (sum, tensor, tensorIndex) =>
          sum + tensor.values[index] * (weights[tensorIndex] ?? 1),
        0,
      ) / weightSum,
    ),
  );
};

export const computeQualityWeightedAlphaPrior = (
  samples: readonly LoadedTrainingSample[],
): {
  tensors: TrainingMaskTensor[];
  weights: number[];
  meanAlphaGrid: number[];
  width: number;
  height: number;
} => {
  const tensors = samples.map((sample) =>
    createMaskTensorFromArtifact(maskPayloadFromTarget(sample.target.humanEditedMask)),
  );
  const weights = samples.map((sample) =>
    round4(Math.max(0, sample.qualityScore) * Math.max(0, sample.sampleWeight)),
  );
  const meanAlphaGrid = aggregateAlphaGrids(tensors, weights);
  return {
    tensors,
    weights,
    meanAlphaGrid,
    width: tensors[0]?.width ?? 0,
    height: tensors[0]?.height ?? 0,
  };
};

export const computeAreaDistribution = (
  tensors: readonly TrainingMaskTensor[],
): BaselineRegionPrior['areaDistribution'] => {
  const areas = tensors.map((tensor) => tensor.nonZeroRatio);
  return {
    min: areas.length === 0 ? 0 : round4(Math.min(...areas)),
    max: areas.length === 0 ? 0 : round4(Math.max(...areas)),
    mean: average(areas),
  };
};

export const computeBoundsDistribution = (
  tensors: readonly TrainingMaskTensor[],
): BaselineRegionPrior['boundsDistribution'] => {
  const bounds = tensors.map((tensor) => tensor.bounds).filter((item) => item !== null);
  const areas = bounds.map((bound) => round4(bound.width * bound.height));
  return {
    meanBounds:
      bounds.length === 0
        ? null
        : {
            x: average(bounds.map((bound) => bound.x)),
            y: average(bounds.map((bound) => bound.y)),
            width: average(bounds.map((bound) => bound.width)),
            height: average(bounds.map((bound) => bound.height)),
            space: 'normalized-image',
          },
    minArea: areas.length === 0 ? 0 : round4(Math.min(...areas)),
    maxArea: areas.length === 0 ? 0 : round4(Math.max(...areas)),
    meanArea: average(areas),
  };
};

const edgeSoftness = (tensor: TrainingMaskTensor): number => {
  if (tensor.width <= 1 || tensor.height <= 1) return 0;
  const gradients: number[] = [];
  for (let y = 0; y < tensor.height; y += 1) {
    for (let x = 0; x < tensor.width; x += 1) {
      const index = y * tensor.width + x;
      const right = x + 1 < tensor.width ? tensor.values[index + 1] : tensor.values[index];
      const down =
        y + 1 < tensor.height ? tensor.values[index + tensor.width] : tensor.values[index];
      gradients.push(Math.abs(tensor.values[index] - right));
      gradients.push(Math.abs(tensor.values[index] - down));
    }
  }
  return round4(1 - Math.min(1, average(gradients)));
};

export const computeEdgeSoftnessPrior = (
  tensors: readonly TrainingMaskTensor[],
): BaselineRegionPrior['edgeSoftnessPrior'] => {
  const values = tensors.map(edgeSoftness);
  return {
    meanEdgeSoftness: average(values),
    minEdgeSoftness: values.length === 0 ? 0 : round4(Math.min(...values)),
    maxEdgeSoftness: values.length === 0 ? 0 : round4(Math.max(...values)),
  };
};

export const computeConfidencePrior = (
  samples: readonly LoadedTrainingSample[],
): BaselineRegionPrior['confidencePrior'] => {
  const values = samples.map((sample) => sample.qualityScore);
  return {
    min: values.length === 0 ? 0 : round4(Math.min(...values)),
    max: values.length === 0 ? 0 : round4(Math.max(...values)),
    mean: average(values),
  };
};

export const trainRegionPrior = (input: {
  regionId: CosmeticSegmentationTarget;
  samples: readonly LoadedTrainingSample[];
  minSamplesPerRegion?: number;
}): BaselineRegionPrior => {
  const alphaPrior = computeQualityWeightedAlphaPrior(input.samples);
  const meanTensor = normalizeAlphaGridToTensor({
    width: alphaPrior.width || 1,
    height: alphaPrior.height || 1,
    values: alphaPrior.meanAlphaGrid.length > 0 ? alphaPrior.meanAlphaGrid : [0],
  });
  const warnings = [
    ...(input.samples.length < (input.minSamplesPerRegion ?? 1)
      ? [`insufficient samples for region:${input.regionId}`]
      : []),
  ];

  return {
    regionId: input.regionId,
    target: input.regionId,
    sampleCount: input.samples.length,
    width: meanTensor.width,
    height: meanTensor.height,
    meanAlphaGrid: meanTensor.values,
    meanAlphaStats: {
      min: meanTensor.min,
      max: meanTensor.max,
      mean: meanTensor.mean,
      activeRatio: meanTensor.nonZeroRatio,
    },
    areaDistribution: computeAreaDistribution(alphaPrior.tensors),
    boundsDistribution: computeBoundsDistribution(alphaPrior.tensors),
    edgeSoftnessPrior: computeEdgeSoftnessPrior(alphaPrior.tensors),
    confidencePrior: computeConfidencePrior(input.samples),
    qualityWeightedSampleCount: round4(
      input.samples.reduce(
        (sum, sample) => sum + sample.qualityScore * sample.sampleWeight,
        0,
      ),
    ),
    warnings,
  };
};

export const validateBaselineTrainingInput = (input: {
  dataset: LoadedTrainingDataset;
  regions: readonly CosmeticSegmentationTarget[];
  minSamplesPerRegion: number;
  missingRegionPolicy?: 'warn' | 'fail' | 'skip';
}): string[] =>
  input.regions.flatMap((region) => {
    const count = input.dataset.samples.filter((sample) => sample.regionId === region).length;
    if (count >= input.minSamplesPerRegion) return [];
    const message = `region ${region} has ${count} samples, requires ${input.minSamplesPerRegion}`;
    return input.missingRegionPolicy === 'skip' ? [] : [message];
  });

export const trainBaselineSegmentationModel = (input: {
  dataset: LoadedTrainingDataset;
  config?: TrainerConfig;
  regions?: readonly CosmeticSegmentationTarget[];
  trainingRunId?: string;
  createdAt?: string;
  modelVersion?: string;
}): BaselineSegmentationModel => {
  const config = input.config ?? createDefaultTrainerConfig();
  const enabledRegions = [
    ...(input.regions ?? config.regions.enabledRegions ?? ALL_REGIONS),
  ].sort() as CosmeticSegmentationTarget[];
  const minSamplesPerRegion = config.regions.minSamplesPerRegion;
  const missingPolicy = config.baseline?.missingRegionPolicy ?? 'warn';
  const priors = enabledRegions
    .map((regionId) => ({
      regionId,
      samples: input.dataset.samples.filter(
        (sample) =>
          sample.regionId === regionId &&
          sample.accepted &&
          sample.trainingReady &&
          sample.qualityScore >= config.quality.minQualityScore,
      ),
    }))
    .filter((group) => missingPolicy !== 'skip' || group.samples.length >= minSamplesPerRegion)
    .filter((group) => group.samples.length > 0)
    .map((group) =>
      trainRegionPrior({
        regionId: group.regionId,
        samples: group.samples,
        minSamplesPerRegion,
      }),
    );
  const warnings = [
    ...validateBaselineTrainingInput({
      dataset: input.dataset,
      regions: enabledRegions,
      minSamplesPerRegion,
      missingRegionPolicy: missingPolicy,
    }),
    ...priors.flatMap((prior) => prior.warnings),
  ].sort();
  const trainingRunId = input.trainingRunId ?? `baseline-run-${input.dataset.summary.datasetId}`;
  const modelWithoutChecksum = {
    modelId: `baseline-mask-prior-${input.dataset.summary.datasetId}`,
    modelVersion: input.modelVersion ?? `${input.dataset.summary.datasetVersion}-baseline-v0.1`,
    schemaVersion: BASELINE_SEGMENTATION_MODEL_SCHEMA_VERSION,
    createdAt: input.createdAt ?? input.dataset.dataset.createdAt,
    sourceDatasetId: input.dataset.summary.datasetId,
    sourcePackageId: input.dataset.summary.sourcePackageId,
    trainingRunId,
    trainerConfigVersion: config.schemaVersion,
    trainedRegions: priors.map((prior) => prior.regionId).sort(),
    regionPriors: Object.fromEntries(
      [...priors]
        .sort((left, right) => left.regionId.localeCompare(right.regionId))
        .map((prior) => [prior.regionId, prior]),
    ),
    trainingSummary: {
      sampleCount: priors.reduce((sum, prior) => sum + prior.sampleCount, 0),
      trainedRegionCount: priors.length,
      skippedRegionCount: Math.max(0, enabledRegions.length - priors.length),
      qualityWeightedSampleCount: round4(
        priors.reduce((sum, prior) => sum + prior.qualityWeightedSampleCount, 0),
      ),
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
      readinessStatus: priors.length === 0 ? 'insufficient-data' as const : 'trained-baseline' as const,
    },
    readinessStatus: priors.length === 0 ? 'insufficient-data' as const : 'trained-baseline' as const,
  };
  const artifactChecksum = checksum(modelWithoutChecksum);

  return {
    ...modelWithoutChecksum,
    artifactChecksum,
  };
};

export const summarizeBaselineTraining = (
  model: BaselineSegmentationModel,
): string =>
  `${model.modelId}:regions=${model.trainedRegions.join(',')}:samples=${model.trainingSummary.sampleCount}:status=${model.readinessStatus}`;
