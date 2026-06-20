import type {
  ControlledRegistryWriteExecutionDesign,
  ControlledRegistryWriteExecutionPreflightId,
} from './controlledRegistryWriteExecutionDesign';
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

export type ControlledRegistryWriteExecutionValidationSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type ControlledRegistryWriteExecutionValidationStatus =
  | 'execution_validation_ready'
  | 'execution_validation_ready_with_warnings'
  | 'execution_validation_blocked';

export type ControlledRegistryWriteExecutionValidationCheckId =
  | 'source_authorization_gate_ready'
  | 'dry_run_only_true'
  | 'actual_write_blocked_true'
  | 'publish_blocked_true'
  | 'package_replacement_blocked_true'
  | 'execution_mode_is_design_only'
  | 'audit_plan_present'
  | 'rollback_design_present'
  | 'write_lock_requirements_present'
  | 'owner_authorization_trace_present'
  | 'trace_preserved'
  | 'no_raw_image_reference'
  | 'no_personal_data'
  | 'no_medical_claims'
  | 'no_product_shade_claims'
  | 'no_unsupported_final_claims'
  | 'no_actual_registry_write'
  | 'no_user_app_shell_package_replacement'
  | 'no_production_package_marker'
  | 'json_round_trip_safe';

export interface ControlledRegistryWriteExecutionValidationCheck {
  id: ControlledRegistryWriteExecutionValidationCheckId;
  label: string;
  passed: boolean;
  severity: ControlledRegistryWriteExecutionValidationSeverity;
  message: string;
}

