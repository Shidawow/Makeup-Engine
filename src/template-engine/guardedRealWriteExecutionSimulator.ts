import type { RealWriteExecutionPlan } from './realWriteExecutionPlan';
import type { RealWriteExecutionPlanValidationResult } from './realWriteExecutionPlanValidation';
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

export type GuardedRealWriteSimulationMode =
  | 'dry_run_simulation'
  | 'guarded_simulation';

export type GuardedRealWriteSimulationStatus =
  | 'simulation_ready'
  | 'simulation_ready_with_warnings'
  | 'simulation_blocked'
  | 'simulation_example_only';

export interface GuardedRealWriteExecutionSimulationSource {
  sourceExecutionPlanStatus: RealWriteExecutionPlan['executionPlanStatus'];
  sourceExecutionPlanValidationStatus: RealWriteExecutionPlanValidationResult['status'];
  sourceReadyForSimulation: boolean;
}

export interface GuardedRealWriteSimulationStep {
  stepId: string;
  order: number;
  label: string;
  dryRunOnly: boolean;
  actualMutationBlocked: boolean;
  status:
    | 'simulated_ready'
    | 'simulated_with_warning'
    | 'simulated_blocked'
    | 'not_executed';
  summary: string;
}

export interface GuardedRealWriteSimulationPreflightResult {
  preflightId: string;
  dryRunOnly: boolean;
  actualWriteBlocked: true;
  status: 'passed' | 'warning' | 'blocked';
  checks: Array<{
    id: string;
    label: string;
    passed: boolean;
    summary: string;
  }>;
  summary: string;
}

export interface GuardedRealWriteSimulationLockResult {
  lockId: string;
  dryRunOnly: boolean;
  actualLockAcquisitionBlocked: true;
  status: 'simulated_acquired' | 'warning' | 'blocked';
  locks: Array<{
    id: string;
    label: string;
    simulated: boolean;
    actualLockBlocked: true;
    summary: string;
  }>;
  summary: string;
}

export interface GuardedRealWriteSimulationAuditEvent {
  eventId: string;
  label: string;
  dryRunOnly: boolean;
  actualRegistryAuditBlocked: true;
  sourceTrace: string;
  summary: string;
}

export interface GuardedRealWriteSimulationRollbackResult {
  rollbackId: string;
  dryRunOnly: boolean;
  actualRollbackBlocked: true;
  status: 'simulated_available' | 'warning' | 'blocked';
  steps: Array<{
    id: string;
    label: string;
    simulated: boolean;
    actualMutationBlocked: true;
    summary: string;
  }>;
  summary: string;
}

export interface GuardedRealWriteSimulationFailureHandlingResult {
  failureHandlingId: string;
  dryRunOnly: boolean;
  actualRecoveryMutationBlocked: true;
  status: 'ready' | 'warning' | 'blocked';
  handlers: Array<{
    id: string;
    label: string;
    stopSimulation: true;
    summary: string;
  }>;
  summary: string;
}

export interface GuardedRealWriteSimulationRun {
  runId: string;
  mode: GuardedRealWriteSimulationMode;
  dryRunOnly: boolean;
  actualWriteBlocked: boolean;
  steps: GuardedRealWriteSimulationStep[];
  summary: string;
}

export interface GuardedRealWriteSimulationWarning {
  id: string;
  message: string;
  recommendation: string;
}

export interface GuardedRealWriteSimulationBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface GuardedRealWriteSimulationTrace {
  source: GuardedRealWriteExecutionSimulationSource;
  sourceExecutionPlanId: string;
  sourceExecutionAuthorizationId: string;
  sourceFinalReviewGateId: string;
  sourceImplementationDraftId: string;
  sourceImplementationGateId: string;
  sourceExecutionDesignId: string;
  sourceWriterDraftId: string;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: RealWriteExecutionPlan['previewTrace'];
  gateTrace: RealWriteExecutionPlan['gateTrace'];
  writerTrace: RealWriteExecutionPlan['writerTrace'];
  implementationTrace: RealWriteExecutionPlan['implementationTrace'];
  authorizationTrace: RealWriteExecutionPlan['authorizationTrace'];
  executionPlanTrace: RealWriteExecutionPlan['trace'];
  noRawImageReference: boolean;
  noPersonalData: boolean;
  noMedicalClaims: boolean;
  noProductShadeClaims: boolean;
  noUnsupportedFinalClaims: boolean;
  noActualRegistryWrite: boolean;
  noRegistryMutation: boolean;
  noUserAppShellPackageReplacement: boolean;
  noProductionPackageMarker: boolean;
  noProductionWriterCreation: boolean;
}

