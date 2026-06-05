import { describe, expect, it } from 'vitest';
import {
  createOfflineTrainingPackage,
  validateOfflineTrainingPackage,
} from '../src/templates/storage/offlineTrainingPackage';
import {
  validateMaskArtifactReferences,
  validatePackageLeakage,
  validateRegionCoverage,
  validateSplitCompleteness,
} from '../src/templates/storage/trainingPackageValidation';
import { offlinePackageFixture } from './offline-package-fixtures';

describe('training package validation', () => {
  it('validates references, split completeness, leakage, and region warnings', () => {
    const { dataset, manifest, queue } = offlinePackageFixture();
    const trainingPackage = createOfflineTrainingPackage({
      dataset,
      trainingManifest: manifest,
      reviewQueue: queue,
    });
    const validation = validateOfflineTrainingPackage(trainingPackage);

    expect(validateMaskArtifactReferences(trainingPackage)).toEqual([]);
    expect(validateSplitCompleteness(trainingPackage)).toEqual([]);
    expect(validatePackageLeakage(trainingPackage)).toEqual([]);
    expect(validateRegionCoverage(trainingPackage)).toContain(
      'region has no samples:contour',
    );
    expect(validation.valid).toBe(true);
    expect(validation.summary.sampleReferenceCount).toBe(3);
  });
});
