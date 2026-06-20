import type { FinalRealWriteReviewGateResult } from './finalRealWriteReviewGate';
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

export const realWriteExecutionAuthorizationOwnerText =
  '授权范围：A。只授权进入 Phase 10Q — Real Write Execution Authorization，不授权真实写入 registry，不授权发布，不授权替换当前 User App Shell package，不授权创建 production writer。';

export type RealWriteExecutionAuthorizationScope =
  | 'execution_authorization_phase_only'
  | 'actual_registry_write'
  | 'publish'
  | 'user_app_shell_replacement'
  | 'production_writer_creation'
  | 'unclear';

export type RealWriteExecutionAuthorizationSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type RealWriteExecutionAuthorizationStatus =
  | 'real_write_execution_authorization_ready'
  | 'real_write_execution_authorization_ready_with_warnings'
  | 'real_write_execution_authorization_blocked'
  | 'real_write_execution_authorization_example_only';

export type RealWriteExecutionAuthorizationDecision =
  | 'eligible_for_future_real_write_execution_plan'
  | 'request_authorization_scope_clarification'
  | 'request_final_review_revision'
  | 'request_owner_authorization_for_actual_write'
  | 'keep_as_authorization_model_only'
  | 'blocked_do_not_execute_real_write';

export type RealWriteExecutionAuthorizationCheckId =
  | 'source_final_review_gate_ready'
  | 'owner_authorized_execution_authorization_phase_only'
  | 'owner_did_not_authorize_actual_registry_write'
  | 'owner_did_not_authorize_publish'
  | 'owner_did_not_authorize_user_app_shell_replacement'
  | 'owner_did_not_authorize_production_writer_creation'
  | 'dry_run_only_true'
  | 'actual_write_blocked_true'
  | 'publish_blocked_true'
  | 'package_replacement_blocked_true'
  | 'production_writer_blocked_true'
  | 'final_review_trace_preserved'
  | 'implementation_draft_trace_preserved'
  | 'production_write_still_disabled'
  | 'future_actual_write_requires_separate_approval'
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

export interface RealWriteExecutionAuthorizationCheck {
  id: RealWriteExecutionAuthorizationCheckId;
  label: string;
  passed: boolean;
  severity: RealWriteExecutionAuthorizationSeverity;
  message: string;
}

