import { describe, expect, it } from 'vitest';
import {
  readTrainingMaskArtifact,
  summarizeTrainingMaskPayload,
  validateTrainingMaskArtifactPayload,
  writeTrainingMaskArtifactMetadata,
} from '../src/training';

const artifact = {
  artifactId: 'mask-a',
  sampleId: 'sample-a',
  maskId: 'mask-a',
  target: 'lips',
  regionId: 'lips',
  artifactKind: 'human_edited_mask',
  width: 3,
  height: 3,
  alphaStats: { min: 0, max: 1, mean: 0.2, activeRatio: 0.4 },
  bounds: null,
  source: 'human-correction-sample',
  checksum: 'abc',
  referenceUri: 'offline://mask-a',
} as const;

describe('mask artifact IO boundary', () => {
  it('reads JSON masks and exposes PNG/binary placeholder contracts', () => {
    const json = readTrainingMaskArtifact(artifact);
    const png = readTrainingMaskArtifact(artifact, { format: 'png-alpha-mask-placeholder' });

    expect(json.format).toBe('json-alpha-grid');
    expect(json.alphaGrid?.width).toBe(3);
    expect(png.alphaGrid).toBeNull();
    expect(validateTrainingMaskArtifactPayload(json)).toEqual([]);
    expect(
      writeTrainingMaskArtifactMetadata(json, {
        format: 'binary-alpha-mask-placeholder',
        referenceUri: 'placeholder://binary',
      }).format,
    ).toBe('binary-alpha-mask-placeholder');
    expect(summarizeTrainingMaskPayload(json)).toContain('lips');
  });
});
