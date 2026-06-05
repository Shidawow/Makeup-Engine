import type { ImagePixelData, ImageConditionedSegmentationModel } from '../schema';
import type { LoadedTrainingDataset, LoadedTrainingSample } from '../schema';
import { createMaskTensorFromArtifact, type TrainingMaskTensor } from '../tensors';
import type { TrainingMaskArtifactPayload } from '../artifacts';
import { predictImageConditionedMask } from '../prediction';
import {
  computeAlphaMAE,
  computeAlphaRMSE,
  computeDiceScore,
  computeMaskIoU,
  computeSoftMaskIoU,
} from './baselineModelEvaluator';

export interface ImageConditionedRegionEvaluationMetric {
  regionId: string;
  sampleCount: number;
  hardIoU: number;
  softIoU: number;
  dice: number;
  alphaMAE: number;
  alphaRMSE: number;
  boundsOverlap: number;
  areaError: number;
  precision: number;
  recall: number;
  falsePositiveRatio: number;
  falseNegativeRatio: number;
}

export interface ImageConditionedEvaluationResult {
  evaluationSampleCount: number;
  missingPixelArtifactCount: number;
  perRegionMetrics: ImageConditionedRegionEvaluationMetric[];
  hardIoU: number;
  softIoU: number;
  dice: number;
  alphaMAE: number;
  alphaRMSE: number;
  precision: number;
  recall: number;
  falsePositiveRatio: number;
  falseNegativeRatio: number;
  readinessStatus: 'evaluated-image-conditioned-baseline' | 'insufficient-pixel-data' | 'failed-pixel-validation';
}

const round4 = (value: number): number => Number(value.toFixed(4));
const average = (values: readonly number[]): number =>
  values.length === 0 ? 0 : round4(values.reduce((sum, value) => sum + value, 0) / values.length);

const targetTensorFromSample = (sample: LoadedTrainingSample): TrainingMaskTensor => {
  const mask = sample.target.humanEditedMask;
  const payload: TrainingMaskArtifactPayload = {
    format: 'json-alpha-grid',
    width: mask.width,
    height: mask.height,
    regionId: sample.regionId,
    target: sample.regionId,
    alphaGrid: null,
    alphaStats: mask.alphaStats,
    bounds: mask.bounds,
    checksum: mask.checksum,
    sourceArtifactUri: `materialized://masks/${mask.artifactId}.json`,
  };
  return createMaskTensorFromArtifact(payload);
};

const comparePredictedMaskToHumanMask = (
  predicted: TrainingMaskTensor,
  actual: TrainingMaskTensor,
): Omit<ImageConditionedRegionEvaluationMetric, 'regionId' | 'sampleCount'> => {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  for (let index = 0; index < actual.values.length; index += 1) {
    const pred = (predicted.values[index] ?? 0) >= 0.5;
    const act = actual.values[index] >= 0.5;
    if (pred && act) tp += 1;
    if (pred && !act) fp += 1;
    if (!pred && act) fn += 1;
  }
  const total = actual.values.length || 1;
  return {
    hardIoU: computeMaskIoU(predicted, actual),
    softIoU: computeSoftMaskIoU(predicted, actual),
    dice: computeDiceScore(predicted, actual),
    alphaMAE: computeAlphaMAE(predicted, actual),
    alphaRMSE: computeAlphaRMSE(predicted, actual),
    boundsOverlap: 1,
    areaError: round4(Math.abs(predicted.nonZeroRatio - actual.nonZeroRatio)),
    precision: tp + fp === 0 ? 0 : round4(tp / (tp + fp)),
    recall: tp + fn === 0 ? 0 : round4(tp / (tp + fn)),
    falsePositiveRatio: round4(fp / total),
    falseNegativeRatio: round4(fn / total),
  };
};

export const computeImageConditionedMetrics = comparePredictedMaskToHumanMask;

