import { describe, expect, it } from 'vitest';
import {
  controlledRegistryWriterValidationActualRegistryWriteExample,
  controlledRegistryWriterValidationMedicalClaimExample,
  controlledRegistryWriterValidationMissingActualWriteBlockedExample,
  controlledRegistryWriterValidationMissingDryRunOnlyExample,
  controlledRegistryWriterValidationMissingGateExample,
  controlledRegistryWriterValidationMissingPackageReplacementBlockedExample,
  controlledRegistryWriterValidationMissingPublishBlockedExample,
  controlledRegistryWriterValidationPersonalDataExample,
  controlledRegistryWriterValidationProductShadeExample,
  controlledRegistryWriterValidationProductionMarkerExample,
  controlledRegistryWriterValidationRawImageExample,
  controlledRegistryWriterValidationReadyExample,
  controlledRegistryWriterValidationShellReplacementExample,
  controlledRegistryWriterValidationUnsupportedFinalClaimExample,
  controlledRegistryWriterValidationWarningExample,
} from '../src/templates/examples';

describe('Controlled UserAppTemplatePackage registry writer validation', () => {
  it('marks a safe dry-run writer draft ready for explicit authorization gate only', () => {
    const validation = controlledRegistryWriterValidationReadyExample;

    expect(validation.status).toBe('writer_validation_ready');
    expect(validation.readyForExplicitWriteAuthorizationGate).toBe(true);
    expect(validation.writerDraftOnly).toBe(true);
    expect(validation.dryRunOnly).toBe(true);
    expect(validation.noActualRegistryWrite).toBe(true);
    expect(validation.notPublished).toBe(true);
    expect(validation.noUserAppShellPackageReplacement).toBe(true);
    expect(validation.notProductionPackage).toBe(true);
    expect(validation.recommendations[0]?.action).toBe(
      'continue_to_explicit_write_authorization_gate',
    );
  });

  it('keeps warning sources dry-run only instead of authorization ready', () => {
    const validation = controlledRegistryWriterValidationWarningExample;

    expect(validation.status).toBe('writer_validation_ready_with_warnings');
    expect(validation.recommendations[0]?.action).toBe('keep_as_dry_run_only');
  });

  it('blocks missing source gate and required safety flags', () => {
    expect(controlledRegistryWriterValidationMissingGateExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'source_registry_write_gate_ready' }),
      ]),
    );
    expect(controlledRegistryWriterValidationMissingDryRunOnlyExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'dry_run_only_true' })]),
    );
    expect(
      controlledRegistryWriterValidationMissingActualWriteBlockedExample.issues,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'actual_write_blocked_true' }),
      ]),
    );
    expect(controlledRegistryWriterValidationMissingPublishBlockedExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'publish_blocked_true' })]),
    );
    expect(
      controlledRegistryWriterValidationMissingPackageReplacementBlockedExample.issues,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'package_replacement_blocked_true' }),
      ]),
    );
  });

  it('blocks image, personal data, medical, product shade, and unsupported final claims', () => {
    expect(controlledRegistryWriterValidationRawImageExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_raw_image_reference' }),
      ]),
    );
    expect(controlledRegistryWriterValidationPersonalDataExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_personal_data' })]),
    );
    expect(controlledRegistryWriterValidationMedicalClaimExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_medical_claims' })]),
    );
    expect(controlledRegistryWriterValidationProductShadeExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_product_shade_claims' }),
      ]),
    );
    expect(controlledRegistryWriterValidationUnsupportedFinalClaimExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_unsupported_final_claims' }),
      ]),
    );
  });

  it('blocks actual write, production marker, and shell replacement', () => {
    expect(controlledRegistryWriterValidationActualRegistryWriteExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_actual_registry_write' }),
      ]),
    );
    expect(controlledRegistryWriterValidationProductionMarkerExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_production_package_marker' }),
      ]),
    );
    expect(controlledRegistryWriterValidationShellReplacementExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_user_app_shell_package_replacement' }),
      ]),
    );
    expect(
      controlledRegistryWriterValidationActualRegistryWriteExample.recommendations[0]?.action,
    ).toBe('block_explicit_write_authorization');
  });

  it('is JSON round-trip stable', () => {
    const json = JSON.stringify(controlledRegistryWriterValidationReadyExample);

    expect(JSON.parse(json)).toEqual(controlledRegistryWriterValidationReadyExample);
  });
});
