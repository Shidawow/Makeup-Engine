import { describe, expect, it } from 'vitest';
import {
  exportOfflinePackageManifestDatasetJson,
  exportOfflinePackageCliBundleJson,
  exportOfflinePackageCliSummary,
  exportOfflineOperatorAuditReportDatasetJson,
  exportOfflineTrainingPackageDatasetJson,
  exportMaterializedDatasetBuildInputJson,
} from '../src/templates/storage/datasetExport';
import {
  createOfflineTrainingPackage,
  exportOfflineTrainingPackageJson,
  exportOfflineTrainingPackageManifestJson,
} from '../src/templates/storage/offlineTrainingPackage';
import { offlinePackageFixture } from './offline-package-fixtures';

describe('offline package export', () => {
  it('exports package, manifest, and audit report with stable schema versions', () => {
    const { dataset, manifest, queue } = offlinePackageFixture();
    const trainingPackage = createOfflineTrainingPackage({
      dataset,
      trainingManifest: manifest,
      reviewQueue: queue,
    });
    const packageJson = exportOfflineTrainingPackageJson(trainingPackage);
    const manifestJson = exportOfflineTrainingPackageManifestJson(trainingPackage);

    expect(packageJson).toBe(exportOfflineTrainingPackageDatasetJson(trainingPackage));
    expect(manifestJson).toBe(
      exportOfflinePackageManifestDatasetJson(trainingPackage),
    );
    expect(packageJson).toContain('offline-training-package-v0.1');
    expect(manifestJson).toContain(trainingPackage.packageId);
    expect(
      exportOfflineOperatorAuditReportDatasetJson(trainingPackage.auditSummary),
    ).toContain(trainingPackage.auditSummary.reportId);
    expect(exportMaterializedDatasetBuildInputJson({ trainingPackage })).toContain(
      'materialized-dataset-build-input-v0.1',
    );
    expect(exportOfflinePackageCliBundleJson({ trainingPackage })).toContain(
      'offline-package-cli-bundle-v0.1',
    );
    expect(exportOfflinePackageCliSummary({})).toContain(
      'build-training-dataset.mjs',
    );
  });
});
