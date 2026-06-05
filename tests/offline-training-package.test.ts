import { describe, expect, it } from 'vitest';
import {
  createOfflineDatasetVersion,
  createOfflineTrainingPackage,
  materializeMaskArtifacts,
  summarizeOfflinePackage,
} from '../src/templates/storage/offlineTrainingPackage';
import { offlinePackageFixture } from './offline-package-fixtures';

describe('offline training package builder', () => {
  it('turns a reviewed training manifest into package entries and mask artifacts', () => {
    const { dataset, manifest, queue } = offlinePackageFixture();
    const datasetVersion = createOfflineDatasetVersion({ dataset, manifest });
    const artifacts = materializeMaskArtifacts(dataset.samples);
    const trainingPackage = createOfflineTrainingPackage({
      dataset,
      trainingManifest: manifest,
      reviewQueue: queue,
      createdAt: '2026-05-29T00:04:00.000Z',
    });

    expect(datasetVersion.versionId).toContain('offline-dataset-version-');
    expect(artifacts).toHaveLength(dataset.samples.length * 3);
    expect(trainingPackage.entries).toHaveLength(3);
    expect(trainingPackage.maskArtifacts).toHaveLength(9);
    expect(trainingPackage.imageReferences).toHaveLength(3);
    expect(trainingPackage.splitSummary.train).toBe(1);
    expect(trainingPackage.splitSummary.validation).toBe(1);
    expect(trainingPackage.splitSummary.test).toBe(1);
    expect(trainingPackage.validationSummary.valid).toBe(true);
    expect(summarizeOfflinePackage(trainingPackage)).toContain('entries:3');
  });
});
