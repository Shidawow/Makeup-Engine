import { describe, expect, it } from 'vitest';
import { evaluateSourceImageQuality } from '../src/training/validation';

describe('source image quality gate', () => {
  it('flags blank low-contrast source images and accepts varied images', () => {
    const blank = evaluateSourceImageQuality({
      width: 2,
      height: 2,
      colorSpace: 'srgb',
      pixels: Array.from({ length: 4 }, () => ({ r: 0.5, g: 0.5, b: 0.5, a: 1 })),
    });
    expect(blank.issueCodes).toContain('source-image-low-contrast');
    const varied = evaluateSourceImageQuality({
      width: 2,
      height: 2,
      colorSpace: 'srgb',
      pixels: [
        { r: 0.1, g: 0.2, b: 0.3, a: 1 },
        { r: 0.9, g: 0.7, b: 0.6, a: 1 },
        { r: 0.4, g: 0.1, b: 0.5, a: 1 },
        { r: 0.7, g: 0.6, b: 0.2, a: 1 },
      ],
    });
    expect(varied.readiness).toBe('ready');
  });
});
