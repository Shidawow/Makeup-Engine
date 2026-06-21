import type { GuardedSimulatorReviewGateResult } from './guardedSimulatorReviewGate';
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

export type RealWriteApprovalBoundarySeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type RealWriteApprovalBoundaryStatus =
  | 'real_write_approval_boundary_ready'
  | 'real_write_approval_boundary_ready_with_warnings'
  | 'real_write_approval_boundary_blocked'
  | 'real_write_approval_boundary_example_only';

export type RealWriteApprovalBoundaryDecision =
  | 'ready_for_future_actual_write_authorization_request'
  | 'request_approval_scope_clarification'
  | 'request_audit_requirement_revision'
  | 'request_rollback_approval_revision'
  | 'request_owner_authorization_for_actual_write'
  | 'keep_as_approval_boundary_only'
  | 'blocked_do_not_execute_real_write';

export type RealWriteApprovalScope =
  | 'boundary_only'
  | 'actual_write'
  | 'registry_mutation'
  | 'publish'
  | 'user_app_shell_replacement'
  | 'production_writer_creation'
  | 'unclear';

export type RealWriteApprovalBoundaryCheckId =
  | 'source_simulator_review_gate_ready'
  | 'approval_boundary_only'
  | 'owner_has_not_authorized_actual_write'
  | 'owner_has_not_authorized_registry_mutation'
  | 'owner_has_not_authorized_publish'
  | 'owner_has_not_authorized_user_app_shell_replacement'
  | 'owner_has_not_authorized_production_writer_creation'
  | 'dry_run_only_true'
  | 'actual_write_blocked_true'
  | 'registry_mutation_blocked_true'
  | 'publish_blocked_true'
  | 'package_replacement_blocked_true'
  | 'production_writer_blocked_true'
  | 'simulator_review_trace_preserved'
  | 'approval_scope_explicit'
  | 'audit_requirements_present'
  | 'rollback_approval_requirements_present'
  | 'future_actual_write_requires_separate_approval'
  | 'no_registry_mutation'
  | 'no_actual_registry_write'
  | 'no_publish'
  | 'no_user_app_shell_package_replacement'
  | 'no_production_writer_creation'
  | 'no_raw_image_reference'
  | 'no_personal_data'
  | 'no_medical_claims'
  | 'no_product_shade_claims'
  | 'no_unsupported_final_claims'
  | 'no_production_package_marker'
  | 'json_round_trip_safe';

export interface RealWriteApprovalBoundaryCheck {
  id: RealWriteApprovalBoundaryCheckId;
  label: string;
  passed: boolean;
  severity: RealWriteApprovalBoundarySeverity;
  message: string;
}

