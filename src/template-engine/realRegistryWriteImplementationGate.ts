import type {
  ControlledRegistryWriteExecutionDesign,
} from './controlledRegistryWriteExecutionDesign';
import type { ControlledRegistryWriteExecutionHandoff } from './controlledRegistryWriteExecutionHandoff';
import type { ControlledRegistryWriteExecutionValidationResult } from './controlledRegistryWriteExecutionValidation';
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

export type RealRegistryWriteImplementationGateSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type RealRegistryWriteImplementationGateStatus =
  | 'real_write_implementation_gate_ready'
  | 'real_write_implementation_gate_ready_with_warnings'
  | 'real_write_implementation_gate_blocked'
  | 'real_write_implementation_gate_example_only';

export type RealRegistryWriteImplementationGateDecision =
  | 'eligible_for_future_real_write_implementation_draft'
  | 'request_execution_plan_revision'
  | 'request_audit_plan_revision'
  | 'request_rollback_design_revision'
  | 'request_write_lock_review'
  | 'request_owner_authorization_review'
  | 'keep_as_execution_design_only'
  | 'blocked_do_not_implement_real_write';

export type RealRegistryWriteImplementationGateCheckId =
  | 'source_execution_validation_ready'
  | 'execution_design_only_confirmed'
  | 'dry_run_only_true'
  | 'actual_write_blocked_true'
  | 'publish_blocked_true'
  | 'package_replacement_blocked_true'
  | 'preflight_checks_present'
  | 'planned_execution_steps_present'
  | 'audit_plan_present'
  | 'rollback_design_present'
  | 'write_lock_requirements_present'
  | 'owner_authorization_trace_present'
  | 'production_write_still_disabled'
  | 'implementation_requires_future_explicit_approval'
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

export interface RealRegistryWriteImplementationGateCheck {
  id: RealRegistryWriteImplementationGateCheckId;
  label: string;
  passed: boolean;
  severity: RealRegistryWriteImplementationGateSeverity;
  message: string;
}