export interface ControlledRegistryWriteExecutionValidationIssue {
  id: string;
  checkId: ControlledRegistryWriteExecutionValidationCheckId;
  severity: Exclude<ControlledRegistryWriteExecutionValidationSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface ControlledRegistryWriteExecutionValidationRecommendation {
  id: string;
  message: string;
  action:
    | 'continue_to_real_write_implementation_gate'
    | 'request_execution_plan_revision'
    | 'request_audit_plan_revision'
    | 'request_rollback_design_revision'
    | 'request_write_lock_review'
    | 'request_owner_authorization_review'
    | 'keep_as_execution_design_only'
    | 'block_real_write_implementation';
}

export interface ControlledRegistryWriteExecutionValidationResult {
  status: ControlledRegistryWriteExecutionValidationStatus;
  checks: ControlledRegistryWriteExecutionValidationCheck[];
  issues: ControlledRegistryWriteExecutionValidationIssue[];
  recommendations: ControlledRegistryWriteExecutionValidationRecommendation[];
  readyForRealWriteImplementationGate: boolean;
  executionDesignOnly: true;
  dryRunOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionPackage: true;
  jsonRoundTripStable: boolean;
}

const createCheck = (
  id: ControlledRegistryWriteExecutionValidationCheckId,
  label: string,
  passed: boolean,
  severity: ControlledRegistryWriteExecutionValidationSeverity,
  message: string,
): ControlledRegistryWriteExecutionValidationCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

const issueForCheck = (
  check: ControlledRegistryWriteExecutionValidationCheck,
  recommendation: string,
): ControlledRegistryWriteExecutionValidationIssue | null => {
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
  design: ControlledRegistryWriteExecutionDesign,
): string =>
  JSON.stringify({
    executionDesignId: design.executionDesignId,
    sourceAuthorizationGateId: design.sourceAuthorizationGateId,
    executionMode: design.executionMode,
    plannedExecutionSteps: design.plannedExecutionSteps.map((step) => ({
      label: step.label,
      status: step.status,
      summary: step.summary,
    })),
    auditItems: design.auditPlan?.items.map((item) => ({
      label: item.label,
      summary: item.summary,
    })),
    rollbackSteps: design.rollbackExecutionDesign?.steps,
    writeLockRequirements: design.writeLockRequirements.map((requirement) => ({
      label: requirement.label,
      note: requirement.note,
    })),
    summary: design.summary,
  });

const actionForIssues = (
  issues: readonly ControlledRegistryWriteExecutionValidationIssue[],
  hasWarnings: boolean,
): ControlledRegistryWriteExecutionValidationRecommendation['action'] => {
  if (issues.length === 0) {
    return hasWarnings
      ? 'keep_as_execution_design_only'
      : 'continue_to_real_write_implementation_gate';
  }
  if (
    issues.some((issue) =>
      [
        'source_authorization_gate_ready',
        'dry_run_only_true',
        'actual_write_blocked_true',
        'publish_blocked_true',
        'package_replacement_blocked_true',
        'execution_mode_is_design_only',
        'no_actual_registry_write',
        'no_user_app_shell_package_replacement',
        'no_production_package_marker',
        'json_round_trip_safe',
      ].includes(issue.checkId),
    )
  ) {
    return 'block_real_write_implementation';
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
    return 'block_real_write_implementation';
  }
  if (issues.some((issue) => issue.checkId === 'audit_plan_present')) {
    return 'request_audit_plan_revision';
  }
  if (issues.some((issue) => issue.checkId === 'rollback_design_present')) {
    return 'request_rollback_design_revision';
  }
  if (issues.some((issue) => issue.checkId === 'write_lock_requirements_present')) {
    return 'request_write_lock_review';
  }
  if (issues.some((issue) => issue.checkId === 'owner_authorization_trace_present')) {
    return 'request_owner_authorization_review';
  }
  return 'request_execution_plan_revision';
};

const preflightPassed = (
  design: ControlledRegistryWriteExecutionDesign,
  id: ControlledRegistryWriteExecutionPreflightId,
): boolean => design.preflightChecks.some((check) => check.id === id && check.passed);

export const validateControlledRegistryWriteExecutionDesign = (
  design: ControlledRegistryWriteExecutionDesign,
): ControlledRegistryWriteExecutionValidationResult => {
  const payloadText = validationPayloadText(design);
  const tracePreserved =
    design.qaTrace.trim().length > 0 &&
    design.humanReviewTrace.trim().length > 0 &&
    design.candidateTrace.trim().length > 0 &&
    design.contractTrace.trim().length > 0 &&
    Boolean(design.previewTrace) &&
    Boolean(design.gateTrace) &&
    Boolean(design.writerTrace) &&
    Boolean(design.authorizationTrace);
  const jsonRoundTripStable =
    design.jsonRoundTripStable && isJsonRoundTripStable(design);
  const noRawImageReference =
    design.trace.noRawImageReference &&
    preflightPassed(design, 'no_raw_image_reference') &&
    !registryPreparationRawImageReferencePattern.test(payloadText);
  const noPersonalData =
    design.trace.noPersonalData &&
    preflightPassed(design, 'no_personal_data') &&
    !registryPreparationPersonalDataPattern.test(payloadText);
  const noMedicalClaims =
    design.trace.noMedicalClaims &&
    preflightPassed(design, 'no_medical_claims') &&
    !registryPreparationMedicalClaimPattern.test(payloadText);
  const noProductShadeClaims =
    design.trace.noProductShadeClaims &&
    preflightPassed(design, 'no_product_shade_claims') &&
    !registryPreparationShadeClaimPattern.test(payloadText);
  const noUnsupportedFinalClaims =
    design.trace.noUnsupportedFinalClaims &&
    preflightPassed(design, 'no_unsupported_final_claims') &&
    !registryPreparationFinalClaimPattern.test(payloadText);
  const noActualRegistryWrite =
    design.actualWriteBlocked &&
    design.noActualRegistryWrite &&
    design.trace.noActualRegistryWrite &&
    preflightPassed(design, 'no_actual_registry_write') &&
    design.plannedExecutionSteps.every((step) => step.actualMutationBlocked) &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    design.packageReplacementBlocked &&
    design.noUserAppShellPackageReplacement &&
    design.trace.noUserAppShellPackageReplacement &&
    preflightPassed(design, 'no_user_app_shell_package_replacement') &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    design.notProductionPackage &&
    design.trace.noProductionPackageMarker &&
    preflightPassed(design, 'no_production_package_marker') &&
    !registryPreparationProductionMarkerPattern.test(payloadText);

  const checks: ControlledRegistryWriteExecutionValidationCheck[] = [
    createCheck(
      'source_authorization_gate_ready',
      'Source authorization gate ready',
      design.trace.source.sourceReadyForExecutionDesign &&
        preflightPassed(design, 'authorization_gate_ready'),
      'blocking',
      'Execution validation requires a ready Phase 10L explicit authorization gate.',
    ),
    createCheck(
      'dry_run_only_true',
      'Dry-run only flag true',
      design.dryRunOnly &&
        design.plannedExecutionSteps.every((step) => step.dryRunOnly) &&
        preflightPassed(design, 'dry_run_only_true'),
      'blocking',
      'Execution validation must keep dryRunOnly true.',
    ),
    createCheck(
      'actual_write_blocked_true',
      'Actual write blocked flag true',
      design.actualWriteBlocked &&
        design.plannedExecutionSteps.every((step) => step.actualMutationBlocked) &&
        preflightPassed(design, 'actual_write_blocked_true'),
      'blocking',
      'Execution validation must block actual registry writes.',
    ),
    createCheck(
      'publish_blocked_true',
      'Publish blocked flag true',
      design.publishBlocked && design.notPublished,
      'blocking',
      'Execution validation must keep publish blocked.',
    ),
    createCheck(
      'package_replacement_blocked_true',
      'Package replacement blocked flag true',
      design.packageReplacementBlocked && design.noUserAppShellPackageReplacement,
      'blocking',
      'Execution validation must block current User App Shell package replacement.',
    ),
    createCheck(
      'execution_mode_is_design_only',
      'Execution mode is design-only',
      design.executionMode === 'dry_run_design',
      'blocking',
      'Execution validation requires design-only / dry-run mode.',
    ),
    createCheck(
      'audit_plan_present',
      'Audit plan present',
      Boolean(
        design.auditPlan &&
          design.auditPlan.dryRunOnly &&
          design.auditPlan.items.length > 0,
      ),
      'blocking',
      'Execution validation requires an audit plan.',
    ),
    createCheck(
      'rollback_design_present',
      'Rollback design present',
      Boolean(
        design.rollbackExecutionDesign &&
          design.rollbackExecutionDesign.requiredBeforeAnyFutureWrite &&
          design.rollbackExecutionDesign.actualRollbackBlocked &&
          design.rollbackExecutionDesign.steps.length > 0,
      ),
      'blocking',
      'Execution validation requires rollback execution design.',
    ),
    createCheck(
      'write_lock_requirements_present',
      'Write lock requirements present',
      design.writeLockRequirements.length > 0 &&
        design.writeLockRequirements.every(
          (requirement) => requirement.required && requirement.status !== 'blocked',
        ),
      'blocking',
      'Execution validation requires write lock requirements.',
    ),
    createCheck(
      'owner_authorization_trace_present',
      'Owner authorization trace present',
      design.ownerAuthorizationTrace.ownerAuthorizationRequired &&
        design.ownerAuthorizationTrace.futureOwnerApprovalRequired &&
        design.ownerAuthorizationTrace.futureRealWriteRequiresSeparateAuthorization,
      'blocking',
      'Execution validation requires owner authorization trace and separate future approval.',
    ),
    createCheck(
      'trace_preserved',
      'Trace preserved',
      tracePreserved,
      'blocking',
      'Execution validation requires QA, human review, candidate, contract, preview, gate, writer, and authorization trace.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      noRawImageReference,
      'blocking',
      'Execution validation must not include raw images, object URLs, base64, local paths, or runtime asset names.',
    ),
    createCheck(
      'no_personal_data',
      'No personal data',
      noPersonalData,
      'blocking',
      'Execution validation must not include personal, contact, health, sensitive identity, or biometric data.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      noMedicalClaims,
      'blocking',
      'Execution validation must not include medical, diagnosis, or treatment claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      noProductShadeClaims,
      'blocking',
      'Execution validation must not include product shade or brand-specific claims.',
    ),
    createCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      noUnsupportedFinalClaims,
      'blocking',
      'Execution validation must not include final recognition, final approval, or AI confirmation claims.',
    ),
    createCheck(
      'no_actual_registry_write',
      'No actual registry write',
      noActualRegistryWrite,
      'blocking',
      'Execution validation must not execute, persist, or mark actual registry writes.',
    ),
    createCheck(
      'no_user_app_shell_package_replacement',
      'No User App Shell package replacement',
      noUserAppShellPackageReplacement,
      'blocking',
      'Execution validation must not replace the current User App Shell package.',
    ),
    createCheck(
      'no_production_package_marker',
      'No production package marker',
      noProductionPackageMarker,
      'blocking',
      'Execution validation must not carry production package markers.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'blocking',
      'Execution validation requires JSON round-trip stability.',
    ),
  ];

