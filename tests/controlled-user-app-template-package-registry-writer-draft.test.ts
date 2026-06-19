import { describe, expect, it } from 'vitest';
import {
  controlledRegistryWriterDraftActualRegistryWriteBlockedExample,
  controlledRegistryWriterDraftMedicalClaimBlockedExample,
  controlledRegistryWriterDraftMissingActualWriteBlockedExample,
  controlledRegistryWriterDraftMissingDryRunOnlyExample,
  controlledRegistryWriterDraftMissingGateExample,
  controlledRegistryWriterDraftMissingPackageReplacementBlockedExample,
  controlledRegistryWriterDraftMissingPublishBlockedExample,
  controlledRegistryWriterDraftPersonalDataBlockedExample,
  controlledRegistryWriterDraftProductShadeBlockedExample,
  controlledRegistryWriterDraftProductionMarkerBlockedExample,
  controlledRegistryWriterDraftRawImageBlockedExample,
  controlledRegistryWriterDraftReadyExample,
  controlledRegistryWriterDraftShellReplacementBlockedExample,
  controlledRegistryWriterDraftUnsupportedFinalClaimBlockedExample,
  controlledRegistryWriterDraftWarningExample,
} from '../src/templates/examples';

describe('Controlled UserAppTemplatePackage registry writer draft', () => {
  it('is ready only after registry write gate ready and remains dry-run only', () => {
    const draft = controlledRegistryWriterDraftReadyExample;

    expect(draft.writerDraftStatus).toBe('writer_draft_ready');
    expect(draft.trace.source.sourceReadyForWriterDraft).toBe(true);
    expect(draft.dryRunOnly).toBe(true);
    expect(draft.actualWriteBlocked).toBe(true);
    expect(draft.publishBlocked).toBe(true);
    expect(draft.packageReplacementBlocked).toBe(true);
    expect(draft.noActualRegistryWrite).toBe(true);
    expect(draft.notPublished).toBe(true);
    expect(draft.noUserAppShellPackageReplacement).toBe(true);
    expect(draft.notProductionPackage).toBe(true);
    expect(draft.writePlan.operations[0]?.operationType).toBe(
      'upsert_registry_entry_dry_run',
    );
    expect(draft.diffPreview.actualMutationBlocked).toBe(true);
    expect(draft.rollbackPlan.requiredBeforeAnyWrite).toBe(true);
    expect(draft.summary).toContain('no registry write');
  });

  it('keeps warning gates as dry-run writer drafts', () => {
    const draft = controlledRegistryWriterDraftWarningExample;

    expect(draft.writerDraftStatus).toBe('writer_draft_ready_with_warnings');
    expect(draft.warnings.length).toBeGreaterThan(0);
    expect(draft.dryRunOnly).toBe(true);
  });

  it('blocks missing source gate and safety flags', () => {
    expect(controlledRegistryWriterDraftMissingGateExample.blockedReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'source_registry_write_gate_not_ready' }),
      ]),
    );
    expect(controlledRegistryWriterDraftMissingDryRunOnlyExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'dry_run_only_missing' })]),
    );
    expect(
      controlledRegistryWriterDraftMissingActualWriteBlockedExample.blockedReasons,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'actual_write_block_missing' }),
      ]),
    );
    expect(controlledRegistryWriterDraftMissingPublishBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'publish_block_missing' })]),
    );
    expect(
      controlledRegistryWriterDraftMissingPackageReplacementBlockedExample
        .blockedReasons,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'package_replacement_block_missing' }),
      ]),
    );
  });

  it('blocks unsafe content categories inherited from the write gate', () => {
    expect(controlledRegistryWriterDraftRawImageBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'raw_image_reference_detected' }),
      ]),
    );
    expect(controlledRegistryWriterDraftPersonalDataBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'personal_data_detected' })]),
    );
    expect(controlledRegistryWriterDraftMedicalClaimBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'medical_claim_detected' })]),
    );
    expect(controlledRegistryWriterDraftProductShadeBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'product_shade_claim_detected' }),
      ]),
    );
    expect(
      controlledRegistryWriterDraftUnsupportedFinalClaimBlockedExample.blockedReasons,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'unsupported_final_claim_detected' }),
      ]),
    );
  });

  it('blocks actual registry write, production marker, and shell replacement', () => {
    expect(
      controlledRegistryWriterDraftActualRegistryWriteBlockedExample.blockedReasons,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'actual_registry_write_detected' }),
      ]),
    );
    expect(
      controlledRegistryWriterDraftProductionMarkerBlockedExample.blockedReasons,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'production_marker_detected' }),
      ]),
    );
    expect(controlledRegistryWriterDraftShellReplacementBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'user_app_shell_replacement_detected' }),
      ]),
    );
  });

  it('is JSON round-trip stable and never claims write, publish, or package replacement', () => {
    const json = JSON.stringify(controlledRegistryWriterDraftReadyExample);

    expect(JSON.parse(json)).toEqual(controlledRegistryWriterDraftReadyExample);
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('actualRegistryWrite');
    expect(json).not.toContain('productionPackageId');
    expect(json).not.toContain('replaceUserAppShellPackage');
  });
});
