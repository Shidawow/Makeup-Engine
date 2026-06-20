import type { RealWriteExecutionPlan } from './realWriteExecutionPlan';
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

export type RealWriteExecutionPlanValidationSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type RealWriteExecutionPlanValidationStatus =
  | 'execution_plan_validation_ready'
  | 'execution_plan_validation_ready_with_warnings'
  | 'execution_plan_validation_blocked';

export type RealWriteExecutionPlanValidationCheckId =
  | 'source_execution_authorization_ready'
  | 'dry_run_only_true'
  | 'actual_write_blocked_true'
  | 'publish_blocked_true'
  | 'package_replacement_blocked_true'
  | 'production_writer_blocked_true'
  | 'execution_sequence_plan_present'
  | 'preflight_plan_present'
  | 'write_lock_plan_present'
  | 'audit_plan_present'
  | 'rollback_plan_present'
  | 'failure_handling_plan_present'
  | 'dry_run_verification_plan_present'
  | 'trace_preserved'
  | 'no_raw_image_reference'
  | 'no_personal_data'
  | 'no_medical_claims'
  | 'no_product_shade_claims'
  | 'no_unsupported_final_claims'
  | 'no_actual_registry_write'
  | 'no_user_app_shell_package_replacement'
  | 'no_production_package_marker'
  | 'no_production_writer_creation'
  | 'json_round_trip_safe';

export interface RealWriteExecutionPlanValidationCheck {
  id: RealWriteExecutionPlanValidationCheckId;
  label: string;
  passed: boolean;
  severity: RealWriteExecutionPlanValidationSeverity;
  message: string;
}

