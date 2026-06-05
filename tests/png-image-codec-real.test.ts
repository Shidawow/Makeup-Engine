import { describe, expect, it } from 'vitest';
import {
  assertPngImageDecodeRoundTrip,
  decodePngImageArtifact,
  encodeRgbaPngImage,
} from '../src/training/artifacts';

describe('real PNG image codec', () => {
  it('encodes and decodes dependency-free RGBA PNG pixels', () => {
    const rgba = [255, 0, 0, 255, 0, 128, 255, 64];
    const png = encodeRgbaPngImage({ width: 2, height: 1, rgba });
    const decoded = decodePngImageArtifact(png, { imageId: 'image-png-real' });
    expect(decoded.validation.valid).toBe(true);
    expect(decoded.decoded?.width).toBe(2);
    expect(decoded.decoded?.height).toBe(1);
    expect(decoded.decoded?.pixels[1]?.g).toBeCloseTo(128 / 255, 6);
    expect(decoded.decoded?.pixels[1]?.a).toBeCloseTo(64 / 255, 6);
    expect(assertPngImageDecodeRoundTrip({ width: 2, height: 1, rgba }).passed).toBe(true);
  });
});
