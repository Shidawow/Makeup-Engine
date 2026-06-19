import { describe, expect, it } from 'vitest';
import { validateUserAppTemplatePackageRegistryPreparation } from '../src/template-engine';
import {
  userAppTemplatePackageRegistryPreparationActualRegistryWriteBlockedExample,
  userAppTemplatePackageRegistryPreparationMedicalClaimBlockedExample,
  userAppTemplatePackageRegistryPreparationMissingDraftOnlyExample,
  userAppTemplatePackageRegistryPreparationMissingPublishBlockedExample,
  userAppTemplatePackageRegistryPreparationMissingPublishGateExample,
  userAppTemplatePackageRegistryPreparationMissingRegistryWriteBlockedExample,
  userAppTemplatePackageRegistryPreparationPersonalDataBlockedExample,
  userAppTemplatePackageRegistryPreparationProductShadeBlockedExample,
  userAppTemplatePackageRegistryPreparationRawImageBlockedExample,
  userAppTemplatePackageRegistryPreparationReadyExample,
  userAppTemplatePackageRegistryPreparationShellReplacementBlockedExample,
  userAppTemplatePackageRegistryPreparationUnsupportedFinalClaimBlockedExample,
  userAppTemplatePackageRegistryPreparationValidationReadyExample,
  userAppTemplatePackageRegistryPreparationValidationWarningExample,
} from '../src/templates/examples';

describe('UserAppTemplatePackage registry preparation validation', () => {
  it('validates a ready preparation as future-gate-ready only', () => {
    const validation = userAppTemplatePackageRegistryPreparationValidationReadyExample;

    expect(validation.status).toBe('registry_preparation_validation_ready');
    expect(validation.readyForRegistryWriteGate).toBe(true);
    expect(validation.registryPreparationOnly).toBe(true);
    expect(validation.noActualRegistryWrite).toBe(true);
    expect(validation.notPublished).toBe(true);
    expect(validation.noUserAppShellPackageReplacement).toBe(true);
    expect(validation.notProductionPackage).toBe(true);
  });

  it('keeps warning preparations reviewable without claiming registry write readiness', () => {
    expect(userAppTemplatePackageRegistryPreparationValidationWarningExample.status).toBe(
      'registry_preparation_validation_ready_with_warnings',
    );
    expect(
      userAppTemplatePackageRegistryPreparationValidationWarningExample.recommendations,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ action: 'keep_as_registry_preview_only' }),
      ]),
    );
  });

  it('blocks missing source gate and safety flags', () => {
    expect(
      validateUserAppTemplatePackageRegistryPreparation(
        userAppTemplatePackageRegistryPreparationMissingPublishGateExample,
      ).issues,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'source_publish_gate_ready' }),
      ]),
    );
    expect(
      validateUserAppTemplatePackageRegistryPreparation(
        userAppTemplatePackageRegistryPreparationMissingDraftOnlyExample,
      ).issues,
    ).toEqual(expect.arrayContaining([expect.objectContaining({ checkId: 'draft_only_true' })]));
    expect(
      validateUserAppTemplatePackageRegistryPreparation(
        userAppTemplatePackageRegistryPreparationMissingPublishBlockedExample,
      ).issues,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'publish_blocked_true' })]),
    );
    expect(
      validateUserAppTemplatePackageRegistryPreparation(
        userAppTemplatePackageRegistryPreparationMissingRegistryWriteBlockedExample,
      ).issues,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'registry_write_blocked_true' }),
      ]),
    );
  });

  it('blocks unsafe user-facing and payload claims', () => {
    expect(
      validateUserAppTemplatePackageRegistryPreparation(
        userAppTemplatePackageRegistryPreparationRawImageBlockedExample,
      ).issues,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_raw_image_reference' })]),
    );
    expect(
      validateUserAppTemplatePackageRegistryPreparation(
        userAppTemplatePackageRegistryPreparationPersonalDataBlockedExample,
      ).issues,
    ).toEqual(expect.arrayContaining([expect.objectContaining({ checkId: 'no_personal_data' })]));
    expect(
      validateUserAppTemplatePackageRegistryPreparation(
        userAppTemplatePackageRegistryPreparationMedicalClaimBlockedExample,
      ).issues,
    ).toEqual(expect.arrayContaining([expect.objectContaining({ checkId: 'no_medical_claims' })]));
    expect(
      validateUserAppTemplatePackageRegistryPreparation(
        userAppTemplatePackageRegistryPreparationProductShadeBlockedExample,
      ).issues,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_product_shade_claims' })]),
    );
    expect(
      validateUserAppTemplatePackageRegistryPreparation(
        userAppTemplatePackageRegistryPreparationUnsupportedFinalClaimBlockedExample,
      ).issues,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_unsupported_final_claims' }),
      ]),
    );
  });

  it('blocks registry writes, User App Shell package replacement, and unstable JSON', () => {
    expect(
      validateUserAppTemplatePackageRegistryPreparation(
        userAppTemplatePackageRegistryPreparationActualRegistryWriteBlockedExample,
      ).issues,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_actual_registry_write' })]),
    );
    expect(
      validateUserAppTemplatePackageRegistryPreparation(
        userAppTemplatePackageRegistryPreparationShellReplacementBlockedExample,
      ).issues,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_user_app_shell_package_replacement' }),
      ]),
    );

    const unstable = {
      ...userAppTemplatePackageRegistryPreparationReadyExample,
      jsonRoundTripStable: false,
    };
    expect(validateUserAppTemplatePackageRegistryPreparation(unstable).issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'json_round_trip_safe' })]),
    );
  });
});
