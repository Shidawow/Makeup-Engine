import { describe, expect, it } from 'vitest';
import { createPngImageSidecarMetadata, encodeRgbaPngImage } from '../src/training/artifacts';

describe('PNG image sidecar metadata', () => {
  it('records codec, color, alpha, and dimension metadata', () => {
    const png = encodeRgbaPngImage({ width: 1, height: 1, rgba: [1, 2, 3, 255] });
    const sidecar = createPngImageSidecarMetadata({
      imageId: 'image-sidecar',
      width: 1,
      height: 1,
      checksum: String(png.length),
    });
    expect(sidecar.schemaVersion).toBe('png-image-sidecar.v1');
    expect(sidecar.codecKind).toBe('png');
    expect(sidecar.channels).toBe(4);
    expect(sidecar.colorSpace).toBe('srgb');
    expect(sidecar.alphaMode).toBe('straight-alpha');
  });
});
