import { averageHue, rgbToHsb } from './color';
import { readPixel } from './regionSampling';
import type {
  ImagePixelData,
  WeightedColorSample,
  WeightedHueBin,
  WeightedMakeupPixelAnalysis,
} from './types';
import type {
  CosmeticSegmentationMask,
  CosmeticSegmentationTarget,
} from '../segmentation';

const sampleTargetMap: Partial<Record<CosmeticSegmentationTarget, keyof WeightedMakeupPixelAnalysis['samples']>> = {
  lips: 'lips',
  blush: 'blush',
  eyeshadow: 'eyeshadow',
  contour: 'contour',
};

const createHueDistribution = (
  hues: Array<{ hue: number; weight: number }>,
): WeightedHueBin[] => {
  const bins: WeightedHueBin[] = Array.from({ length: 12 }, (_, index) => ({
    startHue: index * 30,
    endHue: index * 30 + 30,
    weight: 0,
  }));
  const totalWeight = hues.reduce((sum, item) => sum + item.weight, 0);

  for (const item of hues) {
    const index = Math.min(11, Math.floor(item.hue / 30));
    bins[index] = {
      ...bins[index],
      weight: bins[index].weight + item.weight,
    };
  }

  return bins.map((bin) => ({
    ...bin,
    weight:
      totalWeight === 0
        ? 0
        : Number((bin.weight / totalWeight).toFixed(4)),
  }));
};

export const extractWeightedColorSample = (
  image: ImagePixelData,
  mask: CosmeticSegmentationMask,
): WeightedColorSample => {
  let weightedR = 0;
  let weightedG = 0;
  let weightedB = 0;
  let weightedSaturation = 0;
  let weightedBrightness = 0;
  let totalWeight = 0;
  let sampleCount = 0;
  const hueItems: Array<{ hue: number; weight: number }> = [];

  for (let y = 0; y < mask.grid.height; y += 1) {
    for (let x = 0; x < mask.grid.width; x += 1) {
      const weight = mask.grid.alpha[y * mask.grid.width + x] ?? 0;

      if (weight <= 0.001) {
        continue;
      }

      const pixel = readPixel(
        image,
        ((x + 0.5) / mask.grid.width) * image.width,
        ((y + 0.5) / mask.grid.height) * image.height,
      );
      const hsv = rgbToHsb(pixel);

      weightedR += pixel.r * weight;
      weightedG += pixel.g * weight;
      weightedB += pixel.b * weight;
      weightedSaturation += hsv.saturation * weight;
      weightedBrightness += hsv.brightness * weight;
      totalWeight += weight;
      sampleCount += 1;
      hueItems.push({ hue: hsv.hue, weight });
    }
  }

  const safeWeight = totalWeight || 1;
  const weightedRgbMean = {
    r: Number((weightedR / safeWeight).toFixed(2)),
    g: Number((weightedG / safeWeight).toFixed(2)),
    b: Number((weightedB / safeWeight).toFixed(2)),
  };
  const weightedHsvMean = {
    hue: averageHue(hueItems.map((item) => item.hue)),
    saturation: Number((weightedSaturation / safeWeight).toFixed(4)),
    brightness: Number((weightedBrightness / safeWeight).toFixed(4)),
  };

  return {
    target: mask.target,
    sampleCount,
    totalWeight: Number(totalWeight.toFixed(4)),
    weightedRgbMean,
    weightedHsvMean,
    weightedSaturation: weightedHsvMean.saturation,
    weightedBrightness: weightedHsvMean.brightness,
    weightedOpacity: Number((totalWeight / mask.grid.alpha.length).toFixed(4)),
    hueDistribution: createHueDistribution(hueItems),
  };
};

export const analyzeWeightedMakeupPixels = (
  imageId: string,
  image: ImagePixelData,
  masks: CosmeticSegmentationMask[],
): WeightedMakeupPixelAnalysis => {
  const samples: WeightedMakeupPixelAnalysis['samples'] = {};

  for (const mask of masks) {
    const key = sampleTargetMap[mask.target];

    if (key) {
      samples[key] = extractWeightedColorSample(image, mask);
    }
  }

  return {
    version: '0.1',
    imageId,
    samples,
    debug: {
      weightedHeatmap: masks.map(
        (mask) => `${mask.target}:${mask.grid.width}x${mask.grid.height}`,
      ),
      samplingStatistics: Object.entries(samples).map(
        ([target, sample]) =>
          `${target}:samples=${sample?.sampleCount ?? 0}:weight=${sample?.totalWeight ?? 0}`,
      ),
    },
  };
};

