import { describe, expect, it } from 'vitest';
import { MASK_BINARY_ARTIFACT_SCHEMA_VERSION, type BinaryMaskArtifact } from '../src/training/schema';

describe('mask binary artifact schema', () => {
  it('defines deterministic binary mask metadata', () => {
    const artifact: BinaryMaskArtifact = {
      schemaVersion: MASK_BINARY_ARTIFACT_SCHEMA_VERSION,
      artifactId: 'mask-binary-a',
      sampleId: 'sample-a',
      regionId: 'lips',
      target: 'lips',
      format: 'binary-alpha-mask',
      valueType: 'uint8-alpha',
      width: 3,
      height: 3,
      byteLength: 128,
      checksum: 'abc',
      sourceJsonArtifactUri: 'offline://mask.json',
      referenceUri: 'materialized://masks-binary/mask-binary-a.meamask.json',
      coordinateSpace: { space: 'normalized-image', width: 3, height: 3, origin: 'top-left' },
    };
    expect(artifact.schemaVersion).toBe('mask-binary-artifact-v0.1');
    expect(artifact.format).toBe('binary-alpha-mask');
  });
});
