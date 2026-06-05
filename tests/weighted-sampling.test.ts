import { describe, expect, it } from 'vitest';
import {
  analyzeWeightedMakeupPixels,
  type CosmeticSegmentationMask,
  type ImagePixelData,
} from '../src/vision';

const image: ImagePixelData = {
  width: 4,
  height: 4,
  data: new Uint8ClampedArray(
    Array.from({ length: 16 }).flatMap((_, index) => {
      const x = index % 4;
      const lip = x < 2;
      return lip ? [220, 40, 82, 255] : [180, 150, 132, 255];
    }),
  ),
};

const lipMask: CosmeticSegmentationMask = {
  id: 'weighted-lips',
  target: 'lips',
  polygon: { points: [], space: 'normalized-image' },
  bounds: { x: 0, y: 0, width: 1, height: 1, space: 'normalized-image' },
  grid: {
    width: 4,
    height: 4,
    alpha: [
      1, 0.8, 0, 0,
      1, 0.8, 0, 0,
      1, 0.8, 0, 0,
      1, 0.8, 0, 0,
    ],
  },
  confidence: 0.9,
  debug: [],
};

describe('weighted cosmetic sampling', () => {
  it('extracts alpha-weighted color statistics from segmentation masks', () => {
    const analysis = analyzeWeightedMakeupPixels('weighted-fixture', image, [lipMask]);

    expect(analysis.samples.lips?.weightedRgbMean.r).toBeGreaterThan(200);
    expect(analysis.samples.lips?.weightedSaturation).toBeGreaterThan(0.55);
    expect(analysis.samples.lips?.weightedOpacity).toBe(0.45);
    expect(analysis.samples.lips?.hueDistribution.reduce((sum, bin) => sum + bin.weight, 0)).toBe(1);
    expect(analysis.debug.weightedHeatmap).toEqual(['lips:4x4']);
  });
});
