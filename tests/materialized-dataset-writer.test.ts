import { describe, expect, it } from 'vitest';
import { createOfflineTrainingPackage } from '../src/templates/storage/offlineTrainingPackage';
import {
  createMaterializedTrainingDataset,
  summarizeMaterializedDataset,
  writeMaterializedDataset,
  writeSplitJsonlFiles,
} from '../src/templates/storage/materializedDatasetWriter';
import { offlinePackageFixture } from './offline-package-fixtures';

describe('materialized dataset writer', () => {
  it('builds deterministic materialized entries without absolute path leakage', () => {
    const { dataset, manifest, queue } = offlinePackageFixture();
    const trainingPackage = createOfflineTrainingPackage({
      dataset,
      trainingManifest: manifest,
      reviewQueue: queue,
    });
    const materialized = createMaterializedTrainingDataset({
      trainingPackage,
      outputRootDir: 'datasets/makeup-engine/dev-v0',
    });

    expect(materialized.entries).toHaveLength(3);
    expect(materialized.maskFiles).toHaveLength(6);
    expect(materialized.diffFiles).toHaveLength(3);
    expect(materialized.splitFiles.map((file) => file.sampleCount)).toEqual([
      1, 1, 1,
    ]);
    expect(materialized.manifestPath).toBe('manifest.json');
    expect(JSON.stringify(materialized)).not.toContain('C:\\');
    expect(summarizeMaterializedDataset(materialized)).toContain('entries:3');
  });

  it('creates split JSONL and a dry-run write plan without writing files', async () => {
    const { dataset, manifest, queue } = offlinePackageFixture();
    const trainingPackage = createOfflineTrainingPackage({
      dataset,
      trainingManifest: manifest,
      reviewQueue: queue,
    });
    const splits = writeSplitJsonlFiles(trainingPackage);
    const writes: string[] = [];
    const plan = await writeMaterializedDataset({
      trainingPackage,
      outputRootDir: 'datasets/makeup-engine/dev-v0',
      dryRun: true,
      writer: {
        mkdirp: async (path) => {
          writes.push(`mkdir:${path}`);
        },
        writeFile: async (path) => {
          writes.push(`write:${path}`);
        },
      },
    });

    expect(splits.train).toContain('sample-offline-train');
    expect(splits.validation).toContain('sample-offline-validation');
    expect(splits.test).toContain('sample-offline-test');
    expect(plan.files.some((file) => file.path === 'checksums.json')).toBe(true);
    expect(plan.dataset.validationResult.valid).toBe(true);
    expect(writes).toEqual([]);
  });
});
