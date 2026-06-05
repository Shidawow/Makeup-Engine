import { describe, expect, it } from 'vitest';
import { createPngMaskCodecMetadata } from '../src/training/schema';
import { createPngAlphaMaskSidecarMetadata } from '../src/training/artifacts';

describe('PNG mask sidecar metadata', () => {
  it('records deterministic codec and lineage fields', () => {
    const metadata = createPngMaskCodecMetadata();
    const sidecar = createPngAlphaMaskSidecarMetadata({
      maskId: 'mask-a',
      sampleId: 'sample-a',
      imageId: 'image-a',
      regionId: 'lips',
      target: 'lips',
      width: 64,
      height: 64,
      checksum: 'abc123',
      sourceAlphaGridChecksum: 'source-grid',
    });

    expect(metadata.dependency).toBe('none');
    expect(metadata.nativeBinding).toBe(false);
    expect(sidecar.schemaVersion).toBe('png-alpha-mask-sidecar.v1');
    expect(sidecar.coordinateSpace).toBe('image-pixel');
    expect(sidecar.sourceAlphaGridChecksum).toBe('source-grid');
  });
});
