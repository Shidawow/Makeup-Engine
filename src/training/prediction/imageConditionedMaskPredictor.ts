import type { ImagePixelData, ImageConditionedRegionModel } from '../schema';
import type { PixelFeatureExtractionConfig, PixelFeatureVector } from '../features';
import {
  computeHsvFeatures,
  computeLocalContrastFeatures,
  computePositionFeatures,
  computeRgbFeatures,
  computeSkinRelativeFeatures,
} from '../features';
import type { SkinBaselineFeature } from '../features';
import { computeSkinBaselineRgb } from '../features';
import type { TrainingMaskTensor } from '../tensors';

export interface ImageConditionedPredictionResult {
  width: number;
  height: number;
  alpha: number[];
  confidence: number;
  scoreSummary: {
    min: number;
    max: number;
    mean: number;
  };
}

const round4 = (value: number): number => Number(value.toFixed(4));
const average = (values: readonly number[]): number =>
  values.length === 0 ? 0 : round4(values.reduce((sum, value) => sum + value, 0) / values.length);

export const scorePixelForRegion = (
  features: PixelFeatureVector,
  model: ImageConditionedRegionModel,
): number =>
  round4(
    Object.entries(model.featureModel.scoreWeights).reduce(
      (sum, [key, weight]) => sum + features[key as keyof PixelFeatureVector] * (weight ?? 0),
      0,
    ),
  );

export const createMaskFromPixelScores = (input: {
  width: number;
  height: number;
  scores: readonly number[];
  threshold: number;
}): number[] =>
  input.scores.map((score) => round4(score >= input.threshold ? 1 : Math.max(0, score / Math.max(0.001, input.threshold))));

export const applyRegionBoundsPrior = (
  alpha: readonly number[],
  width: number,
  height: number,
  model: ImageConditionedRegionModel,
): number[] =>
  alpha.map((value, index) => {
    const x = width <= 1 ? 0 : (index % width) / (width - 1);
    const y = height <= 1 ? 0 : Math.floor(index / width) / (height - 1);
    const dx = Math.abs(x - model.positionPrior.centerX);
    const dy = Math.abs(y - model.positionPrior.centerY);
    const within =
      dx <= Math.max(0.5, model.positionPrior.boundsWidth) &&
      dy <= Math.max(0.5, model.positionPrior.boundsHeight);
    return round4(within ? value : value * 0.35);
  });

export const applyAlphaSmoothing = (
  alpha: readonly number[],
  width: number,
  height: number,
): number[] =>
  alpha.map((value, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    const values: number[] = [value];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < width && ny < height) values.push(alpha[ny * width + nx]);
    }
    return average(values);
  });

export const predictImageConditionedMask = (input: {
  image: ImagePixelData;
  regionModel: ImageConditionedRegionModel;
  featureConfig: PixelFeatureExtractionConfig;
  skinBaseline?: SkinBaselineFeature;
  referenceMask?: TrainingMaskTensor;
}): ImageConditionedPredictionResult => {
  const skinBaseline =
    input.skinBaseline ?? computeSkinBaselineRgb(input.image.pixels.map((pixel) => ({ r: pixel.r, g: pixel.g, b: pixel.b })));
  const scores = input.image.pixels.map((pixel, index) => {
    const x = index % input.image.width;
    const y = Math.floor(index / input.image.width);
    const features: PixelFeatureVector = {
      ...computeRgbFeatures(pixel),
      ...computeHsvFeatures(pixel),
      ...computeSkinRelativeFeatures(pixel, skinBaseline),
      ...computeLocalContrastFeatures({
        image: input.image,
        x,
        y,
        window: input.featureConfig.localContrastWindow,
      }),
      ...computePositionFeatures({
        x,
        y,
        width: input.image.width,
        height: input.image.height,
        mask:
          input.referenceMask ?? {
            width: input.image.width,
            height: input.image.height,
            values: [],
            min: 0,
            max: 0,
            mean: 0,
            nonZeroRatio: 0,
            bounds: null,
          },
      }),
      alphaTarget: 0,
    };
    return scorePixelForRegion(features, input.regionModel);
  });
  const rawAlpha = createMaskFromPixelScores({
    width: input.image.width,
    height: input.image.height,
    scores,
    threshold: input.regionModel.featureModel.thresholds.scoreThreshold,
  });
  const bounded = applyRegionBoundsPrior(rawAlpha, input.image.width, input.image.height, input.regionModel);
  const alpha = applyAlphaSmoothing(bounded, input.image.width, input.image.height);
  return {
    width: input.image.width,
    height: input.image.height,
    alpha,
    confidence: input.regionModel.confidencePrior,
    scoreSummary: {
      min: scores.length ? Math.min(...scores) : 0,
      max: scores.length ? Math.max(...scores) : 0,
      mean: average(scores),
    },
  };
};

export const summarizePredictionScores = (
  prediction: ImageConditionedPredictionResult,
): string =>
  `prediction:${prediction.width}x${prediction.height}:meanScore=${prediction.scoreSummary.mean}:confidence=${prediction.confidence}`;
