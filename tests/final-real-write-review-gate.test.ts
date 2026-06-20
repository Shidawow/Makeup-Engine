import { describe, expect, it } from 'vitest';
import {
  finalRealWriteReviewGateActualRegistryWriteExample,
  finalRealWriteReviewGateMissingActualWriteBlockedExample,
  finalRealWriteReviewGateMissingDryRunOnlyExample,
  finalRealWriteReviewGateMissingImplementationDraftValidationExample,
  finalRealWriteReviewGateMissingPackageReplacementBlockedExample,
  finalRealWriteReviewGateMissingProductionWriterBlockedExample,
  finalRealWriteReviewGateMissingPublishBlockedExample,
  finalRealWriteReviewGateOwnerActualWriteExample,
  finalRealWriteReviewGateOwnerPublishExample,
  finalRealWriteReviewGateOwnerShellReplacementExample,
  finalRealWriteReviewGateProductionMarkerExample,
  finalRealWriteReviewGateReadyExample,
  finalRealWriteReviewGateShellReplacementExample,
  finalRealWriteReviewGateWarningExample,
} from '../src/templates/examples';

const blockedIds = (gate: {
  blockedReasons: Array<{ id: string }>;
}): string[] => gate.blockedReasons.map((reason) => reason.id);

describe('Final real write review gate', () => {
  it('becomes ready only after implementation draft validation is ready', () => {
    const gate = finalRealWriteReviewGateReadyExample;

    expect(gate.status).toBe('final_real_write_review_gate_ready');
    expect(gate.decision).toBe(
      'eligible_for_future_real_write_execution_authorization',
    );
    expect(gate.eligibleForFutureRealWriteExecutionAuthorization).toBe(true);
    expect(gate.ownerAuthorizationScope).toBe('review_gate_only');
    expect(gate.dryRunOnly).toBe(true);
    expect(gate.actualWriteBlocked).toBe(true);
    expect(gate.publishBlocked).toBe(true);
    expect(gate.packageReplacementBlocked).toBe(true);
    expect(gate.productionWriterBlocked).toBe(true);
    expect(gate.finalReviewGateOnly).toBe(true);
    expect(gate.notActualWriteAuthorization).toBe(true);
    expect(gate.noActualRegistryWrite).toBe(true);
    expect(gate.notPublished).toBe(true);
    expect(gate.noUserAppShellPackageReplacement).toBe(true);
    expect(gate.notProductionWriter).toBe(true);
    expect(gate.summary).toContain('review_gate_only');
  });

  it('keeps warning inputs as final-review-only instead of execution authorization', () => {
    const gate = finalRealWriteReviewGateWarningExample;

    expect(gate.status).toBe('final_real_write_review_gate_ready_with_warnings');
    expect(gate.decision).toBe('keep_as_final_review_only');
    expect(gate.eligibleForFutureRealWriteExecutionAuthorization).toBe(false);
  });

  it('blocks missing source validation and safety flags', () => {
    expect(
      blockedIds(finalRealWriteReviewGateMissingImplementationDraftValidationExample),
    ).toContain('source_implementation_draft_validation_ready');
    expect(blockedIds(finalRealWriteReviewGateMissingDryRunOnlyExample)).toContain(
      'dry_run_only_true',
    );
    expect(
      blockedIds(finalRealWriteReviewGateMissingActualWriteBlockedExample),
    ).toContain('actual_write_blocked_true');
    expect(
      blockedIds(finalRealWriteReviewGateMissingPublishBlockedExample),
    ).toContain('publish_blocked_true');
    expect(
      blockedIds(finalRealWriteReviewGateMissingPackageReplacementBlockedExample),
    ).toContain('package_replacement_blocked_true');
    expect(
      blockedIds(finalRealWriteReviewGateMissingProductionWriterBlockedExample),
    ).toContain('production_writer_blocked_true');
  });

  it('blocks owner authorization scopes beyond review_gate_only', () => {
    expect(finalRealWriteReviewGateOwnerActualWriteExample.status).toBe(
      'final_real_write_review_gate_blocked',
    );
    expect(blockedIds(finalRealWriteReviewGateOwnerActualWriteExample)).toContain(
      'owner_did_not_authorize_actual_write',
    );
    expect(finalRealWriteReviewGateOwnerPublishExample.status).toBe(
      'final_real_write_review_gate_blocked',
    );
    expect(blockedIds(finalRealWriteReviewGateOwnerPublishExample)).toContain(
      'owner_did_not_authorize_publish',
    );
    expect(finalRealWriteReviewGateOwnerShellReplacementExample.status).toBe(
      'final_real_write_review_gate_blocked',
    );
    expect(
      blockedIds(finalRealWriteReviewGateOwnerShellReplacementExample),
    ).toContain('owner_did_not_authorize_user_app_shell_replacement');
  });

  it('blocks actual registry write, production marker, and User App Shell replacement markers', () => {
    expect(blockedIds(finalRealWriteReviewGateActualRegistryWriteExample)).toContain(
      'no_actual_registry_write',
    );
    expect(blockedIds(finalRealWriteReviewGateProductionMarkerExample)).toContain(
      'no_production_package_marker',
    );
    expect(blockedIds(finalRealWriteReviewGateShellReplacementExample)).toContain(
      'no_user_app_shell_package_replacement',
    );
  });

  it('is JSON round-trip stable and never claims actual write authorization', () => {
    const json = JSON.stringify(finalRealWriteReviewGateReadyExample);

    expect(JSON.parse(json)).toEqual(finalRealWriteReviewGateReadyExample);
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('productionPackageId');
    expect(json).not.toContain('replaceUserAppShellPackage');
    expect(json).not.toContain('actualWriteAuthorized');
    expect(json).not.toContain('productionWriterReady');
  });
});