export interface GuardedRealWriteExecutionSimulator {
  simulatorId: string;
  sourceExecutionPlanId: string;
  sourceExecutionAuthorizationId: string;
  simulationRunId: string;
  simulationMode: GuardedRealWriteSimulationMode;
  simulatedPreflight: GuardedRealWriteSimulationPreflightResult | null;
  simulatedWriteLock: GuardedRealWriteSimulationLockResult | null;
  simulatedWriteOperation: GuardedRealWriteSimulationRun | null;
  simulatedAuditEvents: GuardedRealWriteSimulationAuditEvent[];
  simulatedRollback: GuardedRealWriteSimulationRollbackResult | null;
  simulatedFailureHandling: GuardedRealWriteSimulationFailureHandlingResult | null;
  dryRunOnly: boolean;
  actualWriteBlocked: boolean;
  publishBlocked: boolean;
  packageReplacementBlocked: boolean;
  productionWriterBlocked: boolean;
  registryMutationBlocked: boolean;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: GuardedRealWriteSimulationTrace['previewTrace'];
  gateTrace: GuardedRealWriteSimulationTrace['gateTrace'];
  writerTrace: GuardedRealWriteSimulationTrace['writerTrace'];
  implementationTrace: GuardedRealWriteSimulationTrace['implementationTrace'];
  authorizationTrace: GuardedRealWriteSimulationTrace['authorizationTrace'];
  executionPlanTrace: GuardedRealWriteSimulationTrace['executionPlanTrace'];
  warnings: GuardedRealWriteSimulationWarning[];
  blockedReasons: GuardedRealWriteSimulationBlockedReason[];
  simulationStatus: GuardedRealWriteSimulationStatus;
  simulatorOnly: true;
  noActualRegistryWrite: true;
  noRegistryMutation: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  doesNotCreateProductionWriter: true;
  readyForFutureSimulatorReviewGate: boolean;
  trace: GuardedRealWriteSimulationTrace;
  summary: string;
  jsonRoundTripStable: boolean;
}

export interface GuardedRealWriteExecutionSimulatorOverrides {
  simulationMode?: GuardedRealWriteSimulationMode;
  dryRunOnly?: boolean;
  actualWriteBlocked?: boolean;
  publishBlocked?: boolean;
  packageReplacementBlocked?: boolean;
  productionWriterBlocked?: boolean;
  registryMutationBlocked?: boolean;
  omitSimulatedPreflight?: boolean;
  omitSimulatedWriteLock?: boolean;
  omitSimulatedWriteOperation?: boolean;
  omitSimulatedAuditEvents?: boolean;
  omitSimulatedRollback?: boolean;
  omitSimulatedFailureHandling?: boolean;
  simulatedPreflight?: GuardedRealWriteSimulationPreflightResult | null;
  simulatedWriteLock?: GuardedRealWriteSimulationLockResult | null;
  simulatedWriteOperation?: GuardedRealWriteSimulationRun | null;
  simulatedAuditEvents?: GuardedRealWriteSimulationAuditEvent[];
  simulatedRollback?: GuardedRealWriteSimulationRollbackResult | null;
  simulatedFailureHandling?: GuardedRealWriteSimulationFailureHandlingResult | null;
  note?: string;
}

export const registryMutationMarkerPattern =
  /registryMutation|mutateRegistry|registry\s*mutation\s*:\s*true|已 mutation registry|mutation registry|registry_mutation_executed/i;

