import type { ImagePixelData, LightweightSegmentationClassifier } from '../schema';
import type { LoadedTrainingDataset, LoadedTrainingSample } from '../schema';
import type { TrainingMaskArtifactPayload } from '../artifacts';
import { createMaskTensorFromArtifact, type TrainingMaskTensor } from '../tensors';
import { predictMaskWithLightweightClassifier } from '../prediction/lightweightClassifierMaskPredictor';
import {
  computeAlphaMAE,
  computeAlphaRMSE,
  computeDiceScore,
  computeMaskIoU,
  computeSoftMaskIoU,
} from './baselineModelEvaluator';

export interface LightweightClassifierRegionMetric {
  regionId: string;
  sampleCount: number;
  positivePixelCount: number;
  negativePixelCount: number;
  hardIoU: number;
  softIoU: number;
  dice: number;
  alphaMAE: number;
  alphaRMSE: number;
  boundsOverlap: number;
  areaError: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  falsePositiveRatio: number;
  falseNegativeRatio: number;
  featureSeparationScore: number;
  thresholdStability: number;
}

export interface LightweightClassifierEvaluationResult {
  evaluationSampleCount: number;
  perRegionMetrics: LightweightClassifierRegionMetric[];
  hardIoU: number;
  softIoU: number;
  dice: number;
  alphaMAE: number;
  alphaRMSE: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  readinessStatus:
    | 'evaluated-lightweight-classifier'
    | 'insufficient-feature-data'
    | 'failed-classifier-validation';
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

export const computePixelClassificationMetrics = (
  predicted: TrainingMaskTensor,
  actual: TrainingMaskTensor,
) => {
  let tp = 0;
  let tn = 0;
  let fp = 0;
  let fn = 0;
  for (let index = 0; index < actual.values.length; index += 1) {
    const pred = (predicted.values[index] ?? 0) >= 0.5;
    const act = actual.values[index] >= 0.5;
    if (pred && act) tp += 1;
    if (!pred && !act) tn += 1;
    if (pred && !act) fp += 1;
    if (!pred && act) fn += 1;
  }
  const total = Math.max(1, actual.values.length);
  const precision = tp + fp === 0 ? 0 : round4(tp / (tp + fp));
  const recall = tp + fn === 0 ? 0 : round4(tp / (tp + fn));
  return {
    accuracy: round4((tp + tn) / total),
    precision,
    recall,
    f1: precision + recall === 0 ? 0 : round4((2 * precision * recall) / (precision + recall)),
    falsePositiveRatio: round4(fp / total),
    falseNegativeRatio: round4(fn / total),
  };
};

export const computeClassifierSegmentationMetrics = (
  predicted: TrainingMaskTensor,
  actual: TrainingMaskTensor,
) => ({
  hardIoU: computeMaskIoU(predicted, actual),
  softIoU: computeSoftMaskIoU(predicted, actual),
  dice: computeDiceScore(predicted, actual),
  alphaMAE: computeAlphaMAE(predicted, actual),
  alphaRMSE: computeAlphaRMSE(predicted, actual),
  boundsOverlap: 1,
  areaError: round4(Math.abs(predicted.nonZeroRatio - actual.nonZeroRatio)),
  ...computePixelClassificationMetrics(predicted, actual),
});

export const evaluateRegionLightweightClassifier = (input: {
  model: LightweightSegmentationClassifier;
  dataset: LoadedTrainingDataset;
  imagePixelsByImageId: ReadonlyMap<string, ImagePixelData>;
  regionId: string;
}): LightweightClassifierRegionMetric => {
  const classifier = input.model.regionClassifiers[input.regionId as keyof typeof input.model.regionClassifiers];
  const samples = input.dataset.samples.filter(
    (sample) =>
      sample.regionId === input.regionId &&
      ['validation', 'test'].includes(sample.split) &&
      input.imagePixelsByImageId.has(sample.imageId),
  );
  const metrics = samples.map((sample) => {
    const actual = targetTensorFromSample(sample);
    const image = input.imagePixelsByImageId.get(sample.imageId);
    if (!classifier || !image) return null;
    const prediction = predictMaskWithLightweightClassifier({
      image,
      classifier,
      featureConfig: {
        featureStride: input.model.featureConfig.featureStride,
        alphaPositiveThreshold: input.model.featureConfig.alphaPositiveThreshold,
        alphaNegativeThreshold: input.model.featureConfig.alphaNegativeThreshold,
        localContrastWindow: 1,
      },
      referenceMask: actual,
    });
    return computeClassifierSegmentationMetrics(
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
  const separation = classifier
    ? average(classifier.featureNames.map((name) => Math.abs((classifier.positiveCentroid[name] ?? 0) - (classifier.negativeCentroid[name] ?? 0))))
    : 0;
  return {
    regionId: input.regionId,
    sampleCount: samples.length,
    positivePixelCount: classifier?.positiveSampleCount ?? 0,
    negativePixelCount: classifier?.negativeSampleCount ?? 0,
    hardIoU: average(metrics.map((metric) => metric.hardIoU)),
    softIoU: average(metrics.map((metric) => metric.softIoU)),
    dice: average(metrics.map((metric) => metric.dice)),
    alphaMAE: average(metrics.map((metric) => metric.alphaMAE)),
    alphaRMSE: average(metrics.map((metric) => metric.alphaRMSE)),
    boundsOverlap: average(metrics.map((metric) => metric.boundsOverlap)),
    areaError: average(metrics.map((metric) => metric.areaError)),
    accuracy: average(metrics.map((metric) => metric.accuracy)),
    precision: average(metrics.map((metric) => metric.precision)),
    recall: average(metrics.map((metric) => metric.recall)),
    f1: average(metrics.map((metric) => metric.f1)),
    falsePositiveRatio: average(metrics.map((metric) => metric.falsePositiveRatio)),
    falseNegativeRatio: average(metrics.map((metric) => metric.falseNegativeRatio)),
    featureSeparationScore: round4(separation),
    thresholdStability: classifier ? round4(1 / (1 + Math.abs(classifier.threshold))) : 0,
  };
};

export const evaluateLightweightSegmentationClassifier = (input: {
  model: LightweightSegmentationClassifier;
  dataset: LoadedTrainingDataset;
  imagePixelsByImageId: ReadonlyMap<string, ImagePixelData>;
}): LightweightClassifierEvaluationResult => {
  const perRegionMetrics = input.model.trainedRegions
    .map((regionId) => evaluateRegionLightweightClassifier({ ...input, regionId }))
    .filter((metric) => metric.sampleCount > 0);
  return {
    evaluationSampleCount: input.dataset.samples.filter((sample) => ['validation', 'test'].includes(sample.split)).length,
    perRegionMetrics,
    hardIoU: average(perRegionMetrics.map((metric) => metric.hardIoU)),
    softIoU: average(perRegionMetrics.map((metric) => metric.softIoU)),
    dice: average(perRegionMetrics.map((metric) => metric.dice)),
    alphaMAE: average(perRegionMetrics.map((metric) => metric.alphaMAE)),
    alphaRMSE: average(perRegionMetrics.map((metric) => metric.alphaRMSE)),
    accuracy: average(perRegionMetrics.map((metric) => metric.accuracy)),
    precision: average(perRegionMetrics.map((metric) => metric.precision)),
    recall: average(perRegionMetrics.map((metric) => metric.recall)),
    f1: average(perRegionMetrics.map((metric) => metric.f1)),
    readinessStatus: perRegionMetrics.length === 0 ? 'insufficient-feature-data' : 'evaluated-lightweight-classifier',
  };
};

export const summarizeLightweightClassifierEvaluation = (
  evaluation: LightweightClassifierEvaluationResult,
): string =>
  `lightweight-evaluation:samples=${evaluation.evaluationSampleCount}:dice=${evaluation.dice}:f1=${evaluation.f1}:status=${evaluation.readinessStatus}`;
