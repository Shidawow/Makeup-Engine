import { describe, expect, it } from 'vitest';
import {
  officialUserAppTemplatePackageDraftMissingGateExample,
  officialUserAppTemplatePackageDraftReadyExample,
  officialUserAppTemplatePackageDraftWarningExample,
} from '../src/templates/examples';

describe('official UserAppTemplatePackage draft', () => {
  it('contains user-facing draft fields and trace without becoming production package', () => {
    const draft = officialUserAppTemplatePackageDraftReadyExample;

    expect(draft.draftStatus).toBe('official_package_draft_ready');
    expect(draft.title).toBeTruthy();
    expect(draft.summary).toBeTruthy();
    expect(draft.stepSequence.length).toBeGreaterThan(0);
    expect(draft.regionGuidance.length).toBeGreaterThan(0);
    expect(draft.qaTrace).toBeTruthy();
    expect(draft.humanReviewTrace).toBeTruthy();
    expect(draft.candidateTrace).toBeTruthy();
    expect(draft.contractTrace).toBeTruthy();
    expect(draft.previewTrace).toBeTruthy();
    expect(draft.gateTrace).toBeTruthy();
    expect(draft.draftOnly).toBe(true);
    expect(draft.publishBlocked).toBe(true);
    expect(draft.notProductionUserAppTemplatePackage).toBe(true);
    expect(draft.noUserAppPackageRegistryWrite).toBe(true);
    expect(draft.noUserAppShellPackageReplacement).toBe(true);
  });

  it('keeps warning and blocked statuses explicit', () => {
    expect(officialUserAppTemplatePackageDraftWarningExample.draftStatus).toBe(
      'official_package_draft_ready_with_warnings',
    );
    expect(officialUserAppTemplatePackageDraftWarningExample.warnings.length).toBeGreaterThan(0);

    expect(officialUserAppTemplatePackageDraftMissingGateExample.draftStatus).toBe(
      'official_package_draft_blocked',
    );
    expect(officialUserAppTemplatePackageDraftMissingGateExample.blockedReasons.length).toBeGreaterThan(0);
  });

  it('is stable through JSON round-trip and does not carry registry or publish markers', () => {
    const json = JSON.stringify(officialUserAppTemplatePackageDraftReadyExample);

    expect(JSON.parse(json)).toEqual(officialUserAppTemplatePackageDraftReadyExample);
    expect(json).not.toContain('publishedAt');
    expect(json).not.toContain('writeRegistry');
    expect(json).not.toContain('appTemplateId');
  });
});
