import { describe, expect, it } from 'vitest';
import { createUserAppPackageDraftPreview } from '../src/template-engine';
import {
  candidateToAppPackageContractReadyExample,
  candidateToAppPackageValidationReadyExample,
  userAppPackageDraftPreviewMedicalClaimBlockedExample,
  userAppPackageDraftPreviewMissingContractReadyExample,
  userAppPackageDraftPreviewMissingStepGuidanceExample,
  userAppPackageDraftPreviewPersonalDataBlockedExample,
  userAppPackageDraftPreviewRawImageBlockedExample,
  userAppPackageDraftPreviewReadyExample,
  userAppPackageDraftPreviewUserAppMutationBlockedExample,
  userAppPackageDraftPreviewWarningExample,
} from '../src/templates/examples';

describe('user app package draft preview', () => {
  it('creates ready preview only from app contract validation ready source', () => {
    expect(userAppPackageDraftPreviewReadyExample.previewStatus).toBe(
      'draft_preview_ready',
    );
    expect(userAppPackageDraftPreviewReadyExample.sourceContractPreparationId).toBe(
      candidateToAppPackageContractReadyExample.preparationId,
    );
    expect(userAppPackageDraftPreviewReadyExample.trace.source.contractValidationStatus).toBe(
      'app_contract_validation_ready',
    );
    expect(userAppPackageDraftPreviewReadyExample.draftPreviewOnly).toBe(true);
    expect(userAppPackageDraftPreviewReadyExample.notFormalUserAppTemplatePackage).toBe(true);
    expect(userAppPackageDraftPreviewReadyExample.noUserAppPackageRegistryWrite).toBe(true);
    expect(userAppPackageDraftPreviewReadyExample.notPublished).toBe(true);
  });

  it('surfaces user-facing preview fields and privacy copy', () => {
    expect(userAppPackageDraftPreviewReadyExample.titlePreview).toBeTruthy();
    expect(userAppPackageDraftPreviewReadyExample.summaryPreview).toBeTruthy();
    expect(userAppPackageDraftPreviewReadyExample.stepGuidancePreview.length).toBeGreaterThan(0);
    expect(userAppPackageDraftPreviewReadyExample.regionGuidancePreview.length).toBeGreaterThan(0);
    expect(userAppPackageDraftPreviewReadyExample.privacyNoticePreview).toContain('不上传');
    expect(userAppPackageDraftPreviewReadyExample.privacyNoticePreview).toContain('不训练');
    expect(userAppPackageDraftPreviewReadyExample.userFacingCopyPreview.boundaryNotice).toContain(
      '不是正式 UserAppTemplatePackage',
    );
  });

  it('routes source warnings to ready-with-warnings preview', () => {
    expect(userAppPackageDraftPreviewWarningExample.previewStatus).toBe(
      'draft_preview_ready_with_warnings',
    );
    expect(userAppPackageDraftPreviewWarningExample.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'source_contract_validation_warning' }),
      ]),
    );
  });

  it('blocks missing contract ready and missing step guidance', () => {
    expect(userAppPackageDraftPreviewMissingContractReadyExample.previewStatus).toBe(
      'draft_preview_blocked',
    );
    expect(userAppPackageDraftPreviewMissingContractReadyExample.blockedReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'source_contract_not_ready' }),
      ]),
    );
    expect(userAppPackageDraftPreviewMissingStepGuidanceExample.blockedReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'missing_step_guidance' }),
      ]),
    );
  });

  it('blocks raw image, personal data, medical claims, and UserAppTemplatePackage mutation markers', () => {
    expect(userAppPackageDraftPreviewRawImageBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'raw_image_reference' })]),
    );
    expect(userAppPackageDraftPreviewPersonalDataBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'personal_data' })]),
    );
    expect(userAppPackageDraftPreviewMedicalClaimBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'medical_claim' })]),
    );
    expect(userAppPackageDraftPreviewUserAppMutationBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'user_app_template_package_mutation' }),
      ]),
    );
  });

  it('does not create a formal UserAppTemplatePackage or write a registry', () => {
    const preview = createUserAppPackageDraftPreview({
      preparation: candidateToAppPackageContractReadyExample,
      validation: candidateToAppPackageValidationReadyExample,
    });
    const json = JSON.stringify(preview);

    expect(preview.notFormalUserAppTemplatePackage).toBe(true);
    expect(preview.formalUserAppTemplatePackageGenerationBlocked).toBe(true);
    expect(preview.noUserAppPackageRegistryWrite).toBe(true);
    expect(json).not.toContain('publishedAt');
    expect(json).not.toContain('appTemplateId');
    expect(JSON.parse(JSON.stringify(preview))).toEqual(preview);
  });
});