  const recommendationsByCheck: Record<
    ControlledRegistryWriteExecutionValidationCheckId,
    string
  > = {
    source_authorization_gate_ready:
      'Return to Phase 10L and resolve the authorization gate first.',
    dry_run_only_true:
      'Restore dryRunOnly before any execution design can continue.',
    actual_write_blocked_true:
      'Restore actualWriteBlocked and remove write execution markers.',
    publish_blocked_true:
      'Restore publishBlocked and keep publication out of scope.',
    package_replacement_blocked_true:
      'Restore packageReplacementBlocked and preserve the current User App Shell package.',
    execution_mode_is_design_only:
      'Restore executionMode to dry_run_design.',
    audit_plan_present:
      'Add an audit plan before any future implementation gate can be considered.',
    rollback_design_present:
      'Add rollback execution design before any future implementation gate.',
    write_lock_requirements_present:
      'Add package, version, and owner authorization write lock requirements.',
    owner_authorization_trace_present:
      'Restore owner authorization trace and separate future approval requirements.',
    trace_preserved:
      'Restore all QA, review, package, gate, writer, and authorization trace.',
    no_raw_image_reference:
      'Remove raw images, object URLs, base64, local paths, and runtime assets.',
    no_personal_data:
      'Remove personal, contact, health, sensitive identity, and biometric data.',
    no_medical_claims: 'Remove medical, diagnosis, or treatment claims.',
    no_product_shade_claims:
      'Keep product copy as category placeholders without shade claims.',
    no_unsupported_final_claims:
      'Keep copy draft-only and human-review-only.',
    no_actual_registry_write:
      'Remove actual registry write markers and keep the design dry-run only.',
    no_user_app_shell_package_replacement:
      'Remove shell replacement markers and preserve the current User App Shell package.',
    no_production_package_marker:
      'Remove production markers and keep this design non-production.',
    json_round_trip_safe: 'Remove non-serializable values before handoff.',
  };

