import type { CosmeticSegmentationTarget } from '../../vision';
import type { BaselineRegionPrior, BaselineSegmentationModel } from '../schema';
import type { LoadedTrainingDataset, LoadedTrainingSample } from '../schema';
import {
  createMaskTensorFromArtifact,
  normalizeAlphaGridToTensor,
  type TrainingMaskTensor,
} from '../tensors';
import type { TrainingMaskArtifactPayload } from '../artifacts';

export interface BaselineRegionEvaluationMetric {
  regionId: CosmeticSegmentationTarget;
  sampleCount: number;
  hardIoU: number;
  softIoU: number;
  dice: number;
  alphaMAE: number;
  alphaRMSE: number;
  boundsOverlap: number;
  areaError: number;
}

export interface BaselineSegmentationEvaluationResult {
  evaluationSplit: string;
  evaluationSampleCount: number;
  perRegionMetrics: BaselineRegionEvaluationMetric[];
  hardIoU: number;
  softIoU: number;
  dice: number;
  alphaMAE: number;
  alphaRMSE: number;
  boundsOverlap: number;
  areaError: number;
  readinessStatus: 'evaluated-baseline' | 'insufficient-data' | 'failed-validation';
}

const round4 = (value: number): number => Number(value.toFixed(4));

const average = (values: readonly number[]): number =>
  values.length === 0
    ? 0
    : round4(values.reduce((sum, value) => sum + value, 0) / values.length);

const targetTensorFromSample = (sample: LoadedTrainingSample): TrainingMaskTensor => {
  const mask = sample.target.humanEditedMask;
  const payload: TrainingMaskArtifactPayload = {
    format: 'json-alpha-grid',
    width: mask.width,
    height: mask.height,
    regionId: mask.regionId,
    target: mask.regionId,
    alphaGrid: null,
    alphaStats: mask.alphaStats,
    bounds: mask.bounds,
    checksum: mask.checksum,
    sourceArtifactUri: `materialized://masks/${mask.artifactId}.json`,
  };
  return createMaskTensorFromArtifact(payload);
};

export const predictMaskFromRegionPrior = (
  prior: BaselineRegionPrior,
  targetWidth?: number,
  targetHeight?: number,
): TrainingMaskTensor =>
  normalizeAlphaGridToTensor({
    width: prior.width,
    height: prior.height,
    values: prior.meanAlphaGrid,
    targetWidth: targetWidth ?? prior.width,
    targetHeight: targetHeight ?? prior.height,
  });

export const computeMaskIoU = (
  predicted: TrainingMaskTensor,
  actual: TrainingMaskTensor,
  threshold = 0.5,
): number => {
  const width = actual.width;
  const height = actual.height;
  const pred = normalizeAlphaGridToTensor({
    width: predicted.width,
    height: predicted.height,
    values: predicted.values,
    targetWidth: width,
    targetHeight: height,
  });
  let intersection = 0;
  let union = 0;
  for (let index = 0; index < actual.values.length; index += 1) {
    const predActive = pred.values[index] >= threshold;
    const actualActive = actual.values[index] >= threshold;
    if (predActive && actualActive) intersection += 1;
    if (predActive || actualActive) union += 1;
  }
  return union === 0 ? 1 : round4(intersection / union);
};

export const computeSoftMaskIoU = (
  predicted: TrainingMaskTensor,
  actual: TrainingMaskTensor,
): number => {
  const pred = normalizeAlphaGridToTensor({
    width: predicted.width,
    height: predicted.height,
    values: predicted.values,
    targetWidth: actual.width,
    targetHeight: actual.height,
  });
  let intersection = 0;
  let union = 0;
  for (let index = 0; index < actual.values.length; index += 1) {
    intersection += Math.min(pred.values[index], actual.values[index]);
    union += Math.max(pred.values[index], actual.values[index]);
  }
  return union === 0 ? 1 : round4(intersection / union);
};

export const computeDiceScore = (
  predicted: TrainingMaskTensor,
  actual: TrainingMaskTensor,
  threshold = 0.5,
): number => {
  const pred = normalizeAlphaGridToTensor({
    width: predicted.width,
    height: predicted.height,
    values: predicted.values,
    targetWidth: actual.width,
    targetHeight: actual.height,
  });
  let intersection = 0;
  let predictedCount = 0;
  let actualCount = 0;
  for (let index = 0; index < actual.values.length; index += 1) {
    const predActive = pred.values[index] >= threshold;
    const actualActive = actual.values[index] >= threshold;
    if (predActive) predictedCount += 1;
    if (actualActive) actualCount += 1;
    if (predActive && actualActive) intersection += 1;
  }
  const denominator = predictedCount + actualCount;
  return denominator === 0 ? 1 : round4((2 * intersection) / denominator);
};

export const computeAlphaMAE = (
  predicted: TrainingMaskTensor,
  actual: TrainingMaskTensor,
): number => {
  const pred = normalizeAlphaGridToTensor({
    width: predicted.width,
    height: predicted.height,
    values: predicted.values,
    targetWidth: actual.width,
    targetHeight: actual.height,
  });
  return average(actual.values.map((value, index) => Math.abs(value - pred.values[index])));
};

