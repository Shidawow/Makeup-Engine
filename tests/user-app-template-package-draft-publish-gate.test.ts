import { describe, expect, it } from 'vitest';
import {
  userAppTemplatePackageDraftPublishGateKeepDraftOnlyExample,
  userAppTemplatePackageDraftPublishGateMedicalClaimBlockedExample,
  userAppTemplatePackageDraftPublishGateMissingDraftOnlyExample,
  userAppTemplatePackageDraftPublishGateMissingPublishBlockedExample,
  userAppTemplatePackageDraftPublishGateMissingValidationExample,
  userAppTemplatePackageDraftPublishGatePersonalDataBlockedExample,
  userAppTemplatePackageDraftPublishGateProductShadeBlockedExample,
  userAppTemplatePackageDraftPublishGateProductionMarkerBlockedExample,
  userAppTemplatePackageDraftPublishGatePublishMarkerBlockedExample,
  userAppTemplatePackageDraftPublishGateRawImageBlockedExample,
  userAppTemplatePackageDraftPublishGateReadyExample,
  userAppTemplatePackageDraftPublishGateRegistryWriteBlockedExample,
  userAppTemplatePackageDraftPublishGateShellReplacementBlockedExample,
  userAppTemplatePackageDraftPublishGateUnsupportedFinalClaimBlockedExample,
  userAppTemplatePackageDraftPublishGateWarningExample,
} from '../src/templates/examples';

describe('UserAppTemplatePackage draft publish gate', () => {
  it('marks a ready official draft eligible for future registry preparation only', () => {
    const gate = userAppTemplatePackageDraftPublishGateReadyExample;

    expect(gate.status).toBe('draft_publish_gate_ready');
    expect(gate.decision).toBe('eligible_for_future_registry_preparation');
    expect(gate.eligibleForFutureRegistryPreparation).toBe(true);
    expect(gate.draftOnly).toBe(true);
    expect(gate.publishBlocked).toBe(true);
    expect(gate.noUserAppPackageRegistryWrite).toBe(true);
    expect(gate.noUserAppShellPackageReplacement).toBe(true);
    expect(gate.notPublished).toBe(true);
    expect(gate.notProductionPackage).toBe(true);
    expect(gate.registryPreparationOnly).toBe(true);
  });

  it('keeps warnings explicit without turning the gate into publication', () => {
    expect(userAppTemplatePackageDraftPublishGateWarningExample.status).toBe(
      'draft_publish_gate_ready_with_warnings',
    );
    expect(userAppTemplatePackageDraftPublishGateKeepDraftOnlyExample.decision).toBe(
      'keep_as_draft_only',
    );
  });

  it('blocks missing official draft validation, draftOnly, and publishBlocked', () => {
    expect(userAppTemplatePackageDraftPublishGateMissingValidationExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'source_official_draft_validation_ready' }),
      ]),
    );
    expect(userAppTemplatePackageDraftPublishGateMissingDraftOnlyExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'draft_only_true' })]),
    );
    expect(userAppTemplatePackageDraftPublishGateMissingPublishBlockedExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'publish_blocked_true' })]),
    );
  });

  it('blocks unsafe payload categories before any registry preparation', () => {
    expect(userAppTemplatePackageDraftPublishGateRawImageBlockedExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_raw_image_reference' })]),
    );
    expect(userAppTemplatePackageDraftPublishGatePersonalDataBlockedExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_personal_data' })]),
    );
    expect(userAppTemplatePackageDraftPublishGateMedicalClaimBlockedExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_medical_claims' })]),
    );
    expect(userAppTemplatePackageDraftPublishGateProductShadeBlockedExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_product_shade_claims' })]),
    );
    expect(userAppTemplatePackageDraftPublishGateUnsupportedFinalClaimBlockedExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_unsupported_final_claims' }),
      ]),
    );
  });

  it('blocks registry write, publish, production package, and shell replacement markers', () => {
    expect(userAppTemplatePackageDraftPublishGateRegistryWriteBlockedExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_registry_write' })]),
    );
    expect(userAppTemplatePackageDraftPublishGatePublishMarkerBlockedExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_auto_publish' })]),
    );
    expect(userAppTemplatePackageDraftPublishGateProductionMarkerBlockedExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_production_package_marker' })]),
    );
    expect(userAppTemplatePackageDraftPublishGateShellReplacementBlockedExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_user_app_shell_package_replacement' }),
      ]),
    );
  });

  it('is stable through JSON round-trip and never claims publication', () => {
    const json = JSON.stringify(userAppTemplatePackageDraftPublishGateReadyExample);

    expect(JSON.parse(json)).toEqual(userAppTemplatePackageDraftPublishGateReadyExample);
    expect(json).not.toContain('publishedAt');
    expect(json).not.toContain('registryWrite');
    expect(json).not.toContain('productionPackageId');
  });
});
