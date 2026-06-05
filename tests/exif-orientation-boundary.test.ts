import { describe, expect, it } from 'vitest';
import { applyOrientationToImagePixelData, normalizeExifOrientation, readExifOrientationFromJpegBytes } from '../src/training/artifacts';

describe('EXIF orientation boundary', () => {
  it('normalizes orientation and applies supported rotations without silently ignoring them', () => {
    expect(normalizeExifOrientation(6)).toBe(6);
    expect(normalizeExifOrientation(99)).toBe('unsupported');
    expect(readExifOrientationFromJpegBytes(Uint8Array.from([0xff, 0xd8, 0xff, 0xd9]))).toBe('missing');
    const rotated = applyOrientationToImagePixelData({
      width: 2,
      height: 1,
      colorSpace: 'srgb',
      pixels: [{ r: 1, g: 0, b: 0, a: 1 }, { r: 0, g: 1, b: 0, a: 1 }],
    }, 6);
    expect(rotated.width).toBe(1);
    expect(rotated.height).toBe(2);
  });
});
