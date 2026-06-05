import { describe, expect, it } from 'vitest';
import { createImagePixelArtifactFromRawRgba, resolveRealImageFileReference, validateRealImageFileReference } from '../src/training/artifacts';

describe('real image file resolver boundary', () => {
  it('accepts portable raw rgba references and rejects png decoding as unsupported', () => {
    const reference = {
      referenceId: 'image-ref-a',
      imageId: 'image-a',
      kind: 'raw-rgba-binary' as const,
      relativePath: 'image-pixels/image-a.rgba.bin',
      portableUri: 'materialized://image-pixels/image-a.rgba.bin',
      checksum: 'abc',
    };
    const artifact = createImagePixelArtifactFromRawRgba({
      imageId: 'image-a',
      width: 1,
      height: 1,
      values: [1, 0, 0, 1],
      sourceImageReference: reference.portableUri,
    });
    expect(validateRealImageFileReference(reference).valid).toBe(true);
    expect(resolveRealImageFileReference({ reference, artifact }).supported).toBe(true);
    expect(resolveRealImageFileReference({ reference: { ...reference, kind: 'png-image' } }).validation.errors[0]).toContain('unsupported');
  });
});