export interface RealRegistryWriteImplementationGateIssue {
  id: string;
  checkId: RealRegistryWriteImplementationGateCheckId;
  severity: Exclude<RealRegistryWriteImplementationGateSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface RealRegistryWriteImplementationGateBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface RealRegistryWriteImplementationGateTrace {
  sourceExecutionDesignId: string;
  sourceExecutionValidationStatus: ControlledRegistryWriteExecutionValidationResult['status'];
  sourceReadyForImplementationGate: boolean;
  sourceAuthorizationGateId: string;
  sourceWriterDraftId: string;
  sourceRegistryWriteGateId: string;
  sourceRegistryPreparationId: string;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: ControlledRegistryWriteExecutionDesign['previewTrace'];
  gateTrace: ControlledRegistryWriteExecutionDesign['gateTrace'];
  writerTrace: ControlledRegistryWriteExecutionDesign['writerTrace'];
  authorizationTrace: ControlledRegistryWriteExecutionDesign['authorizationTrace'];
  executionDesignTrace: ControlledRegistryWriteExecutionDesign['trace'];
  executionValidationTrace: Pick<
    ControlledRegistryWriteExecutionValidationResult,
    | 'status'
    | 'readyForRealWriteImplementationGate'
    | 'executionDesignOnly'
    | 'dryRunOnly'
    | 'noActualRegistryWrite'
    | 'notPublished'
    | 'noUserAppShellPackageReplacement'
    | 'notProductionPackage'
  >;
  productionWriteStillDisabled: boolean;
  futureExplicitApprovalRequired: boolean;
  noRawImageReference: boolean;
  noPersonalData: boolean;
  noMedicalClaims: boolean;
  noProductShadeClaims: boolean;
  noUnsupportedFinalClaims: boolean;
  noActualRegistryWrite: boolean;
  noUserAppShellPackageReplacement: boolean;
  noProductionPackageMarker: boolean;
}

export interface RealRegistryWriteImplementationGateResult {
  gateId: string;
  sourceExecutionDesignId: string;
  sourceAuthorizationGateId: string;
  sourceWriterDraftId: string;
  sourceRegistryWriteGateId: string;
  status: RealRegistryWriteImplementationGateStatus;
  decision: RealRegistryWriteImplementationGateDecision;
  checks: RealRegistryWriteImplementationGateCheck[];
  issues: RealRegistryWriteImplementationGateIssue[];
  blockedReasons: RealRegistryWriteImplementationGateBlockedReason[];
  warnings: RealRegistryWriteImplementationGateIssue[];
  dryRunOnly: boolean;
  actualWriteBlocked: boolean;
  publishBlocked: boolean;
  packageReplacementBlocked: boolean;
  productionWriteStillDisabled: boolean;
  futureExplicitApprovalRequired: boolean;
  notRealWriteImplementation: true;
  implementationGateOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionPackage: true;
  readyForFutureRealWriteImplementationDraft: boolean;
  trace: RealRegistryWriteImplementationGateTrace;
  summary: string;
  jsonRoundTripStable: boolean;
}

export interface RealRegistryWriteImplementationGateOverrides {
  dryRunOnly?: boolean;
  actualWriteBlocked?: boolean;
  publishBlocked?: boolean;
  packageReplacementBlocked?: boolean;
  productionWriteStillDisabled?: boolean;
  futureExplicitApprovalRequired?: boolean;
  note?: string;
}

const createCheck = (
  id: RealRegistryWriteImplementationGateCheckId,
  label: string,
  passed: boolean,
  severity: RealRegistryWriteImplementationGateSeverity,
  message: string,
): RealRegistryWriteImplementationGateCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

const issueForCheck = (
  check: RealRegistryWriteImplementationGateCheck,
  recommendation: string,
): RealRegistryWriteImplementationGateIssue | null => {
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

const gatePayloadText = ({
  note = '',
}: {
  design: ControlledRegistryWriteExecutionDesign;
  validation: ControlledRegistryWriteExecutionValidationResult;
  handoff?: ControlledRegistryWriteExecutionHandoff;
  note?: string;
}): string =>
  JSON.stringify({
    // Scan only Phase 10N-authored free text. Upstream 10M check messages contain
    // negative examples such as "object URL" and "final recognition"; those are
    // already validated by 10M and should not make a safe 10N gate look unsafe.
    note,
  });

const validationCheckPassed = (
  validation: ControlledRegistryWriteExecutionValidationResult,
  checkId: string,
): boolean =>
  validation.checks.find((check) => check.id === checkId)?.passed !== false;

const designPreflightPassed = (
  design: ControlledRegistryWriteExecutionDesign,
  checkId: string,
): boolean =>
  design.preflightChecks.find((check) => check.id === checkId)?.passed !== false;

const decisionForIssues = (
  issues: readonly RealRegistryWriteImplementationGateIssue[],
  hasWarnings: boolean,
): RealRegistryWriteImplementationGateDecision => {
  if (issues.length === 0) {
    return hasWarnings
      ? 'keep_as_execution_design_only'
      : 'eligible_for_future_real_write_implementation_draft';
  }
  if (
    issues.some((issue) =>
      [
        'source_execution_validation_ready',
        'execution_design_only_confirmed',
        'dry_run_only_true',
        'actual_write_blocked_true',
        'publish_blocked_true',
        'package_replacement_blocked_true',
        'production_write_still_disabled',
        'implementation_requires_future_explicit_approval',
        'no_actual_registry_write',
        'no_user_app_shell_package_replacement',
        'no_production_package_marker',
        'json_round_trip_safe',
      ].includes(issue.checkId),
    )
  ) {
    return 'blocked_do_not_implement_real_write';
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
    return 'blocked_do_not_implement_real_write';
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

export const createRealRegistryWriteImplementationGate = ({
  design,
  validation,
  handoff,
  gateId = `real-registry-write-implementation-gate-${design.executionDesignId}`,
  overrides = {},
}: {
  design: ControlledRegistryWriteExecutionDesign;
  validation: ControlledRegistryWriteExecutionValidationResult;
  handoff?: ControlledRegistryWriteExecutionHandoff;
  gateId?: string;
  overrides?: RealRegistryWriteImplementationGateOverrides;
}): RealRegistryWriteImplementationGateResult => {
  const sourceExecutionValidationReady =
    validation.status === 'execution_validation_ready' ||
    validation.status === 'execution_validation_ready_with_warnings';
  const dryRunOnly = overrides.dryRunOnly ?? design.dryRunOnly;
  const actualWriteBlocked =
    overrides.actualWriteBlocked ?? design.actualWriteBlocked;
  const publishBlocked = overrides.publishBlocked ?? design.publishBlocked;
  const packageReplacementBlocked =
    overrides.packageReplacementBlocked ?? design.packageReplacementBlocked;
  const productionWriteStillDisabled =
    overrides.productionWriteStillDisabled ?? true;
  const futureExplicitApprovalRequired =
    overrides.futureExplicitApprovalRequired ??
    Boolean(
      design.ownerAuthorizationTrace.futureRealWriteRequiresSeparateAuthorization &&
        (handoff?.futureOwnerAuthorizationRequired ?? true),
    );
  const payloadText = gatePayloadText({
    design,
    validation,
    handoff,
    note: overrides.note,
  });
  const tracePreserved =
    design.qaTrace.trim().length > 0 &&
    design.humanReviewTrace.trim().length > 0 &&
    design.candidateTrace.trim().length > 0 &&
    design.contractTrace.trim().length > 0 &&
    Boolean(design.previewTrace) &&
    Boolean(design.gateTrace) &&
    Boolean(design.writerTrace) &&
    Boolean(design.authorizationTrace) &&
    Boolean(design.trace);
  const noRawImageReference =
    design.trace.noRawImageReference &&
    validationCheckPassed(validation, 'no_raw_image_reference') &&
    !registryPreparationRawImageReferencePattern.test(payloadText);
  const noPersonalData =
    design.trace.noPersonalData &&
    validationCheckPassed(validation, 'no_personal_data') &&
    !registryPreparationPersonalDataPattern.test(payloadText);
  const noMedicalClaims =
    design.trace.noMedicalClaims &&
    validationCheckPassed(validation, 'no_medical_claims') &&
    !registryPreparationMedicalClaimPattern.test(payloadText);
  const noProductShadeClaims =
    design.trace.noProductShadeClaims &&
    validationCheckPassed(validation, 'no_product_shade_claims') &&
    !registryPreparationShadeClaimPattern.test(payloadText);
  const noUnsupportedFinalClaims =
    design.trace.noUnsupportedFinalClaims &&
    validationCheckPassed(validation, 'no_unsupported_final_claims') &&
    !registryPreparationFinalClaimPattern.test(payloadText);
  const noActualRegistryWrite =
    actualWriteBlocked &&
    design.noActualRegistryWrite &&
    design.trace.noActualRegistryWrite &&
    designPreflightPassed(design, 'no_actual_registry_write') &&
    validation.noActualRegistryWrite &&
    validationCheckPassed(validation, 'no_actual_registry_write') &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    packageReplacementBlocked &&
    design.noUserAppShellPackageReplacement &&
    design.trace.noUserAppShellPackageReplacement &&
    designPreflightPassed(design, 'no_user_app_shell_package_replacement') &&
    validation.noUserAppShellPackageReplacement &&
    validationCheckPassed(validation, 'no_user_app_shell_package_replacement') &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    design.notProductionPackage &&
    design.trace.noProductionPackageMarker &&
    designPreflightPassed(design, 'no_production_package_marker') &&
    validation.notProductionPackage &&
    validationCheckPassed(validation, 'no_production_package_marker') &&
    !registryPreparationProductionMarkerPattern.test(payloadText);

  const checks: RealRegistryWriteImplementationGateCheck[] = [
    createCheck(
      'source_execution_validation_ready',
      'Source execution validation ready',
      sourceExecutionValidationReady && validation.readyForRealWriteImplementationGate,
      'blocking',
      'Implementation gate requires a ready Phase 10M execution validation result.',
    ),
    createCheck(
      'execution_design_only_confirmed',
      'Execution design-only confirmed',
      design.executionDesignOnly && validation.executionDesignOnly,
      'blocking',
      'Implementation gate must start from design-only execution inputs.',
    ),
    createCheck(
      'dry_run_only_true',
      'Dry-run only remains true',
      dryRunOnly && validation.dryRunOnly,
      'blocking',
      'Implementation gate must keep dryRunOnly true.',
    ),
    createCheck(
      'actual_write_blocked_true',
      'Actual write remains blocked',
      actualWriteBlocked && validation.noActualRegistryWrite,
      'blocking',
      'Implementation gate must keep actual registry writes blocked.',
    ),
    createCheck(
      'publish_blocked_true',
      'Publish remains blocked',
      publishBlocked && validation.notPublished,
      'blocking',
      'Implementation gate must keep publication blocked.',
    ),
    createCheck(
      'package_replacement_blocked_true',
      'Package replacement remains blocked',
      packageReplacementBlocked && validation.noUserAppShellPackageReplacement,
      'blocking',
      'Implementation gate must not replace the current User App Shell package.',
    ),
    createCheck(
      'preflight_checks_present',
      'Preflight checks present',
      design.preflightChecks.length > 0 &&
        design.preflightChecks.every((check) => check.passed || check.severity !== 'blocking'),
      'blocking',
      'Implementation gate requires passing execution preflight checks.',
    ),
    createCheck(
      'planned_execution_steps_present',
      'Planned execution steps present',
      design.plannedExecutionSteps.length > 0 &&
        design.plannedExecutionSteps.every(
          (step) => step.dryRunOnly && step.actualMutationBlocked,
        ),
      'blocking',
      'Implementation gate requires planned dry-run execution steps.',
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
      'Implementation gate requires a reviewed audit plan.',
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
      'Implementation gate requires reviewed rollback execution design.',
    ),
    createCheck(
      'write_lock_requirements_present',
      'Write lock requirements present',
      design.writeLockRequirements.length > 0 &&
        design.writeLockRequirements.every(
          (requirement) => requirement.required && requirement.status !== 'blocked',
        ),
      'blocking',
      'Implementation gate requires write lock requirements.',
    ),
    createCheck(
      'owner_authorization_trace_present',
      'Owner authorization trace present',
      design.ownerAuthorizationTrace.ownerAuthorizationRequired &&
        design.ownerAuthorizationTrace.futureOwnerApprovalRequired &&
        design.ownerAuthorizationTrace.futureRealWriteRequiresSeparateAuthorization,
      'blocking',
      'Implementation gate requires owner authorization trace.',
    ),
    createCheck(
      'production_write_still_disabled',
      'Production write still disabled',
      productionWriteStillDisabled,
      'blocking',
      'Implementation gate must keep production write disabled.',
    ),
    createCheck(
      'implementation_requires_future_explicit_approval',
      'Future explicit approval required',
      futureExplicitApprovalRequired,
      'blocking',
      'Implementation gate must require a separate future explicit approval.',
    ),
    createCheck(
      'trace_preserved',
      'Trace preserved',
      tracePreserved,
      'blocking',
      'Implementation gate requires QA, human review, candidate, contract, preview, gate, writer, authorization, and execution trace.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      noRawImageReference,
      'blocking',
      'Implementation gate must not include raw images, object URLs, base64, local paths, or runtime asset names.',
    ),
    createCheck(
      'no_personal_data',
      'No personal data',
      noPersonalData,
      'blocking',
      'Implementation gate must not include personal, contact, health, sensitive identity, or biometric data.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      noMedicalClaims,
      'blocking',
      'Implementation gate must not include medical, diagnosis, or treatment claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      noProductShadeClaims,
      'blocking',
      'Implementation gate must not include product shade or brand-specific claims.',
    ),
    createCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      noUnsupportedFinalClaims,
      'blocking',
      'Implementation gate must not include final recognition, final approval, or AI confirmation claims.',
    ),
    createCheck(
      'no_actual_registry_write',
      'No actual registry write',
      noActualRegistryWrite,
      'blocking',
      'Implementation gate must not execute, persist, or mark actual registry writes.',
    ),
    createCheck(
      'no_user_app_shell_package_replacement',
      'No User App Shell package replacement',
      noUserAppShellPackageReplacement,
      'blocking',
      'Implementation gate must not replace the current User App Shell package.',
    ),
    createCheck(
      'no_production_package_marker',
      'No production package marker',
      noProductionPackageMarker,
      'blocking',
      'Implementation gate must not carry production package markers.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      design.jsonRoundTripStable &&
        validation.jsonRoundTripStable &&
        (!handoff || handoff.jsonRoundTripStable),
      'blocking',
      'Implementation gate requires JSON round-trip stability.',
    ),
  ];

  const recommendationsByCheck: Record<
    RealRegistryWriteImplementationGateCheckId,
    string
  > = {
    source_execution_validation_ready:
      'Return to Phase 10M and resolve execution validation first.',
    execution_design_only_confirmed:
      'Restore execution-design-only inputs before any implementation gate.',
    dry_run_only_true:
      'Restore dryRunOnly and remove real execution markers.',
    actual_write_blocked_true:
      'Restore actualWriteBlocked and remove registry write execution markers.',
    publish_blocked_true:
      'Restore publishBlocked and keep publication out of scope.',
    package_replacement_blocked_true:
      'Restore packageReplacementBlocked and preserve the current User App Shell package.',
    preflight_checks_present:
      'Review and pass execution preflight checks.',
    planned_execution_steps_present:
      'Restore dry-run planned execution steps before future implementation draft planning.',
    audit_plan_present:
      'Review the audit plan before any future implementation draft.',
    rollback_design_present:
      'Review rollback execution design before any future implementation draft.',
    write_lock_requirements_present:
      'Review package, version, and owner authorization write lock requirements.',
    owner_authorization_trace_present:
      'Restore owner authorization trace and separate future approval requirements.',
    production_write_still_disabled:
      'Keep production write disabled until a future explicit implementation phase is approved.',
    implementation_requires_future_explicit_approval:
      'Require separate owner approval before any future real write implementation draft can proceed.',
    trace_preserved:
      'Restore all QA, review, package, gate, writer, authorization, and execution trace.',
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
      'Remove actual registry write markers and keep 10N as a gate only.',
    no_user_app_shell_package_replacement:
      'Remove shell replacement markers and preserve the current User App Shell package.',
    no_production_package_marker:
      'Remove production markers and keep this gate non-production.',
    json_round_trip_safe: 'Remove non-serializable values before handoff.',
  };
  const issues = checks
    .map((check) => issueForCheck(check, recommendationsByCheck[check.id]))
    .filter((issue): issue is RealRegistryWriteImplementationGateIssue =>
      Boolean(issue),
    );
  const warnings = issues.filter((issue) => issue.severity === 'warning');
  const blockedReasons: RealRegistryWriteImplementationGateBlockedReason[] =
    issues
      .filter((issue) => issue.severity === 'blocking')
      .map((issue) => ({
        id: issue.id,
        message: issue.message,
        recommendation: issue.recommendation,
      }));
  const hasWarnings =
    validation.status === 'execution_validation_ready_with_warnings' ||
    design.executionDesignStatus === 'execution_design_ready_with_warnings' ||
    design.warnings.length > 0 ||
    (handoff?.status === 'execution_handoff_ready_with_warnings');
  const status: RealRegistryWriteImplementationGateStatus =
    design.executionDesignStatus === 'execution_design_example_only'
      ? 'real_write_implementation_gate_example_only'
      : blockedReasons.length > 0
        ? 'real_write_implementation_gate_blocked'
        : hasWarnings
          ? 'real_write_implementation_gate_ready_with_warnings'
          : 'real_write_implementation_gate_ready';
  const decision = decisionForIssues(issues, hasWarnings);
  const readyForFutureRealWriteImplementationDraft =
    status === 'real_write_implementation_gate_ready' ||
    status === 'real_write_implementation_gate_ready_with_warnings';

  const result: RealRegistryWriteImplementationGateResult = {
    gateId,
    sourceExecutionDesignId: design.executionDesignId,
    sourceAuthorizationGateId: design.sourceAuthorizationGateId,
    sourceWriterDraftId: design.sourceWriterDraftId,
    sourceRegistryWriteGateId: design.sourceRegistryWriteGateId,
    status,
    decision,
    checks,
    issues,
    blockedReasons,
    warnings,
    dryRunOnly,
    actualWriteBlocked,
    publishBlocked,
    packageReplacementBlocked,
    productionWriteStillDisabled,
    futureExplicitApprovalRequired,
    notRealWriteImplementation: true,
    implementationGateOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionPackage: true,
    readyForFutureRealWriteImplementationDraft,
    trace: {
      sourceExecutionDesignId: design.executionDesignId,
      sourceExecutionValidationStatus: validation.status,
      sourceReadyForImplementationGate:
        sourceExecutionValidationReady && validation.readyForRealWriteImplementationGate,
      sourceAuthorizationGateId: design.sourceAuthorizationGateId,
      sourceWriterDraftId: design.sourceWriterDraftId,
      sourceRegistryWriteGateId: design.sourceRegistryWriteGateId,
      sourceRegistryPreparationId: design.trace.sourceRegistryPreparationId,
      qaTrace: design.qaTrace,
      humanReviewTrace: design.humanReviewTrace,
      candidateTrace: design.candidateTrace,
      contractTrace: design.contractTrace,
      previewTrace: design.previewTrace,
      gateTrace: design.gateTrace,
      writerTrace: design.writerTrace,
      authorizationTrace: design.authorizationTrace,
      executionDesignTrace: design.trace,
      executionValidationTrace: {
        status: validation.status,
        readyForRealWriteImplementationGate:
          validation.readyForRealWriteImplementationGate,
        executionDesignOnly: validation.executionDesignOnly,
        dryRunOnly: validation.dryRunOnly,
        noActualRegistryWrite: validation.noActualRegistryWrite,
        notPublished: validation.notPublished,
        noUserAppShellPackageReplacement:
          validation.noUserAppShellPackageReplacement,
        notProductionPackage: validation.notProductionPackage,
      },
      productionWriteStillDisabled,
      futureExplicitApprovalRequired,
      noRawImageReference,
      noPersonalData,
      noMedicalClaims,
      noProductShadeClaims,
      noUnsupportedFinalClaims,
      noActualRegistryWrite,
      noUserAppShellPackageReplacement,
      noProductionPackageMarker,
    },
    summary:
      status === 'real_write_implementation_gate_blocked'
        ? 'Real write implementation gate is blocked; do not implement or execute a registry write.'
        : 'Real write implementation gate is ready for a future implementation draft only; it is not actual registry write implementation.',
    jsonRoundTripStable: false,
  };
  result.jsonRoundTripStable = isJsonRoundTripStable(result);
  return result;
};
