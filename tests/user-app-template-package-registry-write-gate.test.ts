import { describe, expect, it } from 'vitest';
import {
  userAppTemplatePackageRegistryWriteGateActualRegistryWriteBlockedExample,
  userAppTemplatePackageRegistryWriteGateMedicalClaimBlockedExample,
  userAppTemplatePackageRegistryWriteGateMissingDraftOnlyExample,
  userAppTemplatePackageRegistryWriteGateMissingPublishBlockedExample,
  userAppTemplatePackageRegistryWriteGateMissingRegistryWriteBlockedExample,
  userAppTemplatePackageRegistryWriteGateMissingValidationExample,
  userAppTemplatePackageRegistryWriteGatePersonalDataBlockedExample,
  userAppTemplatePackageRegistryWriteGateProductShadeBlockedExample,
  userAppTemplatePackageRegistryWriteGateProductionMarkerBlockedExample,
  userAppTemplatePackageRegistryWriteGateRawImageBlockedExample,
  userAppTemplatePackageRegistryWriteGateReadyExample,
  userAppTemplatePackageRegistryWriteGateShellReplacementBlockedExample,
  userAppTemplatePackageRegistryWriteGateUnsupportedFinalClaimBlockedExample,
  userAppTemplatePackageRegistryWriteGateWarningExample,
} from '../src/templates/examples';

describe('UserAppTemplatePackage registry write gate', () => {
  it('is ready only after registry preparation validation is ready', () => {
    const gate = userAppTemplatePackageRegistryWriteGateReadyExample;

    expect(gate.status).toBe('registry_write_gate_ready');
    expect(gate.decision).toBe('eligible_for_future_controlled_registry_writer');
    expect(gate.eligibleForFutureControlledRegistryWriter).toBe(true);
    expect(gate.registryWriteGateOnly).toBe(true);
    expect(gate.noActualRegistryWrite).toBe(true);
    expect(gate.notPublished).toBe(true);
    expect(gate.noUserAppShellPackageReplacement).toBe(true);
    expect(gate.notProductionPackage).toBe(true);
    expect(gate.draftOnly).toBe(true);
    expect(gate.publishBlocked).toBe(true);
    expect(gate.registryWriteBlocked).toBe(true);
    expect(gate.summary).toContain('does not write registry');
  });

  it('keeps warning sources as preview-only instead of writing registry', () => {
    const gate = userAppTemplatePackageRegistryWriteGateWarningExample;

    expect(gate.status).toBe('registry_write_gate_ready_with_warnings');
    expect(gate.decision).toBe('keep_as_registry_preview_only');
    expect(gate.eligibleForFutureControlledRegistryWriter).toBe(true);
    expect(gate.noActualRegistryWrite).toBe(true);
  });

  it('blocks missing validation and required safety flags', () => {
    expect(userAppTemplatePackageRegistryWriteGateMissingValidationExample.blockedReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'source_registry_preparation_validation_ready' }),
      ]),
    );
    expect(
      userAppTemplatePackageRegistryWriteGateMissingRegistryWriteBlockedExample.blockedReasons,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'registry_write_blocked_true' })]),
    );
    expect(
      userAppTemplatePackageRegistryWriteGateMissingDraftOnlyExample.blockedReasons,
    ).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'draft_only_true' })]));
    expect(
      userAppTemplatePackageRegistryWriteGateMissingPublishBlockedExample.blockedReasons,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'publish_blocked_true' })]),
    );
  });

  it('blocks image, personal data, medical, product shade, and unsupported final claims', () => {
    expect(userAppTemplatePackageRegistryWriteGateRawImageBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'no_raw_image_reference' })]),
    );
    expect(
      userAppTemplatePackageRegistryWriteGatePersonalDataBlockedExample.blockedReasons,
    ).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'no_personal_data' })]));
    expect(
      userAppTemplatePackageRegistryWriteGateMedicalClaimBlockedExample.blockedReasons,
    ).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'no_medical_claims' })]));
    expect(
      userAppTemplatePackageRegistryWriteGateProductShadeBlockedExample.blockedReasons,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'no_product_shade_claims' })]),
    );
    expect(
      userAppTemplatePackageRegistryWriteGateUnsupportedFinalClaimBlockedExample
        .blockedReasons,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'no_unsupported_final_claims' }),
      ]),
    );
  });

  it('blocks actual registry write, production marker, and User App Shell replacement', () => {
    expect(
      userAppTemplatePackageRegistryWriteGateActualRegistryWriteBlockedExample.blockedReasons,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'no_actual_registry_write' })]),
    );
    expect(
      userAppTemplatePackageRegistryWriteGateProductionMarkerBlockedExample.blockedReasons,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'no_production_package_marker' })]),
    );
    expect(
      userAppTemplatePackageRegistryWriteGateShellReplacementBlockedExample.blockedReasons,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'no_user_app_shell_package_replacement' }),
      ]),
    );
  });

  it('survives JSON round trip and never claims a real registry write', () => {
    const json = JSON.stringify(userAppTemplatePackageRegistryWriteGateReadyExample);

    expect(JSON.parse(json)).toEqual(userAppTemplatePackageRegistryWriteGateReadyExample);
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('actualRegistryWrite');
    expect(json).not.toContain('productionPackageId');
  });
});
