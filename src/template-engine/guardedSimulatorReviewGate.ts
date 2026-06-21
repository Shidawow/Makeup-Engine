import type { GuardedRealWriteExecutionSimulator } from './guardedRealWriteExecutionSimulator';
import {
  productionWriterCreationMarkerPattern,
  registryMutationMarkerPattern,
} from './guardedRealWriteExecutionSimulator';
import type { GuardedRealWriteExecutionSimulatorValidationResult } from './guardedRealWriteExecutionSimulatorValidation';
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

export type GuardedSimulatorReviewGateSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type GuardedSimulatorReviewGateStatus =
  | 'simulator_review_gate_ready'
  | 'simulator_review_gate_ready_with_warnings'
  | 'simulator_review_gate_blocked'
  | 'simulator_review_gate_example_only';

export type GuardedSimulatorReviewGateDecision =
  | 'eligible_for_future_real_write_approval_boundary'
  | 'request_simulator_preflight_revision'
  | 'request_simulator_lock_revision'
  | 'request_simulator_audit_revision'
  | 'request_simulator_rollback_revision'
  | 'request_simulator_failure_handling_revision'
  | 'request_owner_authorization_for_actual_write'
  | 'keep_as_simulator_review_only'
  | 'blocked_do_not_execute_real_write';

export type GuardedSimulatorReviewGateCheckId =
  | 'source_simulation_validation_ready'
  | 'simulator_is_dry_run_only'
  | 'registry_mutation_blocked_true'
  | 'actual_write_blocked_true'
  | 'publish_blocked_true'
  | 'package_replacement_blocked_true'
  | 'production_writer_blocked_true'
  | 'simulated_preflight_reviewed'
  | 'simulated_write_lock_reviewed'
  | 'simulated_write_operation_reviewed'
  | 'simulated_audit_events_reviewed'
  | 'simulated_rollback_reviewed'
  | 'simulated_failure_handling_reviewed'
  | 'no_registry_mutation'
  | 'no_actual_registry_write'
  | 'no_publish'
  | 'no_user_app_shell_package_replacement'
  | 'no_production_writer_creation'
  | 'future_actual_write_requires_separate_approval'
  | 'trace_preserved'
  | 'no_raw_image_reference'
  | 'no_personal_data'
  | 'no_medical_claims'
  | 'no_product_shade_claims'
  | 'no_unsupported_final_claims'
  | 'no_production_package_marker'
  | 'json_round_trip_safe';

export interface GuardedSimulatorReviewGateCheck {
  id: GuardedSimulatorReviewGateCheckId;
  label: string;
  passed: boolean;
  severity: GuardedSimulatorReviewGateSeverity;
  message: string;
}

