import { describe, expect, it } from 'vitest';
import { decodePngImageArtifact, encodeRgbaPngImage, summarizePngDecodeResult } from '../src/training/artifacts';

describe('PNG image codec boundary', () => {
  it('decodes real RGBA PNGs and fails clearly for truncated PNGs', () => {
    const png = encodeRgbaPngImage({ width: 1, height: 1, rgba: [255, 128, 0, 255] });
    const decoded = decodePngImageArtifact(png, { sourceUri: 'fixture.png', imageId: 'image-fixture' });
    expect(decoded.validation.valid).toBe(true);
    expect(decoded.decoded?.pixels[0]?.r).toBe(1);
    expect(decoded.decoded?.pixels[0]?.g).toBeCloseTo(128 / 255, 6);
    expect(decoded.decoded?.pixels[0]?.b).toBe(0);
    expect(decoded.decoded?.pixels[0]?.a).toBe(1);
    expect(summarizePngDecodeResult(decoded)).toContain('decoded');
    const result = decodePngImageArtifact(new Uint8Array([137, 80, 78, 71]), { sourceUri: 'fixture.png' });
    expect(result.validation.valid).toBe(false);
    expect(result.validation.issues[0]?.code).toBe('png-image-decode-failed');
    expect(summarizePngDecodeResult(result)).toContain('failed');
  });
});
