import { describe, expect, it } from 'vitest';
import {
  guardedRealWriteExecutionSimulatorValidationActualRegistryWriteExample,
  guardedRealWriteExecutionSimulatorValidationMedicalClaimExample,
  guardedRealWriteExecutionSimulatorValidationMissingActualWriteBlockedExample,
  guardedRealWriteExecutionSimulatorValidationMissingAuditEventsExample,
  guardedRealWriteExecutionSimulatorValidationMissingDryRunOnlyExample,
  guardedRealWriteExecutionSimulatorValidationMissingExecutionPlanReadyExample,
  guardedRealWriteExecutionSimulatorValidationMissingFailureHandlingExample,
  guardedRealWriteExecutionSimulatorValidationMissingPackageReplacementBlockedExample,
  guardedRealWriteExecutionSimulatorValidationMissingPreflightExample,
  guardedRealWriteExecutionSimulatorValidationMissingProductionWriterBlockedExample,
  guardedRealWriteExecutionSimulatorValidationMissingPublishBlockedExample,
  guardedRealWriteExecutionSimulatorValidationMissingRegistryMutationBlockedExample,
  guardedRealWriteExecutionSimulatorValidationMissingRollbackExample,
  guardedRealWriteExecutionSimulatorValidationMissingWriteLockExample,
  guardedRealWriteExecutionSimulatorValidationMissingWriteOperationExample,
  guardedRealWriteExecutionSimulatorValidationPersonalDataExample,
  guardedRealWriteExecutionSimulatorValidationProductionMarkerExample,
  guardedRealWriteExecutionSimulatorValidationProductionWriterCreationExample,
  guardedRealWriteExecutionSimulatorValidationReadyExample,
  guardedRealWriteExecutionSimulatorValidationRegistryMutationExample,
  guardedRealWriteExecutionSimulatorValidationShellReplacementExample,
  guardedRealWriteExecutionSimulatorValidationWarningExample,
} from '../src/templates/examples';

const failedIds = (validation: {
  checks: Array<{ id: string; passed: boolean }>;
}): string[] =>
  validation.checks
    .filter((check) => !check.passed)
    .map((check) => check.id);

describe('Guarded real write execution simulator validation', () => {
  it('passes ready simulations while keeping simulator-only boundaries', () => {
    const validation = guardedRealWriteExecutionSimulatorValidationReadyExample;

    expect(validation.status).toBe('simulation_validation_ready');
    expect(validation.readyForFutureSimulatorReviewGate).toBe(true);
    expect(validation.simulatorOnly).toBe(true);
    expect(validation.dryRunOnly).toBe(true);
    expect(validation.noActualRegistryWrite).toBe(true);
    expect(validation.noRegistryMutation).toBe(true);
    expect(validation.notPublished).toBe(true);
    expect(validation.noUserAppShellPackageReplacement).toBe(true);
    expect(validation.notProductionWriter).toBe(true);
    expect(validation.doesNotCreateProductionWriter).toBe(true);
    expect(validation.recommendations[0]?.action).toBe(
      'continue_to_future_simulator_review_gate',
    );
  });

  it('keeps warning simulations as simulator-only instead of actual-write-ready', () => {
    const validation = guardedRealWriteExecutionSimulatorValidationWarningExample;

    expect(validation.status).toBe('simulation_validation_ready_with_warnings');
    expect(validation.readyForFutureSimulatorReviewGate).toBe(false);
    expect(validation.recommendations[0]?.action).toBe('keep_as_simulator_only');
  });

  it('blocks missing source readiness and safety flags', () => {
    expect(
      failedIds(
        guardedRealWriteExecutionSimulatorValidationMissingExecutionPlanReadyExample,
      ),
    ).toContain('source_execution_plan_validation_ready');
    expect(
      failedIds(guardedRealWriteExecutionSimulatorValidationMissingDryRunOnlyExample),
    ).toContain('dry_run_only_true');
    expect(
      failedIds(
        guardedRealWriteExecutionSimulatorValidationMissingActualWriteBlockedExample,
      ),
    ).toContain('actual_write_blocked_true');
    expect(
      failedIds(
        guardedRealWriteExecutionSimulatorValidationMissingPublishBlockedExample,
      ),
    ).toContain('publish_blocked_true');
    expect(
      failedIds(
        guardedRealWriteExecutionSimulatorValidationMissingPackageReplacementBlockedExample,
      ),
    ).toContain('package_replacement_blocked_true');
    expect(
      failedIds(
        guardedRealWriteExecutionSimulatorValidationMissingProductionWriterBlockedExample,
      ),
    ).toContain('production_writer_blocked_true');
    expect(
      failedIds(
        guardedRealWriteExecutionSimulatorValidationMissingRegistryMutationBlockedExample,
      ),
    ).toContain('registry_mutation_blocked_true');
  });

  it('blocks missing simulated sections', () => {
    expect(
      failedIds(guardedRealWriteExecutionSimulatorValidationMissingPreflightExample),
    ).toContain('simulated_preflight_present');
    expect(
      failedIds(guardedRealWriteExecutionSimulatorValidationMissingWriteLockExample),
    ).toContain('simulated_write_lock_present');
    expect(
      failedIds(
        guardedRealWriteExecutionSimulatorValidationMissingWriteOperationExample,
      ),
    ).toContain('simulated_write_operation_present');
    expect(
      failedIds(
        guardedRealWriteExecutionSimulatorValidationMissingAuditEventsExample,
      ),
    ).toContain('simulated_audit_events_present');
    expect(
      failedIds(guardedRealWriteExecutionSimulatorValidationMissingRollbackExample),
    ).toContain('simulated_rollback_present');
    expect(
      failedIds(
        guardedRealWriteExecutionSimulatorValidationMissingFailureHandlingExample,
      ),
    ).toContain('simulated_failure_handling_present');
  });

  it('blocks unsafe data, registry write, registry mutation, shell, production, and writer markers', () => {
    expect(
      failedIds(guardedRealWriteExecutionSimulatorValidationActualRegistryWriteExample),
    ).toContain('no_actual_registry_write');
    expect(
      failedIds(guardedRealWriteExecutionSimulatorValidationRegistryMutationExample),
    ).toContain('no_registry_mutation');
    expect(
      failedIds(guardedRealWriteExecutionSimulatorValidationProductionMarkerExample),
    ).toContain('no_production_package_marker');
    expect(
      failedIds(guardedRealWriteExecutionSimulatorValidationShellReplacementExample),
    ).toContain('no_user_app_shell_package_replacement');
    expect(
      failedIds(
        guardedRealWriteExecutionSimulatorValidationProductionWriterCreationExample,
      ),
    ).toContain('no_production_writer_creation');
    expect(
      failedIds(guardedRealWriteExecutionSimulatorValidationPersonalDataExample),
    ).toContain('no_personal_data');
    expect(
      failedIds(guardedRealWriteExecutionSimulatorValidationMedicalClaimExample),
    ).toContain('no_medical_claims');
  });

  it('is JSON round-trip stable', () => {
    const json = JSON.stringify(
      guardedRealWriteExecutionSimulatorValidationReadyExample,
    );

    expect(JSON.parse(json)).toEqual(
      guardedRealWriteExecutionSimulatorValidationReadyExample,
    );
    expect(
      guardedRealWriteExecutionSimulatorValidationReadyExample.jsonRoundTripStable,
    ).toBe(true);
  });
});
