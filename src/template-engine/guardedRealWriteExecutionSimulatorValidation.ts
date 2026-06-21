import type { GuardedRealWriteExecutionSimulator } from './guardedRealWriteExecutionSimulator';
import {
  productionWriterCreationMarkerPattern,
  registryMutationMarkerPattern,
} from './guardedRealWriteExecutionSimulator';
import {
  registryPreparationActualRegistryWritePattern,
  registryPreparationFinalClaimPattern,
  registryPreparationMedicalClaimPattern,
  registryPreparationPersonalDataPattern,
  registryPreparationProductionMarkerPattern,
  registryPreparationRawImageReferencePattern,
  registryPreparationShadeClaimPattern,
  registryPreparationShellReplacementPattern,
} from './userAppTemplatePackageRegistryPreparation';

export type GuardedRealWriteExecutionSimulatorValidationSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type GuardedRealWriteExecutionSimulatorValidationStatus =
  | 'simulation_validation_ready'
  | 'simulation_validation_ready_with_warnings'
  | 'simulation_validation_blocked';

export type GuardedRealWriteExecutionSimulatorValidationCheckId =
  | 'source_execution_plan_validation_ready'
  | 'simulation_mode_is_dry_run'
  | 'dry_run_only_true'
  | 'actual_write_blocked_true'
  | 'publish_blocked_true'
  | 'package_replacement_blocked_true'
  | 'production_writer_blocked_true'
  | 'registry_mutation_blocked_true'
  | 'simulated_preflight_present'
  | 'simulated_write_lock_present'
  | 'simulated_write_operation_present'
  | 'simulated_audit_events_present'
  | 'simulated_rollback_present'
  | 'simulated_failure_handling_present'
  | 'trace_preserved'
  | 'no_raw_image_reference'
  | 'no_personal_data'
  | 'no_medical_claims'
  | 'no_product_shade_claims'
  | 'no_unsupported_final_claims'
  | 'no_actual_registry_write'
  | 'no_registry_mutation'
  | 'no_user_app_shell_package_replacement'
  | 'no_production_package_marker'
  | 'no_production_writer_creation'
  | 'json_round_trip_safe';

export interface GuardedRealWriteExecutionSimulatorValidationCheck {
  id: GuardedRealWriteExecutionSimulatorValidationCheckId;
  label: string;
  passed: boolean;
  severity: GuardedRealWriteExecutionSimulatorValidationSeverity;
  message: string;
}

