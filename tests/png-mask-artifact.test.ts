import { describe, expect, it } from 'vitest';
import {
  assertPngAlphaMaskRoundTrip,
  convertJsonAlphaGridToPngAlphaMask,
  convertPngAlphaMaskToJsonAlphaGrid,
  readPngAlphaMaskArtifact,
  summarizePngAlphaMaskArtifact,
  validatePngAlphaMaskArtifact,
} from '../src/training/artifacts';

describe('PNG mask artifact boundary', () => {
  it('writes and reads a real deterministic grayscale PNG alpha mask', () => {
    const payload = {
      format: 'json-alpha-grid' as const,
      width: 2,
      height: 2,
      regionId: 'lips' as const,
      target: 'lips' as const,
      alphaGrid: { width: 2, height: 2, alpha: [0, 0.5, 0.75, 1] },
      alphaStats: { min: 0, max: 1, mean: 0.5625, activeRatio: 0.75 },
      bounds: null,
      checksum: 'source-grid',
      sourceArtifactUri: 'materialized://masks/source.json',
    };
    const encoded = convertJsonAlphaGridToPngAlphaMask(payload, {
      sampleId: 'sample-a',
      imageId: 'image-a',
      regionId: 'lips',
      referenceUri: 'materialized://masks-png/sample-a-lips.png',
    });
    expect(encoded.issues).toEqual([]);
    expect(Array.from(encoded.content?.slice(0, 8) ?? [])).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    const decoded = readPngAlphaMaskArtifact(encoded.content!, { sidecarMetadata: encoded.sidecarMetadata! });
    expect(decoded.issues).toEqual([]);
    expect(decoded.payload?.alphaGrid?.alpha[3]).toBe(1);
    expect(validatePngAlphaMaskArtifact(encoded.artifact)).toEqual([]);
    expect(convertPngAlphaMaskToJsonAlphaGrid(encoded.content!, { sidecarMetadata: encoded.sidecarMetadata! }).payload?.width).toBe(2);
    expect(assertPngAlphaMaskRoundTrip({ payload, options: { sampleId: 'sample-a', regionId: 'lips', referenceUri: 'x' } }).passed).toBe(true);
    expect(summarizePngAlphaMaskArtifact(encoded.artifact)).toContain('png-alpha-mask:lips:2x2');
  });
});
