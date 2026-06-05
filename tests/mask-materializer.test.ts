import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { OfflineMaskArtifact } from '../src/templates/schema';
import { binaryMaskToTrainingMaskPayload, materializeMaskArtifact, readBinaryMaskArtifact, validateBinaryMaskArtifact, writeBinaryMaskArtifact } from '../src/training/artifacts';

describe('mask materializer', () => {
  it('round-trips json alpha metadata through binary mask artifact', async () => {
    const artifact = JSON.parse(
      await readFile(path.resolve('tests/fixtures/materialized-dataset-with-pixels.sample/masks/artifact-train-edited.json'), 'utf8'),
    ) as OfflineMaskArtifact;
    const materialized = materializeMaskArtifact({ artifact });
    const content = writeBinaryMaskArtifact(materialized.blob);
    const readBack = readBinaryMaskArtifact(content);
    const payload = binaryMaskToTrainingMaskPayload(readBack, materialized.materialization.checksum, materialized.materialization.relativePath);
    expect(validateBinaryMaskArtifact(readBack)).toEqual([]);
    expect(payload.alphaGrid?.alpha).toHaveLength(9);
    expect(materialized.materialization.relativePath).toContain('masks-binary');
  });
});
