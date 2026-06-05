import { describe, expect, it } from 'vitest';
import { decodePngImageArtifact, encodeRgbaPngImage, summarizePngCodecSupport } from '../src/training/artifacts';

describe('PNG codec hardening', () => {
  it('reconstructs PNG filters 0 through 4 for project-generated RGBA PNGs', () => {
    const rgba = [
      255, 10, 20, 255, 20, 40, 60, 200,
      70, 80, 90, 255, 100, 110, 120, 180,
    ];
    for (const filterType of [0, 1, 2, 3, 4] as const) {
      const result = decodePngImageArtifact(encodeRgbaPngImage({ width: 2, height: 2, rgba, filterType }));
      expect(result.validation.valid).toBe(true);
      expect(result.support?.filterTypesSeen).toEqual([filterType]);
      expect(Math.round((result.decoded?.pixels[3]?.a ?? 0) * 255)).toBe(180);
      expect(summarizePngCodecSupport(result.support!)).toContain('png-support');
    }
  });
});
