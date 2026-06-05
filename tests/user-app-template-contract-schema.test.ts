import { describe, expect, it } from 'vitest';
import { createUserAppTemplatePackageFromPublishPackage } from '../src/template-engine/app-contract';
import { createUserAppContractPublishPackageFixture } from './userAppContractTestUtils';

describe('User App Template Contract schema', () => {
  it('creates app-facing templates with required contract fields', async () => {
    const publishPackage = await createUserAppContractPublishPackageFixture();
    const appPackage = createUserAppTemplatePackageFromPublishPackage({
      packageData: publishPackage,
      target: 'web-app-v0',
      createdAt: '2026-06-01T00:00:00.000Z',
    });

    expect(appPackage.schemaVersion).toBe('user-app-template-contract-v0.1');
    expect(appPackage.compatibilityTarget).toBe('web-app-v0');
    expect(appPackage.localOnly).toBe(true);
    expect(appPackage.onlinePublished).toBe(false);
    expect(appPackage.templates[0]?.steps.length).toBeGreaterThan(0);
    expect(appPackage.templates[0]?.regionInstructions.length).toBeGreaterThan(0);
    expect(appPackage.exportNotes).toContain('No object URLs');
  });
});

