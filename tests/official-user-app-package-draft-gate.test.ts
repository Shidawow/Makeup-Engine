import { describe, expect, it } from 'vitest';
import { createOfficialUserAppPackageDraftGate } from '../src/template-engine';
import {
  officialUserAppPackageDraftGateMedicalClaimBlockedExample,
  officialUserAppPackageDraftGateMissingPreviewValidationExample,
  officialUserAppPackageDraftGateMissingStepGuidanceExample,
  officialUserAppPackageDraftGatePersonalDataBlockedExample,
  officialUserAppPackageDraftGateProductShadeBlockedExample,
  officialUserAppPackageDraftGateRawImageBlockedExample,
  officialUserAppPackageDraftGateReadyExample,
  officialUserAppPackageDraftGateRegistryWriteBlockedExample,
  officialUserAppPackageDraftGateUserAppMutationBlockedExample,
  officialUserAppPackageDraftGateWarningExample,
  userAppPackageDraftPreviewReadyExample,
  userAppPackageDraftPreviewValidationReadyExample,
} from '../src/templates/examples';

describe('official user app package draft gate', () => {
  it('marks a ready 10E preview validation as eligible for the future builder only', () => {
    expect(officialUserAppPackageDraftGateReadyExample.status).toBe(
      'official_draft_gate_ready',
    );
    expect(officialUserAppPackageDraftGateReadyExample.decision).toBe(
      'eligible_for_official_user_app_package_draft_builder',
    );
    expect(officialUserAppPackageDraftGateReadyExample.eligibleForOfficialUserAppPackageDraftBuilder).toBe(true);
    expect(officialUserAppPackageDraftGateReadyExample.gateOnly).toBe(true);
    expect(officialUserAppPackageDraftGateReadyExample.notFormalUserAppTemplatePackage).toBe(true);
    expect(officialUserAppPackageDraftGateReadyExample.noUserAppPackageRegistryWrite).toBe(true);
    expect(officialUserAppPackageDraftGateReadyExample.notPublished).toBe(true);
  });

  it('keeps warning previews gated as ready with warnings', () => {
    expect(officialUserAppPackageDraftGateWarningExample.status).toBe(
      'official_draft_gate_ready_with_warnings',
    );
    expect(officialUserAppPackageDraftGateWarningExample.warnings.length).toBeGreaterThan(0);
  });

  it('blocks missing preview validation and missing step guidance', () => {
    expect(officialUserAppPackageDraftGateMissingPreviewValidationExample.status).toBe(
      'official_draft_gate_blocked',
    );
    expect(officialUserAppPackageDraftGateMissingPreviewValidationExample.blockedReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: expect.stringContaining('source_preview_validation_ready') }),
      ]),
    );

    expect(officialUserAppPackageDraftGateMissingStepGuidanceExample.decision).toBe(
      'request_step_guidance_revision',
    );
    expect(officialUserAppPackageDraftGateMissingStepGuidanceExample.blockedReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: expect.stringContaining('step_guidance_complete') }),
      ]),
    );
  });

  it('blocks raw image, personal data, medical, product shade, registry write, and mutation risk', () => {
    expect(officialUserAppPackageDraftGateRawImageBlockedExample.decision).toBe(
      'request_privacy_review',
    );
    expect(officialUserAppPackageDraftGatePersonalDataBlockedExample.decision).toBe(
      'request_privacy_review',
    );
    expect(officialUserAppPackageDraftGateMedicalClaimBlockedExample.decision).toBe(
      'request_privacy_review',
    );
    expect(officialUserAppPackageDraftGateProductShadeBlockedExample.decision).toBe(
      'request_privacy_review',
    );
    expect(officialUserAppPackageDraftGateRegistryWriteBlockedExample.decision).toBe(
      'blocked_do_not_create_official_package_draft',
    );
    expect(officialUserAppPackageDraftGateUserAppMutationBlockedExample.decision).toBe(
      'blocked_do_not_create_official_package_draft',
    );
  });

  it('does not generate a formal package, write registry, publish, or mutate UserAppTemplatePackage', () => {
    const gate = createOfficialUserAppPackageDraftGate({
      preview: userAppPackageDraftPreviewReadyExample,
      validation: userAppPackageDraftPreviewValidationReadyExample,
    });
    const json = JSON.stringify(gate);

    expect(gate.notFormalUserAppTemplatePackage).toBe(true);
    expect(gate.formalUserAppTemplatePackageGenerationBlocked).toBe(true);
    expect(gate.noUserAppPackageRegistryWrite).toBe(true);
    expect(gate.notPublished).toBe(true);
    expect(json).not.toContain('publishedAt');
    expect(json).not.toContain('appTemplateId');
    expect(JSON.parse(JSON.stringify(gate))).toEqual(gate);
  });
});
