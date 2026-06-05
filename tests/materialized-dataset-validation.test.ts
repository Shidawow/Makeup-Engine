import { describe, expect, it } from 'vitest';
import { createOfflineTrainingPackage } from '../src/templates/storage/offlineTrainingPackage';
import { createMaterializedTrainingDataset } from '../src/templates/storage/materializedDatasetWriter';
import {
  validateEntryArtifactLinks,
  validateMaterializedDatasetIntegrity,
  validateNoAbsolutePathLeakage,
  validateSplitFiles,
} from '../src/templates/storage';
import { offlinePackageFixture } from './offline-package-fixtures';

describe('materialized dataset validation', () => {
  it('validates split completeness, links, and path leakage', () => {
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

    expect(validateSplitFiles(materialized)).toEqual([]);
    expect(validateEntryArtifactLinks(materialized)).toEqual([]);
    expect(validateNoAbsolutePathLeakage(materialized)).toEqual([]);
    expect(
      validateMaterializedDatasetIntegrity({ dataset: materialized }).valid,
    ).toBe(true);
  });

  it('reports missing artifact links', () => {
    const { dataset, manifest, queue } = offlinePackageFixture();
    const materialized = createMaterializedTrainingDataset({
      trainingPackage: createOfflineTrainingPackage({
        dataset,
        trainingManifest: manifest,
        reviewQueue: queue,
      }),
      outputRootDir: 'datasets/makeup-engine/dev-v0',
    });
    const broken = {
      ...materialized,
      maskFiles: materialized.maskFiles.slice(1),
    };

    expect(validateEntryArtifactLinks(broken).length).toBeGreaterThan(0);
  });
});
