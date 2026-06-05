import { describe, expect, it } from 'vitest';
import {
  readTrainingDiffArtifact,
  summarizeTrainingDiffPayload,
  validateTrainingDiffArtifactPayload,
  writeTrainingDiffArtifactMetadata,
} from '../src/training';

const artifact = {
  artifactId: 'diff-a',
  sampleId: 'sample-a',
  maskId: 'diff-a',
  target: 'lips',
  regionId: 'lips',
  artifactKind: 'diff_heatmap',
  width: 3,
  height: 3,
  alphaStats: { min: 0, max: 0.3, mean: 0.1, activeRatio: 0.2 },
  bounds: null,
  source: 'mask-diff',
  checksum: 'diff',
  referenceUri: 'offline://diff-a',
} as const;

describe('diff artifact IO boundary', () => {
  it('reads JSON diffs and exposes heatmap/binary placeholder contracts', () => {
    const payload = readTrainingDiffArtifact(artifact);

    expect(payload.format).toBe('json-diff-grid');
    expect(payload.changedAreaRatio).toBe(0.2);
    expect(validateTrainingDiffArtifactPayload(payload)).toEqual([]);
    expect(
      writeTrainingDiffArtifactMetadata(payload, 'png-diff-heatmap-placeholder').format,
    ).toBe('png-diff-heatmap-placeholder');
    expect(summarizeTrainingDiffPayload(payload)).toContain('json-diff-grid');
  });
});
