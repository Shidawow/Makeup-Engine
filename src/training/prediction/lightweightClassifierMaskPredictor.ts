import type { ImagePixelData, LightweightRegionClassifier } from '../schema';
import type { PixelFeatureExtractionConfig, PixelFeatureVector } from '../features';
import {
  computeHsvFeatures,
  computeLocalContrastFeatures,
  computePositionFeatures,
  computeRgbFeatures,
  computeSkinRelativeFeatures,
} from '../features';
import { computeSkinBaselineRgb, type SkinBaselineFeature } from '../features';
import type { TrainingMaskTensor } from '../tensors';

export interface LightweightClassifierPredictionResult {
  width: number;
  height: number;
  alpha: number[];
  confidence: number;
  scoreSummary: {
    min: number;
    max: number;
    mean: number;
  };
  featureContributionSummary: Record<string, number>;
}

const round4 = (value: number): number => Number(value.toFixed(4));
const average = (values: readonly number[]): number =>
  values.length === 0 ? 0 : round4(values.reduce((sum, value) => sum + value, 0) / values.length);
const sigmoid = (value: number): number => 1 / (1 + Math.exp(-value));
const squaredDistance = (
  features: PixelFeatureVector,
  centroid: Record<string, number>,
  featureNames: readonly string[],
): number =>
  featureNames.reduce((sum, feature) => {
    const delta = (features[feature as keyof PixelFeatureVector] ?? 0) - (centroid[feature] ?? 0);
    return sum + delta * delta;
  }, 0);

export const scorePixelWithNearestCentroid = (
  features: PixelFeatureVector,
  classifier: LightweightRegionClassifier,
): number => {
  const positiveDistance = squaredDistance(features, classifier.positiveCentroid, classifier.featureNames);
  const negativeDistance = squaredDistance(features, classifier.negativeCentroid, classifier.featureNames);
  return round4(negativeDistance - positiveDistance);
};

export const scorePixelWithLogisticLinear = (
  features: PixelFeatureVector,
  classifier: LightweightRegionClassifier,
): number => {
  const linear = classifier.featureNames.reduce(
    (sum, feature) =>
      sum + (features[feature as keyof PixelFeatureVector] ?? 0) * (classifier.featureWeights[feature] ?? 0),
    classifier.bias,
  );
  return round4(sigmoid(linear));
};

export const applyClassifierThreshold = (
  score: number,
  classifier: LightweightRegionClassifier,
): number =>
  classifier.classifierKind === 'logistic-linear'
    ? (score >= classifier.threshold ? 1 : score)
    : (score >= classifier.threshold ? 1 : Math.max(0, 0.5 + score / 2));

export const applyRegionBoundsConstraint = (
  alpha: readonly number[],
  width: number,
  height: number,
): number[] =>
  alpha.map((value, index) => {
    const x = width <= 1 ? 0 : (index % width) / (width - 1);
    const y = height <= 1 ? 0 : Math.floor(index / width) / (height - 1);
    return x >= 0 && y >= 0 && x <= 1 && y <= 1 ? value : value * 0.25;
  });

export const applyPostProcessingSmoothing = (
  alpha: readonly number[],
  width: number,
  height: number,
): number[] =>
  alpha.map((value, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    const neighbors = [value];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < width && ny < height) neighbors.push(alpha[ny * width + nx]);
    }
    return average(neighbors);
  });

const featuresForPixel = (input: {
  image: ImagePixelData;
  x: number;
  y: number;
  featureConfig: PixelFeatureExtractionConfig;
  skinBaseline: SkinBaselineFeature;
  referenceMask?: TrainingMaskTensor;
}): PixelFeatureVector => {
  const pixel = input.image.pixels[input.y * input.image.width + input.x];
  return {
    ...computeRgbFeatures(pixel),
    ...computeHsvFeatures(pixel),
    ...computeSkinRelativeFeatures(pixel, input.skinBaseline),
    ...computeLocalContrastFeatures({
      image: input.image,
      x: input.x,
      y: input.y,
      window: input.featureConfig.localContrastWindow,
    }),
    ...computePositionFeatures({
      x: input.x,
      y: input.y,
      width: input.image.width,
      height: input.image.height,
      mask: input.referenceMask ?? {
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
};

export const predictMaskWithLightweightClassifier = (input: {
  image: ImagePixelData;
  classifier: LightweightRegionClassifier;
  featureConfig: PixelFeatureExtractionConfig;
  skinBaseline?: SkinBaselineFeature;
  referenceMask?: TrainingMaskTensor;
}): LightweightClassifierPredictionResult => {
  const skinBaseline =
    input.skinBaseline ?? computeSkinBaselineRgb(input.image.pixels.map((pixel) => ({ r: pixel.r, g: pixel.g, b: pixel.b })));
  const scores: number[] = [];
  const contributions: Record<string, number> = Object.fromEntries(input.classifier.featureNames.map((name) => [name, 0]));
  for (let y = 0; y < input.image.height; y += 1) {
    for (let x = 0; x < input.image.width; x += 1) {
      const features = featuresForPixel({
        image: input.image,
        x,
        y,
        featureConfig: input.featureConfig,
        skinBaseline,
        referenceMask: input.referenceMask,
      });
      const score =
        input.classifier.classifierKind === 'logistic-linear'
          ? scorePixelWithLogisticLinear(features, input.classifier)
          : scorePixelWithNearestCentroid(features, input.classifier);
      scores.push(score);
      for (const name of input.classifier.featureNames) {
        contributions[name] = round4((contributions[name] ?? 0) + Math.abs((features[name as keyof PixelFeatureVector] ?? 0) * (input.classifier.featureWeights[name] ?? 0)));
      }
    }
  }
  const alpha = applyPostProcessingSmoothing(
    applyRegionBoundsConstraint(
      scores.map((score) => applyClassifierThreshold(score, input.classifier)),
      input.image.width,
      input.image.height,
    ),
    input.image.width,
    input.image.height,
  );
  return {
    width: input.image.width,
    height: input.image.height,
    alpha,
    confidence: round4(Math.min(1, (input.classifier.positiveSampleCount + input.classifier.negativeSampleCount) / 20)),
    scoreSummary: {
      min: scores.length ? round4(Math.min(...scores)) : 0,
      max: scores.length ? round4(Math.max(...scores)) : 0,
      mean: average(scores),
    },
    featureContributionSummary: Object.fromEntries(
      Object.entries(contributions).map(([key, value]) => [key, round4(value / Math.max(1, scores.length))]),
    ),
  };
};

export const summarizeClassifierPrediction = (
  prediction: LightweightClassifierPredictionResult,
): string =>
  `lightweight-prediction:${prediction.width}x${prediction.height}:score=${prediction.scoreSummary.mean}:confidence=${prediction.confidence}`;