export const productionWriterCreationMarkerPattern =
  /productionWriterCreated|createProductionWriter|productionWriter\s*:\s*true|已创建 production writer|production_writer_ready/i;

const buildBlockedReason = (
  id: string,
  message: string,
  recommendation: string,
): GuardedRealWriteSimulationBlockedReason => ({
  id,
  message,
  recommendation,
});

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const sourcePlanValidationReady = (
  validation: RealWriteExecutionPlanValidationResult,
): boolean =>
  validation.status === 'execution_plan_validation_ready' ||
  validation.status === 'execution_plan_validation_ready_with_warnings';

const createSimulatedPreflight = (
  plan: RealWriteExecutionPlan,
  validation: RealWriteExecutionPlanValidationResult,
): GuardedRealWriteSimulationPreflightResult => ({
  preflightId: `guarded-simulation-preflight-${plan.executionPlanId}`,
  dryRunOnly: true,
  actualWriteBlocked: true,
  status: validation.status === 'execution_plan_validation_ready' ? 'passed' : 'warning',
  checks: [
    {
      id: 'source_plan_validation_ready',
      label: 'Source execution plan validation ready',
      passed: sourcePlanValidationReady(validation),
      summary: 'Phase 10S can simulate only from a ready or ready-with-warnings execution plan validation.',
    },
    {
      id: 'owner_authorization_scope_preserved',
      label: 'Owner authorization scope preserved',
      passed:
        plan.authorizationTrace.ownerAuthorizationScope ===
        'execution_authorization_phase_only',
      summary:
        'Owner authorization remains Phase-10Q-only and does not authorize real registry writes.',
    },
    {
      id: 'all_write_boundaries_blocked',
      label: 'All write boundaries blocked',
      passed:
        plan.dryRunOnly &&
        plan.actualWriteBlocked &&
        plan.publishBlocked &&
        plan.packageReplacementBlocked &&
        plan.productionWriterBlocked,
      summary:
        'Actual write, publish, shell replacement, and production writer creation stay blocked.',
    },
  ],
  summary:
    'Simulated preflight checks source validation, owner scope, trace, and no-write safety flags without executing anything.',
});

const createSimulatedWriteLock = (
  plan: RealWriteExecutionPlan,
): GuardedRealWriteSimulationLockResult => ({
  lockId: `guarded-simulation-lock-${plan.executionPlanId}`,
  dryRunOnly: true,
  actualLockAcquisitionBlocked: true,
  status: 'simulated_acquired',
  locks: [
    {
      id: 'source_plan_snapshot_lock',
      label: 'Source execution plan snapshot lock',
      simulated: true,
      actualLockBlocked: true,
      summary: 'Simulates locking the 10R execution plan snapshot. No real lock is acquired.',
    },
    {
      id: 'authorization_trace_lock',
      label: 'Authorization trace lock',
      simulated: true,
      actualLockBlocked: true,
      summary: 'Simulates locking the 10Q authorization trace for review only.',
    },
    {
      id: 'registry_mutation_lock',
      label: 'Registry mutation lock',
      simulated: true,
      actualLockBlocked: true,
      summary: 'Simulates a registry mutation lock while keeping actual registry mutation blocked.',
    },
  ],
  summary:
    'Write lock is simulated only. Phase 10S does not acquire production locks or mutate registry state.',
});

