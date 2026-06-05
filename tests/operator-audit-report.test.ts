import { describe, expect, it } from 'vitest';
import {
  createOfflineTrainingPackage,
  validateOfflineTrainingPackage,
} from '../src/templates/storage/offlineTrainingPackage';
import {
  createOperatorAuditReport,
  exportOperatorAuditReportJson,
  summarizeCorrectionVolume,
} from '../src/templates/storage/operatorAuditReport';
import { offlinePackageFixture } from './offline-package-fixtures';

describe('operator audit report', () => {
  it('summarizes correction volume, review decisions, readiness, and recommendations', () => {
    const { dataset, manifest, queue } = offlinePackageFixture();
    const trainingPackage = createOfflineTrainingPackage({
      dataset,
      trainingManifest: manifest,
      reviewQueue: queue,
    });
    const validation = validateOfflineTrainingPackage(trainingPackage);
    const report = createOperatorAuditReport({
      packageId: trainingPackage.packageId,
      dataset,
      manifest,
      queue,
      validation,
      createdAt: '2026-05-29T00:05:00.000Z',
    });

    expect(summarizeCorrectionVolume(dataset)).toContain('3 corrections');
    expect(report.correctionSummary.totalCorrections).toBe(3);
    expect(report.reviewSummary.accepted).toBe(3);
    expect(report.readinessSummary.validationPassed).toBe(true);
    expect(exportOperatorAuditReportJson(report)).toContain(report.reportId);
  });
});
