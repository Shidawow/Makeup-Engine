import { describe, expect, it } from 'vitest';
import {
  officialUserAppTemplatePackageDraftValidationMedicalClaimExample,
  officialUserAppTemplatePackageDraftValidationMissingGateExample,
  officialUserAppTemplatePackageDraftValidationMissingPrivacyExample,
  officialUserAppTemplatePackageDraftValidationMissingStepExample,
  officialUserAppTemplatePackageDraftValidationMutationExample,
  officialUserAppTemplatePackageDraftValidationPersonalDataExample,
  officialUserAppTemplatePackageDraftValidationProductShadeExample,
  officialUserAppTemplatePackageDraftValidationRawImageExample,
  officialUserAppTemplatePackageDraftValidationReadyExample,
  officialUserAppTemplatePackageDraftValidationRegistryWriteExample,
  officialUserAppTemplatePackageDraftValidationWarningExample,
} from '../src/templates/examples';

describe('official UserAppTemplatePackage draft validation', () => {
  it('marks a safe draft ready for the future draft publish gate only', () => {
    const validation = officialUserAppTemplatePackageDraftValidationReadyExample;

    expect(validation.status).toBe('official_draft_validation_ready');
    expect(validation.readyForDraftPublishGate).toBe(true);
    expect(validation.draftOnly).toBe(true);
    expect(validation.publishBlocked).toBe(true);
    expect(validation.noUserAppPackageRegistryWrite).toBe(true);
    expect(validation.noUserAppShellPackageReplacement).toBe(true);
    expect(validation.notPublishReady).toBe(true);
    expect(validation.jsonRoundTripStable).toBe(true);
  });

  it('keeps warnings from becoming publish readiness', () => {
    expect(officialUserAppTemplatePackageDraftValidationWarningExample.status).toBe(
      'official_draft_validation_ready_with_warnings',
    );
    expect(officialUserAppTemplatePackageDraftValidationWarningExample.notPublishReady).toBe(true);
  });

  it('blocks missing gate, missing steps, and missing privacy notice', () => {
    expect(officialUserAppTemplatePackageDraftValidationMissingGateExample.status).toBe(
      'official_draft_validation_blocked',
    );
    expect(officialUserAppTemplatePackageDraftValidationMissingStepExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'step_sequence_ready' })]),
    );
    expect(officialUserAppTemplatePackageDraftValidationMissingPrivacyExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'privacy_notice_ready' })]),
    );
  });

  it('blocks unsafe payload categories and UserAppTemplatePackage mutation markers', () => {
    expect(officialUserAppTemplatePackageDraftValidationRawImageExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_raw_image_reference' })]),
    );
    expect(officialUserAppTemplatePackageDraftValidationPersonalDataExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_personal_data' })]),
    );
    expect(officialUserAppTemplatePackageDraftValidationMedicalClaimExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_medical_claims' })]),
    );
    expect(officialUserAppTemplatePackageDraftValidationProductShadeExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_product_shade_claims' })]),
    );
    expect(officialUserAppTemplatePackageDraftValidationRegistryWriteExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_registry_write' })]),
    );
    expect(officialUserAppTemplatePackageDraftValidationMutationExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_user_app_template_package_mutation' }),
      ]),
    );
  });
});
