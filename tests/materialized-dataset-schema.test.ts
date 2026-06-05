import { describe, expect, it } from 'vitest';
import {
  MATERIALIZED_DATASET_SCHEMA_VERSION,
  type MaterializedTrainingDataset,
} from '../src/templates/schema';

describe('materialized dataset schema', () => {
  it('defines the required top-level contract fields', () => {
    const dataset = {
      datasetId: 'materialized-a',
      schemaVersion: MATERIALIZED_DATASET_SCHEMA_VERSION,
      sourcePackageId: 'offline-package-a',
      datasetVersion: 'offline-version-a',
      createdAt: '2026-05-30T00:00:00.000Z',
      rootDir: 'datasets/makeup-engine/dev-v0',
      entries: [],
      imageFiles: [],
      maskFiles: [],
      diffFiles: [],
      splitFiles: [],
      manifestPath: 'manifest.json',
      packagePath: 'package.json',
      auditReportPath: 'audit-report.json',
      checksumsPath: 'checksums.json',
      validationResult: {
        schemaVersion: MATERIALIZED_DATASET_SCHEMA_VERSION,
        valid: true,
        checkedAt: '2026-05-30T00:00:00.000Z',
        errors: [],
        warnings: [],
        summary: {
          entryCount: 0,
          imageFileCount: 0,
          maskFileCount: 0,
          diffFileCount: 0,
          splitFileCount: 0,
          checksumMismatchCount: 0,
          absolutePathLeakCount: 0,
          splitCompleteness: {
            train: false,
            validation: false,
            test: false,
          },
          missingArtifactLinkCount: 0,
        },
      },
    } satisfies MaterializedTrainingDataset;

    expect(dataset.schemaVersion).toBe('materialized-training-dataset-v0.1');
    expect(dataset.manifestPath).toBe('manifest.json');
    expect(dataset.checksumsPath).toBe('checksums.json');
  });
});
