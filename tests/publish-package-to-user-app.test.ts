import { describe, expect, it } from 'vitest';
import {
  convertPublishPackageEntryToUserAppTemplate,
  createUserAppTemplatePackageFromPublishPackage,
  estimateTemplateDuration,
  extractAppStyleTags,
} from '../src/template-engine/app-contract';
import { createUserAppContractPublishPackageFixture } from './userAppContractTestUtils';

describe('Template Publish Package to User App adapter', () => {
  it('converts package entries into app templates and preserves local-only lineage', async () => {
    const publishPackage = await createUserAppContractPublishPackageFixture();
    const entry = publishPackage.entries[0];

    expect(entry).toBeDefined();

    const template = convertPublishPackageEntryToUserAppTemplate({
      entry: entry!,
      sourcePackage: publishPackage,
      target: 'ios-app-v0',
      createdAt: '2026-06-01T00:00:00.000Z',
    });

    expect(template.compatibility.target).toBe('ios-app-v0');
    expect(template.lineage.sourcePublishPackageId).toBe(publishPackage.packageId);
    expect(template.lineage.onlinePublished).toBe(false);
    expect(template.estimatedDurationMinutes).toBe(estimateTemplateDuration(entry!.makeupSteps));
    expect(extractAppStyleTags(entry!)).toContain('natural');
  });

  it('does not create app templates when publish package readiness is blocked', async () => {
    const publishPackage = await createUserAppContractPublishPackageFixture();
    const blockedPackage = {
      ...publishPackage,
      validation: {
        ...publishPackage.validation,
        valid: false,
        readiness: {
          ...publishPackage.validation.readiness,
          ready: false,
          blockingIssues: ['blocked fixture'],
        },
        issues: ['blocked fixture'],
      },
    };
    const appPackage = createUserAppTemplatePackageFromPublishPackage({
      packageData: blockedPackage,
    });

    expect(appPackage.templates).toHaveLength(0);
    expect(appPackage.validation.valid).toBe(false);
    expect(appPackage.validation.blockingIssues).toContain('package contains no app templates');
    expect(appPackage.compatibility.sourcePackageCompatibility?.target).toBe(
      'local-user-app-contract',
    );
  });
});
