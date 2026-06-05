import { averageHue, rgbToHsb } from './color';
import { readPixel } from './regionSampling';
import type {
  HsbColorFeature,
  ImagePixelData,
  SkinBaselineAnalysis,
  SkinBaselineDifference,
} from './types';
import type {
  CosmeticSegmentationMask,
  CosmeticSegmentationTarget,
} from '../segmentation';

const baselineTargetMap: Partial<Record<CosmeticSegmentationTarget, keyof SkinBaselineAnalysis['differences']>> = {
  lips: 'lips',
  blush: 'blush',
  eyeshadow: 'eyeshadow',
  contour: 'contour',
};

const summarizeCells = (
  image: ImagePixelData,
  mask: CosmeticSegmentationMask,
  predicate: (alpha: number) => boolean,
): { count: number; hsv: HsbColorFeature } => {
  const hsvValues: HsbColorFeature[] = [];

  for (let y = 0; y < mask.grid.height; y += 1) {
    for (let x = 0; x < mask.grid.width; x += 1) {
      const alpha = mask.grid.alpha[y * mask.grid.width + x] ?? 0;

      if (!predicate(alpha)) {
        continue;
      }

      hsvValues.push(
        rgbToHsb(
          readPixel(
            image,
            ((x + 0.5) / mask.grid.width) * image.width,
            ((y + 0.5) / mask.grid.height) * image.height,
          ),
        ),
      );
    }
  }

  if (hsvValues.length === 0) {
    return {
      count: 0,
      hsv: { hue: 0, saturation: 0, brightness: 0 },
    };
  }

  return {
    count: hsvValues.length,
    hsv: {
      hue: averageHue(hsvValues.map((value) => value.hue)),
      saturation: Number(
        (
          hsvValues.reduce((sum, value) => sum + value.saturation, 0) /
          hsvValues.length
        ).toFixed(4),
      ),
      brightness: Number(
        (
          hsvValues.reduce((sum, value) => sum + value.brightness, 0) /
          hsvValues.length
        ).toFixed(4),
      ),
    },
  };
};

const hueShift = (innerHue: number, outerHue: number): number => {
  const diff = Math.abs(innerHue - outerHue);
  return Number(Math.min(diff, 360 - diff).toFixed(2));
};

export const estimateSkinBaselineDifference = (
  image: ImagePixelData,
  mask: CosmeticSegmentationMask,
): SkinBaselineDifference => {
  const inner = summarizeCells(image, mask, (alpha) => alpha >= 0.55);
  const outer = summarizeCells(image, mask, (alpha) => alpha > 0.02 && alpha < 0.22);
  const relativeSaturation = Number(
    (inner.hsv.saturation - outer.hsv.saturation).toFixed(4),
  );
  const relativeBrightness = Number(
    (inner.hsv.brightness - outer.hsv.brightness).toFixed(4),
  );
  const relativeHueShift = hueShift(inner.hsv.hue, outer.hsv.hue);
  const opacityEstimate = Number(
    Math.min(
      1,
      Math.max(
        0,
        Math.abs(relativeSaturation) * 0.9 +
          Math.abs(relativeBrightness) * 0.55 +
          relativeHueShift / 360,
      ),
    ).toFixed(4),
  );

  return {
    target: mask.target,
    innerSampleCount: inner.count,
    outerSampleCount: outer.count,
    relativeSaturation,
    relativeBrightness,
    relativeHueShift,
    opacityEstimate,
  };
};

export const analyzeSkinBaseline = (
  imageId: string,
  image: ImagePixelData,
  masks: CosmeticSegmentationMask[],
): SkinBaselineAnalysis => {
  const differences: SkinBaselineAnalysis['differences'] = {};

  for (const mask of masks) {
    const key = baselineTargetMap[mask.target];

    if (key) {
      differences[key] = estimateSkinBaselineDifference(image, mask);
    }
  }

  return {
    version: '0.1',
    imageId,
    differences,
    debug: Object.entries(differences).map(
      ([target, difference]) =>
        `${target}:opacity=${difference?.opacityEstimate ?? 0}:hueShift=${difference?.relativeHueShift ?? 0}`,
    ),
  };
};

