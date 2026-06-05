import { describe, expect, it } from 'vitest';
import { validatePngImageMaskCodecAlignment } from '../src/training/validation/pixelMaskAlignmentValidation';

describe('image and mask codec alignment', () => {
  it('flags PNG image and mask dimension mismatches', () => {
    const issues = validatePngImageMaskCodecAlignment({
      imageWidth: 64,
      imageHeight: 64,
      maskWidth: 32,
      maskHeight: 64,
      imageId: 'image-alignment',
      sampleId: 'sample-alignment',
    });
    expect(issues[0]?.code).toBe('image-mask-codec-mismatch');
  });
});