export interface RealWriteExecutionAuthorizationIssue {
  id: string;
  checkId: RealWriteExecutionAuthorizationCheckId;
  severity: Exclude<RealWriteExecutionAuthorizationSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface RealWriteExecutionAuthorizationBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface RealWriteExecutionAuthorizationTrace {
  sourceFinalReviewGateId: string;
  sourceImplementationDraftId: string;
  sourceImplementationGateId: string;
  sourceExecutionDesignId: string;
  sourceWriterDraftId: string;
  sourceFinalReviewGateStatus: FinalRealWriteReviewGateResult['status'];
  sourceReadyForExecutionAuthorization: boolean;
  ownerAuthorizationScope: RealWriteExecutionAuthorizationScope;
  ownerAuthorizationText: string;
  finalReviewTrace: FinalRealWriteReviewGateResult['trace'];
  implementationDraftTrace: FinalRealWriteReviewGateResult['trace']['implementationDraftTrace'];
  productionWriteStillDisabled: boolean;
  futureActualWriteRequiresSeparateApproval: boolean;
  noRawImageReference: boolean;
  noPersonalData: boolean;
  noMedicalClaims: boolean;
  noProductShadeClaims: boolean;
  noUnsupportedFinalClaims: boolean;
  noActualRegistryWrite: boolean;
  noUserAppShellPackageReplacement: boolean;
  noProductionPackageMarker: boolean;
  noProductionWriterCreation: boolean;
}

export interface RealWriteExecutionAuthorizationResult {
  authorizationId: string;
  sourceFinalReviewGateId: string;
  sourceImplementationDraftId: string;
  sourceImplementationGateId: string;
  sourceExecutionDesignId: string;
  sourceWriterDraftId: string;
  status: RealWriteExecutionAuthorizationStatus;
  decision: RealWriteExecutionAuthorizationDecision;
  checks: RealWriteExecutionAuthorizationCheck[];
  issues: RealWriteExecutionAuthorizationIssue[];
  blockedReasons: RealWriteExecutionAuthorizationBlockedReason[];
  warnings: RealWriteExecutionAuthorizationIssue[];
  ownerAuthorizationScope: RealWriteExecutionAuthorizationScope;
  ownerAuthorizationText: string;
  dryRunOnly: boolean;
  actualWriteBlocked: boolean;
  publishBlocked: boolean;
  packageReplacementBlocked: boolean;
  productionWriterBlocked: boolean;
  productionWriteStillDisabled: boolean;
  futureActualWriteRequiresSeparateApproval: boolean;
  authorizationModelOnly: true;
  notActualWriteAuthorization: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  doesNotCreateProductionWriter: true;
  readyForFutureRealWriteExecutionPlan: boolean;
  trace: RealWriteExecutionAuthorizationTrace;
  summary: string;
  jsonRoundTripStable: boolean;
}

export interface RealWriteExecutionAuthorizationOverrides {
  ownerAuthorizationScope?: RealWriteExecutionAuthorizationScope;
  ownerAuthorizationText?: string;
  dryRunOnly?: boolean;
  actualWriteBlocked?: boolean;
  publishBlocked?: boolean;
  packageReplacementBlocked?: boolean;
  productionWriterBlocked?: boolean;
  productionWriteStillDisabled?: boolean;
  futureActualWriteRequiresSeparateApproval?: boolean;
  note?: string;
}

const productionWriterCreationPattern =
  /productionWriterCreated|createProductionWriter|productionWriter\s*:\s*true|已创建 production writer|production_writer_ready/i;

const createCheck = (
  id: RealWriteExecutionAuthorizationCheckId,
  label: string,
  passed: boolean,
  severity: RealWriteExecutionAuthorizationSeverity,
  message: string,
): RealWriteExecutionAuthorizationCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

const issueForCheck = (
  check: RealWriteExecutionAuthorizationCheck,
  recommendation: string,
): RealWriteExecutionAuthorizationIssue | null => {
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

const sourceFinalReviewReady = (gate: FinalRealWriteReviewGateResult): boolean =>
  gate.status === 'final_real_write_review_gate_ready' ||
  gate.status === 'final_real_write_review_gate_ready_with_warnings';

const authorizationPayloadText = ({
  gate,
  ownerAuthorizationText,
  note = '',
}: {
  gate: FinalRealWriteReviewGateResult;
  ownerAuthorizationText: string;
  note?: string;
}): string =>
  JSON.stringify({
    ownerAuthorizationText,
    finalReviewSummary: gate.summary,
    finalReviewDecision: gate.decision,
    finalReviewTrace: {
      gateId: gate.gateId,
      sourceImplementationDraftId: gate.sourceImplementationDraftId,
      sourceImplementationGateId: gate.sourceImplementationGateId,
      sourceExecutionDesignId: gate.sourceExecutionDesignId,
      sourceWriterDraftId: gate.sourceWriterDraftId,
      safetyFlags: [
        gate.trace.noRawImageReference,
        gate.trace.noPersonalData,
        gate.trace.noMedicalClaims,
        gate.trace.noProductShadeClaims,
        gate.trace.noUnsupportedFinalClaims,
        gate.trace.noActualRegistryWrite,
        gate.trace.noUserAppShellPackageReplacement,
        gate.trace.noProductionPackageMarker,
      ],
    },
    note,
  });

const decisionForIssues = (
  issues: readonly RealWriteExecutionAuthorizationIssue[],
  hasWarnings: boolean,
): RealWriteExecutionAuthorizationDecision => {
  if (issues.length === 0) {
    return hasWarnings
      ? 'keep_as_authorization_model_only'
      : 'eligible_for_future_real_write_execution_plan';
  }
  if (
    issues.some((issue) =>
      [
        'owner_authorized_execution_authorization_phase_only',
        'owner_did_not_authorize_actual_registry_write',
        'owner_did_not_authorize_publish',
        'owner_did_not_authorize_user_app_shell_replacement',
        'owner_did_not_authorize_production_writer_creation',
      ].includes(issue.checkId),
    )
  ) {
    return 'request_authorization_scope_clarification';
  }
  if (
    issues.some((issue) =>
      [
        'source_final_review_gate_ready',
        'final_review_trace_preserved',
        'implementation_draft_trace_preserved',
        'trace_preserved',
      ].includes(issue.checkId),
    )
  ) {
    return 'request_final_review_revision';
  }
  if (
    issues.some((issue) =>
      [
        'dry_run_only_true',
        'actual_write_blocked_true',
        'publish_blocked_true',
        'package_replacement_blocked_true',
        'production_writer_blocked_true',
        'production_write_still_disabled',
        'future_actual_write_requires_separate_approval',
        'no_actual_registry_write',
        'no_user_app_shell_package_replacement',
        'no_production_package_marker',
        'no_production_writer_creation',
        'json_round_trip_safe',
      ].includes(issue.checkId),
    )
  ) {
    return 'blocked_do_not_execute_real_write';
  }
  return 'blocked_do_not_execute_real_write';
};

export const createRealWriteExecutionAuthorization = ({
  finalReviewGate,
  authorizationId = `real-write-execution-authorization-${finalReviewGate.gateId}`,
  overrides = {},
}: {
  finalReviewGate: FinalRealWriteReviewGateResult;
  authorizationId?: string;
  overrides?: RealWriteExecutionAuthorizationOverrides;
}): RealWriteExecutionAuthorizationResult => {
  const ownerAuthorizationScope =
    overrides.ownerAuthorizationScope ?? 'execution_authorization_phase_only';
  const ownerAuthorizationText =
    overrides.ownerAuthorizationText ?? realWriteExecutionAuthorizationOwnerText;
  const dryRunOnly = overrides.dryRunOnly ?? finalReviewGate.dryRunOnly;
  const actualWriteBlocked =
    overrides.actualWriteBlocked ?? finalReviewGate.actualWriteBlocked;
  const publishBlocked = overrides.publishBlocked ?? finalReviewGate.publishBlocked;
  const packageReplacementBlocked =
    overrides.packageReplacementBlocked ?? finalReviewGate.packageReplacementBlocked;
  const productionWriterBlocked =
    overrides.productionWriterBlocked ?? finalReviewGate.productionWriterBlocked;
  const productionWriteStillDisabled =
    overrides.productionWriteStillDisabled ??
    finalReviewGate.productionWriteStillDisabled;
  const futureActualWriteRequiresSeparateApproval =
    overrides.futureActualWriteRequiresSeparateApproval ??
    finalReviewGate.futureActualWriteRequiresSeparateApproval;
  const sourceReadyForExecutionAuthorization =
    sourceFinalReviewReady(finalReviewGate);
  const payloadText = authorizationPayloadText({
    gate: finalReviewGate,
    ownerAuthorizationText,
    note: overrides.note,
  });
  const finalReviewTracePreserved = Boolean(finalReviewGate.trace);
  const implementationDraftTracePreserved =
    Boolean(finalReviewGate.trace?.implementationDraftTrace) &&
    Boolean(finalReviewGate.trace?.implementationDraftValidationTrace);
  const tracePreserved =
    finalReviewTracePreserved &&
    implementationDraftTracePreserved &&
    finalReviewGate.trace.qaTrace.trim().length > 0 &&
    finalReviewGate.trace.humanReviewTrace.trim().length > 0 &&
    finalReviewGate.trace.candidateTrace.trim().length > 0 &&
    finalReviewGate.trace.contractTrace.trim().length > 0;
  const noRawImageReference =
    finalReviewGate.trace.noRawImageReference &&
    !registryPreparationRawImageReferencePattern.test(payloadText);
  const noPersonalData =
    finalReviewGate.trace.noPersonalData &&
    !registryPreparationPersonalDataPattern.test(payloadText);
  const noMedicalClaims =
    finalReviewGate.trace.noMedicalClaims &&
    !registryPreparationMedicalClaimPattern.test(payloadText);
  const noProductShadeClaims =
    finalReviewGate.trace.noProductShadeClaims &&
    !registryPreparationShadeClaimPattern.test(payloadText);
  const noUnsupportedFinalClaims =
    finalReviewGate.trace.noUnsupportedFinalClaims &&
    !registryPreparationFinalClaimPattern.test(payloadText);
  const noActualRegistryWrite =
    actualWriteBlocked &&
    finalReviewGate.noActualRegistryWrite &&
    finalReviewGate.trace.noActualRegistryWrite &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    packageReplacementBlocked &&
    finalReviewGate.noUserAppShellPackageReplacement &&
    finalReviewGate.trace.noUserAppShellPackageReplacement &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    finalReviewGate.notProductionPackage &&
    finalReviewGate.trace.noProductionPackageMarker &&
    !registryPreparationProductionMarkerPattern.test(payloadText);
  const noProductionWriterCreation =
    productionWriterBlocked &&
    finalReviewGate.notProductionWriter &&
    !productionWriterCreationPattern.test(payloadText);

  const checks: RealWriteExecutionAuthorizationCheck[] = [
    createCheck(
      'source_final_review_gate_ready',
      'Source final review gate ready',
      sourceReadyForExecutionAuthorization,
      'blocking',
      'Real write execution authorization requires a ready Phase 10P final review gate.',
    ),
    createCheck(
      'owner_authorized_execution_authorization_phase_only',
      'Owner authorized execution authorization phase only',
      ownerAuthorizationScope === 'execution_authorization_phase_only',
      'blocking',
      'Owner authorization for Phase 10Q must be scoped to execution_authorization_phase_only.',
    ),
    createCheck(
      'owner_did_not_authorize_actual_registry_write',
      'Owner did not authorize actual registry write',
      ownerAuthorizationScope !== 'actual_registry_write',
      'blocking',
      'Owner authorization must not be interpreted as actual registry write authorization.',
    ),
    createCheck(
      'owner_did_not_authorize_publish',
      'Owner did not authorize publish',
      ownerAuthorizationScope !== 'publish',
      'blocking',
      'Owner authorization must not be interpreted as publication authorization.',
    ),
    createCheck(
      'owner_did_not_authorize_user_app_shell_replacement',
      'Owner did not authorize User App Shell package replacement',
      ownerAuthorizationScope !== 'user_app_shell_replacement',
      'blocking',
      'Owner authorization must not be interpreted as permission to replace the current User App Shell package.',
    ),
    createCheck(
      'owner_did_not_authorize_production_writer_creation',
      'Owner did not authorize production writer creation',
      ownerAuthorizationScope !== 'production_writer_creation',
      'blocking',
      'Owner authorization must not be interpreted as permission to create a production writer.',
    ),
    createCheck(
      'dry_run_only_true',
      'Dry-run only true',
      dryRunOnly,
      'blocking',
      'Execution authorization model must keep dryRunOnly true.',
    ),
    createCheck(
      'actual_write_blocked_true',
      'Actual write blocked true',
      actualWriteBlocked,
      'blocking',
      'Execution authorization model must keep actual registry writes blocked.',
    ),
    createCheck(
      'publish_blocked_true',
      'Publish blocked true',
      publishBlocked,
      'blocking',
      'Execution authorization model must keep publication blocked.',
    ),
    createCheck(
      'package_replacement_blocked_true',
      'Package replacement blocked true',
      packageReplacementBlocked,
      'blocking',
      'Execution authorization model must not replace the current User App Shell package.',
    ),
    createCheck(
      'production_writer_blocked_true',
      'Production writer blocked true',
      productionWriterBlocked,
      'blocking',
      'Execution authorization model must not create a production writer.',
    ),
    createCheck(
      'final_review_trace_preserved',
      'Final review trace preserved',
      finalReviewTracePreserved,
      'blocking',
      'Execution authorization model requires Phase 10P final review trace.',
    ),
    createCheck(
      'implementation_draft_trace_preserved',
      'Implementation draft trace preserved',
      implementationDraftTracePreserved,
      'blocking',
      'Execution authorization model requires Phase 10O implementation draft trace.',
    ),
    createCheck(
      'production_write_still_disabled',
      'Production write still disabled',
      productionWriteStillDisabled,
      'blocking',
      'Execution authorization model must keep production write disabled.',
    ),
    createCheck(
      'future_actual_write_requires_separate_approval',
      'Future actual write requires separate approval',
      futureActualWriteRequiresSeparateApproval,
      'blocking',
      'Future actual registry write must require separate owner approval.',
    ),
    createCheck(
      'trace_preserved',
      'Trace preserved',
      tracePreserved,
      'blocking',
      'Execution authorization model requires complete final review and implementation trace.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      noRawImageReference,
      'blocking',
      'Execution authorization model must not include raw images, object URLs, base64, local paths, or runtime asset names.',
    ),
    createCheck(
      'no_personal_data',
      'No personal data',
      noPersonalData,
      'blocking',
      'Execution authorization model must not include personal, contact, health, sensitive identity, or biometric data.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      noMedicalClaims,
      'blocking',
      'Execution authorization model must not include medical, diagnosis, or treatment claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      noProductShadeClaims,
      'blocking',
      'Execution authorization model must not include product shade or brand-specific claims.',
    ),
    createCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      noUnsupportedFinalClaims,
      'blocking',
      'Execution authorization model must not include final recognition, final approval, or AI confirmation claims.',
    ),
    createCheck(
      'no_actual_registry_write',
      'No actual registry write',
      noActualRegistryWrite,
      'blocking',
      'Execution authorization model must not execute, persist, or mark actual registry writes.',
    ),
    createCheck(
      'no_user_app_shell_package_replacement',
      'No User App Shell package replacement',
      noUserAppShellPackageReplacement,
      'blocking',
      'Execution authorization model must not replace the current User App Shell package.',
    ),
    createCheck(
      'no_production_package_marker',
      'No production package marker',
      noProductionPackageMarker,
      'blocking',
      'Execution authorization model must not include production package markers.',
    ),
    createCheck(
      'no_production_writer_creation',
      'No production writer creation',
      noProductionWriterCreation,
      'blocking',
      'Execution authorization model must not create or mark a production writer.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      finalReviewGate.jsonRoundTripStable,
      'blocking',
      'Execution authorization model input must be JSON round-trip stable.',
    ),
  ];

  const recommendationsByCheck: Record<RealWriteExecutionAuthorizationCheckId, string> = {
    source_final_review_gate_ready:
      'Return to Phase 10P and resolve final review gate readiness first.',
    owner_authorized_execution_authorization_phase_only:
      'Clarify owner authorization so it only allows entering Phase 10Q execution authorization.',
    owner_did_not_authorize_actual_registry_write:
      'Remove any actual-write authorization interpretation from Phase 10Q.',
    owner_did_not_authorize_publish:
      'Remove any publication authorization interpretation from Phase 10Q.',
    owner_did_not_authorize_user_app_shell_replacement:
      'Remove any current User App Shell package replacement authorization interpretation.',
    owner_did_not_authorize_production_writer_creation:
      'Remove any production writer creation authorization interpretation.',
    dry_run_only_true: 'Restore dryRunOnly before execution authorization can continue.',
    actual_write_blocked_true:
      'Restore actualWriteBlocked and remove registry write execution markers.',
    publish_blocked_true:
      'Restore publishBlocked and keep publication out of scope.',
    package_replacement_blocked_true:
      'Restore packageReplacementBlocked and preserve the current User App Shell package.',
    production_writer_blocked_true:
      'Restore productionWriterBlocked and keep this phase from creating a production writer.',
    final_review_trace_preserved:
      'Restore Phase 10P final review trace before execution authorization.',
    implementation_draft_trace_preserved:
      'Restore Phase 10O implementation draft trace before execution authorization.',
    production_write_still_disabled:
      'Keep production write disabled until a separate future actual-write authorization.',
    future_actual_write_requires_separate_approval:
      'Require separate future owner approval before any actual registry write execution.',
    trace_preserved:
      'Restore complete 10O/10P trace before execution authorization.',
    no_raw_image_reference:
      'Remove raw images, object URLs, base64, local paths, and runtime assets.',
    no_personal_data:
      'Remove personal, contact, health, sensitive identity, and biometric data.',
    no_medical_claims: 'Remove medical, diagnosis, or treatment claims.',
    no_product_shade_claims:
      'Keep product copy as category placeholders without shade claims.',
    no_unsupported_final_claims:
      'Keep copy authorization-model-only and human-review-only.',
    no_actual_registry_write:
      'Remove actual registry write markers and keep 10Q as authorization model only.',
    no_user_app_shell_package_replacement:
      'Remove shell replacement markers and preserve the current User App Shell package.',
    no_production_package_marker:
      'Remove production package markers and keep this phase non-production.',
    no_production_writer_creation:
      'Remove production writer creation markers and keep this phase model-only.',
    json_round_trip_safe: 'Remove non-serializable values before handoff.',
  };
  const issues = checks
    .map((check) => issueForCheck(check, recommendationsByCheck[check.id]))
    .filter(
      (issue): issue is RealWriteExecutionAuthorizationIssue => Boolean(issue),
    );
  const hasWarnings =
    finalReviewGate.status === 'final_real_write_review_gate_ready_with_warnings' ||
    finalReviewGate.warnings.length > 0;
  const status: RealWriteExecutionAuthorizationStatus =
    finalReviewGate.status === 'final_real_write_review_gate_example_only'
      ? 'real_write_execution_authorization_example_only'
      : issues.some((issue) => issue.severity === 'blocking')
        ? 'real_write_execution_authorization_blocked'
        : hasWarnings
          ? 'real_write_execution_authorization_ready_with_warnings'
          : 'real_write_execution_authorization_ready';
  const authorizationShell: RealWriteExecutionAuthorizationResult = {
    authorizationId,
    sourceFinalReviewGateId: finalReviewGate.gateId,
    sourceImplementationDraftId: finalReviewGate.sourceImplementationDraftId,
    sourceImplementationGateId: finalReviewGate.sourceImplementationGateId,
    sourceExecutionDesignId: finalReviewGate.sourceExecutionDesignId,
    sourceWriterDraftId: finalReviewGate.sourceWriterDraftId,
    status,
    decision: decisionForIssues(issues, hasWarnings),
    checks,
    issues,
    blockedReasons: issues
      .filter((issue) => issue.severity === 'blocking')
      .map((issue) => ({
        id: issue.checkId,
        message: issue.message,
        recommendation: issue.recommendation,
      })),
    warnings: hasWarnings
      ? [
          {
            id: 'source_final_review_warning',
            checkId: 'source_final_review_gate_ready',
            severity: 'warning',
            message: 'Source final review gate is ready with warnings.',
            recommendation:
              'Keep Phase 10Q as authorization model only until warnings are explicitly reviewed.',
          },
        ]
      : [],
    ownerAuthorizationScope,
    ownerAuthorizationText,
    dryRunOnly,
    actualWriteBlocked,
    publishBlocked,
    packageReplacementBlocked,
    productionWriterBlocked,
    productionWriteStillDisabled,
    futureActualWriteRequiresSeparateApproval,
    authorizationModelOnly: true,
    notActualWriteAuthorization: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    doesNotCreateProductionWriter: true,
    readyForFutureRealWriteExecutionPlan:
      status === 'real_write_execution_authorization_ready',
    trace: {
      sourceFinalReviewGateId: finalReviewGate.gateId,
      sourceImplementationDraftId: finalReviewGate.sourceImplementationDraftId,
      sourceImplementationGateId: finalReviewGate.sourceImplementationGateId,
      sourceExecutionDesignId: finalReviewGate.sourceExecutionDesignId,
      sourceWriterDraftId: finalReviewGate.sourceWriterDraftId,
      sourceFinalReviewGateStatus: finalReviewGate.status,
      sourceReadyForExecutionAuthorization,
      ownerAuthorizationScope,
      ownerAuthorizationText,
      finalReviewTrace: finalReviewGate.trace,
      implementationDraftTrace:
        finalReviewGate.trace.implementationDraftTrace,
      productionWriteStillDisabled,
      futureActualWriteRequiresSeparateApproval,
      noRawImageReference,
      noPersonalData,
      noMedicalClaims,
      noProductShadeClaims,
      noUnsupportedFinalClaims,
      noActualRegistryWrite,
      noUserAppShellPackageReplacement,
      noProductionPackageMarker,
      noProductionWriterCreation,
    },
    summary:
      status === 'real_write_execution_authorization_ready'
        ? 'Real write execution authorization is ready for a future execution plan only; it is not actual registry write authorization.'
        : status === 'real_write_execution_authorization_ready_with_warnings'
          ? 'Real write execution authorization is ready with warnings and remains authorization-model-only.'
          : 'Real write execution authorization is blocked; do not execute real write.',
    jsonRoundTripStable: true,
  };
  authorizationShell.jsonRoundTripStable =
    isJsonRoundTripStable(authorizationShell);
  return authorizationShell;
};
