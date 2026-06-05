import { describe, expect, it } from 'vitest';
import {
  analyzeEdgeRings,
  type CosmeticSegmentationMask,
  type ImagePixelData,
} from '../src/vision';

const image: ImagePixelData = {
  width: 4,
  height: 4,
  data: new Uint8ClampedArray(
    Array.from({ length: 16 }).flatMap((_, index) => {
      const x = index % 4;
      return x < 2 ? [210, 60, 90, 255] : [180, 156, 142, 255];
    }),
  ),
};

const lipMask: CosmeticSegmentationMask = {
  id: 'edge-lips',
  target: 'lips',
  polygon: { points: [], space: 'normalized-image' },
  bounds: { x: 0, y: 0, width: 1, height: 1, space: 'normalized-image' },
  grid: {
    width: 4,
    height: 4,
    alpha: [
      0.8, 0.4, 0.1, 0,
      0.8, 0.4, 0.1, 0,
      0.8, 0.4, 0.1, 0,
      0.8, 0.4, 0.1, 0,
    ],
  },
  confidence: 0.9,
  debug: [],
};

describe('edge ring analysis', () => {
  it('extracts inner edge outer ring diagnostics from mask alpha bands', () => {
    const analysis = analyzeEdgeRings('edge-fixture', image, [lipMask]);

    expect(analysis.features.lips?.innerSampleCount).toBe(4);
    expect(analysis.features.lips?.edgeSampleCount).toBe(4);
    expect(analysis.features.lips?.outerSampleCount).toBe(4);
    expect(analysis.features.lips?.edgeContrast).toBeGreaterThan(0);
    expect(analysis.features.lips?.diffusionScore).toBeGreaterThan(0);
    expect(analysis.debug[0]).toContain('lips:edge=');
  });
});

