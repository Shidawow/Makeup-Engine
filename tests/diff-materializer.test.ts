import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { OfflineMaskArtifact } from '../src/templates/schema';
import { materializeDiffArtifact, readBinaryDiffArtifact, summarizeBinaryDiffArtifact, validateBinaryDiffArtifact, writeBinaryDiffArtifact } from '../src/training/artifacts';

describe('diff materializer', () => {
  it('round-trips json diff metadata through binary diff artifact', async () => {
    const artifact = JSON.parse(
      await readFile(path.resolve('tests/fixtures/materialized-dataset-with-pixels.sample/diffs/artifact-train-diff.json'), 'utf8'),
    ) as OfflineMaskArtifact;
    const materialized = materializeDiffArtifact({ artifact });
    const readBack = readBinaryDiffArtifact(writeBinaryDiffArtifact(materialized.blob));
    expect(validateBinaryDiffArtifact(readBack)).toEqual([]);
    expect(summarizeBinaryDiffArtifact(readBack)).toContain('binary-diff:lips');
  });
});
