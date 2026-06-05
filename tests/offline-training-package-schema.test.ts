import { describe, expect, it } from 'vitest';
import type { OfflineTrainingPackage } from '../src/templates/schema';
import { OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION } from '../src/templates/schema';

describe('OfflineTrainingPackage schema', () => {
  it('defines deterministic package contract fields', () => {
    const contract: Pick<
      OfflineTrainingPackage,
      'schemaVersion' | 'packageId' | 'entries' | 'maskArtifacts'
    > = {
      schemaVersion: OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION,
      packageId: 'offline-package-fixture',
      entries: [],
      maskArtifacts: [],
    };

    expect(contract.schemaVersion).toBe('offline-training-package-v0.1');
    expect(contract.packageId).toBe('offline-package-fixture');
    expect(contract.entries).toEqual([]);
  });
});