export interface GuardedSimulatorReviewGateIssue {
  id: string;
  checkId: GuardedSimulatorReviewGateCheckId;
  severity: Exclude<GuardedSimulatorReviewGateSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface GuardedSimulatorReviewGateBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface GuardedSimulatorReviewGateTrace {
  sourceSimulatorId: string;
  sourceSimulationValidationStatus: GuardedRealWriteExecutionSimulatorValidationResult['status'];
  sourceExecutionPlanId: string;
  sourceExecutionAuthorizationId: string;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: GuardedRealWriteExecutionSimulator['previewTrace'];
  gateTrace: GuardedRealWriteExecutionSimulator['gateTrace'];
  writerTrace: GuardedRealWriteExecutionSimulator['writerTrace'];
  implementationTrace: GuardedRealWriteExecutionSimulator['implementationTrace'];
  authorizationTrace: GuardedRealWriteExecutionSimulator['authorizationTrace'];
  executionPlanTrace: GuardedRealWriteExecutionSimulator['executionPlanTrace'];
  simulatorTrace: GuardedRealWriteExecutionSimulator['trace'];
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

export interface GuardedSimulatorReviewGateResult {
  gateId: string;
  sourceSimulatorId: string;
  sourceExecutionPlanId: string;
  sourceExecutionAuthorizationId: string;
  status: GuardedSimulatorReviewGateStatus;
  decision: GuardedSimulatorReviewGateDecision;
  checks: GuardedSimulatorReviewGateCheck[];
  issues: GuardedSimulatorReviewGateIssue[];
  blockedReasons: GuardedSimulatorReviewGateBlockedReason[];
  warnings: GuardedSimulatorReviewGateIssue[];
  reviewGateOnly: true;
  dryRunOnly: true;
  noActualRegistryWrite: true;
  noRegistryMutation: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  doesNotCreateProductionWriter: true;
  futureActualWriteRequiresSeparateApproval: true;
  readyForFutureRealWriteApprovalBoundary: boolean;
  trace: GuardedSimulatorReviewGateTrace;
  summary: string;
  jsonRoundTripStable: boolean;
}

export interface GuardedSimulatorReviewGateOverrides {
  dryRunOnly?: boolean;
  actualWriteBlocked?: boolean;
  publishBlocked?: boolean;
  packageReplacementBlocked?: boolean;
  productionWriterBlocked?: boolean;
  registryMutationBlocked?: boolean;
  futureActualWriteRequiresSeparateApproval?: boolean;
  note?: string;
}

const createCheck = (
  id: GuardedSimulatorReviewGateCheckId,
  label: string,
  passed: boolean,
  severity: GuardedSimulatorReviewGateSeverity,
  message: string,
): GuardedSimulatorReviewGateCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

const issueForCheck = (
  check: GuardedSimulatorReviewGateCheck,
  recommendation: string,
): GuardedSimulatorReviewGateIssue | null => {
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

const validationReadyForReviewGate = (
  validation: GuardedRealWriteExecutionSimulatorValidationResult,
): boolean =>
  validation.status === 'simulation_validation_ready' ||
  validation.status === 'simulation_validation_ready_with_warnings';

const validationCheckPassed = (
  validation: GuardedRealWriteExecutionSimulatorValidationResult,
  checkId: string,
): boolean =>
  validation.checks.some((check) => check.id === checkId && check.passed);

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const reviewPayloadText = ({
  simulator,
  note = '',
}: {
  simulator: GuardedRealWriteExecutionSimulator;
  note?: string;
}): string =>
  JSON.stringify({
    preflight: simulator.simulatedPreflight?.summary,
    writeLock: simulator.simulatedWriteLock?.summary,
    operation: simulator.simulatedWriteOperation?.summary,
    operationSteps: simulator.simulatedWriteOperation?.steps.map((step) => ({
      label: step.label,
      status: step.status,
      summary: step.summary,
    })),
    audit: simulator.simulatedAuditEvents.map((event) => ({
      label: event.label,
      summary: event.summary,
    })),
    rollback: simulator.simulatedRollback?.summary,
    failureHandling: simulator.simulatedFailureHandling?.summary,
    summary: simulator.summary,
    operatorNote: note,
  });

const decisionForIssues = (
  issues: readonly GuardedSimulatorReviewGateIssue[],
  hasWarnings: boolean,
): GuardedSimulatorReviewGateDecision => {
  if (issues.length === 0) {
    return hasWarnings
      ? 'keep_as_simulator_review_only'
      : 'eligible_for_future_real_write_approval_boundary';
  }
  if (
    issues.some((issue) =>
      [
        'source_simulation_validation_ready',
        'simulator_is_dry_run_only',
        'registry_mutation_blocked_true',
        'actual_write_blocked_true',
        'publish_blocked_true',
        'package_replacement_blocked_true',
        'production_writer_blocked_true',
        'no_registry_mutation',
        'no_actual_registry_write',
        'no_publish',
        'no_user_app_shell_package_replacement',
        'no_production_writer_creation',
        'future_actual_write_requires_separate_approval',
        'no_raw_image_reference',
        'no_personal_data',
        'no_medical_claims',
        'no_product_shade_claims',
        'no_unsupported_final_claims',
        'no_production_package_marker',
        'json_round_trip_safe',
      ].includes(issue.checkId),
    )
  ) {
    return 'blocked_do_not_execute_real_write';
  }
  if (issues.some((issue) => issue.checkId === 'simulated_preflight_reviewed')) {
    return 'request_simulator_preflight_revision';
  }
  if (issues.some((issue) => issue.checkId === 'simulated_write_lock_reviewed')) {
    return 'request_simulator_lock_revision';
  }
  if (issues.some((issue) => issue.checkId === 'simulated_audit_events_reviewed')) {
    return 'request_simulator_audit_revision';
  }
  if (issues.some((issue) => issue.checkId === 'simulated_rollback_reviewed')) {
    return 'request_simulator_rollback_revision';
  }
  if (
    issues.some((issue) => issue.checkId === 'simulated_failure_handling_reviewed')
  ) {
    return 'request_simulator_failure_handling_revision';
  }
  return 'request_owner_authorization_for_actual_write';
};

export const createGuardedSimulatorReviewGate = ({
  simulator,
  validation,
  gateId = `guarded-simulator-review-gate-${simulator.simulatorId}`,
  overrides = {},
}: {
  simulator: GuardedRealWriteExecutionSimulator;
  validation: GuardedRealWriteExecutionSimulatorValidationResult;
  gateId?: string;
  overrides?: GuardedSimulatorReviewGateOverrides;
}): GuardedSimulatorReviewGateResult => {
  const dryRunOnly = overrides.dryRunOnly ?? simulator.dryRunOnly;
  const actualWriteBlocked =
    overrides.actualWriteBlocked ?? simulator.actualWriteBlocked;
  const publishBlocked = overrides.publishBlocked ?? simulator.publishBlocked;
  const packageReplacementBlocked =
    overrides.packageReplacementBlocked ?? simulator.packageReplacementBlocked;
  const productionWriterBlocked =
    overrides.productionWriterBlocked ?? simulator.productionWriterBlocked;
  const registryMutationBlocked =
    overrides.registryMutationBlocked ?? simulator.registryMutationBlocked;
  const futureActualWriteRequiresSeparateApproval =
    overrides.futureActualWriteRequiresSeparateApproval ?? true;
  const payloadText = reviewPayloadText({
    simulator,
    note: overrides.note,
  });

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
    Boolean(simulator.executionPlanTrace) &&
    Boolean(simulator.trace);
  const simulatedPreflightReviewed =
    Boolean(simulator.simulatedPreflight) &&
    validationCheckPassed(validation, 'simulated_preflight_present');
  const simulatedWriteLockReviewed =
    Boolean(simulator.simulatedWriteLock) &&
    validationCheckPassed(validation, 'simulated_write_lock_present');
  const simulatedWriteOperationReviewed =
    Boolean(simulator.simulatedWriteOperation) &&
    validationCheckPassed(validation, 'simulated_write_operation_present');
  const simulatedAuditEventsReviewed =
    simulator.simulatedAuditEvents.length > 0 &&
    validationCheckPassed(validation, 'simulated_audit_events_present');
  const simulatedRollbackReviewed =
    Boolean(simulator.simulatedRollback) &&
    validationCheckPassed(validation, 'simulated_rollback_present');
  const simulatedFailureHandlingReviewed =
    Boolean(simulator.simulatedFailureHandling) &&
    validationCheckPassed(validation, 'simulated_failure_handling_present');

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
    actualWriteBlocked &&
    simulator.noActualRegistryWrite &&
    simulator.trace.noActualRegistryWrite &&
    validationCheckPassed(validation, 'no_actual_registry_write') &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noRegistryMutation =
    registryMutationBlocked &&
    simulator.noRegistryMutation &&
    simulator.trace.noRegistryMutation &&
    validationCheckPassed(validation, 'no_registry_mutation') &&
    !registryMutationMarkerPattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    packageReplacementBlocked &&
    simulator.noUserAppShellPackageReplacement &&
    simulator.trace.noUserAppShellPackageReplacement &&
    validationCheckPassed(validation, 'no_user_app_shell_package_replacement') &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    simulator.notProductionPackage &&
    simulator.trace.noProductionPackageMarker &&
    validationCheckPassed(validation, 'no_production_package_marker') &&
    !registryPreparationProductionMarkerPattern.test(payloadText);
  const noProductionWriterCreation =
    productionWriterBlocked &&
    simulator.notProductionWriter &&
    simulator.doesNotCreateProductionWriter &&
    simulator.trace.noProductionWriterCreation &&
    validationCheckPassed(validation, 'no_production_writer_creation') &&
    !productionWriterCreationMarkerPattern.test(payloadText);
  const jsonRoundTripStable =
    simulator.jsonRoundTripStable &&
    validation.jsonRoundTripStable &&
    isJsonRoundTripStable(simulator) &&
    isJsonRoundTripStable(validation);

  const checks: GuardedSimulatorReviewGateCheck[] = [
    createCheck(
      'source_simulation_validation_ready',
      'Source simulation validation ready',
      validationReadyForReviewGate(validation),
      'blocking',
      'Guarded simulator review gate requires Phase 10S simulation validation ready or ready-with-warnings.',
    ),
    createCheck(
      'simulator_is_dry_run_only',
      'Simulator is dry-run only',
      dryRunOnly && simulator.simulatorOnly,
      'blocking',
      'Simulator review gate must remain dry-run-only and review-gate-only.',
    ),
    createCheck(
      'registry_mutation_blocked_true',
      'Registry mutation blocked true',
      registryMutationBlocked,
      'blocking',
      'Simulator review gate must keep registry mutation blocked.',
    ),
    createCheck(
      'actual_write_blocked_true',
      'Actual write blocked true',
      actualWriteBlocked,
      'blocking',
      'Simulator review gate must keep actual registry writes blocked.',
    ),
    createCheck(
      'publish_blocked_true',
      'Publish blocked true',
      publishBlocked,
      'blocking',
      'Simulator review gate must keep publication blocked.',
    ),
    createCheck(
      'package_replacement_blocked_true',
      'Package replacement blocked true',
      packageReplacementBlocked,
      'blocking',
      'Simulator review gate must not replace the current User App Shell package.',
    ),
    createCheck(
      'production_writer_blocked_true',
      'Production writer blocked true',
      productionWriterBlocked,
      'blocking',
      'Simulator review gate must not create a production writer.',
    ),
    createCheck(
      'simulated_preflight_reviewed',
      'Simulated preflight reviewed',
      simulatedPreflightReviewed,
      'blocking',
      'Review gate requires simulated preflight review evidence.',
    ),
    createCheck(
      'simulated_write_lock_reviewed',
      'Simulated write lock reviewed',
      simulatedWriteLockReviewed,
      'blocking',
      'Review gate requires simulated write lock review evidence.',
    ),
    createCheck(
      'simulated_write_operation_reviewed',
      'Simulated write operation reviewed',
      simulatedWriteOperationReviewed,
      'blocking',
      'Review gate requires simulated write operation review evidence.',
    ),
    createCheck(
      'simulated_audit_events_reviewed',
      'Simulated audit events reviewed',
      simulatedAuditEventsReviewed,
      'blocking',
      'Review gate requires simulated audit event review evidence.',
    ),
    createCheck(
      'simulated_rollback_reviewed',
      'Simulated rollback reviewed',
      simulatedRollbackReviewed,
      'blocking',
      'Review gate requires simulated rollback review evidence.',
    ),
    createCheck(
      'simulated_failure_handling_reviewed',
      'Simulated failure handling reviewed',
      simulatedFailureHandlingReviewed,
      'blocking',
      'Review gate requires simulated failure handling review evidence.',
    ),
    createCheck(
      'no_registry_mutation',
      'No registry mutation',
      noRegistryMutation,
      'blocking',
      'Review gate must not include registry mutation markers.',
    ),
    createCheck(
      'no_actual_registry_write',
      'No actual registry write',
      noActualRegistryWrite,
      'blocking',
      'Review gate must not execute, persist, or mark actual registry writes.',
    ),
    createCheck(
      'no_publish',
      'No publish',
      publishBlocked && simulator.notPublished,
      'blocking',
      'Review gate must not publish to the user app.',
    ),
    createCheck(
      'no_user_app_shell_package_replacement',
      'No User App Shell package replacement',
      noUserAppShellPackageReplacement,
      'blocking',
      'Review gate must not replace the current User App Shell package.',
    ),
    createCheck(
      'no_production_writer_creation',
      'No production writer creation',
      noProductionWriterCreation,
      'blocking',
      'Review gate must not create or mark a production writer.',
    ),
    createCheck(
      'future_actual_write_requires_separate_approval',
      'Future actual write requires separate approval',
      futureActualWriteRequiresSeparateApproval,
      'blocking',
      'Future actual write must require separate explicit owner approval.',
    ),
    createCheck(
      'trace_preserved',
      'Trace preserved',
      tracePreserved,
      'blocking',
      'Review gate requires QA, human review, candidate, contract, preview, gate, writer, implementation, authorization, execution plan, and simulator trace.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      noRawImageReference,
      'blocking',
      'Review gate must not include raw image references.',
    ),
    createCheck(
      'no_personal_data',
      'No personal data',
      noPersonalData,
      'blocking',
      'Review gate must not include personal or sensitive data.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      noMedicalClaims,
      'blocking',
      'Review gate must not include medical claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      noProductShadeClaims,
      'blocking',
      'Review gate must not include product shade claims.',
    ),
    createCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      noUnsupportedFinalClaims,
      'blocking',
      'Review gate must not include final recognition, final approval, or AI confirmation claims.',
    ),
    createCheck(
      'no_production_package_marker',
      'No production package marker',
      noProductionPackageMarker,
      'blocking',
      'Review gate must not include production package markers.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'blocking',
      'Review gate must be JSON round-trip stable.',
    ),
  ];

  const recommendationsByCheck: Record<
    GuardedSimulatorReviewGateCheckId,
    string
  > = {
    source_simulation_validation_ready:
      'Return to Phase 10S and resolve simulator validation first.',
    simulator_is_dry_run_only:
      'Restore dryRunOnly and simulator-only review behavior.',
    registry_mutation_blocked_true:
      'Restore registryMutationBlocked before review can continue.',
    actual_write_blocked_true:
      'Restore actualWriteBlocked and remove real registry write markers.',
    publish_blocked_true: 'Restore publishBlocked and keep publication out of scope.',
    package_replacement_blocked_true:
      'Restore packageReplacementBlocked and preserve the current User App Shell package.',
    production_writer_blocked_true:
      'Restore productionWriterBlocked and keep production writer creation out of scope.',
    simulated_preflight_reviewed:
      'Review or revise simulated preflight evidence.',
    simulated_write_lock_reviewed:
      'Review or revise simulated write lock evidence.',
    simulated_write_operation_reviewed:
      'Review or revise simulated write operation evidence.',
    simulated_audit_events_reviewed:
      'Review or revise simulated audit event evidence.',
    simulated_rollback_reviewed:
      'Review or revise simulated rollback evidence.',
    simulated_failure_handling_reviewed:
      'Review or revise simulated failure handling evidence.',
    no_registry_mutation:
      'Remove registry mutation markers and keep the gate non-mutating.',
    no_actual_registry_write:
      'Remove actual registry write markers and keep the gate review-only.',
    no_publish: 'Remove publish markers and keep the gate unpublished.',
    no_user_app_shell_package_replacement:
      'Remove current User App Shell package replacement markers.',
    no_production_writer_creation:
      'Remove production writer creation or readiness markers.',
    future_actual_write_requires_separate_approval:
      'Restore separate owner approval requirement before any future actual write.',
    trace_preserved:
      'Restore complete simulator and upstream trace evidence.',
    no_raw_image_reference:
      'Remove object URLs, base64, local paths, and runtime asset references.',
    no_personal_data:
      'Remove personal, contact, health, sensitive identity, biometric, or camera data.',
    no_medical_claims: 'Remove treatment, diagnosis, or medical-effect wording.',
    no_product_shade_claims:
      'Keep product references generic and placeholder-only.',
    no_unsupported_final_claims:
      'Remove final recognition, final approval, and AI confirmation wording.',
    no_production_package_marker:
      'Remove production package and production readiness markers.',
    json_round_trip_safe: 'Remove non-serializable values before handoff.',
  };

  const issues = checks
    .map((check) => issueForCheck(check, recommendationsByCheck[check.id]))
    .filter((issue): issue is GuardedSimulatorReviewGateIssue => Boolean(issue));
  const warnings = issues.filter((issue) => issue.severity === 'warning');
  const hasWarnings =
    validation.status === 'simulation_validation_ready_with_warnings' ||
    simulator.simulationStatus === 'simulation_ready_with_warnings' ||
    warnings.length > 0;
  const status: GuardedSimulatorReviewGateStatus =
    simulator.simulationStatus === 'simulation_example_only'
      ? 'simulator_review_gate_example_only'
      : issues.some((issue) => issue.severity === 'blocking')
        ? 'simulator_review_gate_blocked'
        : hasWarnings
          ? 'simulator_review_gate_ready_with_warnings'
          : 'simulator_review_gate_ready';
  const decision = decisionForIssues(issues, hasWarnings);
  const gate: GuardedSimulatorReviewGateResult = {
    gateId,
    sourceSimulatorId: simulator.simulatorId,
    sourceExecutionPlanId: simulator.sourceExecutionPlanId,
    sourceExecutionAuthorizationId: simulator.sourceExecutionAuthorizationId,
    status,
    decision,
    checks,
    issues,
    blockedReasons: issues
      .filter((issue) => issue.severity === 'blocking')
      .map((issue) => ({
        id: issue.checkId,
        message: issue.message,
        recommendation: issue.recommendation,
      })),
    warnings,
    reviewGateOnly: true,
    dryRunOnly: true,
    noActualRegistryWrite: true,
    noRegistryMutation: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    doesNotCreateProductionWriter: true,
    futureActualWriteRequiresSeparateApproval: true,
    readyForFutureRealWriteApprovalBoundary:
      status === 'simulator_review_gate_ready' &&
      decision === 'eligible_for_future_real_write_approval_boundary',
    trace: {
      sourceSimulatorId: simulator.simulatorId,
      sourceSimulationValidationStatus: validation.status,
      sourceExecutionPlanId: simulator.sourceExecutionPlanId,
      sourceExecutionAuthorizationId: simulator.sourceExecutionAuthorizationId,
      qaTrace: simulator.qaTrace,
      humanReviewTrace: simulator.humanReviewTrace,
      candidateTrace: simulator.candidateTrace,
      contractTrace: simulator.contractTrace,
      previewTrace: simulator.previewTrace,
      gateTrace: simulator.gateTrace,
      writerTrace: simulator.writerTrace,
      implementationTrace: simulator.implementationTrace,
      authorizationTrace: simulator.authorizationTrace,
      executionPlanTrace: simulator.executionPlanTrace,
      simulatorTrace: simulator.trace,
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
    },
    summary:
      'Guarded simulator review gate reviews Phase 10S simulation evidence only; it cannot execute a registry write, mutate registry state, publish, replace the current User App Shell package, or create a production writer.',
    jsonRoundTripStable: true,
  };
  gate.jsonRoundTripStable = jsonRoundTripStable && isJsonRoundTripStable(gate);
  if (!gate.jsonRoundTripStable) {
    const jsonCheck = gate.checks.find((check) => check.id === 'json_round_trip_safe');
    if (jsonCheck) {
      jsonCheck.passed = false;
    }
  }
  return gate;
};
