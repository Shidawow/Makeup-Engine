import type { RealRegistryWriteImplementationDraft } from './realRegistryWriteImplementationDraft';
import type { RealRegistryWriteImplementationDraftValidationResult } from './realRegistryWriteImplementationDraftValidation';
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

export const finalRealWriteOwnerAuthorizationText =
  '授权范围：A。只授权进入 Phase 10P 最终真实写入复核闸门，不授权真实写入 registry，不授权发布，不授权替换当前 User App Shell package。';

export type FinalRealWriteOwnerAuthorizationScope =
  | 'review_gate_only'
  | 'actual_write'
  | 'publish'
  | 'user_app_shell_replacement'
  | 'production_writer'
  | 'unclear';

export type FinalRealWriteReviewGateSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type FinalRealWriteReviewGateStatus =
  | 'final_real_write_review_gate_ready'
  | 'final_real_write_review_gate_ready_with_warnings'
  | 'final_real_write_review_gate_blocked'
  | 'final_real_write_review_gate_example_only';

export type FinalRealWriteReviewGateDecision =
  | 'eligible_for_future_real_write_execution_authorization'
  | 'request_writer_interface_revision'
  | 'request_transaction_draft_revision'
  | 'request_write_lock_revision'
  | 'request_audit_event_revision'
  | 'request_rollback_command_revision'
  | 'request_owner_authorization_clarification'
  | 'keep_as_final_review_only'
  | 'blocked_do_not_execute_real_write';

export type FinalRealWriteReviewGateCheckId =
  | 'source_implementation_draft_validation_ready'
  | 'owner_authorized_review_gate_only'
  | 'owner_did_not_authorize_actual_write'
  | 'owner_did_not_authorize_publish'
  | 'owner_did_not_authorize_user_app_shell_replacement'
  | 'dry_run_only_true'
  | 'actual_write_blocked_true'
  | 'publish_blocked_true'
  | 'package_replacement_blocked_true'
  | 'production_writer_blocked_true'
  | 'writer_interface_draft_present'
  | 'transaction_draft_present'
  | 'write_lock_draft_present'
  | 'audit_event_draft_present'
  | 'rollback_command_draft_present'
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
  | 'json_round_trip_safe';

export interface FinalRealWriteReviewGateCheck {
  id: FinalRealWriteReviewGateCheckId;
  label: string;
  passed: boolean;
  severity: FinalRealWriteReviewGateSeverity;
  message: string;
}