export interface RealWriteApprovalBoundaryIssue {
  id: string;
  checkId: RealWriteApprovalBoundaryCheckId;
  severity: Exclude<RealWriteApprovalBoundarySeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface RealWriteApprovalBoundaryBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface RealWriteApprovalBoundaryTrace {
  sourceGateId: string;
  sourceSimulatorId: string;
  sourceExecutionPlanId: string;
  sourceExecutionAuthorizationId: string;
  sourceSimulatorReviewGateStatus: GuardedSimulatorReviewGateResult['status'];
  sourceSimulatorReviewGateDecision: GuardedSimulatorReviewGateResult['decision'];
  approvalScope: RealWriteApprovalScope;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  simulatorTrace: GuardedSimulatorReviewGateResult['trace']['simulatorTrace'];
  reviewGateTrace: GuardedSimulatorReviewGateResult['trace'];
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

export interface RealWriteApprovalBoundaryResult {
  boundaryId: string;
  sourceGateId: string;
  sourceSimulatorId: string;
  sourceExecutionPlanId: string;
  sourceExecutionAuthorizationId: string;
  status: RealWriteApprovalBoundaryStatus;
  decision: RealWriteApprovalBoundaryDecision;
  approvalScope: RealWriteApprovalScope;
  checks: RealWriteApprovalBoundaryCheck[];
  issues: RealWriteApprovalBoundaryIssue[];
  blockedReasons: RealWriteApprovalBoundaryBlockedReason[];
  warnings: RealWriteApprovalBoundaryIssue[];
  auditRequirements: string[];
  rollbackApprovalRequirements: string[];
  approvalBoundaryOnly: true;
  notActualWriteAuthorization: true;
  dryRunOnly: true;
  actualWriteBlocked: true;
  registryMutationBlocked: true;
  publishBlocked: true;
  packageReplacementBlocked: true;
  productionWriterBlocked: true;
  noActualRegistryWrite: true;
  noRegistryMutation: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  doesNotCreateProductionWriter: true;
  futureActualWriteRequiresSeparateApproval: true;
  readyForFutureActualWriteAuthorizationRequest: boolean;
  trace: RealWriteApprovalBoundaryTrace;
  summary: string;
  jsonRoundTripStable: boolean;
}

export interface RealWriteApprovalBoundaryOverrides {
  approvalScope?: RealWriteApprovalScope;
  dryRunOnly?: boolean;
  actualWriteBlocked?: boolean;
  registryMutationBlocked?: boolean;
  publishBlocked?: boolean;
  packageReplacementBlocked?: boolean;
  productionWriterBlocked?: boolean;
  futureActualWriteRequiresSeparateApproval?: boolean;
  auditRequirements?: string[];
  rollbackApprovalRequirements?: string[];
  note?: string;
}

const defaultAuditRequirements = [
  'Preserve Phase 10T guarded simulator review trace.',
  'Record that Phase 10U is approval boundary only.',
  'Confirm no actual registry write and no registry mutation.',
  'Confirm future actual write requires separate explicit owner authorization.',
];

const defaultRollbackApprovalRequirements = [
  'Rollback is not executed in Phase 10U.',
  'Future rollback execution requires separate owner approval.',
  'Current User App Shell package is not replaced.',
];

const createCheck = (
  id: RealWriteApprovalBoundaryCheckId,
  label: string,
  passed: boolean,
  severity: RealWriteApprovalBoundarySeverity,
  message: string,
): RealWriteApprovalBoundaryCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

const issueForCheck = (
  check: RealWriteApprovalBoundaryCheck,
  recommendation: string,
): RealWriteApprovalBoundaryIssue | null => {
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

const gateReadyForApprovalBoundary = (
  gate: GuardedSimulatorReviewGateResult,
): boolean =>
  gate.status === 'simulator_review_gate_ready' ||
  gate.status === 'simulator_review_gate_ready_with_warnings';

const gateCheckPassed = (
  gate: GuardedSimulatorReviewGateResult,
  checkId: string,
): boolean => gate.checks.some((check) => check.id === checkId && check.passed);

const approvalPayloadText = ({
  gate,
  approvalScope,
  auditRequirements,
  rollbackApprovalRequirements,
  note = '',
}: {
  gate: GuardedSimulatorReviewGateResult;
  approvalScope: RealWriteApprovalScope;
  auditRequirements: readonly string[];
  rollbackApprovalRequirements: readonly string[];
  note?: string;
}): string =>
  JSON.stringify({
    gateStatus: gate.status,
    gateDecision: gate.decision,
    gateSummary: gate.summary,
    sourceGateId: gate.gateId,
    sourceSimulatorId: gate.sourceSimulatorId,
    approvalScope,
    auditRequirements,
    rollbackApprovalRequirements,
    failedGateChecks: gate.checks
      .filter((check) => !check.passed)
      .map((check) => check.id),
    operatorNote: note,
  });

const recommendationForCheck = (
  checkId: RealWriteApprovalBoundaryCheckId,
): string => {
  switch (checkId) {
    case 'approval_scope_explicit':
      return 'Clarify the approval scope as boundary_only before continuing.';
    case 'audit_requirements_present':
      return 'Add audit requirements before the approval boundary can continue.';
    case 'rollback_approval_requirements_present':
      return 'Add rollback approval requirements before the approval boundary can continue.';
    case 'source_simulator_review_gate_ready':
      return 'Return to Phase 10T and make the guarded simulator review gate ready.';
    case 'owner_has_not_authorized_actual_write':
    case 'owner_has_not_authorized_registry_mutation':
    case 'owner_has_not_authorized_publish':
    case 'owner_has_not_authorized_user_app_shell_replacement':
    case 'owner_has_not_authorized_production_writer_creation':
    case 'approval_boundary_only':
      return 'Keep Phase 10U as approval-boundary-only; request separate owner authorization in a future phase.';
    default:
      return 'Keep the boundary blocked until the no-write, no-mutation, no-publish guardrail is restored.';
  }
};

const decisionForIssues = (
  issues: readonly RealWriteApprovalBoundaryIssue[],
  hasWarnings: boolean,
): RealWriteApprovalBoundaryDecision => {
  if (issues.length === 0) {
    return hasWarnings
      ? 'keep_as_approval_boundary_only'
      : 'ready_for_future_actual_write_authorization_request';
  }
  if (issues.some((issue) => issue.checkId === 'approval_scope_explicit')) {
    return 'request_approval_scope_clarification';
  }
  if (issues.some((issue) => issue.checkId === 'audit_requirements_present')) {
    return 'request_audit_requirement_revision';
  }
  if (
    issues.some(
      (issue) => issue.checkId === 'rollback_approval_requirements_present',
    )
  ) {
    return 'request_rollback_approval_revision';
  }
  if (
    issues.some((issue) =>
      [
        'owner_has_not_authorized_actual_write',
        'owner_has_not_authorized_registry_mutation',
        'owner_has_not_authorized_publish',
        'owner_has_not_authorized_user_app_shell_replacement',
        'owner_has_not_authorized_production_writer_creation',
        'future_actual_write_requires_separate_approval',
      ].includes(issue.checkId),
    )
  ) {
    return 'request_owner_authorization_for_actual_write';
  }
  return 'blocked_do_not_execute_real_write';
};

export const createRealWriteApprovalBoundary = ({
  gate,
  boundaryId = `real-write-approval-boundary-${gate.gateId}`,
  overrides = {},
}: {
  gate: GuardedSimulatorReviewGateResult;
  boundaryId?: string;
  overrides?: RealWriteApprovalBoundaryOverrides;
}): RealWriteApprovalBoundaryResult => {
  const approvalScope = overrides.approvalScope ?? 'boundary_only';
  const dryRunOnly = overrides.dryRunOnly ?? gate.dryRunOnly;
  const actualWriteBlocked = overrides.actualWriteBlocked ?? true;
  const registryMutationBlocked = overrides.registryMutationBlocked ?? true;
  const publishBlocked = overrides.publishBlocked ?? true;
  const packageReplacementBlocked =
    overrides.packageReplacementBlocked ?? true;
  const productionWriterBlocked = overrides.productionWriterBlocked ?? true;
  const futureActualWriteRequiresSeparateApproval =
    overrides.futureActualWriteRequiresSeparateApproval ??
    gate.futureActualWriteRequiresSeparateApproval;
  const auditRequirements =
    overrides.auditRequirements ?? defaultAuditRequirements;
  const rollbackApprovalRequirements =
    overrides.rollbackApprovalRequirements ?? defaultRollbackApprovalRequirements;
  const payloadText = approvalPayloadText({
    gate,
    approvalScope,
    auditRequirements,
    rollbackApprovalRequirements,
    note: overrides.note,
  });

  const sourceGateReady = gateReadyForApprovalBoundary(gate);
  const approvalBoundaryOnly = approvalScope === 'boundary_only';
  const approvalScopeExplicit = approvalScope !== 'unclear';
  const ownerHasNotAuthorizedActualWrite = approvalScope !== 'actual_write';
  const ownerHasNotAuthorizedRegistryMutation =
    approvalScope !== 'registry_mutation';
  const ownerHasNotAuthorizedPublish = approvalScope !== 'publish';
  const ownerHasNotAuthorizedUserAppShellReplacement =
    approvalScope !== 'user_app_shell_replacement';
  const ownerHasNotAuthorizedProductionWriterCreation =
    approvalScope !== 'production_writer_creation';
  const simulatorReviewTracePreserved =
    gate.trace.qaTrace.trim().length > 0 &&
    gate.trace.humanReviewTrace.trim().length > 0 &&
    gate.trace.candidateTrace.trim().length > 0 &&
    gate.trace.contractTrace.trim().length > 0 &&
    Boolean(gate.trace.simulatorTrace) &&
    Boolean(gate.trace.gateTrace);
  const auditRequirementsPresent = auditRequirements.length > 0;
  const rollbackApprovalRequirementsPresent =
    rollbackApprovalRequirements.length > 0;
  const noRawImageReference =
    gate.trace.noRawImageReference &&
    gateCheckPassed(gate, 'no_raw_image_reference') &&
    !registryPreparationRawImageReferencePattern.test(payloadText);
  const noPersonalData =
    gate.trace.noPersonalData &&
    gateCheckPassed(gate, 'no_personal_data') &&
    !registryPreparationPersonalDataPattern.test(payloadText);
  const noMedicalClaims =
    gate.trace.noMedicalClaims &&
    gateCheckPassed(gate, 'no_medical_claims') &&
    !registryPreparationMedicalClaimPattern.test(payloadText);
  const noProductShadeClaims =
    gate.trace.noProductShadeClaims &&
    gateCheckPassed(gate, 'no_product_shade_claims') &&
    !registryPreparationShadeClaimPattern.test(payloadText);
  const noUnsupportedFinalClaims =
    gate.trace.noUnsupportedFinalClaims &&
    gateCheckPassed(gate, 'no_unsupported_final_claims') &&
    !registryPreparationFinalClaimPattern.test(payloadText);
  const noActualRegistryWrite =
    actualWriteBlocked &&
    gate.noActualRegistryWrite &&
    gate.trace.noActualRegistryWrite &&
    gateCheckPassed(gate, 'no_actual_registry_write') &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noRegistryMutation =
    registryMutationBlocked &&
    gate.noRegistryMutation &&
    gate.trace.noRegistryMutation &&
    gateCheckPassed(gate, 'no_registry_mutation') &&
    !registryMutationMarkerPattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    packageReplacementBlocked &&
    gate.noUserAppShellPackageReplacement &&
    gate.trace.noUserAppShellPackageReplacement &&
    gateCheckPassed(gate, 'no_user_app_shell_package_replacement') &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    gate.notProductionPackage &&
    gate.trace.noProductionPackageMarker &&
    gateCheckPassed(gate, 'no_production_package_marker') &&
    !registryPreparationProductionMarkerPattern.test(payloadText);
  const noProductionWriterCreation =
    productionWriterBlocked &&
    gate.doesNotCreateProductionWriter &&
    gate.trace.noProductionWriterCreation &&
    gateCheckPassed(gate, 'no_production_writer_creation') &&
    !productionWriterCreationMarkerPattern.test(payloadText);
  const jsonRoundTripStable =
    gate.jsonRoundTripStable && isJsonRoundTripStable(gate);

  const checks: RealWriteApprovalBoundaryCheck[] = [
    createCheck(
      'source_simulator_review_gate_ready',
      'Source simulator review gate ready',
      sourceGateReady,
      'blocking',
      'Real write approval boundary requires Phase 10T simulator review gate ready or ready-with-warnings.',
    ),
    createCheck(
      'approval_boundary_only',
      'Approval boundary only',
      approvalBoundaryOnly,
      'blocking',
      'Phase 10U must remain approval-boundary-only.',
    ),
    createCheck(
      'owner_has_not_authorized_actual_write',
      'Owner has not authorized actual write',
      ownerHasNotAuthorizedActualWrite,
      'blocking',
      'Owner has not authorized actual registry write in Phase 10U.',
    ),
    createCheck(
      'owner_has_not_authorized_registry_mutation',
      'Owner has not authorized registry mutation',
      ownerHasNotAuthorizedRegistryMutation,
      'blocking',
      'Owner has not authorized registry mutation in Phase 10U.',
    ),
    createCheck(
      'owner_has_not_authorized_publish',
      'Owner has not authorized publish',
      ownerHasNotAuthorizedPublish,
      'blocking',
      'Owner has not authorized publishing in Phase 10U.',
    ),
    createCheck(
      'owner_has_not_authorized_user_app_shell_replacement',
      'Owner has not authorized User App Shell replacement',
      ownerHasNotAuthorizedUserAppShellReplacement,
      'blocking',
      'Owner has not authorized replacing the current User App Shell package in Phase 10U.',
    ),
    createCheck(
      'owner_has_not_authorized_production_writer_creation',
      'Owner has not authorized production writer creation',
      ownerHasNotAuthorizedProductionWriterCreation,
      'blocking',
      'Owner has not authorized creating a production writer in Phase 10U.',
    ),
    createCheck(
      'dry_run_only_true',
      'Dry run only true',
      dryRunOnly && gate.dryRunOnly,
      'blocking',
      'Real write approval boundary must keep dryRunOnly true.',
    ),
    createCheck(
      'actual_write_blocked_true',
      'Actual write blocked true',
      actualWriteBlocked,
      'blocking',
      'Real write approval boundary must keep actual writes blocked.',
    ),
    createCheck(
      'registry_mutation_blocked_true',
      'Registry mutation blocked true',
      registryMutationBlocked,
      'blocking',
      'Real write approval boundary must keep registry mutation blocked.',
    ),
    createCheck(
      'publish_blocked_true',
      'Publish blocked true',
      publishBlocked,
      'blocking',
      'Real write approval boundary must keep publication blocked.',
    ),
    createCheck(
      'package_replacement_blocked_true',
      'Package replacement blocked true',
      packageReplacementBlocked,
      'blocking',
      'Real write approval boundary must keep User App Shell package replacement blocked.',
    ),
    createCheck(
      'production_writer_blocked_true',
      'Production writer blocked true',
      productionWriterBlocked,
      'blocking',
      'Real write approval boundary must keep production writer creation blocked.',
    ),
    createCheck(
      'simulator_review_trace_preserved',
      'Simulator review trace preserved',
      simulatorReviewTracePreserved,
      'blocking',
      'Real write approval boundary must preserve the simulator review trace.',
    ),
    createCheck(
      'approval_scope_explicit',
      'Approval scope explicit',
      approvalScopeExplicit,
      'blocking',
      'Real write approval boundary requires an explicit boundary_only approval scope.',
    ),
    createCheck(
      'audit_requirements_present',
      'Audit requirements present',
      auditRequirementsPresent,
      'blocking',
      'Real write approval boundary requires audit requirements.',
    ),
    createCheck(
      'rollback_approval_requirements_present',
      'Rollback approval requirements present',
      rollbackApprovalRequirementsPresent,
      'blocking',
      'Real write approval boundary requires rollback approval requirements.',
    ),
    createCheck(
      'future_actual_write_requires_separate_approval',
      'Future actual write requires separate approval',
      futureActualWriteRequiresSeparateApproval,
      'blocking',
      'Future actual write must require separate explicit owner authorization.',
    ),
    createCheck(
      'no_registry_mutation',
      'No registry mutation',
      noRegistryMutation,
      'blocking',
      'Approval boundary must not include registry mutation markers.',
    ),
    createCheck(
      'no_actual_registry_write',
      'No actual registry write',
      noActualRegistryWrite,
      'blocking',
      'Approval boundary must not include actual registry write markers.',
    ),
    createCheck(
      'no_publish',
      'No publish',
      publishBlocked && gate.notPublished,
      'blocking',
      'Approval boundary must not publish to the user app.',
    ),
    createCheck(
      'no_user_app_shell_package_replacement',
      'No User App Shell package replacement',
      noUserAppShellPackageReplacement,
      'blocking',
      'Approval boundary must not replace the current User App Shell package.',
    ),
    createCheck(
      'no_production_writer_creation',
      'No production writer creation',
      noProductionWriterCreation,
      'blocking',
      'Approval boundary must not create a production writer.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      noRawImageReference,
      'blocking',
      'Approval boundary must not carry raw image references.',
    ),
    createCheck(
      'no_personal_data',
      'No personal data',
      noPersonalData,
      'blocking',
      'Approval boundary must not carry personal data.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      noMedicalClaims,
      'blocking',
      'Approval boundary must not carry medical claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      noProductShadeClaims,
      'blocking',
      'Approval boundary must not carry unsupported product shade claims.',
    ),
    createCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      noUnsupportedFinalClaims,
      'blocking',
      'Approval boundary must not carry unsupported final claims.',
    ),
    createCheck(
      'no_production_package_marker',
      'No production package marker',
      noProductionPackageMarker,
      'blocking',
      'Approval boundary must not carry production package markers.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'blocking',
      'Approval boundary must remain JSON round-trip stable.',
    ),
  ];

  const issues = checks
    .map((check) => issueForCheck(check, recommendationForCheck(check.id)))
    .filter((issue): issue is RealWriteApprovalBoundaryIssue => Boolean(issue));
  const warnings =
    gate.status === 'simulator_review_gate_ready_with_warnings'
      ? [
          {
            id: 'source_simulator_review_gate_warning',
            checkId:
              'source_simulator_review_gate_ready' as RealWriteApprovalBoundaryCheckId,
            severity: 'warning' as const,
            message:
              'Source simulator review gate is ready with warnings; keep this as approval boundary only.',
            recommendation:
              'Resolve upstream warnings before requesting future actual write authorization.',
          },
        ]
      : [];
  const hasBlockingIssues = issues.some((issue) => issue.severity === 'blocking');
  const status: RealWriteApprovalBoundaryStatus =
    gate.status === 'simulator_review_gate_example_only'
      ? 'real_write_approval_boundary_example_only'
      : hasBlockingIssues
        ? 'real_write_approval_boundary_blocked'
        : warnings.length > 0
          ? 'real_write_approval_boundary_ready_with_warnings'
          : 'real_write_approval_boundary_ready';
  const decision =
    status === 'real_write_approval_boundary_blocked'
      ? decisionForIssues(issues, warnings.length > 0)
      : decisionForIssues([], warnings.length > 0);
  const boundary: RealWriteApprovalBoundaryResult = {
    boundaryId,
    sourceGateId: gate.gateId,
    sourceSimulatorId: gate.sourceSimulatorId,
    sourceExecutionPlanId: gate.sourceExecutionPlanId,
    sourceExecutionAuthorizationId: gate.sourceExecutionAuthorizationId,
    status,
    decision,
    approvalScope,
    checks,
    issues,
    blockedReasons: issues.map((issue) => ({
      id: `blocked_${issue.checkId}`,
      message: issue.message,
      recommendation: issue.recommendation,
    })),
    warnings,
    auditRequirements,
    rollbackApprovalRequirements,
    approvalBoundaryOnly: true,
    notActualWriteAuthorization: true,
    dryRunOnly: true,
    actualWriteBlocked: true,
    registryMutationBlocked: true,
    publishBlocked: true,
    packageReplacementBlocked: true,
    productionWriterBlocked: true,
    noActualRegistryWrite: true,
    noRegistryMutation: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    doesNotCreateProductionWriter: true,
    futureActualWriteRequiresSeparateApproval: true,
    readyForFutureActualWriteAuthorizationRequest:
      status === 'real_write_approval_boundary_ready' &&
      decision === 'ready_for_future_actual_write_authorization_request',
    trace: {
      sourceGateId: gate.gateId,
      sourceSimulatorId: gate.sourceSimulatorId,
      sourceExecutionPlanId: gate.sourceExecutionPlanId,
      sourceExecutionAuthorizationId: gate.sourceExecutionAuthorizationId,
      sourceSimulatorReviewGateStatus: gate.status,
      sourceSimulatorReviewGateDecision: gate.decision,
      approvalScope,
      qaTrace: gate.trace.qaTrace,
      humanReviewTrace: gate.trace.humanReviewTrace,
      candidateTrace: gate.trace.candidateTrace,
      contractTrace: gate.trace.contractTrace,
      simulatorTrace: gate.trace.simulatorTrace,
      reviewGateTrace: gate.trace,
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
      status === 'real_write_approval_boundary_ready'
        ? 'Approval boundary is ready for a future actual write authorization request only; no registry write, mutation, publish, shell replacement, or production writer is authorized.'
        : 'Approval boundary is not permission to write; keep registry write, mutation, publish, shell replacement, and production writer blocked.',
    jsonRoundTripStable: true,
  };
  boundary.jsonRoundTripStable = isJsonRoundTripStable(boundary);
  return boundary;
};
