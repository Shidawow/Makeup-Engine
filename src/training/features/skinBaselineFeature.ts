import type { ImagePixelData } from '../schema';
import type { TrainingMaskTensor } from '../tensors';

export interface SkinBaselineFeature {
  r: number;
  g: number;
  b: number;
  sampleCount: number;
  warnings: string[];
}

const round4 = (value: number): number => Number(value.toFixed(4));
const average = (values: readonly number[]): number =>
  values.length === 0 ? 0 : round4(values.reduce((sum, value) => sum + value, 0) / values.length);

export const extractSkinReferencePixels = (input: {
  image: ImagePixelData;
  mask: TrainingMaskTensor;
}): Array<{ r: number; g: number; b: number }> =>
  input.image.pixels.filter((_, index) => (input.mask.values[index] ?? 0) <= 0.05);

export const computeSkinBaselineRgb = (
  pixels: ReadonlyArray<{ r: number; g: number; b: number }>,
): SkinBaselineFeature => ({
  r: average(pixels.map((pixel) => pixel.r)),
  g: average(pixels.map((pixel) => pixel.g)),
  b: average(pixels.map((pixel) => pixel.b)),
  sampleCount: pixels.length,
  warnings: pixels.length < 2 ? ['skin reference pixel count is low'] : [],
});

export const estimateTrainingSkinBaseline = (input: {
  image?: ImagePixelData;
  mask?: TrainingMaskTensor;
}): SkinBaselineFeature => {
  if (!input.image || !input.mask) {
    return { r: 0, g: 0, b: 0, sampleCount: 0, warnings: ['pixel artifact missing'] };
  }
  return computeSkinBaselineRgb(extractSkinReferencePixels({ image: input.image, mask: input.mask }));
};

export const computeSkinRelativeDelta = (
  pixel: { r: number; g: number; b: number },
  baseline: SkinBaselineFeature,
): number =>
  round4(
    Math.sqrt(
      (pixel.r - baseline.r) ** 2 +
        (pixel.g - baseline.g) ** 2 +
        (pixel.b - baseline.b) ** 2,
    ),
  );

export const summarizeSkinBaselineFeature = (baseline: SkinBaselineFeature): string =>
  `skin-rgb:${baseline.r},${baseline.g},${baseline.b}:samples=${baseline.sampleCount}`;
