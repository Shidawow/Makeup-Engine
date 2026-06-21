import { describe, expect, it } from 'vitest';
import {
  guardedRealWriteExecutionSimulatorActualRegistryWriteExample,
  guardedRealWriteExecutionSimulatorMedicalClaimExample,
  guardedRealWriteExecutionSimulatorMissingActualWriteBlockedExample,
  guardedRealWriteExecutionSimulatorMissingAuditEventsExample,
  guardedRealWriteExecutionSimulatorMissingDryRunOnlyExample,
  guardedRealWriteExecutionSimulatorMissingExecutionPlanReadyExample,
  guardedRealWriteExecutionSimulatorMissingFailureHandlingExample,
  guardedRealWriteExecutionSimulatorMissingPackageReplacementBlockedExample,
  guardedRealWriteExecutionSimulatorMissingPreflightExample,
  guardedRealWriteExecutionSimulatorMissingProductionWriterBlockedExample,
  guardedRealWriteExecutionSimulatorMissingPublishBlockedExample,
  guardedRealWriteExecutionSimulatorMissingRegistryMutationBlockedExample,
  guardedRealWriteExecutionSimulatorMissingRollbackExample,
  guardedRealWriteExecutionSimulatorMissingWriteLockExample,
  guardedRealWriteExecutionSimulatorMissingWriteOperationExample,
  guardedRealWriteExecutionSimulatorPersonalDataExample,
  guardedRealWriteExecutionSimulatorProductionMarkerExample,
  guardedRealWriteExecutionSimulatorProductionWriterCreationExample,
  guardedRealWriteExecutionSimulatorReadyExample,
  guardedRealWriteExecutionSimulatorRegistryMutationExample,
  guardedRealWriteExecutionSimulatorShellReplacementExample,
  guardedRealWriteExecutionSimulatorWarningExample,
} from '../src/templates/examples';

const blockedIds = (simulator: {
  blockedReasons: Array<{ id: string }>;
}): string[] => simulator.blockedReasons.map((reason) => reason.id);

