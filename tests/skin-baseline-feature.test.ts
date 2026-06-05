import { describe, expect, it } from 'vitest';
import { estimateTrainingSkinBaseline } from '../src/training/features';

describe('skin baseline feature', () => {
  it('estimates skin baseline from negative mask pixels', () => {
    const baseline = estimateTrainingSkinBaseline({
      image: {
        width: 2,
        height: 1,
        colorSpace: 'srgb',
        pixels: [
          { r: 0.8, g: 0.2, b: 0.2, a: 1 },
          { r: 0.5, g: 0.4, b: 0.3, a: 1 },
        ],
      },
      mask: { width: 2, height: 1, values: [1, 0], min: 0, max: 1, mean: 0.5, nonZeroRatio: 0.5, bounds: null },
    });
    expect(baseline.r).toBe(0.5);
    expect(baseline.sampleCount).toBe(1);
  });
});
