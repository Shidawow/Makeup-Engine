import { describe, expect, it } from 'vitest';
import { createUserAppTemplatePackageFromPublishPackage } from '../src/template-engine/app-contract';
import {
  createUserAppConsumptionChecksums,
  createUserAppConsumptionManifest,
} from '../src/templates/storage';
import { createUserAppContractPublishPackageFixture } from './userAppContractTestUtils';

describe('User app consumption manifest', () => {
  it('summarizes app templates, versions, compatibility target, and checksums', async () => {
    const publishPackage = await createUserAppContractPublishPackageFixture();
    const appPackage = createUserAppTemplatePackageFromPublishPackage({
      packageData: publishPackage,
      target: 'ios-app-v0',
      createdAt: '2026-06-01T00:00:00.000Z',
    });
    const manifest = createUserAppConsumptionManifest({
      packageData: appPackage,
      generatedAt: '2026-06-01T01:00:00.000Z',
    });

    expect(manifest.schemaVersion).toBe('user-app-consumption-manifest-v0.1');
    expect(manifest.compatibilityTarget).toBe('ios-app-v0');
    expect(manifest.entryCount).toBe(appPackage.templates.length);
    expect(Object.keys(createUserAppConsumptionChecksums(appPackage.templates))).toHaveLength(
      appPackage.templates.length,
    );
    expect(manifest.onlinePublished).toBe(false);
  });
});

