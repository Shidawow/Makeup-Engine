import type { GuardedRealWriteExecutionSimulator } from './guardedRealWriteExecutionSimulator';
import type {
  GuardedRealWriteExecutionSimulatorValidationRecommendation,
  GuardedRealWriteExecutionSimulatorValidationResult,
} from './guardedRealWriteExecutionSimulatorValidation';

export type GuardedRealWriteExecutionSimulatorNextAction =
  | 'ready_for_future_simulator_review_gate'
  | 'request_simulation_preflight_revision'
  | 'request_simulation_lock_revision'
  | 'request_simulation_audit_revision'
  | 'request_simulation_rollback_revision'
  | 'request_simulation_failure_handling_revision'
  | 'request_owner_authorization_for_actual_write'
  | 'keep_as_simulator_only'
  | 'blocked_do_not_execute_real_write';

export type GuardedRealWriteExecutionSimulatorHandoffStatus =
  | 'simulation_handoff_ready'
  | 'simulation_handoff_ready_with_warnings'
  | 'simulation_handoff_blocked'
  | 'simulation_handoff_example_only';

export interface GuardedRealWriteExecutionSimulatorHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface GuardedRealWriteExecutionSimulatorHandoff {
  id: string;
  sourceSimulatorId: string;
  sourceExecutionPlanId: string;
  sourceExecutionAuthorizationId: string;
  status: GuardedRealWriteExecutionSimulatorHandoffStatus;
  nextAction: GuardedRealWriteExecutionSimulatorNextAction;
  items: GuardedRealWriteExecutionSimulatorHandoffItem[];
  notes: string[];
  simulatorOnly: true;
  dryRunOnly: true;
  noActualRegistryWrite: true;
  noRegistryMutation: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  doesNotCreateProductionWriter: true;
  readyForFutureSimulatorReviewGate: boolean;
  jsonRoundTripStable: boolean;
}

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const statusForSimulator = (
  simulator: GuardedRealWriteExecutionSimulator,
  validation: GuardedRealWriteExecutionSimulatorValidationResult,
): GuardedRealWriteExecutionSimulatorHandoffStatus => {
  if (simulator.simulationStatus === 'simulation_example_only') {
    return 'simulation_handoff_example_only';
  }
  if (
    simulator.simulationStatus === 'simulation_blocked' ||
    validation.status === 'simulation_validation_blocked'
  ) {
    return 'simulation_handoff_blocked';
  }
  if (
    simulator.simulationStatus === 'simulation_ready_with_warnings' ||
    validation.status === 'simulation_validation_ready_with_warnings'
  ) {
    return 'simulation_handoff_ready_with_warnings';
  }
  return 'simulation_handoff_ready';
};

const nextActionForValidation = (
  recommendation:
    | GuardedRealWriteExecutionSimulatorValidationRecommendation
    | undefined,
): GuardedRealWriteExecutionSimulatorNextAction => {
  switch (recommendation?.action) {
    case 'continue_to_future_simulator_review_gate':
      return 'ready_for_future_simulator_review_gate';
    case 'request_simulation_preflight_revision':
      return 'request_simulation_preflight_revision';
    case 'request_simulation_lock_revision':
      return 'request_simulation_lock_revision';
    case 'request_simulation_audit_revision':
      return 'request_simulation_audit_revision';
    case 'request_simulation_rollback_revision':
      return 'request_simulation_rollback_revision';
    case 'request_simulation_failure_handling_revision':
      return 'request_simulation_failure_handling_revision';
    case 'request_owner_authorization_for_actual_write':
      return 'request_owner_authorization_for_actual_write';
    case 'keep_as_simulator_only':
      return 'keep_as_simulator_only';
    case 'block_real_write_execution':
    default:
      return 'blocked_do_not_execute_real_write';
  }
};

export const createGuardedRealWriteExecutionSimulatorHandoff = ({
  simulator,
  validation,
  id = `guarded-real-write-execution-simulator-handoff-${simulator.simulatorId}`,
}: {
  simulator: GuardedRealWriteExecutionSimulator;
  validation: GuardedRealWriteExecutionSimulatorValidationResult;
  id?: string;
}): GuardedRealWriteExecutionSimulatorHandoff => {
  const handoff: GuardedRealWriteExecutionSimulatorHandoff = {
    id,
    sourceSimulatorId: simulator.simulatorId,
    sourceExecutionPlanId: simulator.sourceExecutionPlanId,
    sourceExecutionAuthorizationId: simulator.sourceExecutionAuthorizationId,
    status: statusForSimulator(simulator, validation),
    nextAction: nextActionForValidation(validation.recommendations[0]),
    items: [
      {
        id: 'simulation_status',
        label: 'Guarded real write simulation',
        value: simulator.simulationStatus,
        status:
          simulator.simulationStatus === 'simulation_blocked'
            ? 'blocked'
            : simulator.simulationStatus === 'simulation_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'simulation_validation_status',
        label: 'Simulation validation',
        value: validation.status,
        status:
          validation.status === 'simulation_validation_blocked'
            ? 'blocked'
            : validation.status === 'simulation_validation_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'preflight_lock_operation',
        label: 'Preflight / lock / operation',
        value:
          simulator.simulatedPreflight &&
          simulator.simulatedWriteLock &&
          simulator.simulatedWriteOperation
            ? 'present'
            : 'missing',
        status:
          simulator.simulatedPreflight &&
          simulator.simulatedWriteLock &&
          simulator.simulatedWriteOperation
            ? 'ready'
            : 'blocked',
      },
      {
        id: 'audit_rollback_failure',
        label: 'Audit / rollback / failure handling',
        value:
          simulator.simulatedAuditEvents.length > 0 &&
          simulator.simulatedRollback &&
          simulator.simulatedFailureHandling
            ? 'present'
            : 'missing',
        status:
          simulator.simulatedAuditEvents.length > 0 &&
          simulator.simulatedRollback &&
          simulator.simulatedFailureHandling
            ? 'ready'
            : 'blocked',
      },
      {
        id: 'dry_run_no_mutation',
        label: 'Dry-run / no registry mutation',
        value:
          simulator.dryRunOnly &&
          simulator.actualWriteBlocked &&
          simulator.registryMutationBlocked
            ? 'dry-run only; actual write and registry mutation blocked'
            : 'missing safety flags',
        status:
          simulator.dryRunOnly &&
          simulator.actualWriteBlocked &&
          simulator.registryMutationBlocked
            ? 'ready'
            : 'blocked',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Handoff does not write a UserAppTemplatePackage registry.',
      'Handoff does not mutate registry state.',
      'Handoff does not publish to the user app.',
      'Handoff does not replace the current User App Shell package.',
      'Handoff does not create a production writer.',
      'Handoff remains dry-run-only simulation.',
      'Handoff is for Phase 10T or later guarded simulator review gate only.',
      'Future actual registry write still requires separate explicit owner authorization.',
    ],
    simulatorOnly: true,
    dryRunOnly: true,
    noActualRegistryWrite: true,
    noRegistryMutation: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    doesNotCreateProductionWriter: true,
    readyForFutureSimulatorReviewGate:
      validation.readyForFutureSimulatorReviewGate,
    jsonRoundTripStable: true,
  };
  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
