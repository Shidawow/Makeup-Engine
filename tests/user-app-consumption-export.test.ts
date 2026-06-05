import { describe, expect, it } from 'vitest';
import { createUserAppTemplatePackageFromPublishPackage } from '../src/template-engine/app-contract';
import {
  createUserAppConsumptionExport,
  exportUserAppConsumptionHandoff,
  exportUserAppTemplatePackageJson,
  summarizeUserAppConsumptionExport,
} from '../src/templates/storage';
import { createUserAppContractPublishPackageFixture } from './userAppContractTestUtils';

describe('User app consumption export', () => {
  it('exports deterministic JSON and excludes runtime-only resources', async () => {
    const publishPackage = await createUserAppContractPublishPackageFixture();
    const appPackage = createUserAppTemplatePackageFromPublishPackage({
      packageData: publishPackage,
      target: 'web-app-v0',
      createdAt: '2026-06-01T00:00:00.000Z',
    });
    const json = exportUserAppTemplatePackageJson(appPackage);
    const handoff = exportUserAppConsumptionHandoff(appPackage);
    const summary = summarizeUserAppConsumptionExport(appPackage);
    const exportBundle = createUserAppConsumptionExport({
      packageData: appPackage,
      exportedAt: '2026-06-01T02:00:00.000Z',
    });

    expect(JSON.parse(json)).toMatchObject({ schemaVersion: 'user-app-template-contract-v0.1' });
    expect(JSON.parse(handoff)).toMatchObject({ compatibilityTarget: 'web-app-v0' });
    expect(summary).toContain(appPackage.packageId);
    expect(exportBundle.localOnlyDisclaimer).toContain('not online release');
    expect(json).not.toContain('blob:');
    expect(json).not.toContain('data:image/');
    expect(json).not.toContain('C:\\');
  });
});