  const issues = checks
    .map((check) => issueForCheck(check, recommendationsByCheck[check.id]))
    .filter((issue): issue is ControlledRegistryWriteExecutionValidationIssue =>
      Boolean(issue),
    );
  const hasWarnings =
    design.executionDesignStatus === 'execution_design_ready_with_warnings' ||
    design.warnings.length > 0;
  const status: ControlledRegistryWriteExecutionValidationStatus =
    issues.some((issue) => issue.severity === 'blocking')
      ? 'execution_validation_blocked'
      : hasWarnings
        ? 'execution_validation_ready_with_warnings'
        : 'execution_validation_ready';
  const action = actionForIssues(issues, hasWarnings);
  const recommendations: ControlledRegistryWriteExecutionValidationRecommendation[] = [
    {
      id: 'controlled_registry_write_execution_next_action',
      message:
        status === 'execution_validation_blocked'
          ? 'Do not implement or execute a real registry write. Resolve blocked execution design checks first.'
          : 'Execution design is dry-run ready only; it may proceed to a future real write implementation gate.',
      action,
    },
  ];

  return {
    status,
    checks,
    issues,
    recommendations,
    readyForRealWriteImplementationGate:
      status === 'execution_validation_ready' ||
      status === 'execution_validation_ready_with_warnings',
    executionDesignOnly: true,
    dryRunOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionPackage: true,
    jsonRoundTripStable,
  };
};
