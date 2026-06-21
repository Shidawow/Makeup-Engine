import { describe, expect, it } from 'vitest';
import {
  guardedSimulatorReviewGateActualRegistryWriteExample,
  guardedSimulatorReviewGateMissingActualWriteBlockedExample,
  guardedSimulatorReviewGateMissingDryRunOnlyExample,
  guardedSimulatorReviewGateMissingPackageReplacementBlockedExample,
  guardedSimulatorReviewGateMissingProductionWriterBlockedExample,
  guardedSimulatorReviewGateMissingPublishBlockedExample,
  guardedSimulatorReviewGateMissingRegistryMutationBlockedExample,
  guardedSimulatorReviewGateMissingSimulationValidationExample,
  guardedSimulatorReviewGateProductionMarkerExample,
  guardedSimulatorReviewGateProductionWriterCreationExample,
  guardedSimulatorReviewGateReadyExample,
  guardedSimulatorReviewGateRegistryMutationExample,
  guardedSimulatorReviewGateShellReplacementExample,
  guardedSimulatorReviewGateWarningExample,
} from '../src/templates/examples';

const failedIds = (gate: {
  checks: Array<{ id: string; passed: boolean }>;
}): string[] => gate.checks.filter((check) => !check.passed).map((check) => check.id);

describe('Guarded simulator review gate', () => {
  it('becomes ready only from simulation validation ready while staying review-gate-only', () => {
    const gate = guardedSimulatorReviewGateReadyExample;

    expect(gate.status).toBe('simulator_review_gate_ready');
    expect(gate.decision).toBe('eligible_for_future_real_write_approval_boundary');
    expect(gate.readyForFutureRealWriteApprovalBoundary).toBe(true);
    expect(gate.reviewGateOnly).toBe(true);
    expect(gate.dryRunOnly).toBe(true);
    expect(gate.noActualRegistryWrite).toBe(true);
    expect(gate.noRegistryMutation).toBe(true);
    expect(gate.notPublished).toBe(true);
    expect(gate.noUserAppShellPackageReplacement).toBe(true);
    expect(gate.notProductionWriter).toBe(true);
    expect(gate.doesNotCreateProductionWriter).toBe(true);
    expect(gate.futureActualWriteRequiresSeparateApproval).toBe(true);
    expect(failedIds(gate)).toEqual([]);
  });

  it('keeps warning simulations as review-only instead of actual-write-ready', () => {
    const gate = guardedSimulatorReviewGateWarningExample;

    expect(gate.status).toBe('simulator_review_gate_ready_with_warnings');
    expect(gate.readyForFutureRealWriteApprovalBoundary).toBe(false);
    expect(gate.decision).toBe('keep_as_simulator_review_only');
  });

  it('blocks missing simulation validation and required safety flags', () => {
    expect(failedIds(guardedSimulatorReviewGateMissingSimulationValidationExample)).toContain(
      'source_simulation_validation_ready',
    );
    expect(failedIds(guardedSimulatorReviewGateMissingDryRunOnlyExample)).toContain(
      'simulator_is_dry_run_only',
    );
    expect(
      failedIds(guardedSimulatorReviewGateMissingActualWriteBlockedExample),
    ).toContain('actual_write_blocked_true');
    expect(failedIds(guardedSimulatorReviewGateMissingPublishBlockedExample)).toContain(
      'publish_blocked_true',
    );
    expect(
      failedIds(guardedSimulatorReviewGateMissingPackageReplacementBlockedExample),
    ).toContain('package_replacement_blocked_true');
    expect(
      failedIds(guardedSimulatorReviewGateMissingProductionWriterBlockedExample),
    ).toContain('production_writer_blocked_true');
    expect(
      failedIds(guardedSimulatorReviewGateMissingRegistryMutationBlockedExample),
    ).toContain('registry_mutation_blocked_true');
  });

  it('blocks actual write, mutation, production, shell replacement, and writer creation markers', () => {
    expect(failedIds(guardedSimulatorReviewGateActualRegistryWriteExample)).toContain(
      'no_actual_registry_write',
    );
    expect(failedIds(guardedSimulatorReviewGateRegistryMutationExample)).toContain(
      'no_registry_mutation',
    );
    expect(failedIds(guardedSimulatorReviewGateProductionMarkerExample)).toContain(
      'no_production_package_marker',
    );
    expect(failedIds(guardedSimulatorReviewGateShellReplacementExample)).toContain(
      'no_user_app_shell_package_replacement',
    );
    expect(
      failedIds(guardedSimulatorReviewGateProductionWriterCreationExample),
    ).toContain('no_production_writer_creation');
  });

  it('is JSON round-trip stable and never claims real execution', () => {
    const json = JSON.stringify(guardedSimulatorReviewGateReadyExample);

    expect(JSON.parse(json)).toEqual(guardedSimulatorReviewGateReadyExample);
    expect(guardedSimulatorReviewGateReadyExample.jsonRoundTripStable).toBe(true);
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('registry_mutation_executed');
    expect(json).not.toContain('productionPackageId');
    expect(json).not.toContain('replaceUserAppShellPackage');
    expect(json).not.toContain('createProductionWriter');
    expect(json).not.toContain('actualWriteAuthorized');
  });
});