export interface RealWriteExecutionPlanValidationIssue {
  id: string;
  checkId: RealWriteExecutionPlanValidationCheckId;
  severity: Exclude<RealWriteExecutionPlanValidationSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface RealWriteExecutionPlanValidationRecommendation {
  id: string;
  message: string;
  action:
    | 'continue_to_guarded_execution_simulator'
    | 'request_execution_sequence_revision'
    | 'request_preflight_revision'
    | 'request_write_lock_revision'
    | 'request_audit_plan_revision'
    | 'request_rollback_plan_revision'
    | 'request_failure_handling_revision'
    | 'request_owner_authorization_for_actual_write'
    | 'keep_as_execution_plan_only'
    | 'block_real_write_execution';
}

export interface RealWriteExecutionPlanValidationResult {
  status: RealWriteExecutionPlanValidationStatus;
  checks: RealWriteExecutionPlanValidationCheck[];
  issues: RealWriteExecutionPlanValidationIssue[];
  recommendations: RealWriteExecutionPlanValidationRecommendation[];
  readyForFutureGuardedExecutionSimulator: boolean;
  executionPlanOnly: true;
  dryRunOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  doesNotCreateProductionWriter: true;
  jsonRoundTripStable: boolean;
}

const productionWriterCreationPattern =
  /productionWriterCreated|createProductionWriter|productionWriter\s*:\s*true|已创建 production writer|production_writer_ready/i;

const createCheck = (
  id: RealWriteExecutionPlanValidationCheckId,
  label: string,
  passed: boolean,
  severity: RealWriteExecutionPlanValidationSeverity,
  message: string,
): RealWriteExecutionPlanValidationCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

const issueForCheck = (
  check: RealWriteExecutionPlanValidationCheck,
  recommendation: string,
): RealWriteExecutionPlanValidationIssue | null => {
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

const validationPayloadText = (plan: RealWriteExecutionPlan): string =>
  JSON.stringify({
    executionSequencePlan: plan.executionSequencePlan.map((step) => ({
      label: step.label,
      status: step.status,
      summary: step.summary,
    })),
    preflight: plan.preflightPlan?.summary,
    locks: plan.writeLockPlan?.locks.map((lock) => ({
      label: lock.label,
      note: lock.note,
    })),
    audit: plan.auditPlan?.events.map((event) => ({
      label: event.label,
      summary: event.summary,
    })),
    rollback: plan.rollbackPlan?.steps.map((step) => ({
      label: step.label,
      summary: step.summary,
    })),
    failures: plan.failureHandlingPlan?.handlers.map((handler) => ({
      label: handler.label,
      summary: handler.summary,
    })),
    verification: plan.dryRunVerificationPlan?.checks.map((check) => ({
      label: check.label,
      summary: check.summary,
    })),
    summary: plan.summary,
  });

const sourceAuthorizationReady = (plan: RealWriteExecutionPlan): boolean =>
  plan.trace.source.sourceReadyForExecutionPlan &&
  (plan.executionPlanStatus === 'execution_plan_ready' ||
    plan.executionPlanStatus === 'execution_plan_ready_with_warnings');

const actionForIssues = (
  issues: readonly RealWriteExecutionPlanValidationIssue[],
  hasWarnings: boolean,
): RealWriteExecutionPlanValidationRecommendation['action'] => {
  if (issues.length === 0) {
    return hasWarnings
      ? 'keep_as_execution_plan_only'
      : 'continue_to_guarded_execution_simulator';
  }
  if (
    issues.some((issue) =>
      [
        'source_execution_authorization_ready',
        'dry_run_only_true',
        'actual_write_blocked_true',
        'publish_blocked_true',
        'package_replacement_blocked_true',
        'production_writer_blocked_true',
        'no_actual_registry_write',
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
  if (issues.some((issue) => issue.checkId === 'execution_sequence_plan_present')) {
    return 'request_execution_sequence_revision';
  }
  if (issues.some((issue) => issue.checkId === 'preflight_plan_present')) {
    return 'request_preflight_revision';
  }
  if (issues.some((issue) => issue.checkId === 'write_lock_plan_present')) {
    return 'request_write_lock_revision';
  }
  if (issues.some((issue) => issue.checkId === 'audit_plan_present')) {
    return 'request_audit_plan_revision';
  }
  if (issues.some((issue) => issue.checkId === 'rollback_plan_present')) {
    return 'request_rollback_plan_revision';
  }
  if (issues.some((issue) => issue.checkId === 'failure_handling_plan_present')) {
    return 'request_failure_handling_revision';
  }
  return 'request_owner_authorization_for_actual_write';
};

export const validateRealWriteExecutionPlan = (
  plan: RealWriteExecutionPlan,
): RealWriteExecutionPlanValidationResult => {
  const payloadText = validationPayloadText(plan);
  const tracePreserved =
    plan.qaTrace.trim().length > 0 &&
    plan.humanReviewTrace.trim().length > 0 &&
    plan.candidateTrace.trim().length > 0 &&
    plan.contractTrace.trim().length > 0 &&
    Boolean(plan.previewTrace) &&
    Boolean(plan.gateTrace) &&
    Boolean(plan.writerTrace) &&
    Boolean(plan.implementationTrace) &&
    Boolean(plan.authorizationTrace);
  const executionSequencePlanPresent =
    plan.executionSequencePlan.length > 0 &&
    plan.executionSequencePlan.every(
      (step) => step.dryRunOnly && step.actualMutationBlocked,
    );
  const preflightPlanPresent =
    Boolean(plan.preflightPlan) &&
    plan.preflightPlan?.dryRunOnly === true &&
    plan.preflightPlan.checks.length > 0 &&
    plan.preflightPlan.checks.every(
      (check) => check.required && check.status !== 'blocked',
    );
  const writeLockPlanPresent =
    Boolean(plan.writeLockPlan) &&
    plan.writeLockPlan?.dryRunOnly === true &&
    plan.writeLockPlan?.actualLockAcquisitionBlocked === true &&
    plan.writeLockPlan.locks.length > 0 &&
    plan.writeLockPlan.locks.every(
      (lock) => lock.required && lock.status !== 'blocked',
    );
  const auditPlanPresent =
    Boolean(plan.auditPlan) &&
    plan.auditPlan?.dryRunOnly === true &&
    plan.auditPlan?.actualWriteAuditOnly === true &&
    plan.auditPlan.events.length > 0;
  const rollbackPlanPresent =
    Boolean(plan.rollbackPlan) &&
    plan.rollbackPlan?.dryRunOnly === true &&
    plan.rollbackPlan?.actualRollbackBlocked === true &&
    plan.rollbackPlan.steps.length > 0 &&
    plan.rollbackPlan.steps.every((step) => step.actualMutationBlocked);
  const failureHandlingPlanPresent =
    Boolean(plan.failureHandlingPlan) &&
    plan.failureHandlingPlan?.dryRunOnly === true &&
    plan.failureHandlingPlan?.actualRecoveryMutationBlocked === true &&
    plan.failureHandlingPlan.handlers.length > 0 &&
    plan.failureHandlingPlan.handlers.every(
      (handler) => handler.required && handler.status !== 'blocked',
    );
  const dryRunVerificationPlanPresent =
    Boolean(plan.dryRunVerificationPlan) &&
    plan.dryRunVerificationPlan?.dryRunOnly === true &&
    plan.dryRunVerificationPlan?.actualWriteBlocked === true &&
    plan.dryRunVerificationPlan.checks.length > 0 &&
    plan.dryRunVerificationPlan.checks.every(
      (check) => check.required && check.status !== 'blocked',
    );
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
    plan.actualWriteBlocked &&
    plan.noActualRegistryWrite &&
    plan.trace.noActualRegistryWrite &&
    executionSequencePlanPresent &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    plan.packageReplacementBlocked &&
    plan.noUserAppShellPackageReplacement &&
    plan.trace.noUserAppShellPackageReplacement &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    plan.notProductionPackage &&
    plan.trace.noProductionPackageMarker &&
    !registryPreparationProductionMarkerPattern.test(payloadText);
  const noProductionWriterCreation =
    plan.productionWriterBlocked &&
    plan.notProductionWriter &&
    plan.doesNotCreateProductionWriter &&
    plan.trace.noProductionWriterCreation &&
    !productionWriterCreationPattern.test(payloadText);
  const jsonRoundTripStable =
    plan.jsonRoundTripStable && isJsonRoundTripStable(plan);

  const checks: RealWriteExecutionPlanValidationCheck[] = [
    createCheck(
      'source_execution_authorization_ready',
      'Source execution authorization ready',
      sourceAuthorizationReady(plan),
      'blocking',
      'Execution plan validation requires a ready Phase 10Q execution authorization.',
    ),
    createCheck(
      'dry_run_only_true',
      'Dry-run only true',
      plan.dryRunOnly,
      'blocking',
      'Execution plan must keep dryRunOnly true.',
    ),
    createCheck(
      'actual_write_blocked_true',
      'Actual write blocked true',
      plan.actualWriteBlocked,
      'blocking',
      'Execution plan must keep actual registry writes blocked.',
    ),
    createCheck(
      'publish_blocked_true',
      'Publish blocked true',
      plan.publishBlocked,
      'blocking',
      'Execution plan must keep publication blocked.',
    ),
    createCheck(
      'package_replacement_blocked_true',
      'Package replacement blocked true',
      plan.packageReplacementBlocked,
      'blocking',
      'Execution plan must not replace the current User App Shell package.',
    ),
    createCheck(
      'production_writer_blocked_true',
      'Production writer blocked true',
      plan.productionWriterBlocked,
      'blocking',
      'Execution plan must not create a production writer.',
    ),
    createCheck(
      'execution_sequence_plan_present',
      'Execution sequence plan present',
      executionSequencePlanPresent,
      'blocking',
      'Execution plan requires dry-run-only execution sequence steps.',
    ),
    createCheck(
      'preflight_plan_present',
      'Preflight plan present',
      preflightPlanPresent,
      'blocking',
      'Execution plan requires a preflight plan.',
    ),
    createCheck(
      'write_lock_plan_present',
      'Write lock plan present',
      writeLockPlanPresent,
      'blocking',
      'Execution plan requires a write lock plan.',
    ),
    createCheck(
      'audit_plan_present',
      'Audit plan present',
      auditPlanPresent,
      'blocking',
      'Execution plan requires an audit plan.',
    ),
    createCheck(
      'rollback_plan_present',
      'Rollback plan present',
      rollbackPlanPresent,
      'blocking',
      'Execution plan requires a rollback plan.',
    ),
    createCheck(
      'failure_handling_plan_present',
      'Failure handling plan present',
      failureHandlingPlanPresent,
      'blocking',
      'Execution plan requires a failure handling plan.',
    ),
    createCheck(
      'dry_run_verification_plan_present',
      'Dry-run verification plan present',
      dryRunVerificationPlanPresent,
      'blocking',
      'Execution plan requires a dry-run verification plan.',
    ),
    createCheck(
      'trace_preserved',
      'Trace preserved',
      tracePreserved,
      'blocking',
      'Execution plan requires QA, human review, candidate, contract, preview, gate, writer, implementation, and authorization trace.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      noRawImageReference,
      'blocking',
      'Execution plan must not include raw image references.',
    ),
    createCheck(
      'no_personal_data',
      'No personal data',
      noPersonalData,
      'blocking',
      'Execution plan must not include personal or sensitive data.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      noMedicalClaims,
      'blocking',
      'Execution plan must not include medical claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      noProductShadeClaims,
      'blocking',
      'Execution plan must not include product shade claims.',
    ),
    createCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      noUnsupportedFinalClaims,
      'blocking',
      'Execution plan must not include final recognition, final approval, or AI confirmation claims.',
    ),
    createCheck(
      'no_actual_registry_write',
      'No actual registry write',
      noActualRegistryWrite,
      'blocking',
      'Execution plan must not execute, persist, or mark actual registry writes.',
    ),
    createCheck(
      'no_user_app_shell_package_replacement',
      'No User App Shell package replacement',
      noUserAppShellPackageReplacement,
      'blocking',
      'Execution plan must not replace the current User App Shell package.',
    ),
    createCheck(
      'no_production_package_marker',
      'No production package marker',
      noProductionPackageMarker,
      'blocking',
      'Execution plan must not include production package markers.',
    ),
    createCheck(
      'no_production_writer_creation',
      'No production writer creation',
      noProductionWriterCreation,
      'blocking',
      'Execution plan must not create or mark a production writer.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'blocking',
      'Execution plan must be JSON round-trip stable.',
    ),
  ];
  const recommendationsByCheck: Record<RealWriteExecutionPlanValidationCheckId, string> = {
    source_execution_authorization_ready:
      'Return to Phase 10Q and resolve execution authorization readiness first.',
    dry_run_only_true: 'Restore dryRunOnly before execution planning can continue.',
    actual_write_blocked_true:
      'Restore actualWriteBlocked and remove registry write execution markers.',
    publish_blocked_true: 'Restore publishBlocked and keep publication out of scope.',
    package_replacement_blocked_true:
      'Restore packageReplacementBlocked and preserve the current User App Shell package.',
    production_writer_blocked_true:
      'Restore productionWriterBlocked and keep production writer creation out of scope.',
    execution_sequence_plan_present:
      'Add dry-run-only execution sequence steps.',
    preflight_plan_present:
      'Add a preflight plan covering source authorization, trace, and safety flags.',
    write_lock_plan_present:
      'Add write lock planning before any future guarded simulator.',
    audit_plan_present: 'Add audit plan events before handoff.',
    rollback_plan_present:
      'Add rollback planning before any future guarded simulator.',
    failure_handling_plan_present:
      'Add failure handling stop conditions and review actions.',
    dry_run_verification_plan_present:
      'Add dry-run verification checks for no write/no publish/no replacement/no production writer.',
    trace_preserved:
      'Restore QA, human review, candidate, contract, preview, gate, writer, implementation, and authorization traces.',
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
      'Remove actual registry write markers and keep Phase 10R plan-only.',
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
    .filter((issue): issue is RealWriteExecutionPlanValidationIssue =>
      Boolean(issue),
    );
  const hasWarnings =
    plan.executionPlanStatus === 'execution_plan_ready_with_warnings' ||
    checks.some((check) => !check.passed && check.severity === 'warning');
  const status: RealWriteExecutionPlanValidationStatus =
    issues.some((issue) => issue.severity === 'blocking')
      ? 'execution_plan_validation_blocked'
      : hasWarnings
        ? 'execution_plan_validation_ready_with_warnings'
        : 'execution_plan_validation_ready';
  const action = actionForIssues(issues, hasWarnings);
  return {
    status,
    checks,
    issues,
    recommendations: [
      {
        id: `${action}-recommendation`,
        message:
          action === 'continue_to_guarded_execution_simulator'
            ? 'Execution plan can hand off to a future guarded execution simulator. This is not actual write readiness.'
            : 'Execution plan needs revision or must remain plan-only before any future simulator.',
        action,
      },
    ],
    readyForFutureGuardedExecutionSimulator:
      status === 'execution_plan_validation_ready' &&
      plan.readyForFutureGuardedExecutionSimulator,
    executionPlanOnly: true,
    dryRunOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    doesNotCreateProductionWriter: true,
    jsonRoundTripStable,
  };
};
