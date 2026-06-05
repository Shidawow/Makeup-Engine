import type { CosmeticSegmentationTarget } from '../../vision';
import type { ImagePixelData } from '../schema';
import type { TrainingMaskTensor } from '../tensors';
import {
  computeSkinRelativeDelta,
  estimateTrainingSkinBaseline,
  type SkinBaselineFeature,
} from './skinBaselineFeature';

export interface PixelFeatureVector {
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  v: number;
  brightness: number;
  saturation: number;
  skinRelativeR: number;
  skinRelativeG: number;
  skinRelativeB: number;
  skinRelativeDelta: number;
  localContrast: number;
  normalizedX: number;
  normalizedY: number;
  distanceToRegionCenter: number;
  distanceToRegionBounds: number;
  alphaTarget: number;
}

export interface PixelFeatureExtractionConfig {
  featureStride: number;
  alphaPositiveThreshold: number;
  alphaNegativeThreshold: number;
  localContrastWindow: number;
}

export interface RegionPixelFeatureSample {
  sampleId: string;
  regionId: CosmeticSegmentationTarget;
  label: 'positive' | 'negative';
  features: PixelFeatureVector;
}

const round4 = (value: number): number => Number(value.toFixed(4));

export const computeRgbFeatures = (pixel: { r: number; g: number; b: number }) => ({
  r: round4(pixel.r),
  g: round4(pixel.g),
  b: round4(pixel.b),
  brightness: round4((pixel.r + pixel.g + pixel.b) / 3),
});

export const computeHsvFeatures = (pixel: { r: number; g: number; b: number }) => {
  const max = Math.max(pixel.r, pixel.g, pixel.b);
  const min = Math.min(pixel.r, pixel.g, pixel.b);
  const delta = max - min;
  const hue =
    delta === 0
      ? 0
      : max === pixel.r
        ? ((pixel.g - pixel.b) / delta) % 6
        : max === pixel.g
          ? (pixel.b - pixel.r) / delta + 2
          : (pixel.r - pixel.g) / delta + 4;
  const h = round4((((hue * 60) % 360) + 360) % 360 / 360);
  const s = max === 0 ? 0 : round4(delta / max);
  return { h, s, v: round4(max), saturation: s };
};

export const computeSkinRelativeFeatures = (
  pixel: { r: number; g: number; b: number },
  baseline: SkinBaselineFeature,
) => ({
  skinRelativeR: round4(pixel.r - baseline.r),
  skinRelativeG: round4(pixel.g - baseline.g),
  skinRelativeB: round4(pixel.b - baseline.b),
  skinRelativeDelta: computeSkinRelativeDelta(pixel, baseline),
});

export const computeLocalContrastFeatures = (input: {
  image: ImagePixelData;
  x: number;
  y: number;
  window: number;
}) => {
  const values: number[] = [];
  for (let dy = -input.window; dy <= input.window; dy += 1) {
    for (let dx = -input.window; dx <= input.window; dx += 1) {
      const nx = input.x + dx;
      const ny = input.y + dy;
      if (nx < 0 || ny < 0 || nx >= input.image.width || ny >= input.image.height) continue;
      const pixel = input.image.pixels[ny * input.image.width + nx];
      values.push((pixel.r + pixel.g + pixel.b) / 3);
    }
  }
  const center = input.image.pixels[input.y * input.image.width + input.x];
  const centerBrightness = (center.r + center.g + center.b) / 3;
  const mean = values.length === 0 ? centerBrightness : values.reduce((sum, value) => sum + value, 0) / values.length;
  return { localContrast: round4(Math.abs(centerBrightness - mean)) };
};

export const computePositionFeatures = (input: {
  x: number;
  y: number;
  width: number;
  height: number;
  mask: TrainingMaskTensor;
}) => {
  const normalizedX = input.width <= 1 ? 0 : input.x / (input.width - 1);
  const normalizedY = input.height <= 1 ? 0 : input.y / (input.height - 1);
  const bounds = input.mask.bounds ?? { x: 0, y: 0, width: 1, height: 1 };
  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height / 2;
  const dx = normalizedX - centerX;
  const dy = normalizedY - centerY;
  const insideX = normalizedX >= bounds.x && normalizedX <= bounds.x + bounds.width;
  const insideY = normalizedY >= bounds.y && normalizedY <= bounds.y + bounds.height;
  const distanceToRegionBounds = insideX && insideY
    ? 0
    : Math.min(
        Math.abs(normalizedX - bounds.x),
        Math.abs(normalizedX - (bounds.x + bounds.width)),
        Math.abs(normalizedY - bounds.y),
        Math.abs(normalizedY - (bounds.y + bounds.height)),
      );
  return {
    normalizedX: round4(normalizedX),
    normalizedY: round4(normalizedY),
    distanceToRegionCenter: round4(Math.sqrt(dx * dx + dy * dy)),
    distanceToRegionBounds: round4(Math.max(0, distanceToRegionBounds)),
  };
};

export const extractPixelFeaturesForMask = (input: {
  image: ImagePixelData;
  mask: TrainingMaskTensor;
  sampleId: string;
  regionId: CosmeticSegmentationTarget;
  config: PixelFeatureExtractionConfig;
  skinBaseline?: SkinBaselineFeature;
}): RegionPixelFeatureSample[] => {
  const baseline =
    input.skinBaseline ?? estimateTrainingSkinBaseline({ image: input.image, mask: input.mask });
  const samples: RegionPixelFeatureSample[] = [];
  for (let y = 0; y < input.image.height; y += Math.max(1, input.config.featureStride)) {
    for (let x = 0; x < input.image.width; x += Math.max(1, input.config.featureStride)) {
      const index = y * input.image.width + x;
      const alphaTarget = input.mask.values[index] ?? 0;
      const label =
        alphaTarget >= input.config.alphaPositiveThreshold
          ? 'positive'
          : alphaTarget <= input.config.alphaNegativeThreshold
            ? 'negative'
            : null;
      if (!label) continue;
      const pixel = input.image.pixels[index];
      samples.push({
        sampleId: input.sampleId,
        regionId: input.regionId,
        label,
        features: {
          ...computeRgbFeatures(pixel),
          ...computeHsvFeatures(pixel),
          ...computeSkinRelativeFeatures(pixel, baseline),
          ...computeLocalContrastFeatures({
            image: input.image,
            x,
            y,
            window: input.config.localContrastWindow,
          }),
          ...computePositionFeatures({
            x,
            y,
            width: input.image.width,
            height: input.image.height,
            mask: input.mask,
          }),
          alphaTarget: round4(alphaTarget),
        },
      });
    }
  }
  return samples.sort((left, right) =>
    `${left.sampleId}:${left.label}:${left.features.normalizedY}:${left.features.normalizedX}`.localeCompare(
      `${right.sampleId}:${right.label}:${right.features.normalizedY}:${right.features.normalizedX}`,
    ),
  );
};

export const extractRegionPixelFeatureSamples = extractPixelFeaturesForMask;

export const extractPositiveNegativePixelSamples = (
  samples: readonly RegionPixelFeatureSample[],
) => ({
  positive: samples.filter((sample) => sample.label === 'positive'),
  negative: samples.filter((sample) => sample.label === 'negative'),
});

export const summarizePixelFeatureSamples = (
  samples: readonly RegionPixelFeatureSample[],
): string =>
  `pixel-features:total=${samples.length}:positive=${samples.filter((sample) => sample.label === 'positive').length}:negative=${samples.filter((sample) => sample.label === 'negative').length}`;