export const evaluateImageConditionedRegionModel = (input: {
  model: ImageConditionedSegmentationModel;
  dataset: LoadedTrainingDataset;
  imagePixelsByImageId: ReadonlyMap<string, ImagePixelData>;
  regionId: string;
}): ImageConditionedRegionEvaluationMetric => {
  const regionModel = input.model.regionModels[input.regionId];
  const samples = input.dataset.samples.filter(
    (sample) =>
      sample.regionId === input.regionId &&
      ['validation', 'test'].includes(sample.split) &&
      input.imagePixelsByImageId.has(sample.imageId),
  );
  const metrics = samples.map((sample) => {
    const actual = targetTensorFromSample(sample);
    const image = input.imagePixelsByImageId.get(sample.imageId);
    if (!image || !regionModel) return null;
    const prediction = predictImageConditionedMask({
      image,
      regionModel,
      featureConfig: input.model.featureConfig,
      referenceMask: actual,
    });
    return comparePredictedMaskToHumanMask(
      {
        width: prediction.width,
        height: prediction.height,
        values: prediction.alpha,
        min: prediction.alpha.length ? Math.min(...prediction.alpha) : 0,
        max: prediction.alpha.length ? Math.max(...prediction.alpha) : 0,
        mean: average(prediction.alpha),
        nonZeroRatio: prediction.alpha.length
          ? round4(prediction.alpha.filter((value) => value > 0.001).length / prediction.alpha.length)
          : 0,
        bounds: actual.bounds,
      },
      actual,
    );
  }).filter((metric) => metric !== null);

  return {
    regionId: input.regionId,
    sampleCount: samples.length,
    hardIoU: average(metrics.map((metric) => metric.hardIoU)),
    softIoU: average(metrics.map((metric) => metric.softIoU)),
    dice: average(metrics.map((metric) => metric.dice)),
    alphaMAE: average(metrics.map((metric) => metric.alphaMAE)),
    alphaRMSE: average(metrics.map((metric) => metric.alphaRMSE)),
    boundsOverlap: average(metrics.map((metric) => metric.boundsOverlap)),
    areaError: average(metrics.map((metric) => metric.areaError)),
    precision: average(metrics.map((metric) => metric.precision)),
    recall: average(metrics.map((metric) => metric.recall)),
    falsePositiveRatio: average(metrics.map((metric) => metric.falsePositiveRatio)),
    falseNegativeRatio: average(metrics.map((metric) => metric.falseNegativeRatio)),
  };
};

export const evaluateImageConditionedSegmentationModel = (input: {
  model: ImageConditionedSegmentationModel;
  dataset: LoadedTrainingDataset;
  imagePixelsByImageId: ReadonlyMap<string, ImagePixelData>;
}): ImageConditionedEvaluationResult => {
  const perRegionMetrics = input.model.trainedRegions
    .map((regionId) =>
      evaluateImageConditionedRegionModel({
        ...input,
        regionId,
      }),
    )
    .filter((metric) => metric.sampleCount > 0);
  const evaluationSamples = input.dataset.samples.filter((sample) =>
    ['validation', 'test'].includes(sample.split),
  );
  const missingPixelArtifactCount = evaluationSamples.filter(
    (sample) => !input.imagePixelsByImageId.has(sample.imageId),
  ).length;
  const readinessStatus =
    missingPixelArtifactCount > 0
      ? 'failed-pixel-validation'
      : perRegionMetrics.length === 0
        ? 'insufficient-pixel-data'
        : 'evaluated-image-conditioned-baseline';
  return {
    evaluationSampleCount: evaluationSamples.length,
    missingPixelArtifactCount,
    perRegionMetrics,
    hardIoU: average(perRegionMetrics.map((metric) => metric.hardIoU)),
    softIoU: average(perRegionMetrics.map((metric) => metric.softIoU)),
    dice: average(perRegionMetrics.map((metric) => metric.dice)),
    alphaMAE: average(perRegionMetrics.map((metric) => metric.alphaMAE)),
    alphaRMSE: average(perRegionMetrics.map((metric) => metric.alphaRMSE)),
    precision: average(perRegionMetrics.map((metric) => metric.precision)),
    recall: average(perRegionMetrics.map((metric) => metric.recall)),
    falsePositiveRatio: average(perRegionMetrics.map((metric) => metric.falsePositiveRatio)),
    falseNegativeRatio: average(perRegionMetrics.map((metric) => metric.falseNegativeRatio)),
    readinessStatus,
  };
};

export const summarizeImageConditionedEvaluation = (
  evaluation: ImageConditionedEvaluationResult,
): string =>
  `image-conditioned-evaluation:samples=${evaluation.evaluationSampleCount}:softIoU=${evaluation.softIoU}:missingPixels=${evaluation.missingPixelArtifactCount}:status=${evaluation.readinessStatus}`;

export { comparePredictedMaskToHumanMask };