const createSimulatedWriteOperation = (
  plan: RealWriteExecutionPlan,
  simulationMode: GuardedRealWriteSimulationMode,
  dryRunOnly: boolean,
  actualWriteBlocked: boolean,
): GuardedRealWriteSimulationRun => {
  const steps: GuardedRealWriteSimulationStep[] = [
    {
      stepId: `guarded-simulation-check-${plan.executionPlanId}`,
      order: 1,
      label: 'Simulate final pre-write safety check',
      dryRunOnly,
      actualMutationBlocked: actualWriteBlocked,
      status:
        dryRunOnly && actualWriteBlocked
          ? 'simulated_ready'
          : 'simulated_blocked',
      summary: 'Rehearses the final no-write safety check in memory only.',
    },
    {
      stepId: `guarded-simulation-transaction-${plan.executionPlanId}`,
      order: 2,
      label: 'Simulate registry write transaction',
      dryRunOnly,
      actualMutationBlocked: actualWriteBlocked,
      status:
        dryRunOnly && actualWriteBlocked
          ? 'not_executed'
          : 'simulated_blocked',
      summary:
        'Represents the write transaction shape without executing a registry write, mutation, publish, or shell replacement.',
    },
    {
      stepId: `guarded-simulation-verify-${plan.executionPlanId}`,
      order: 3,
      label: 'Simulate post-write verification',
      dryRunOnly,
      actualMutationBlocked: actualWriteBlocked,
      status:
        dryRunOnly && actualWriteBlocked
          ? 'simulated_ready'
          : 'simulated_blocked',
      summary:
        'Checks that the rehearsal stayed dry-run-only and did not create production writer output.',
    },
  ];

  return {
    runId: `guarded-simulation-run-${plan.executionPlanId}`,
    mode: simulationMode,
    dryRunOnly,
    actualWriteBlocked,
    steps,
    summary:
      'Simulation run rehearses the future guarded write flow while blocking actual mutation, publication, package replacement, and production writer creation.',
  };
};

const createSimulatedAuditEvents = (
  plan: RealWriteExecutionPlan,
): GuardedRealWriteSimulationAuditEvent[] => [
  {
    eventId: `guarded-simulation-audit-plan-${plan.executionPlanId}`,
    label: 'Source execution plan reviewed',
    dryRunOnly: true,
    actualRegistryAuditBlocked: true,
    sourceTrace: plan.executionPlanId,
    summary: 'Records the 10R execution plan lineage for simulated review only.',
  },
  {
    eventId: `guarded-simulation-audit-authorization-${plan.sourceExecutionAuthorizationId}`,
    label: 'Owner authorization scope reviewed',
    dryRunOnly: true,
    actualRegistryAuditBlocked: true,
    sourceTrace: plan.sourceExecutionAuthorizationId,
    summary: 'Records that Phase 10Q authorization does not authorize real writes.',
  },
  {
    eventId: `guarded-simulation-audit-no-mutation-${plan.executionPlanId}`,
    label: 'No registry mutation verified',
    dryRunOnly: true,
    actualRegistryAuditBlocked: true,
    sourceTrace: plan.executionPlanId,
    summary: 'Records that simulated registry mutation remained blocked.',
  },
];

const createSimulatedRollback = (
  plan: RealWriteExecutionPlan,
): GuardedRealWriteSimulationRollbackResult => ({
  rollbackId: `guarded-simulation-rollback-${plan.executionPlanId}`,
  dryRunOnly: true,
  actualRollbackBlocked: true,
  status: 'simulated_available',
  steps: [
    {
      id: 'capture_pre_simulation_state',
      label: 'Capture pre-simulation state',
      simulated: true,
      actualMutationBlocked: true,
      summary:
        'Simulates capturing current registry-preview state without reading or writing production registry data.',
    },
    {
      id: 'prepare_restore_plan',
      label: 'Prepare restore plan',
      simulated: true,
      actualMutationBlocked: true,
      summary:
        'Prepares a rollback rehearsal artifact only; no rollback command is executed.',
    },
    {
      id: 'block_on_verification_failure',
      label: 'Block on verification failure',
      simulated: true,
      actualMutationBlocked: true,
      summary:
        'Any failed verification blocks handoff to the future simulator review gate.',
    },
  ],
  summary:
    'Rollback is simulated and available for review only. Phase 10S cannot execute rollback mutations.',
});

