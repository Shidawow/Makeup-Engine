import { describe, expect, it } from 'vitest';
import {
  realRegistryWriteImplementationDraftValidationActualRegistryWriteExample,
  realRegistryWriteImplementationDraftValidationMissingActualWriteBlockedExample,
  realRegistryWriteImplementationDraftValidationMissingAuditEventExample,
  realRegistryWriteImplementationDraftValidationMissingDryRunOnlyExample,
  realRegistryWriteImplementationDraftValidationMissingGateReadyExample,
  realRegistryWriteImplementationDraftValidationMissingPackageReplacementBlockedExample,
  realRegistryWriteImplementationDraftValidationMissingProductionWriterBlockedExample,
  realRegistryWriteImplementationDraftValidationMissingPublishBlockedExample,
  realRegistryWriteImplementationDraftValidationMissingRollbackCommandExample,
  realRegistryWriteImplementationDraftValidationMissingTransactionExample,
  realRegistryWriteImplementationDraftValidationMissingWriterInterfaceExample,
  realRegistryWriteImplementationDraftValidationMissingWriteLockExample,
  realRegistryWriteImplementationDraftValidationProductionMarkerExample,
  realRegistryWriteImplementationDraftValidationReadyExample,
  realRegistryWriteImplementationDraftValidationShellReplacementExample,
  realRegistryWriteImplementationDraftValidationWarningExample,
} from '../src/templates/examples';

const issueIds = (validation: {
  issues: Array<{ id: string }>;
}): string[] => validation.issues.map((issue) => issue.id);

describe('Real registry write implementation draft validation', () => {
  it('validates a ready implementation draft without turning it into a production writer', () => {
    const validation = realRegistryWriteImplementationDraftValidationReadyExample;

    expect(validation.status).toBe('implementation_draft_validation_ready');
    expect(validation.readyForFinalRealWriteReviewGate).toBe(true);
    expect(validation.implementationDraftOnly).toBe(true);
    expect(validation.dryRunOnly).toBe(true);
    expect(validation.noActualRegistryWrite).toBe(true);
    expect(validation.notPublished).toBe(true);
    expect(validation.noUserAppShellPackageReplacement).toBe(true);
    expect(validation.notProductionWriter).toBe(true);
    expect(validation.notProductionPackage).toBe(true);
    expect(validation.recommendations[0].action).toBe(
      'continue_to_final_real_write_review_gate',
    );
  });

  it('keeps warning drafts as draft-only until warning review', () => {
    const validation = realRegistryWriteImplementationDraftValidationWarningExample;

    expect(validation.status).toBe(
      'implementation_draft_validation_ready_with_warnings',
    );
    expect(validation.recommendations[0].action).toBe(
      'keep_as_implementation_draft_only',
    );
  });

  it('blocks missing source gate and missing safety flags', () => {
    expect(issueIds(realRegistryWriteImplementationDraftValidationMissingGateReadyExample)).toContain(
      'source_implementation_gate_ready_blocking',
    );
    expect(issueIds(realRegistryWriteImplementationDraftValidationMissingDryRunOnlyExample)).toContain(
      'dry_run_only_true_blocking',
    );
    expect(
      issueIds(realRegistryWriteImplementationDraftValidationMissingActualWriteBlockedExample),
    ).toContain('actual_write_blocked_true_blocking');
    expect(issueIds(realRegistryWriteImplementationDraftValidationMissingPublishBlockedExample)).toContain(
      'publish_blocked_true_blocking',
    );
    expect(
      issueIds(realRegistryWriteImplementationDraftValidationMissingPackageReplacementBlockedExample),
    ).toContain('package_replacement_blocked_true_blocking');
    expect(
      issueIds(realRegistryWriteImplementationDraftValidationMissingProductionWriterBlockedExample),
    ).toContain('production_writer_blocked_true_blocking');
  });

  it('blocks missing writer interface, transaction, write lock, audit, and rollback drafts', () => {
    expect(
      issueIds(realRegistryWriteImplementationDraftValidationMissingWriterInterfaceExample),
    ).toContain('writer_interface_draft_present_blocking');
    expect(issueIds(realRegistryWriteImplementationDraftValidationMissingTransactionExample)).toContain(
      'transaction_draft_present_blocking',
    );
    expect(issueIds(realRegistryWriteImplementationDraftValidationMissingWriteLockExample)).toContain(
      'write_lock_draft_present_blocking',
    );
    expect(issueIds(realRegistryWriteImplementationDraftValidationMissingAuditEventExample)).toContain(
      'audit_event_draft_present_blocking',
    );
    expect(
      issueIds(realRegistryWriteImplementationDraftValidationMissingRollbackCommandExample),
    ).toContain('rollback_command_draft_present_blocking');
  });

  it('blocks actual registry write markers, production markers, and shell replacement', () => {
    expect(
      issueIds(realRegistryWriteImplementationDraftValidationActualRegistryWriteExample),
    ).toContain('no_actual_registry_write_blocking');
    expect(issueIds(realRegistryWriteImplementationDraftValidationProductionMarkerExample)).toContain(
      'no_production_package_marker_blocking',
    );
    expect(issueIds(realRegistryWriteImplementationDraftValidationShellReplacementExample)).toContain(
      'no_user_app_shell_package_replacement_blocking',
    );
  });

  it('is JSON round-trip stable', () => {
    const json = JSON.stringify(realRegistryWriteImplementationDraftValidationReadyExample);

    expect(JSON.parse(json)).toEqual(
      realRegistryWriteImplementationDraftValidationReadyExample,
    );
  });
});
