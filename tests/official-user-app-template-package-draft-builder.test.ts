import { describe, expect, it } from 'vitest';
import { buildOfficialUserAppTemplatePackageDraft } from '../src/template-engine';
import {
  officialUserAppPackageDraftGateHandoffReadyExample,
  officialUserAppPackageDraftGateReadyExample,
  officialUserAppTemplatePackageDraftBuilderMedicalClaimExample,
  officialUserAppTemplatePackageDraftBuilderMissingGateExample,
  officialUserAppTemplatePackageDraftBuilderMissingPrivacyExample,
  officialUserAppTemplatePackageDraftBuilderMissingStepExample,
  officialUserAppTemplatePackageDraftBuilderMutationExample,
  officialUserAppTemplatePackageDraftBuilderPersonalDataExample,
  officialUserAppTemplatePackageDraftBuilderProductShadeExample,
  officialUserAppTemplatePackageDraftBuilderRawImageExample,
  officialUserAppTemplatePackageDraftBuilderReadyExample,
  officialUserAppTemplatePackageDraftBuilderRegistryWriteExample,
  officialUserAppTemplatePackageDraftBuilderWarningExample,
  userAppPackageDraftPreviewReadyExample,
} from '../src/templates/examples';

describe('official UserAppTemplatePackage draft builder', () => {
  it('builds a ready draft only from a ready 10F gate', () => {
    const result = officialUserAppTemplatePackageDraftBuilderReadyExample;

    expect(result.status).toBe('official_package_draft_ready');
    expect(result.draft.draftOnly).toBe(true);
    expect(result.draft.publishBlocked).toBe(true);
    expect(result.draft.noUserAppPackageRegistryWrite).toBe(true);
    expect(result.draft.noUserAppShellPackageReplacement).toBe(true);
    expect(result.draft.notProductionUserAppTemplatePackage).toBe(true);
    expect(result.draft.stepSequence.length).toBeGreaterThan(0);
    expect(result.draft.privacyNotice).toContain('不上传');
  });

  it('keeps warnings as draft-ready-with-warnings', () => {
    expect(officialUserAppTemplatePackageDraftBuilderWarningExample.status).toBe(
      'official_package_draft_ready_with_warnings',
    );
    expect(officialUserAppTemplatePackageDraftBuilderWarningExample.warnings.length).toBeGreaterThan(0);
  });

  it('blocks missing gate, missing steps, and missing privacy copy', () => {
    expect(officialUserAppTemplatePackageDraftBuilderMissingGateExample.status).toBe(
      'official_package_draft_blocked',
    );
    expect(officialUserAppTemplatePackageDraftBuilderMissingGateExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'source_gate_not_ready' })]),
    );

    expect(officialUserAppTemplatePackageDraftBuilderMissingStepExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'missing_step_sequence' })]),
    );
    expect(officialUserAppTemplatePackageDraftBuilderMissingPrivacyExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'missing_privacy_notice' })]),
    );
  });

  it('blocks raw image, personal data, medical, shade, registry write, and mutation risks', () => {
    expect(officialUserAppTemplatePackageDraftBuilderRawImageExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'raw_image_reference' })]),
    );
    expect(officialUserAppTemplatePackageDraftBuilderPersonalDataExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'personal_data' })]),
    );
    expect(officialUserAppTemplatePackageDraftBuilderMedicalClaimExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'medical_claim' })]),
    );
    expect(officialUserAppTemplatePackageDraftBuilderProductShadeExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'product_shade_claim' })]),
    );
    expect(officialUserAppTemplatePackageDraftBuilderRegistryWriteExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'publish_registry_or_mutation_scope' })]),
    );
    expect(officialUserAppTemplatePackageDraftBuilderMutationExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'publish_registry_or_mutation_scope' })]),
    );
  });

  it('does not write registry, publish, or replace current User App Shell package', () => {
    const result = buildOfficialUserAppTemplatePackageDraft({
      preview: userAppPackageDraftPreviewReadyExample,
      gate: officialUserAppPackageDraftGateReadyExample,
      gateHandoff: officialUserAppPackageDraftGateHandoffReadyExample,
    });
    const json = JSON.stringify(result.draft);

    expect(result.draft.draftOnly).toBe(true);
    expect(result.draft.publishBlocked).toBe(true);
    expect(result.draft.noUserAppPackageRegistryWrite).toBe(true);
    expect(result.draft.noUserAppShellPackageReplacement).toBe(true);
    expect(json).not.toContain('publishedAt');
    expect(json).not.toContain('appTemplateId');
    expect(JSON.parse(JSON.stringify(result.draft))).toEqual(result.draft);
  });
});
