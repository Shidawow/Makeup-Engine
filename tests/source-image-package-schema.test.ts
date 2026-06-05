import { describe, expect, it } from 'vitest';
import { SOURCE_IMAGE_PACKAGE_SCHEMA_VERSION, type SourceImageManifest } from '../src/training/schema';

describe('source image package schema', () => {
  it('defines deterministic source image manifest contracts', () => {
    const manifest: SourceImageManifest = {
      schemaVersion: SOURCE_IMAGE_PACKAGE_SCHEMA_VERSION,
      packageId: 'source-image-package-test',
      createdAt: '2026-05-30T00:00:00.000Z',
      entries: [],
      readiness: 'blocked',
      issueCodes: [],
    };
    expect(manifest.schemaVersion).toBe('source-image-package-v0.1');
  });
});
