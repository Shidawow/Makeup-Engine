import { describe, expect, it } from 'vitest';
import {
  compareMaskArtifactReferences,
  createMaskArtifactReference,
  summarizeMaskArtifact,
  validateMaskArtifactShape,
} from '../src/vision';
import { maskFixture } from './dataset-review-fixtures';

describe('mask artifact materialization', () => {
  it('creates stable metadata references without writing image files', () => {
    const mask = maskFixture('artifact-mask', 'lips', [0, 0.4, 0, 0.1]);
    const artifact = createMaskArtifactReference({
      sampleId: 'sample-artifact',
      maskId: mask.id,
      target: mask.target,
      grid: mask.grid,
      bounds: mask.bounds,
      artifactKind: 'human_edited_mask',
      source: 'human-correction-sample',
    });
    const again = createMaskArtifactReference({
      sampleId: 'sample-artifact',
      maskId: mask.id,
      target: mask.target,
      grid: mask.grid,
      bounds: mask.bounds,
      artifactKind: 'human_edited_mask',
      source: 'human-correction-sample',
    });

    expect(artifact.artifactId).toBe(again.artifactId);
    expect(artifact.referenceUri).toContain('offline://mask-artifacts/');
    expect(artifact.alphaStats.activeRatio).toBe(0.5);
    expect(validateMaskArtifactShape(artifact)).toEqual([]);
    expect(summarizeMaskArtifact(artifact)).toContain('human_edited_mask');
    expect(compareMaskArtifactReferences(artifact, again)).toBe(0);
  });
});