export interface GuardedRealWriteExecutionSimulatorValidationIssue {
  id: string;
  checkId: GuardedRealWriteExecutionSimulatorValidationCheckId;
  severity: Exclude<GuardedRealWriteExecutionSimulatorValidationSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface GuardedRealWriteExecutionSimulatorValidationRecommendation {
  id: string;
  message: string;
  action:
    | 'continue_to_future_simulator_review_gate'
    | 'request_simulation_preflight_revision'
    | 'request_simulation_lock_revision'
    | 'request_simulation_audit_revision'
    | 'request_simulation_rollback_revision'
    | 'request_simulation_failure_handling_revision'
    | 'request_owner_authorization_for_actual_write'
    | 'keep_as_simulator_only'
    | 'block_real_write_execution';
}

export interface GuardedRealWriteExecutionSimulatorValidationResult {
  status: GuardedRealWriteExecutionSimulatorValidationStatus;
  checks: GuardedRealWriteExecutionSimulatorValidationCheck[];
  issues: GuardedRealWriteExecutionSimulatorValidationIssue[];
  recommendations: GuardedRealWriteExecutionSimulatorValidationRecommendation[];
  readyForFutureSimulatorReviewGate: boolean;
  simulatorOnly: true;
  dryRunOnly: true;
  noActualRegistryWrite: true;
  noRegistryMutation: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  doesNotCreateProductionWriter: true;
  jsonRoundTripStable: boolean;
}

const createCheck = (
  id: GuardedRealWriteExecutionSimulatorValidationCheckId,
  label: string,
  passed: boolean,
  severity: GuardedRealWriteExecutionSimulatorValidationSeverity,
  message: string,
): GuardedRealWriteExecutionSimulatorValidationCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

const issueForCheck = (
  check: GuardedRealWriteExecutionSimulatorValidationCheck,
  recommendation: string,
): GuardedRealWriteExecutionSimulatorValidationIssue | null => {
  if (check.passed || check.severity === 'info') {
    return null;
  }
  return {
    id: `${check.id}_${check.severity}`,
    checkId: check.id,
    severity: check.severity,
    message: check.message,
    recommendation,
  };
};

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const validationPayloadText = (
  simulator: GuardedRealWriteExecutionSimulator,
): string =>
  JSON.stringify({
    preflight: simulator.simulatedPreflight?.summary,
    lock: simulator.simulatedWriteLock?.locks.map((lock) => ({
      label: lock.label,
      summary: lock.summary,
    })),
    operation: simulator.simulatedWriteOperation?.steps.map((step) => ({
      label: step.label,
      status: step.status,
      summary: step.summary,
    })),
    audit: simulator.simulatedAuditEvents.map((event) => ({
      label: event.label,
      summary: event.summary,
    })),
    rollback: simulator.simulatedRollback?.steps.map((step) => ({
      label: step.label,
      summary: step.summary,
    })),
    failureHandling: simulator.simulatedFailureHandling?.handlers.map((handler) => ({
      label: handler.label,
      summary: handler.summary,
    })),
    summary: simulator.summary,
  });

const sourcePlanValidationReady = (
  simulator: GuardedRealWriteExecutionSimulator,
): boolean =>
  simulator.trace.source.sourceReadyForSimulation &&
  (simulator.simulationStatus === 'simulation_ready' ||
    simulator.simulationStatus === 'simulation_ready_with_warnings');

const actionForIssues = (
  issues: readonly GuardedRealWriteExecutionSimulatorValidationIssue[],
  hasWarnings: boolean,
): GuardedRealWriteExecutionSimulatorValidationRecommendation['action'] => {
  if (issues.length === 0) {
    return hasWarnings
      ? 'keep_as_simulator_only'
      : 'continue_to_future_simulator_review_gate';
  }
  if (
    issues.some((issue) =>
      [
        'source_execution_plan_validation_ready',
        'simulation_mode_is_dry_run',
        'dry_run_only_true',
        'actual_write_blocked_true',
        'publish_blocked_true',
        'package_replacement_blocked_true',
        'production_writer_blocked_true',
        'registry_mutation_blocked_true',
        'no_actual_registry_write',
        'no_registry_mutation',
        'no_user_app_shell_package_replacement',
        'no_production_package_marker',
        'no_production_writer_creation',
        'json_round_trip_safe',
      ].includes(issue.checkId),
    )
  ) {
    return 'block_real_write_execution';
  }
  if (
    issues.some((issue) =>
      [
        'no_raw_image_reference',
        'no_personal_data',
        'no_medical_claims',
        'no_product_shade_claims',
        'no_unsupported_final_claims',
      ].includes(issue.checkId),
    )
  ) {
    return 'block_real_write_execution';
  }
  if (issues.some((issue) => issue.checkId === 'simulated_preflight_present')) {
    return 'request_simulation_preflight_revision';
  }
  if (issues.some((issue) => issue.checkId === 'simulated_write_lock_present')) {
    return 'request_simulation_lock_revision';
  }
  if (issues.some((issue) => issue.checkId === 'simulated_audit_events_present')) {
    return 'request_simulation_audit_revision';
  }
  if (issues.some((issue) => issue.checkId === 'simulated_rollback_present')) {
    return 'request_simulation_rollback_revision';
  }
  if (
    issues.some((issue) => issue.checkId === 'simulated_failure_handling_present')
  ) {
    return 'request_simulation_failure_handling_revision';
  }
  return 'request_owner_authorization_for_actual_write';
};

export const validateGuardedRealWriteExecutionSimulator = (
  simulator: GuardedRealWriteExecutionSimulator,
): GuardedRealWriteExecutionSimulatorValidationResult => {
  const payloadText = validationPayloadText(simulator);
  const tracePreserved =
    simulator.qaTrace.trim().length > 0 &&
    simulator.humanReviewTrace.trim().length > 0 &&
    simulator.candidateTrace.trim().length > 0 &&
    simulator.contractTrace.trim().length > 0 &&
    Boolean(simulator.previewTrace) &&
    Boolean(simulator.gateTrace) &&
    Boolean(simulator.writerTrace) &&
    Boolean(simulator.implementationTrace) &&
    Boolean(simulator.authorizationTrace) &&
    Boolean(simulator.executionPlanTrace);
  const simulatedPreflightPresent =
    Boolean(simulator.simulatedPreflight) &&
    simulator.simulatedPreflight?.dryRunOnly === true &&
    simulator.simulatedPreflight?.actualWriteBlocked === true &&
    simulator.simulatedPreflight.checks.length > 0 &&
    simulator.simulatedPreflight.checks.every((check) => check.passed);
  const simulatedWriteLockPresent =
    Boolean(simulator.simulatedWriteLock) &&
    simulator.simulatedWriteLock?.dryRunOnly === true &&
    simulator.simulatedWriteLock?.actualLockAcquisitionBlocked === true &&
    simulator.simulatedWriteLock.locks.length > 0 &&
    simulator.simulatedWriteLock.locks.every(
      (lock) => lock.simulated && lock.actualLockBlocked,
    );
  const simulatedWriteOperationPresent =
    Boolean(simulator.simulatedWriteOperation) &&
    simulator.simulatedWriteOperation?.dryRunOnly === true &&
    simulator.simulatedWriteOperation?.actualWriteBlocked === true &&
    simulator.simulatedWriteOperation.steps.length > 0 &&
    simulator.simulatedWriteOperation.steps.every(
      (step) => step.dryRunOnly && step.actualMutationBlocked,
    );
  const simulatedAuditEventsPresent =
    simulator.simulatedAuditEvents.length > 0 &&
    simulator.simulatedAuditEvents.every(
      (event) => event.dryRunOnly && event.actualRegistryAuditBlocked,
    );
  const simulatedRollbackPresent =
    Boolean(simulator.simulatedRollback) &&
    simulator.simulatedRollback?.dryRunOnly === true &&
    simulator.simulatedRollback?.actualRollbackBlocked === true &&
    simulator.simulatedRollback.steps.length > 0 &&
    simulator.simulatedRollback.steps.every(
      (step) => step.simulated && step.actualMutationBlocked,
    );
  const simulatedFailureHandlingPresent =
    Boolean(simulator.simulatedFailureHandling) &&
    simulator.simulatedFailureHandling?.dryRunOnly === true &&
    simulator.simulatedFailureHandling?.actualRecoveryMutationBlocked === true &&
    simulator.simulatedFailureHandling.handlers.length > 0 &&
    simulator.simulatedFailureHandling.handlers.every(
      (handler) => handler.stopSimulation,
    );
  const noRawImageReference =
    simulator.trace.noRawImageReference &&
    !registryPreparationRawImageReferencePattern.test(payloadText);
  const noPersonalData =
    simulator.trace.noPersonalData &&
    !registryPreparationPersonalDataPattern.test(payloadText);
  const noMedicalClaims =
    simulator.trace.noMedicalClaims &&
    !registryPreparationMedicalClaimPattern.test(payloadText);
  const noProductShadeClaims =
    simulator.trace.noProductShadeClaims &&
    !registryPreparationShadeClaimPattern.test(payloadText);
  const noUnsupportedFinalClaims =
    simulator.trace.noUnsupportedFinalClaims &&
    !registryPreparationFinalClaimPattern.test(payloadText);
  const noActualRegistryWrite =
    simulator.actualWriteBlocked &&
    simulator.noActualRegistryWrite &&
    simulator.trace.noActualRegistryWrite &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noRegistryMutation =
    simulator.registryMutationBlocked &&
    simulator.noRegistryMutation &&
    simulator.trace.noRegistryMutation &&
    !registryMutationMarkerPattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    simulator.packageReplacementBlocked &&
    simulator.noUserAppShellPackageReplacement &&
    simulator.trace.noUserAppShellPackageReplacement &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    simulator.notProductionPackage &&
    simulator.trace.noProductionPackageMarker &&
    !registryPreparationProductionMarkerPattern.test(payloadText);
  const noProductionWriterCreation =
    simulator.productionWriterBlocked &&
    simulator.notProductionWriter &&
    simulator.doesNotCreateProductionWriter &&
    simulator.trace.noProductionWriterCreation &&
    !productionWriterCreationMarkerPattern.test(payloadText);
  const simulationModeIsDryRun =
    simulator.simulationMode === 'dry_run_simulation' ||
    simulator.simulationMode === 'guarded_simulation';
  const jsonRoundTripStable =
    simulator.jsonRoundTripStable && isJsonRoundTripStable(simulator);

  const checks: GuardedRealWriteExecutionSimulatorValidationCheck[] = [
    createCheck(
      'source_execution_plan_validation_ready',
      'Source execution plan validation ready',
      sourcePlanValidationReady(simulator),
      'blocking',
      'Guarded simulator requires a ready Phase 10R execution plan validation.',
    ),
    createCheck(
      'simulation_mode_is_dry_run',
      'Simulation mode is dry-run',
      simulationModeIsDryRun,
      'blocking',
      'Simulation mode must remain dry-run or guarded simulation.',
    ),
    createCheck(
      'dry_run_only_true',
      'Dry-run only true',
      simulator.dryRunOnly,
      'blocking',
      'Simulator must keep dryRunOnly true.',
    ),
    createCheck(
      'actual_write_blocked_true',
      'Actual write blocked true',
      simulator.actualWriteBlocked,
      'blocking',
      'Simulator must keep actual registry writes blocked.',
    ),
    createCheck(
      'publish_blocked_true',
      'Publish blocked true',
      simulator.publishBlocked,
      'blocking',
      'Simulator must keep publication blocked.',
    ),
    createCheck(
      'package_replacement_blocked_true',
      'Package replacement blocked true',
      simulator.packageReplacementBlocked,
      'blocking',
      'Simulator must not replace the current User App Shell package.',
    ),
    createCheck(
      'production_writer_blocked_true',
      'Production writer blocked true',
      simulator.productionWriterBlocked,
      'blocking',
      'Simulator must not create a production writer.',
    ),
    createCheck(
      'registry_mutation_blocked_true',
      'Registry mutation blocked true',
      simulator.registryMutationBlocked,
      'blocking',
      'Simulator must keep registry mutation blocked.',
    ),
    createCheck(
      'simulated_preflight_present',
      'Simulated preflight present',
      simulatedPreflightPresent,
      'blocking',
      'Simulator requires simulated preflight results.',
    ),
    createCheck(
      'simulated_write_lock_present',
      'Simulated write lock present',
      simulatedWriteLockPresent,
      'blocking',
      'Simulator requires simulated write lock results.',
    ),
    createCheck(
      'simulated_write_operation_present',
      'Simulated write operation present',
      simulatedWriteOperationPresent,
      'blocking',
      'Simulator requires dry-run-only simulated write operation steps.',
    ),
    createCheck(
      'simulated_audit_events_present',
      'Simulated audit events present',
      simulatedAuditEventsPresent,
      'blocking',
      'Simulator requires simulated audit events.',
    ),
    createCheck(
      'simulated_rollback_present',
      'Simulated rollback present',
      simulatedRollbackPresent,
      'blocking',
      'Simulator requires simulated rollback results.',
    ),
    createCheck(
      'simulated_failure_handling_present',
      'Simulated failure handling present',
      simulatedFailureHandlingPresent,
      'blocking',
      'Simulator requires simulated failure handling.',
    ),
    createCheck(
      'trace_preserved',
      'Trace preserved',
      tracePreserved,
      'blocking',
      'Simulator requires QA, human review, candidate, contract, preview, gate, writer, implementation, authorization, and execution plan trace.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      noRawImageReference,
      'blocking',
      'Simulator must not include raw image references.',
    ),
    createCheck(
      'no_personal_data',
      'No personal data',
      noPersonalData,
      'blocking',
      'Simulator must not include personal or sensitive data.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      noMedicalClaims,
      'blocking',
      'Simulator must not include medical claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      noProductShadeClaims,
      'blocking',
      'Simulator must not include product shade claims.',
    ),
    createCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      noUnsupportedFinalClaims,
      'blocking',
      'Simulator must not include final recognition, final approval, or AI confirmation claims.',
    ),
    createCheck(
      'no_actual_registry_write',
      'No actual registry write',
      noActualRegistryWrite,
      'blocking',
      'Simulator must not execute, persist, or mark actual registry writes.',
    ),
    createCheck(
      'no_registry_mutation',
      'No registry mutation',
      noRegistryMutation,
      'blocking',
      'Simulator must not include registry mutation markers.',
    ),
    createCheck(
      'no_user_app_shell_package_replacement',
      'No User App Shell package replacement',
      noUserAppShellPackageReplacement,
      'blocking',
      'Simulator must not replace the current User App Shell package.',
    ),
    createCheck(
      'no_production_package_marker',
      'No production package marker',
      noProductionPackageMarker,
      'blocking',
      'Simulator must not include production package markers.',
    ),
    createCheck(
      'no_production_writer_creation',
      'No production writer creation',
      noProductionWriterCreation,
      'blocking',
      'Simulator must not create or mark a production writer.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'blocking',
      'Simulator must be JSON round-trip stable.',
    ),
  ];
  const recommendationsByCheck: Record<
    GuardedRealWriteExecutionSimulatorValidationCheckId,
    string
  > = {
    source_execution_plan_validation_ready:
      'Return to Phase 10R and resolve execution plan validation first.',
    simulation_mode_is_dry_run:
      'Restore dry-run or guarded simulation mode before continuing.',
    dry_run_only_true:
      'Restore dryRunOnly before simulator validation can continue.',
    actual_write_blocked_true:
      'Restore actualWriteBlocked and remove real registry write markers.',
    publish_blocked_true: 'Restore publishBlocked and keep publication out of scope.',
    package_replacement_blocked_true:
      'Restore packageReplacementBlocked and preserve the current User App Shell package.',
    production_writer_blocked_true:
      'Restore productionWriterBlocked and keep production writer creation out of scope.',
    registry_mutation_blocked_true:
      'Restore registryMutationBlocked and remove registry mutation paths.',
    simulated_preflight_present:
      'Add simulated preflight results before handoff.',
    simulated_write_lock_present:
      'Add simulated write lock results before handoff.',
    simulated_write_operation_present:
      'Add dry-run-only simulated write operation steps before handoff.',
    simulated_audit_events_present:
      'Add simulated audit events before handoff.',
    simulated_rollback_present:
      'Add simulated rollback results before handoff.',
    simulated_failure_handling_present:
      'Add simulated failure handling before handoff.',
    trace_preserved:
      'Restore QA, human review, candidate, contract, preview, gate, writer, implementation, authorization, and execution plan traces.',
    no_raw_image_reference:
      'Remove object URLs, base64, local paths, and runtime asset references.',
    no_personal_data:
      'Remove personal, contact, health, sensitive identity, biometric, or camera data.',
    no_medical_claims: 'Remove treatment, diagnosis, or medical-effect wording.',
    no_product_shade_claims:
      'Keep product references generic and placeholder-only.',
    no_unsupported_final_claims:
      'Remove final recognition, final approval, and AI confirmation wording.',
    no_actual_registry_write:
      'Remove actual registry write markers and keep Phase 10S simulator-only.',
    no_registry_mutation:
      'Remove registry mutation markers and keep the simulator non-mutating.',
    no_user_app_shell_package_replacement:
      'Remove current User App Shell package replacement markers.',
    no_production_package_marker:
      'Remove production package and production readiness markers.',
    no_production_writer_creation:
      'Remove production writer creation or readiness markers.',
    json_round_trip_safe: 'Remove non-serializable values before handoff.',
  };
  const issues = checks
    .map((check) => issueForCheck(check, recommendationsByCheck[check.id]))
    .filter(
      (issue): issue is GuardedRealWriteExecutionSimulatorValidationIssue =>
        Boolean(issue),
    );
  const hasWarnings =
    simulator.simulationStatus === 'simulation_ready_with_warnings' ||
    checks.some((check) => !check.passed && check.severity === 'warning');
  const status: GuardedRealWriteExecutionSimulatorValidationStatus =
    issues.some((issue) => issue.severity === 'blocking')
      ? 'simulation_validation_blocked'
      : hasWarnings
        ? 'simulation_validation_ready_with_warnings'
        : 'simulation_validation_ready';
  const action = actionForIssues(issues, hasWarnings);
  return {
    status,
    checks,
    issues,
    recommendations: [
      {
        id: `${action}-recommendation`,
        message:
          action === 'continue_to_future_simulator_review_gate'
            ? 'Simulation can hand off to a future simulator review gate. This is not actual write authorization.'
            : 'Simulation needs revision or must remain simulator-only before any future review gate.',
        action,
      },
    ],
    readyForFutureSimulatorReviewGate:
      status === 'simulation_validation_ready' &&
      simulator.readyForFutureSimulatorReviewGate,
    simulatorOnly: true,
    dryRunOnly: true,
    noActualRegistryWrite: true,
    noRegistryMutation: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    doesNotCreateProductionWriter: true,
    jsonRoundTripStable,
  };
};
