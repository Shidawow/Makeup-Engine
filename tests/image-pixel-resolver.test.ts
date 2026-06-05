import { describe, expect, it } from 'vitest';
import { createImagePixelArtifactFromRgbaGrid, normalizeImagePixelData, validateImagePixelArtifact } from '../src/training/artifacts';

describe('image pixel resolver', () => {
  it('normalizes JSON RGBA grid artifacts and rejects placeholder formats', () => {
    const artifact = createImagePixelArtifactFromRgbaGrid({
      artifactId: 'pixel-a',
      imageId: 'image-a',
      width: 1,
      height: 1,
      values: [0.1, 0.2, 0.3, 1],
      sourceImageReference: 'image-ref-a',
      createdAt: '2026-05-30T00:00:00.000Z',
    });
    expect(validateImagePixelArtifact(artifact).valid).toBe(true);
    expect(normalizeImagePixelData(artifact).pixels[0]).toEqual({ r: 0.1, g: 0.2, b: 0.3, a: 1 });
    expect(validateImagePixelArtifact({ ...artifact, format: 'png-image-placeholder', pixels: null }).errors[0]).toContain('unsupported');
  });
});