export const computeAlphaRMSE = (
  predicted: TrainingMaskTensor,
  actual: TrainingMaskTensor,
): number => {
  const pred = normalizeAlphaGridToTensor({
    width: predicted.width,
    height: predicted.height,
    values: predicted.values,
    targetWidth: actual.width,
    targetHeight: actual.height,
  });
  return round4(
    Math.sqrt(
      average(actual.values.map((value, index) => (value - pred.values[index]) ** 2)),
    ),
  );
};

export const computeBoundsOverlap = (
  predicted: TrainingMaskTensor,
  actual: TrainingMaskTensor,
): number => {
  if (!predicted.bounds || !actual.bounds) return predicted.bounds === actual.bounds ? 1 : 0;
  const x1 = Math.max(predicted.bounds.x, actual.bounds.x);
  const y1 = Math.max(predicted.bounds.y, actual.bounds.y);
  const x2 = Math.min(
    predicted.bounds.x + predicted.bounds.width,
    actual.bounds.x + actual.bounds.width,
  );
  const y2 = Math.min(
    predicted.bounds.y + predicted.bounds.height,
    actual.bounds.y + actual.bounds.height,
  );
  const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const predictedArea = predicted.bounds.width * predicted.bounds.height;
  const actualArea = actual.bounds.width * actual.bounds.height;
  const union = predictedArea + actualArea - intersection;
  return union === 0 ? 1 : round4(intersection / union);
};

export const evaluateRegionPrior = (input: {
  prior: BaselineRegionPrior;
  samples: readonly LoadedTrainingSample[];
}): BaselineRegionEvaluationMetric => {
  const actuals = input.samples.map(targetTensorFromSample);
  const predicted = input.prior;
  const metrics = actuals.map((actual) => {
    const pred = predictMaskFromRegionPrior(predicted, actual.width, actual.height);
    return {
      hardIoU: computeMaskIoU(pred, actual),
      softIoU: computeSoftMaskIoU(pred, actual),
      dice: computeDiceScore(pred, actual),
      alphaMAE: computeAlphaMAE(pred, actual),
      alphaRMSE: computeAlphaRMSE(pred, actual),
      boundsOverlap: computeBoundsOverlap(pred, actual),
      areaError: round4(Math.abs(pred.nonZeroRatio - actual.nonZeroRatio)),
    };
  });

  return {
    regionId: input.prior.regionId,
    sampleCount: input.samples.length,
    hardIoU: average(metrics.map((metric) => metric.hardIoU)),
    softIoU: average(metrics.map((metric) => metric.softIoU)),
    dice: average(metrics.map((metric) => metric.dice)),
    alphaMAE: average(metrics.map((metric) => metric.alphaMAE)),
    alphaRMSE: average(metrics.map((metric) => metric.alphaRMSE)),
    boundsOverlap: average(metrics.map((metric) => metric.boundsOverlap)),
    areaError: average(metrics.map((metric) => metric.areaError)),
  };
};

export const evaluateBaselineSegmentationModel = (input: {
  model: BaselineSegmentationModel;
  dataset: LoadedTrainingDataset;
  splits?: readonly string[];
}): BaselineSegmentationEvaluationResult => {
  const splitSet = new Set(input.splits ?? ['validation', 'test']);
  const samples = input.dataset.samples.filter((sample) => splitSet.has(sample.split));
  const perRegionMetrics = Object.values(input.model.regionPriors)
    .map((prior) => ({
      prior,
      samples: samples.filter((sample) => sample.regionId === prior.regionId),
    }))
    .filter((group) => group.samples.length > 0)
    .map(evaluateRegionPrior);
  const readinessStatus =
    samples.length === 0 || perRegionMetrics.length === 0
      ? 'insufficient-data'
      : 'evaluated-baseline';

  return {
    evaluationSplit: [...splitSet].sort().join(','),
    evaluationSampleCount: samples.length,
    perRegionMetrics,
    hardIoU: average(perRegionMetrics.map((metric) => metric.hardIoU)),
    softIoU: average(perRegionMetrics.map((metric) => metric.softIoU)),
    dice: average(perRegionMetrics.map((metric) => metric.dice)),
    alphaMAE: average(perRegionMetrics.map((metric) => metric.alphaMAE)),
    alphaRMSE: average(perRegionMetrics.map((metric) => metric.alphaRMSE)),
    boundsOverlap: average(perRegionMetrics.map((metric) => metric.boundsOverlap)),
    areaError: average(perRegionMetrics.map((metric) => metric.areaError)),
    readinessStatus,
  };
};

export const summarizeBaselineEvaluation = (
  evaluation: BaselineSegmentationEvaluationResult,
): string =>
  `baseline-evaluation:samples=${evaluation.evaluationSampleCount}:softIoU=${evaluation.softIoU}:dice=${evaluation.dice}:status=${evaluation.readinessStatus}`;
