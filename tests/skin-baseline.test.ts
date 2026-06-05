import { describe, expect, it } from 'vitest';
import {
  analyzeSkinBaseline,
  type CosmeticSegmentationMask,
  type ImagePixelData,
} from '../src/vision';

const image: ImagePixelData = {
  width: 4,
  height: 4,
  data: new Uint8ClampedArray(
    Array.from({ length: 16 }).flatMap((_, index) => {
      const y = Math.floor(index / 4);
      const inner = y < 2;
      return inner ? [225, 88, 120, 255] : [186, 160, 145, 255];
    }),
  ),
};

const blushMask: CosmeticSegmentationMask = {
  id: 'baseline-blush',
  target: 'blush',
  polygon: { points: [], space: 'normalized-image' },
  bounds: { x: 0, y: 0, width: 1, height: 1, space: 'normalized-image' },
  grid: {
    width: 4,
    height: 4,
    alpha: [
      0.8, 0.8, 0.8, 0.8,
      0.8, 0.8, 0.8, 0.8,
      0.1, 0.1, 0.1, 0.1,
      0.1, 0.1, 0.1, 0.1,
    ],
  },
  confidence: 0.9,
  debug: [],
};

describe('skin baseline sampling', () => {
  it('estimates makeup opacity from inner region vs outer skin ring', () => {
    const analysis = analyzeSkinBaseline('baseline-fixture', image, [blushMask]);

    expect(analysis.differences.blush?.innerSampleCount).toBe(8);
    expect(analysis.differences.blush?.outerSampleCount).toBe(8);
    expect(analysis.differences.blush?.relativeSaturation).toBeGreaterThan(0.18);
    expect(analysis.differences.blush?.opacityEstimate).toBeGreaterThan(0.2);
    expect(analysis.debug[0]).toContain('blush:opacity=');
  });
});