const createSimulatedFailureHandling = (
  plan: RealWriteExecutionPlan,
): GuardedRealWriteSimulationFailureHandlingResult => ({
  failureHandlingId: `guarded-simulation-failure-handling-${plan.executionPlanId}`,
  dryRunOnly: true,
  actualRecoveryMutationBlocked: true,
  status: 'ready',
  handlers: [
    {
      id: 'preflight_failure',
      label: 'Preflight failure',
      stopSimulation: true,
      summary:
        'Stop the simulation and request preflight revision. Do not continue toward real write execution.',
    },
    {
      id: 'lock_failure',
      label: 'Write lock simulation failure',
      stopSimulation: true,
      summary:
        'Stop the simulation and request lock revision. Do not acquire real locks.',
    },
    {
      id: 'mutation_marker_failure',
      label: 'Mutation marker detected',
      stopSimulation: true,
      summary:
        'Stop immediately if a registry write, mutation, publish, shell replacement, or production writer marker appears.',
    },
  ],
  summary:
    'Failure handling keeps every failure path review-only and blocks any real mutation recovery action.',
});

const simulationPayloadText = ({
  parts,
  note = '',
}: {
  parts: {
    simulatedPreflight: GuardedRealWriteSimulationPreflightResult | null;
    simulatedWriteLock: GuardedRealWriteSimulationLockResult | null;
    simulatedWriteOperation: GuardedRealWriteSimulationRun | null;
    simulatedAuditEvents: GuardedRealWriteSimulationAuditEvent[];
    simulatedRollback: GuardedRealWriteSimulationRollbackResult | null;
    simulatedFailureHandling: GuardedRealWriteSimulationFailureHandlingResult | null;
  };
  note?: string;
}): string =>
  JSON.stringify({
    preflight: parts.simulatedPreflight?.summary,
    lock: parts.simulatedWriteLock?.summary,
    operation: parts.simulatedWriteOperation?.steps.map((step) => ({
      label: step.label,
      status: step.status,
      summary: step.summary,
    })),
    audit: parts.simulatedAuditEvents.map((event) => ({
      label: event.label,
      summary: event.summary,
    })),
    rollback: parts.simulatedRollback?.steps.map((step) => ({
      label: step.label,
      summary: step.summary,
    })),
    failureHandling: parts.simulatedFailureHandling?.handlers.map((handler) => ({
      label: handler.label,
      summary: handler.summary,
    })),
    operatorNote: note,
  });

