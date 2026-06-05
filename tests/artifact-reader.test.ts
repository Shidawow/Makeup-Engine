import { describe, expect, it } from 'vitest';
import {
  normalizeDiffArtifact,
  normalizeMaskArtifact,
  readDiffArtifact,
  readImageReferenceArtifact,
  readMaskArtifact,
  summarizeArtifactStats,
  validateDiffArtifactForTraining,
  validateMaskArtifactForTraining,
} from '../src/training';
import { fixtureReader } from './training-bridge-fixtures';

describe('training artifact reader', () => {
  it('reads and normalizes mask, diff, and image reference artifacts', async () => {
    const reader = fixtureReader();
    const image = await readImageReferenceArtifact(reader, 'images/image-ref-train.json');
    const mask = await readMaskArtifact(reader, 'masks/artifact-train-edited.json');
    const diff = await readDiffArtifact(reader, 'diffs/artifact-train-diff.json');

    expect(image.imageId).toBe('image-train');
    expect(normalizeMaskArtifact(mask).regionId).toBe('lips');
    expect(normalizeDiffArtifact(diff).regionId).toBe('lips');
    expect(validateMaskArtifactForTraining(mask)).toEqual([]);
    expect(validateDiffArtifactForTraining(diff)).toEqual([]);
    expect(summarizeArtifactStats([mask, diff])).toContain('human_edited_mask:lips');
  });
});
