import { describe, expect, it } from 'vitest';
import {
  realRegistryWriteImplementationDraftActualRegistryWriteExample,
  realRegistryWriteImplementationDraftMissingActualWriteBlockedExample,
  realRegistryWriteImplementationDraftMissingAuditEventExample,
  realRegistryWriteImplementationDraftMissingDryRunOnlyExample,
  realRegistryWriteImplementationDraftMissingGateReadyExample,
  realRegistryWriteImplementationDraftMissingPackageReplacementBlockedExample,
  realRegistryWriteImplementationDraftMissingProductionWriterBlockedExample,
  realRegistryWriteImplementationDraftMissingPublishBlockedExample,
  realRegistryWriteImplementationDraftMissingRollbackCommandExample,
  realRegistryWriteImplementationDraftMissingTransactionExample,
  realRegistryWriteImplementationDraftMissingWriterInterfaceExample,
  realRegistryWriteImplementationDraftMissingWriteLockExample,
  realRegistryWriteImplementationDraftProductionMarkerExample,
  realRegistryWriteImplementationDraftReadyExample,
  realRegistryWriteImplementationDraftShellReplacementExample,
  realRegistryWriteImplementationDraftWarningExample,
} from '../src/templates/examples';

const blockedIds = (draft: {
  blockedReasons: Array<{ id: string }>;
}): string[] => draft.blockedReasons.map((reason) => reason.id);

describe('Real registry write implementation draft', () => {
  it('creates a dry-run implementation draft after the 10N gate is ready', () => {
    const draft = realRegistryWriteImplementationDraftReadyExample;

    expect(draft.implementationDraftStatus).toBe('implementation_draft_ready');
    expect(draft.readyForFinalRealWriteReviewGate).toBe(true);
    expect(draft.implementationDraftOnly).toBe(true);
    expect(draft.dryRunOnly).toBe(true);
    expect(draft.actualWriteBlocked).toBe(true);
    expect(draft.publishBlocked).toBe(true);
    expect(draft.packageReplacementBlocked).toBe(true);
    expect(draft.productionWriterBlocked).toBe(true);
    expect(draft.noActualRegistryWrite).toBe(true);
    expect(draft.notPublished).toBe(true);
    expect(draft.noUserAppShellPackageReplacement).toBe(true);
    expect(draft.notProductionWriter).toBe(true);
    expect(draft.notProductionPackage).toBe(true);
    expect(draft.writerInterfaceDraft?.methods.length).toBeGreaterThan(0);
    expect(draft.transactionDraft?.steps.length).toBeGreaterThan(0);
    expect(draft.writeLockDraft?.locks.length).toBeGreaterThan(0);
    expect(draft.auditEventDraft?.events.length).toBeGreaterThan(0);
    expect(draft.rollbackCommandDraft?.commands.length).toBeGreaterThan(0);
    expect(draft.summary).toContain('dry-run only');
  });

  it('keeps warning gate output as warning draft only', () => {
    const draft = realRegistryWriteImplementationDraftWarningExample;

    expect(draft.implementationDraftStatus).toBe(
      'implementation_draft_ready_with_warnings',
    );
    expect(draft.warnings.map((warning) => warning.id)).toContain(
      'source_gate_warnings',
    );
    expect(draft.readyForFinalRealWriteReviewGate).toBe(true);
  });

  it('blocks missing source gate and required safety flags', () => {
    expect(blockedIds(realRegistryWriteImplementationDraftMissingGateReadyExample)).toContain(
      'missing_implementation_gate_ready',
    );
    expect(blockedIds(realRegistryWriteImplementationDraftMissingDryRunOnlyExample)).toContain(
      'missing_dry_run_only',
    );
    expect(
      blockedIds(realRegistryWriteImplementationDraftMissingActualWriteBlockedExample),
    ).toContain('missing_actual_write_blocked');
    expect(blockedIds(realRegistryWriteImplementationDraftMissingPublishBlockedExample)).toContain(
      'missing_publish_blocked',
    );
    expect(
      blockedIds(realRegistryWriteImplementationDraftMissingPackageReplacementBlockedExample),
    ).toContain('missing_package_replacement_blocked');
    expect(
      blockedIds(realRegistryWriteImplementationDraftMissingProductionWriterBlockedExample),
    ).toContain('missing_production_writer_blocked');
  });

  it('blocks missing writer interface, transaction, write lock, audit, and rollback drafts', () => {
    expect(blockedIds(realRegistryWriteImplementationDraftMissingWriterInterfaceExample)).toContain(
      'missing_writer_interface_draft',
    );
    expect(blockedIds(realRegistryWriteImplementationDraftMissingTransactionExample)).toContain(
      'missing_transaction_draft',
    );
    expect(blockedIds(realRegistryWriteImplementationDraftMissingWriteLockExample)).toContain(
      'missing_write_lock_draft',
    );
    expect(blockedIds(realRegistryWriteImplementationDraftMissingAuditEventExample)).toContain(
      'missing_audit_event_draft',
    );
    expect(blockedIds(realRegistryWriteImplementationDraftMissingRollbackCommandExample)).toContain(
      'missing_rollback_command_draft',
    );
  });

  it('blocks actual registry write markers, production markers, and shell replacement', () => {
    expect(blockedIds(realRegistryWriteImplementationDraftActualRegistryWriteExample)).toContain(
      'actual_registry_write_marker',
    );
    expect(blockedIds(realRegistryWriteImplementationDraftProductionMarkerExample)).toContain(
      'production_marker',
    );
    expect(blockedIds(realRegistryWriteImplementationDraftShellReplacementExample)).toContain(
      'user_app_shell_package_replacement',
    );
  });

  it('is JSON round-trip stable and never claims actual write or production writer readiness', () => {
    const json = JSON.stringify(realRegistryWriteImplementationDraftReadyExample);

    expect(JSON.parse(json)).toEqual(realRegistryWriteImplementationDraftReadyExample);
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('productionPackageId');
    expect(json).not.toContain('replaceUserAppShellPackage');
    expect(json).not.toContain('productionWriterReady');
    expect(json).not.toContain('actualWriteAuthorized');
  });
});