export const createGuardedRealWriteExecutionSimulator = ({
  plan,
  validation,
  simulatorId = `guarded-real-write-execution-simulator-${plan.executionPlanId}`,
  overrides = {},
}: {
  plan: RealWriteExecutionPlan;
  validation: RealWriteExecutionPlanValidationResult;
  simulatorId?: string;
  overrides?: GuardedRealWriteExecutionSimulatorOverrides;
}): GuardedRealWriteExecutionSimulator => {
  const simulationMode = overrides.simulationMode ?? 'dry_run_simulation';
  const dryRunOnly = overrides.dryRunOnly ?? plan.dryRunOnly;
  const actualWriteBlocked =
    overrides.actualWriteBlocked ?? plan.actualWriteBlocked;
  const publishBlocked = overrides.publishBlocked ?? plan.publishBlocked;
  const packageReplacementBlocked =
    overrides.packageReplacementBlocked ?? plan.packageReplacementBlocked;
  const productionWriterBlocked =
    overrides.productionWriterBlocked ?? plan.productionWriterBlocked;
  const registryMutationBlocked = overrides.registryMutationBlocked ?? true;
  const sourceReadyForSimulation =
    sourcePlanValidationReady(validation) &&
    (plan.executionPlanStatus === 'execution_plan_ready' ||
      plan.executionPlanStatus === 'execution_plan_ready_with_warnings');
  const simulatedPreflight = overrides.omitSimulatedPreflight
    ? null
    : (overrides.simulatedPreflight ??
      createSimulatedPreflight(plan, validation));
  const simulatedWriteLock = overrides.omitSimulatedWriteLock
    ? null
    : (overrides.simulatedWriteLock ?? createSimulatedWriteLock(plan));
  const simulatedWriteOperation = overrides.omitSimulatedWriteOperation
    ? null
    : (overrides.simulatedWriteOperation ??
      createSimulatedWriteOperation(
        plan,
        simulationMode,
        dryRunOnly,
        actualWriteBlocked,
      ));
  const simulatedAuditEvents = overrides.omitSimulatedAuditEvents
    ? []
    : (overrides.simulatedAuditEvents ?? createSimulatedAuditEvents(plan));
  const simulatedRollback = overrides.omitSimulatedRollback
    ? null
    : (overrides.simulatedRollback ?? createSimulatedRollback(plan));
  const simulatedFailureHandling = overrides.omitSimulatedFailureHandling
    ? null
    : (overrides.simulatedFailureHandling ??
      createSimulatedFailureHandling(plan));
  const parts = {
    simulatedPreflight,
    simulatedWriteLock,
    simulatedWriteOperation,
    simulatedAuditEvents,
    simulatedRollback,
    simulatedFailureHandling,
  };
  const payloadText = simulationPayloadText({
    parts,
    note: overrides.note,
  });
  const noRawImageReference =
    plan.trace.noRawImageReference &&
    !registryPreparationRawImageReferencePattern.test(payloadText);
  const noPersonalData =
    plan.trace.noPersonalData &&
    !registryPreparationPersonalDataPattern.test(payloadText);
  const noMedicalClaims =
    plan.trace.noMedicalClaims &&
    !registryPreparationMedicalClaimPattern.test(payloadText);
  const noProductShadeClaims =
    plan.trace.noProductShadeClaims &&
    !registryPreparationShadeClaimPattern.test(payloadText);
  const noUnsupportedFinalClaims =
    plan.trace.noUnsupportedFinalClaims &&
    !registryPreparationFinalClaimPattern.test(payloadText);
  const noActualRegistryWrite =
    actualWriteBlocked &&
    plan.noActualRegistryWrite &&
    plan.trace.noActualRegistryWrite &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noRegistryMutation =
    registryMutationBlocked && !registryMutationMarkerPattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    packageReplacementBlocked &&
    plan.noUserAppShellPackageReplacement &&
    plan.trace.noUserAppShellPackageReplacement &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    plan.notProductionPackage &&
    plan.trace.noProductionPackageMarker &&
    !registryPreparationProductionMarkerPattern.test(payloadText);
  const noProductionWriterCreation =
    productionWriterBlocked &&
    plan.notProductionWriter &&
    plan.doesNotCreateProductionWriter &&
    plan.trace.noProductionWriterCreation &&
    !productionWriterCreationMarkerPattern.test(payloadText);

  const blockedReasons: GuardedRealWriteSimulationBlockedReason[] = [
    !sourceReadyForSimulation &&
      buildBlockedReason(
        'source_execution_plan_validation_ready',
        'Guarded real write execution simulator requires a ready Phase 10R execution plan validation.',
        'Return to Phase 10R and resolve execution plan validation before simulation.',
      ),
    simulationMode !== 'dry_run_simulation' &&
      simulationMode !== 'guarded_simulation' &&
      buildBlockedReason(
        'simulation_mode_is_dry_run',
        'Simulation mode must remain dry-run or guarded simulation.',
        'Restore a dry-run simulation mode before continuing.',
      ),
    !dryRunOnly &&
      buildBlockedReason(
        'dry_run_only_true',
        'Simulator must keep dryRunOnly true.',
        'Restore dry-run-only simulation before continuing.',
      ),
    !actualWriteBlocked &&
      buildBlockedReason(
        'actual_write_blocked_true',
        'Simulator must keep actual registry writes blocked.',
        'Remove real write execution from Phase 10S.',
      ),
    !publishBlocked &&
      buildBlockedReason(
        'publish_blocked_true',
        'Simulator must keep publication blocked.',
        'Remove publication from Phase 10S scope.',
      ),
    !packageReplacementBlocked &&
      buildBlockedReason(
        'package_replacement_blocked_true',
        'Simulator must not replace the current User App Shell package.',
        'Restore packageReplacementBlocked and keep current shell package unchanged.',
      ),
    !productionWriterBlocked &&
      buildBlockedReason(
        'production_writer_blocked_true',
        'Simulator must not create a production writer.',
        'Restore productionWriterBlocked and keep production writer creation out of scope.',
      ),
    !registryMutationBlocked &&
      buildBlockedReason(
        'registry_mutation_blocked_true',
        'Simulator must keep registry mutation blocked.',
        'Restore registryMutationBlocked and remove mutation paths.',
      ),
    !simulatedPreflight &&
      buildBlockedReason(
        'simulated_preflight_present',
        'Simulated preflight is required.',
        'Add simulated preflight checks before handoff.',
      ),
    !simulatedWriteLock &&
      buildBlockedReason(
        'simulated_write_lock_present',
        'Simulated write lock is required.',
        'Add simulated write lock results before handoff.',
      ),
    !simulatedWriteOperation &&
      buildBlockedReason(
        'simulated_write_operation_present',
        'Simulated write operation is required.',
        'Add dry-run-only simulated operation steps before handoff.',
      ),
    simulatedAuditEvents.length === 0 &&
      buildBlockedReason(
        'simulated_audit_events_present',
        'Simulated audit events are required.',
        'Add simulated audit events before handoff.',
      ),
    !simulatedRollback &&
      buildBlockedReason(
        'simulated_rollback_present',
        'Simulated rollback is required.',
        'Add simulated rollback results before handoff.',
      ),
    !simulatedFailureHandling &&
      buildBlockedReason(
        'simulated_failure_handling_present',
        'Simulated failure handling is required.',
        'Add simulated failure handling before handoff.',
      ),
    !noRawImageReference &&
      buildBlockedReason(
        'no_raw_image_reference',
        'Simulator must not include raw image references.',
        'Remove object URLs, base64, local paths, and runtime asset references.',
      ),
    !noPersonalData &&
      buildBlockedReason(
        'no_personal_data',
        'Simulator must not include personal or sensitive data.',
        'Remove names, contact data, health data, biometrics, and camera data.',
      ),
    !noMedicalClaims &&
      buildBlockedReason(
        'no_medical_claims',
        'Simulator must not include medical claims.',
        'Remove treatment, diagnosis, or medical-effect wording.',
      ),
    !noProductShadeClaims &&
      buildBlockedReason(
        'no_product_shade_claims',
        'Simulator must not include product shade claims.',
        'Keep product references generic and placeholder-only.',
      ),
    !noUnsupportedFinalClaims &&
      buildBlockedReason(
        'no_unsupported_final_claims',
        'Simulator must not include unsupported final claims.',
        'Remove final recognition, final approval, or AI confirmation wording.',
      ),
    !noActualRegistryWrite &&
      buildBlockedReason(
        'no_actual_registry_write',
        'Simulator must not execute or mark actual registry writes.',
        'Remove actual registry write markers and keep Phase 10S simulator-only.',
      ),
    !noRegistryMutation &&
      buildBlockedReason(
        'no_registry_mutation',
        'Simulator must not include registry mutation markers.',
        'Remove registry mutation wording and keep the simulator non-mutating.',
      ),
    !noUserAppShellPackageReplacement &&
      buildBlockedReason(
        'no_user_app_shell_package_replacement',
        'Simulator must not replace the current User App Shell package.',
        'Remove shell package replacement markers.',
      ),
    !noProductionPackageMarker &&
      buildBlockedReason(
        'no_production_package_marker',
        'Simulator must not contain production package markers.',
        'Remove production package or production readiness markers.',
      ),
    !noProductionWriterCreation &&
      buildBlockedReason(
        'no_production_writer_creation',
        'Simulator must not create or mark a production writer.',
        'Remove production writer creation markers.',
      ),
  ].filter(
    (reason): reason is GuardedRealWriteSimulationBlockedReason => Boolean(reason),
  );

  const warnings: GuardedRealWriteSimulationWarning[] =
    validation.status === 'execution_plan_validation_ready_with_warnings'
      ? [
          {
            id: 'source_execution_plan_validation_warning',
            message:
              'Source execution plan validation is ready with warnings, so this simulation remains under extra review.',
            recommendation:
              'Keep as simulator-only until warning context is reviewed before any future simulator review gate.',
          },
        ]
      : [];
  const simulationStatus: GuardedRealWriteSimulationStatus =
    plan.executionPlanStatus === 'execution_plan_example_only'
      ? 'simulation_example_only'
      : blockedReasons.length > 0
        ? 'simulation_blocked'
        : warnings.length > 0
          ? 'simulation_ready_with_warnings'
          : 'simulation_ready';
  const trace: GuardedRealWriteSimulationTrace = {
    source: {
      sourceExecutionPlanStatus: plan.executionPlanStatus,
      sourceExecutionPlanValidationStatus: validation.status,
      sourceReadyForSimulation,
    },
    sourceExecutionPlanId: plan.executionPlanId,
    sourceExecutionAuthorizationId: plan.sourceExecutionAuthorizationId,
    sourceFinalReviewGateId: plan.sourceFinalReviewGateId,
    sourceImplementationDraftId: plan.sourceImplementationDraftId,
    sourceImplementationGateId: plan.sourceImplementationGateId,
    sourceExecutionDesignId: plan.sourceExecutionDesignId,
    sourceWriterDraftId: plan.sourceWriterDraftId,
    qaTrace: plan.qaTrace,
    humanReviewTrace: plan.humanReviewTrace,
    candidateTrace: plan.candidateTrace,
    contractTrace: plan.contractTrace,
    previewTrace: plan.previewTrace,
    gateTrace: plan.gateTrace,
    writerTrace: plan.writerTrace,
    implementationTrace: plan.implementationTrace,
    authorizationTrace: plan.authorizationTrace,
    executionPlanTrace: plan.trace,
    noRawImageReference,
    noPersonalData,
    noMedicalClaims,
    noProductShadeClaims,
    noUnsupportedFinalClaims,
    noActualRegistryWrite,
    noRegistryMutation,
    noUserAppShellPackageReplacement,
    noProductionPackageMarker,
    noProductionWriterCreation,
  };
  const simulator: GuardedRealWriteExecutionSimulator = {
    simulatorId,
    sourceExecutionPlanId: plan.executionPlanId,
    sourceExecutionAuthorizationId: plan.sourceExecutionAuthorizationId,
    simulationRunId:
      simulatedWriteOperation?.runId ?? `guarded-simulation-run-${plan.executionPlanId}`,
    simulationMode,
    simulatedPreflight,
    simulatedWriteLock,
    simulatedWriteOperation,
    simulatedAuditEvents,
    simulatedRollback,
    simulatedFailureHandling,
    dryRunOnly,
    actualWriteBlocked,
    publishBlocked,
    packageReplacementBlocked,
    productionWriterBlocked,
    registryMutationBlocked,
    qaTrace: plan.qaTrace,
    humanReviewTrace: plan.humanReviewTrace,
    candidateTrace: plan.candidateTrace,
    contractTrace: plan.contractTrace,
    previewTrace: plan.previewTrace,
    gateTrace: plan.gateTrace,
    writerTrace: plan.writerTrace,
    implementationTrace: plan.implementationTrace,
    authorizationTrace: plan.authorizationTrace,
    executionPlanTrace: plan.trace,
    warnings,
    blockedReasons,
    simulationStatus,
    simulatorOnly: true,
    noActualRegistryWrite: true,
    noRegistryMutation: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    doesNotCreateProductionWriter: true,
    readyForFutureSimulatorReviewGate: simulationStatus === 'simulation_ready',
    trace,
    summary:
      'Guarded real write execution simulator rehearses the future write path as dry-run-only simulation. It does not write a registry, publish, replace shell packages, create production writers, or mutate registry state.',
    jsonRoundTripStable: true,
  };
  simulator.jsonRoundTripStable = isJsonRoundTripStable(simulator);
  return simulator;
};