export interface FinalRealWriteReviewGateIssue {
  id: string;
  checkId: FinalRealWriteReviewGateCheckId;
  severity: Exclude<FinalRealWriteReviewGateSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface FinalRealWriteReviewGateBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface FinalRealWriteReviewGateTrace {
  sourceImplementationDraftId: string;
  sourceImplementationGateId: string;
  sourceExecutionDesignId: string;
  sourceWriterDraftId: string;
  sourceImplementationDraftValidationStatus: RealRegistryWriteImplementationDraftValidationResult['status'];
  sourceReadyForFinalReviewGate: boolean;
  ownerAuthorizationScope: FinalRealWriteOwnerAuthorizationScope;
  ownerAuthorizationText: string;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: RealRegistryWriteImplementationDraft['previewTrace'];
  gateTrace: RealRegistryWriteImplementationDraft['gateTrace'];
  writerTrace: RealRegistryWriteImplementationDraft['writerTrace'];
  executionTrace: RealRegistryWriteImplementationDraft['executionTrace'];
  implementationGateTrace: RealRegistryWriteImplementationDraft['implementationGateTrace'];
  implementationDraftTrace: RealRegistryWriteImplementationDraft['trace'];
  implementationDraftValidationTrace: Pick<
    RealRegistryWriteImplementationDraftValidationResult,
    | 'status'
    | 'readyForFinalRealWriteReviewGate'
    | 'implementationDraftOnly'
    | 'dryRunOnly'
    | 'noActualRegistryWrite'
    | 'notPublished'
    | 'noUserAppShellPackageReplacement'
    | 'notProductionWriter'
    | 'notProductionPackage'
  >;
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
}

export interface FinalRealWriteReviewGateResult {
  gateId: string;
  sourceImplementationDraftId: string;
  sourceImplementationGateId: string;
  sourceExecutionDesignId: string;
  sourceWriterDraftId: string;
  status: FinalRealWriteReviewGateStatus;
  decision: FinalRealWriteReviewGateDecision;
  checks: FinalRealWriteReviewGateCheck[];
  issues: FinalRealWriteReviewGateIssue[];
  blockedReasons: FinalRealWriteReviewGateBlockedReason[];
  warnings: FinalRealWriteReviewGateIssue[];
  ownerAuthorizationScope: FinalRealWriteOwnerAuthorizationScope;
  ownerAuthorizationText: string;
  dryRunOnly: boolean;
  actualWriteBlocked: boolean;
  publishBlocked: boolean;
  packageReplacementBlocked: boolean;
  productionWriterBlocked: boolean;
  productionWriteStillDisabled: boolean;
  futureActualWriteRequiresSeparateApproval: boolean;
  finalReviewGateOnly: true;
  notActualWriteAuthorization: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  eligibleForFutureRealWriteExecutionAuthorization: boolean;
  trace: FinalRealWriteReviewGateTrace;
  summary: string;
  jsonRoundTripStable: boolean;
}

export interface FinalRealWriteReviewGateOverrides {
  ownerAuthorizationScope?: FinalRealWriteOwnerAuthorizationScope;
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

const createCheck = (
  id: FinalRealWriteReviewGateCheckId,
  label: string,
  passed: boolean,
  severity: FinalRealWriteReviewGateSeverity,
  message: string,
): FinalRealWriteReviewGateCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

const issueForCheck = (
  check: FinalRealWriteReviewGateCheck,
  recommendation: string,
): FinalRealWriteReviewGateIssue | null => {
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

const reviewPayloadText = ({
  draft,
  ownerAuthorizationText,
  note = '',
}: {
  draft: RealRegistryWriteImplementationDraft;
  ownerAuthorizationText: string;
  note?: string;
}): string =>
  JSON.stringify({
    ownerAuthorizationText,
    writerInterfaceDraft: draft.writerInterfaceDraft?.summary,
    transactionDraft: draft.transactionDraft?.summary,
    writeLockDraft: draft.writeLockDraft?.summary,
    auditEventDraft: draft.auditEventDraft?.summary,
    rollbackCommandDraft: draft.rollbackCommandDraft?.summary,
    summary: draft.summary,
    note,
  });

const validationReady = (
  validation: RealRegistryWriteImplementationDraftValidationResult,
): boolean =>
  validation.readyForFinalRealWriteReviewGate &&
  (validation.status === 'implementation_draft_validation_ready' ||
    validation.status === 'implementation_draft_validation_ready_with_warnings');

const decisionForIssues = (
  issues: readonly FinalRealWriteReviewGateIssue[],
  hasWarnings: boolean,
): FinalRealWriteReviewGateDecision => {
  if (issues.length === 0) {
    return hasWarnings
      ? 'keep_as_final_review_only'
      : 'eligible_for_future_real_write_execution_authorization';
  }
  if (
    issues.some((issue) =>
      [
        'owner_authorized_review_gate_only',
        'owner_did_not_authorize_actual_write',
        'owner_did_not_authorize_publish',
        'owner_did_not_authorize_user_app_shell_replacement',
      ].includes(issue.checkId),
    )
  ) {
    return 'request_owner_authorization_clarification';
  }
  if (
    issues.some((issue) =>
      [
        'source_implementation_draft_validation_ready',
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
        'json_round_trip_safe',
      ].includes(issue.checkId),
    )
  ) {
    return 'blocked_do_not_execute_real_write';
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
    return 'blocked_do_not_execute_real_write';
  }
  if (issues.some((issue) => issue.checkId === 'writer_interface_draft_present')) {
    return 'request_writer_interface_revision';
  }
  if (issues.some((issue) => issue.checkId === 'transaction_draft_present')) {
    return 'request_transaction_draft_revision';
  }
  if (issues.some((issue) => issue.checkId === 'write_lock_draft_present')) {
    return 'request_write_lock_revision';
  }
  if (issues.some((issue) => issue.checkId === 'audit_event_draft_present')) {
    return 'request_audit_event_revision';
  }
  if (issues.some((issue) => issue.checkId === 'rollback_command_draft_present')) {
    return 'request_rollback_command_revision';
  }
  return 'blocked_do_not_execute_real_write';
};

export const createFinalRealWriteReviewGate = ({
  draft,
  validation,
  gateId = `final-real-write-review-gate-${draft.implementationDraftId}`,
  overrides = {},
}: {
  draft: RealRegistryWriteImplementationDraft;
  validation: RealRegistryWriteImplementationDraftValidationResult;
  gateId?: string;
  overrides?: FinalRealWriteReviewGateOverrides;
}): FinalRealWriteReviewGateResult => {
  const ownerAuthorizationScope =
    overrides.ownerAuthorizationScope ?? 'review_gate_only';
  const ownerAuthorizationText =
    overrides.ownerAuthorizationText ?? finalRealWriteOwnerAuthorizationText;
  const sourceReadyForFinalReviewGate =
    draft.readyForFinalRealWriteReviewGate && validationReady(validation);
  const dryRunOnly = overrides.dryRunOnly ?? draft.dryRunOnly;
  const actualWriteBlocked =
    overrides.actualWriteBlocked ?? draft.actualWriteBlocked;
  const publishBlocked = overrides.publishBlocked ?? draft.publishBlocked;
  const packageReplacementBlocked =
    overrides.packageReplacementBlocked ?? draft.packageReplacementBlocked;
  const productionWriterBlocked =
    overrides.productionWriterBlocked ?? draft.productionWriterBlocked;
  const productionWriteStillDisabled =
    overrides.productionWriteStillDisabled ??
    (actualWriteBlocked && productionWriterBlocked);
  const futureActualWriteRequiresSeparateApproval =
    overrides.futureActualWriteRequiresSeparateApproval ?? true;
  const payloadText = reviewPayloadText({
    draft,
    ownerAuthorizationText,
    note: overrides.note,
  });
  const tracePreserved =
    draft.qaTrace.trim().length > 0 &&
    draft.humanReviewTrace.trim().length > 0 &&
    draft.candidateTrace.trim().length > 0 &&
    draft.contractTrace.trim().length > 0 &&
    Boolean(draft.previewTrace) &&
    Boolean(draft.gateTrace) &&
    Boolean(draft.writerTrace) &&
    Boolean(draft.executionTrace) &&
    Boolean(draft.implementationGateTrace) &&
    Boolean(draft.trace);
  const writerInterfaceDraftPresent =
    Boolean(draft.writerInterfaceDraft) &&
    draft.writerInterfaceDraft?.dryRunOnly === true &&
    draft.writerInterfaceDraft?.actualWriteBlocked === true &&
    draft.writerInterfaceDraft?.productionWriterBlocked === true;
  const transactionDraftPresent =
    Boolean(draft.transactionDraft) &&
    draft.transactionDraft?.dryRunOnly === true &&
    draft.transactionDraft?.actualWriteBlocked === true;
  const writeLockDraftPresent =
    Boolean(draft.writeLockDraft) &&
    draft.writeLockDraft?.dryRunOnly === true &&
    draft.writeLockDraft?.requiredBeforeAnyFutureWrite === true;
  const auditEventDraftPresent =
    Boolean(draft.auditEventDraft) &&
    draft.auditEventDraft?.dryRunOnly === true &&
    draft.auditEventDraft?.actualAuditOnly === true;
  const rollbackCommandDraftPresent =
    Boolean(draft.rollbackCommandDraft) &&
    draft.rollbackCommandDraft?.dryRunOnly === true &&
    draft.rollbackCommandDraft?.actualRollbackBlocked === true;
  const noRawImageReference =
    draft.trace.noRawImageReference &&
    !registryPreparationRawImageReferencePattern.test(payloadText);
  const noPersonalData =
    draft.trace.noPersonalData &&
    !registryPreparationPersonalDataPattern.test(payloadText);
  const noMedicalClaims =
    draft.trace.noMedicalClaims &&
    !registryPreparationMedicalClaimPattern.test(payloadText);
  const noProductShadeClaims =
    draft.trace.noProductShadeClaims &&
    !registryPreparationShadeClaimPattern.test(payloadText);
  const noUnsupportedFinalClaims =
    draft.trace.noUnsupportedFinalClaims &&
    !registryPreparationFinalClaimPattern.test(payloadText);
  const noActualRegistryWrite =
    actualWriteBlocked &&
    draft.noActualRegistryWrite &&
    draft.trace.noActualRegistryWrite &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    packageReplacementBlocked &&
    draft.noUserAppShellPackageReplacement &&
    draft.trace.noUserAppShellPackageReplacement &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    draft.notProductionPackage &&
    draft.notProductionWriter &&
    productionWriterBlocked &&
    draft.trace.noProductionPackageMarker &&
    !registryPreparationProductionMarkerPattern.test(payloadText);

  const checks: FinalRealWriteReviewGateCheck[] = [
    createCheck(
      'source_implementation_draft_validation_ready',
      'Source implementation draft validation ready',
      sourceReadyForFinalReviewGate,
      'blocking',
      'Final real write review gate requires a ready Phase 10O implementation draft validation result.',
    ),
    createCheck(
      'owner_authorized_review_gate_only',
      'Owner authorized review gate only',
      ownerAuthorizationScope === 'review_gate_only',
      'blocking',
      'Owner authorization for Phase 10P must be scoped to review_gate_only.',
    ),
    createCheck(
      'owner_did_not_authorize_actual_write',
      'Owner did not authorize actual write',
      ownerAuthorizationScope !== 'actual_write',
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
      'dry_run_only_true',
      'Dry-run only true',
      dryRunOnly,
      'blocking',
      'Final review gate must keep dryRunOnly true.',
    ),
    createCheck(
      'actual_write_blocked_true',
      'Actual write blocked true',
      actualWriteBlocked,
      'blocking',
      'Final review gate must keep actual registry writes blocked.',
    ),
    createCheck(
      'publish_blocked_true',
      'Publish blocked true',
      publishBlocked,
      'blocking',
      'Final review gate must keep publication blocked.',
    ),
    createCheck(
      'package_replacement_blocked_true',
      'Package replacement blocked true',
      packageReplacementBlocked,
      'blocking',
      'Final review gate must not replace the current User App Shell package.',
    ),
    createCheck(
      'production_writer_blocked_true',
      'Production writer blocked true',
      productionWriterBlocked,
      'blocking',
      'Final review gate must not create a production writer.',
    ),
    createCheck(
      'writer_interface_draft_present',
      'Writer interface draft present',
      writerInterfaceDraftPresent,
      'blocking',
      'Final review gate requires a dry-run writer interface draft.',
    ),
    createCheck(
      'transaction_draft_present',
      'Transaction draft present',
      transactionDraftPresent,
      'blocking',
      'Final review gate requires a dry-run transaction draft.',
    ),
    createCheck(
      'write_lock_draft_present',
      'Write lock draft present',
      writeLockDraftPresent,
      'blocking',
      'Final review gate requires a write lock draft.',
    ),
    createCheck(
      'audit_event_draft_present',
      'Audit event draft present',
      auditEventDraftPresent,
      'blocking',
      'Final review gate requires an audit event draft.',
    ),
    createCheck(
      'rollback_command_draft_present',
      'Rollback command draft present',
      rollbackCommandDraftPresent,
      'blocking',
      'Final review gate requires a rollback command draft.',
    ),
    createCheck(
      'production_write_still_disabled',
      'Production write still disabled',
      productionWriteStillDisabled,
      'blocking',
      'Final review gate must keep production write disabled.',
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
      'Final review gate requires QA, human review, candidate, contract, preview, gate, writer, execution, implementation gate, and implementation draft trace.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      noRawImageReference,
      'blocking',
      'Final review gate must not include raw images, object URLs, base64, local paths, or runtime asset names.',
    ),
    createCheck(
      'no_personal_data',
      'No personal data',
      noPersonalData,
      'blocking',
      'Final review gate must not include personal, contact, health, sensitive identity, or biometric data.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      noMedicalClaims,
      'blocking',
      'Final review gate must not include medical, diagnosis, or treatment claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      noProductShadeClaims,
      'blocking',
      'Final review gate must not include product shade or brand-specific claims.',
    ),
    createCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      noUnsupportedFinalClaims,
      'blocking',
      'Final review gate must not include final recognition, final approval, or AI confirmation claims.',
    ),
    createCheck(
      'no_actual_registry_write',
      'No actual registry write',
      noActualRegistryWrite,
      'blocking',
      'Final review gate must not execute, persist, or mark actual registry writes.',
    ),
    createCheck(
      'no_user_app_shell_package_replacement',
      'No User App Shell package replacement',
      noUserAppShellPackageReplacement,
      'blocking',
      'Final review gate must not replace the current User App Shell package.',
    ),
    createCheck(
      'no_production_package_marker',
      'No production package marker',
      noProductionPackageMarker,
      'blocking',
      'Final review gate must not include production writer or package markers.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      draft.jsonRoundTripStable && validation.jsonRoundTripStable,
      'blocking',
      'Final review gate input must be JSON round-trip stable.',
    ),
  ];

  const recommendationsByCheck: Record<FinalRealWriteReviewGateCheckId, string> = {
    source_implementation_draft_validation_ready:
      'Return to Phase 10O and resolve implementation draft validation first.',
    owner_authorized_review_gate_only:
      'Clarify owner authorization so it only allows entering the Phase 10P review gate.',
    owner_did_not_authorize_actual_write:
      'Remove any actual-write authorization interpretation from this gate.',
    owner_did_not_authorize_publish:
      'Remove any publication authorization interpretation from this gate.',
    owner_did_not_authorize_user_app_shell_replacement:
      'Remove any current User App Shell package replacement authorization interpretation.',
    dry_run_only_true: 'Restore dryRunOnly before final review.',
    actual_write_blocked_true:
      'Restore actualWriteBlocked and remove registry write execution markers.',
    publish_blocked_true:
      'Restore publishBlocked and keep publication out of scope.',
    package_replacement_blocked_true:
      'Restore packageReplacementBlocked and preserve the current User App Shell package.',
    production_writer_blocked_true:
      'Restore productionWriterBlocked and keep this gate from creating a production writer.',
    writer_interface_draft_present:
      'Revise the 10O writer interface draft before final review.',
    transaction_draft_present:
      'Revise the 10O transaction draft before final review.',
    write_lock_draft_present:
      'Revise the 10O write lock draft before final review.',
    audit_event_draft_present:
      'Revise the 10O audit event draft before final review.',
    rollback_command_draft_present:
      'Revise the 10O rollback command draft before final review.',
    production_write_still_disabled:
      'Keep production write disabled until a separate future authorization phase.',
    future_actual_write_requires_separate_approval:
      'Require separate future owner approval before any actual registry write execution.',
    trace_preserved:
      'Restore complete 10A-10O trace before final review.',
    no_raw_image_reference:
      'Remove raw images, object URLs, base64, local paths, and runtime assets.',
    no_personal_data:
      'Remove personal, contact, health, sensitive identity, and biometric data.',
    no_medical_claims: 'Remove medical, diagnosis, or treatment claims.',
    no_product_shade_claims:
      'Keep product copy as category placeholders without shade claims.',
    no_unsupported_final_claims:
      'Keep copy review-gate-only and human-review-only.',
    no_actual_registry_write:
      'Remove actual registry write markers and keep 10P as a final review gate.',
    no_user_app_shell_package_replacement:
      'Remove shell replacement markers and preserve the current User App Shell package.',
    no_production_package_marker:
      'Remove production markers and keep this gate non-production.',
    json_round_trip_safe: 'Remove non-serializable values before handoff.',
  };
  const issues = checks
    .map((check) => issueForCheck(check, recommendationsByCheck[check.id]))
    .filter(
      (issue): issue is FinalRealWriteReviewGateIssue => Boolean(issue),
    );
  const hasWarnings =
    validation.status === 'implementation_draft_validation_ready_with_warnings' ||
    draft.implementationDraftStatus === 'implementation_draft_ready_with_warnings' ||
    draft.warnings.length > 0;
  const status: FinalRealWriteReviewGateStatus =
    draft.implementationDraftStatus === 'implementation_draft_example_only'
      ? 'final_real_write_review_gate_example_only'
      : issues.some((issue) => issue.severity === 'blocking')
        ? 'final_real_write_review_gate_blocked'
        : hasWarnings
          ? 'final_real_write_review_gate_ready_with_warnings'
          : 'final_real_write_review_gate_ready';
  const gateShell: FinalRealWriteReviewGateResult = {
    gateId,
    sourceImplementationDraftId: draft.implementationDraftId,
    sourceImplementationGateId: draft.sourceImplementationGateId,
    sourceExecutionDesignId: draft.sourceExecutionDesignId,
    sourceWriterDraftId: draft.sourceWriterDraftId,
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
            id: 'source_implementation_draft_warning',
            checkId: 'source_implementation_draft_validation_ready',
            severity: 'warning',
            message:
              'Source implementation draft validation is ready with warnings.',
            recommendation:
              'Keep Phase 10P as final review only until warnings are explicitly reviewed.',
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
    finalReviewGateOnly: true,
    notActualWriteAuthorization: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    eligibleForFutureRealWriteExecutionAuthorization:
      status === 'final_real_write_review_gate_ready',
    trace: {
      sourceImplementationDraftId: draft.implementationDraftId,
      sourceImplementationGateId: draft.sourceImplementationGateId,
      sourceExecutionDesignId: draft.sourceExecutionDesignId,
      sourceWriterDraftId: draft.sourceWriterDraftId,
      sourceImplementationDraftValidationStatus: validation.status,
      sourceReadyForFinalReviewGate,
      ownerAuthorizationScope,
      ownerAuthorizationText,
      qaTrace: draft.qaTrace,
      humanReviewTrace: draft.humanReviewTrace,
      candidateTrace: draft.candidateTrace,
      contractTrace: draft.contractTrace,
      previewTrace: draft.previewTrace,
      gateTrace: draft.gateTrace,
      writerTrace: draft.writerTrace,
      executionTrace: draft.executionTrace,
      implementationGateTrace: draft.implementationGateTrace,
      implementationDraftTrace: draft.trace,
      implementationDraftValidationTrace: {
        status: validation.status,
        readyForFinalRealWriteReviewGate:
          validation.readyForFinalRealWriteReviewGate,
        implementationDraftOnly: validation.implementationDraftOnly,
        dryRunOnly: validation.dryRunOnly,
        noActualRegistryWrite: validation.noActualRegistryWrite,
        notPublished: validation.notPublished,
        noUserAppShellPackageReplacement:
          validation.noUserAppShellPackageReplacement,
        notProductionWriter: validation.notProductionWriter,
        notProductionPackage: validation.notProductionPackage,
      },
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
    },
    summary:
      'Final real write review gate records owner authorization as review_gate_only and cannot execute registry writes, publish, create a production writer, or replace the current User App Shell package.',
    jsonRoundTripStable: false,
  };
  gateShell.jsonRoundTripStable = isJsonRoundTripStable(gateShell);
  return gateShell;
};
