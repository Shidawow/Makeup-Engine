import { describe, expect, it } from 'vitest';
import { decodePngImageArtifact, encodeRgbaPngImage } from '../src/training/artifacts';

describe('PNG image decode validation', () => {
  it('reports sidecar dimension mismatch without crashing', () => {
    const png = encodeRgbaPngImage({ width: 2, height: 1, rgba: [0, 0, 0, 255, 255, 255, 255, 255] });
    const result = decodePngImageArtifact(png, {
      sidecarMetadata: {
        schemaVersion: 'png-image-sidecar.v1',
        imageId: 'image-sidecar-mismatch',
        width: 3,
        height: 1,
        channels: 4,
        colorSpace: 'srgb',
        alphaMode: 'straight-alpha',
        codecKind: 'png',
        codecVersion: 'makeup-engine-png-image-rgba-v0.1',
        checksum: 'fixture',
        source: 'training-fixture',
      },
    });
    expect(result.validation.valid).toBe(false);
    expect(result.validation.issues.map((issue) => issue.code)).toContain('png-image-dimension-mismatch');
  });
});
