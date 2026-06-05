import { describe, expect, it } from 'vitest';
import { validatePixelMaskDimensions, summarizePixelMaskAlignment } from '../src/training/validation';

describe('pixel mask alignment validation', () => {
  it('blocks incompatible pixel and mask dimensions', () => {
    const issues = validatePixelMaskDimensions({
      image: { width: 3, height: 3, colorSpace: 'srgb', pixels: Array.from({ length: 9 }, () => ({ r: 0, g: 0, b: 0, a: 1 })) },
      mask: { width: 2, height: 2, values: [0, 1, 0, 1], min: 0, max: 1, mean: 0.5, nonZeroRatio: 0.5, bounds: null },
      sampleId: 'sample-a',
    });
    expect(issues[0].code).toBe('pixel-mask-dimensions-mismatch');
    expect(summarizePixelMaskAlignment([])).toBe('pixel-mask-alignment:valid=0/0:errors=0');
  });
});