describe('Guarded real write execution simulator', () => {
  it('becomes ready only from ready execution plan validation while staying simulator-only', () => {
    const simulator = guardedRealWriteExecutionSimulatorReadyExample;

    expect(simulator.simulationStatus).toBe('simulation_ready');
    expect(simulator.readyForFutureSimulatorReviewGate).toBe(true);
    expect(simulator.simulatorOnly).toBe(true);
    expect(simulator.dryRunOnly).toBe(true);
    expect(simulator.actualWriteBlocked).toBe(true);
    expect(simulator.publishBlocked).toBe(true);
    expect(simulator.packageReplacementBlocked).toBe(true);
    expect(simulator.productionWriterBlocked).toBe(true);
    expect(simulator.registryMutationBlocked).toBe(true);
    expect(simulator.noActualRegistryWrite).toBe(true);
    expect(simulator.noRegistryMutation).toBe(true);
    expect(simulator.notPublished).toBe(true);
    expect(simulator.noUserAppShellPackageReplacement).toBe(true);
    expect(simulator.notProductionWriter).toBe(true);
    expect(simulator.doesNotCreateProductionWriter).toBe(true);
    expect(simulator.simulatedPreflight).toBeTruthy();
    expect(simulator.simulatedWriteLock).toBeTruthy();
    expect(simulator.simulatedWriteOperation).toBeTruthy();
    expect(simulator.simulatedAuditEvents.length).toBeGreaterThan(0);
    expect(simulator.simulatedRollback).toBeTruthy();
    expect(simulator.simulatedFailureHandling).toBeTruthy();
  });

  it('keeps warning source plans as simulator-only warnings', () => {
    expect(guardedRealWriteExecutionSimulatorWarningExample.simulationStatus).toBe(
      'simulation_ready_with_warnings',
    );
    expect(
      guardedRealWriteExecutionSimulatorWarningExample.readyForFutureSimulatorReviewGate,
    ).toBe(false);
  });

  it('blocks missing source readiness and safety flags', () => {
    expect(
      blockedIds(guardedRealWriteExecutionSimulatorMissingExecutionPlanReadyExample),
    ).toContain('source_execution_plan_validation_ready');
    expect(blockedIds(guardedRealWriteExecutionSimulatorMissingDryRunOnlyExample)).toContain(
      'dry_run_only_true',
    );
    expect(
      blockedIds(guardedRealWriteExecutionSimulatorMissingActualWriteBlockedExample),
    ).toContain('actual_write_blocked_true');
    expect(
      blockedIds(guardedRealWriteExecutionSimulatorMissingPublishBlockedExample),
    ).toContain('publish_blocked_true');
    expect(
      blockedIds(
        guardedRealWriteExecutionSimulatorMissingPackageReplacementBlockedExample,
      ),
    ).toContain('package_replacement_blocked_true');
    expect(
      blockedIds(
        guardedRealWriteExecutionSimulatorMissingProductionWriterBlockedExample,
      ),
    ).toContain('production_writer_blocked_true');
    expect(
      blockedIds(
        guardedRealWriteExecutionSimulatorMissingRegistryMutationBlockedExample,
      ),
    ).toContain('registry_mutation_blocked_true');
  });

  it('blocks missing simulated execution sections', () => {
    expect(
      blockedIds(guardedRealWriteExecutionSimulatorMissingPreflightExample),
    ).toContain('simulated_preflight_present');
    expect(
      blockedIds(guardedRealWriteExecutionSimulatorMissingWriteLockExample),
    ).toContain('simulated_write_lock_present');
    expect(
      blockedIds(guardedRealWriteExecutionSimulatorMissingWriteOperationExample),
    ).toContain('simulated_write_operation_present');
    expect(
      blockedIds(guardedRealWriteExecutionSimulatorMissingAuditEventsExample),
    ).toContain('simulated_audit_events_present');
    expect(
      blockedIds(guardedRealWriteExecutionSimulatorMissingRollbackExample),
    ).toContain('simulated_rollback_present');
    expect(
      blockedIds(guardedRealWriteExecutionSimulatorMissingFailureHandlingExample),
    ).toContain('simulated_failure_handling_present');
  });

  it('blocks unsafe data, write, mutation, production, shell, and writer markers', () => {
    expect(
      blockedIds(guardedRealWriteExecutionSimulatorActualRegistryWriteExample),
    ).toContain('no_actual_registry_write');
    expect(
      blockedIds(guardedRealWriteExecutionSimulatorRegistryMutationExample),
    ).toContain('no_registry_mutation');
    expect(
      blockedIds(guardedRealWriteExecutionSimulatorProductionMarkerExample),
    ).toContain('no_production_package_marker');
    expect(
      blockedIds(guardedRealWriteExecutionSimulatorShellReplacementExample),
    ).toContain('no_user_app_shell_package_replacement');
    expect(
      blockedIds(guardedRealWriteExecutionSimulatorProductionWriterCreationExample),
    ).toContain('no_production_writer_creation');
    expect(blockedIds(guardedRealWriteExecutionSimulatorPersonalDataExample)).toContain(
      'no_personal_data',
    );
    expect(blockedIds(guardedRealWriteExecutionSimulatorMedicalClaimExample)).toContain(
      'no_medical_claims',
    );
  });

  it('is JSON round-trip stable and never claims real execution', () => {
    const json = JSON.stringify(guardedRealWriteExecutionSimulatorReadyExample);

    expect(JSON.parse(json)).toEqual(guardedRealWriteExecutionSimulatorReadyExample);
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('registry_mutation_executed');
    expect(json).not.toContain('productionPackageId');
    expect(json).not.toContain('replaceUserAppShellPackage');
    expect(json).not.toContain('createProductionWriter');
    expect(json).not.toContain('actualWriteAuthorized');
    expect(json).not.toContain('productionWriterReady');
  });
});
