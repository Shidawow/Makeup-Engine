import { describe, expect, it } from 'vitest';
import { extractPixelFeaturesForMask } from '../src/training/features';

describe('pixel feature extractor', () => {
  it('extracts deterministic positive and negative feature samples', () => {
    const samples = extractPixelFeaturesForMask({
      image: {
        width: 2,
        height: 2,
        colorSpace: 'srgb',
        pixels: [
          { r: 0.9, g: 0.1, b: 0.1, a: 1 },
          { r: 0.5, g: 0.4, b: 0.3, a: 1 },
          { r: 0.5, g: 0.4, b: 0.3, a: 1 },
          { r: 0.9, g: 0.1, b: 0.1, a: 1 },
        ],
      },
      mask: { width: 2, height: 2, values: [1, 0, 0, 1], min: 0, max: 1, mean: 0.5, nonZeroRatio: 0.5, bounds: null },
      sampleId: 'sample',
      regionId: 'lips',
      config: { featureStride: 1, alphaPositiveThreshold: 0.5, alphaNegativeThreshold: 0.05, localContrastWindow: 1 },
    });
    expect(samples.filter((sample) => sample.label === 'positive')).toHaveLength(2);
    expect(samples[0].features).toHaveProperty('skinRelativeDelta');
  });
});
