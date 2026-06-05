import { describe, expect, it } from 'vitest';
import { convertJsonAlphaGridToPngAlphaMask, validatePngAlphaMaskArtifact } from '../src/training/artifacts';

describe('PNG alpha mask codec', () => {
  it('encodes PNG alpha mask metadata without native dependencies', () => {
    const result = convertJsonAlphaGridToPngAlphaMask({
      format: 'json-alpha-grid',
      width: 1,
      height: 2,
      regionId: 'blush',
      target: 'blush',
      alphaGrid: { width: 1, height: 2, alpha: [0.25, 1] },
      alphaStats: { min: 0.25, max: 1, mean: 0.625, activeRatio: 1 },
      bounds: null,
      checksum: 'alpha-grid',
      sourceArtifactUri: 'materialized://masks/source.json',
    }, {
      sampleId: 'sample-blush',
      regionId: 'blush',
      referenceUri: 'materialized://masks-png/sample-blush-blush.png',
    });
    expect(result.issues).toEqual([]);
    expect(result.sidecarMetadata?.codecVersion).toBe('makeup-engine-png-alpha-grayscale-v0.1');
    expect(validatePngAlphaMaskArtifact(result.artifact)).toEqual([]);
  });
});
