import { describe, expect, it } from 'vitest';
import { convertJsonAlphaGridToPngAlphaMask } from '../src/training/artifacts';
import { validatePngMaskAgainstAlphaGrid, summarizePngMaskRoundTrip } from '../src/training/validation';

describe('PNG mask round-trip validation', () => {
  it('passes alpha grid round-trip within uint8 quantization tolerance', () => {
    const payload = {
      format: 'json-alpha-grid' as const,
      width: 2,
      height: 2,
      regionId: 'eyeshadow' as const,
      target: 'eyeshadow' as const,
      alphaGrid: { width: 2, height: 2, alpha: [0, 0.25, 0.5, 1] },
      alphaStats: { min: 0, max: 1, mean: 0.4375, activeRatio: 0.75 },
      bounds: null,
      checksum: 'grid',
      sourceArtifactUri: 'materialized://masks/grid.json',
    };
    const encoded = convertJsonAlphaGridToPngAlphaMask(payload, {
      sampleId: 'sample-eye',
      imageId: 'image-eye',
      regionId: 'eyeshadow',
      referenceUri: 'materialized://masks-png/sample-eye-eyeshadow.png',
    });
    const report = validatePngMaskAgainstAlphaGrid({
      pngBytes: encoded.content!,
      sidecar: encoded.sidecarMetadata!,
      payload,
    });

    expect(report.readiness).toBe('ready');
    expect(report.blockingIssues).toEqual([]);
    expect(summarizePngMaskRoundTrip(report)).toContain('png-mask-roundtrip:ready');
  });
});
