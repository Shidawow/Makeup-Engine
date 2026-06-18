import { describe, expect, it } from 'vitest';
import { validateUserAppPackageDraftPreview } from '../src/template-engine';
import {
  userAppPackageDraftPreviewMedicalClaimBlockedExample,
  userAppPackageDraftPreviewMissingContractReadyExample,
  userAppPackageDraftPreviewMissingStepGuidanceExample,
  userAppPackageDraftPreviewPersonalDataBlockedExample,
  userAppPackageDraftPreviewReadyExample,
  userAppPackageDraftPreviewUserAppMutationBlockedExample,
  userAppPackageDraftPreviewValidationMedicalClaimBlockedExample,
  userAppPackageDraftPreviewValidationMissingContractReadyExample,
  userAppPackageDraftPreviewValidationMissingStepGuidanceExample,
  userAppPackageDraftPreviewValidationPersonalDataBlockedExample,
  userAppPackageDraftPreviewValidationRawImageBlockedExample,
  userAppPackageDraftPreviewValidationReadyExample,
  userAppPackageDraftPreviewValidationUserAppMutationBlockedExample,
  userAppPackageDraftPreviewValidationWarningExample,
} from '../src/templates/examples';

describe('user app package draft preview validation', () => {
  it('validates ready preview as preview-only and ready for the 10F draft gate', () => {
    expect(userAppPackageDraftPreviewValidationReadyExample.status).toBe(
      'draft_preview_validation_ready',
    );
    expect(userAppPackageDraftPreviewValidationReadyExample.readyForOfficialUserAppPackageDraftGate).toBe(
      true,
    );
    expect(userAppPackageDraftPreviewValidationReadyExample.previewOnly).toBe(true);
    expect(userAppPackageDraftPreviewValidationReadyExample.notFormalUserAppTemplatePackage).toBe(true);
    expect(userAppPackageDraftPreviewValidationReadyExample.noUserAppPackageRegistryWrite).toBe(true);
  });

  it('keeps source warnings as ready-with-warnings', () => {
    expect(userAppPackageDraftPreviewValidationWarningExample.status).toBe(
      'draft_preview_validation_ready_with_warnings',
    );
    expect(userAppPackageDraftPreviewValidationWarningExample.recommendations[0]?.action).toBe(
      'request_draft_preview_revision',
    );
  });

  it('blocks missing source contract readiness and missing step guidance', () => {
    expect(userAppPackageDraftPreviewValidationMissingContractReadyExample.status).toBe(
      'draft_preview_validation_blocked',
    );
    expect(userAppPackageDraftPreviewValidationMissingContractReadyExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'source_contract_ready' }),
      ]),
    );
    expect(userAppPackageDraftPreviewValidationMissingStepGuidanceExample.status).toBe(
      'draft_preview_validation_blocked',
    );
    expect(userAppPackageDraftPreviewValidationMissingStepGuidanceExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'steps_user_comprehensible' }),
      ]),
    );
  });

  it('blocks personal data, medical claims, and UserAppTemplatePackage mutation', () => {
    expect(userAppPackageDraftPreviewValidationRawImageBlockedExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_raw_image_reference' })]),
    );
    expect(userAppPackageDraftPreviewValidationPersonalDataBlockedExample.status).toBe(
      'draft_preview_validation_blocked',
    );
    expect(userAppPackageDraftPreviewValidationPersonalDataBlockedExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_personal_data' })]),
    );
    expect(userAppPackageDraftPreviewValidationMedicalClaimBlockedExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_medical_claims' })]),
    );
    expect(userAppPackageDraftPreviewValidationUserAppMutationBlockedExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_user_app_template_package_mutation' }),
      ]),
    );
  });

  it('keeps JSON round-trip stable and does not overclaim package readiness', () => {
    const validation = validateUserAppPackageDraftPreview(
      userAppPackageDraftPreviewReadyExample,
    );

    expect(validation.jsonRoundTripStable).toBe(true);
    expect(JSON.parse(JSON.stringify(validation))).toEqual(validation);
    expect(validation.recommendations[0]?.message).toContain('仍不是正式 UserAppTemplatePackage');
  });

  it('retains blockers when preview already reports them', () => {
    expect(userAppPackageDraftPreviewMissingContractReadyExample.blockedReasons.length).toBeGreaterThan(0);
    expect(userAppPackageDraftPreviewMissingStepGuidanceExample.blockedReasons.length).toBeGreaterThan(0);
    expect(userAppPackageDraftPreviewPersonalDataBlockedExample.blockedReasons.length).toBeGreaterThan(0);
    expect(userAppPackageDraftPreviewMedicalClaimBlockedExample.blockedReasons.length).toBeGreaterThan(0);
    expect(userAppPackageDraftPreviewUserAppMutationBlockedExample.blockedReasons.length).toBeGreaterThan(0);
  });
});
