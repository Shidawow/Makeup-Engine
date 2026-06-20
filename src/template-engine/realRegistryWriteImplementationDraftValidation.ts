import type {
  RealRegistryWriteImplementationDraft,
  RealRegistryWriteImplementationDraftStatus,
} from './realRegistryWriteImplementationDraft';
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

export type RealRegistryWriteImplementationDraftValidationSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type RealRegistryWriteImplementationDraftValidationStatus =
  | 'implementation_draft_validation_ready'
  | 'implementation_draft_validation_ready_with_warnings'
  | 'implementation_draft_validation_blocked';

export type RealRegistryWriteImplementationDraftValidationCheckId =
  | 'source_implementation_gate_ready'
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

export interface RealRegistryWriteImplementationDraftValidationCheck {
  id: RealRegistryWriteImplementationDraftValidationCheckId;
  label: string;
  passed: boolean;
  severity: RealRegistryWriteImplementationDraftValidationSeverity;
  message: string;
}

export interface RealRegistryWriteImplementationDraftValidationIssue {
  id: string;
  checkId: RealRegistryWriteImplementationDraftValidationCheckId;
  severity: Exclude<
    RealRegistryWriteImplementationDraftValidationSeverity,
    'info'
  >;
  message: string;
  recommendation: string;
}

export interface RealRegistryWriteImplementationDraftValidationRecommendation {
  id: string;
  message: string;
  action:
    | 'continue_to_final_real_write_review_gate'
    | 'request_writer_interface_revision'
    | 'request_transaction_draft_revision'
    | 'request_write_lock_revision'
    | 'request_audit_event_revision'
    | 'request_rollback_command_revision'
    | 'request_owner_authorization_review'
    | 'keep_as_implementation_draft_only'
    | 'block_production_writer_creation';
}

export interface RealRegistryWriteImplementationDraftValidationResult {
  status: RealRegistryWriteImplementationDraftValidationStatus;
  checks: RealRegistryWriteImplementationDraftValidationCheck[];
  issues: RealRegistryWriteImplementationDraftValidationIssue[];
  recommendations: RealRegistryWriteImplementationDraftValidationRecommendation[];
  readyForFinalRealWriteReviewGate: boolean;
  implementationDraftOnly: true;
  dryRunOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  jsonRoundTripStable: boolean;
}

const createCheck = (
  id: RealRegistryWriteImplementationDraftValidationCheckId,
  label: string,
  passed: boolean,
  severity: RealRegistryWriteImplementationDraftValidationSeverity,
  message: string,
): RealRegistryWriteImplementationDraftValidationCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

const issueForCheck = (
  check: RealRegistryWriteImplementationDraftValidationCheck,
  recommendation: string,
): RealRegistryWriteImplementationDraftValidationIssue | null => {
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
  draft: RealRegistryWriteImplementationDraft,
): string =>
  JSON.stringify({
    implementationDraftId: draft.implementationDraftId,
    writerInterfaceDraft: draft.writerInterfaceDraft,
    transactionDraft: draft.transactionDraft,
    writeLockDraft: draft.writeLockDraft,
    auditEventDraft: draft.auditEventDraft,
    rollbackCommandDraft: draft.rollbackCommandDraft,
    summary: draft.summary,
  });

const actionForIssues = (
  issues: readonly RealRegistryWriteImplementationDraftValidationIssue[],
  hasWarnings: boolean,
): RealRegistryWriteImplementationDraftValidationRecommendation['action'] => {
  if (issues.length === 0) {
    return hasWarnings
      ? 'keep_as_implementation_draft_only'
      : 'continue_to_final_real_write_review_gate';
  }
  if (
    issues.some((issue) =>
      [
        'source_implementation_gate_ready',
        'dry_run_only_true',
        'actual_write_blocked_true',
        'publish_blocked_true',
        'package_replacement_blocked_true',
        'production_writer_blocked_true',
        'no_actual_registry_write',
        'no_user_app_shell_package_replacement',
        'no_production_package_marker',
        'json_round_trip_safe',
      ].includes(issue.checkId),
    )
  ) {
    return 'block_production_writer_creation';
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
    return 'block_production_writer_creation';
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
  return 'request_owner_authorization_review';
};

const draftStatusReady = (
  status: RealRegistryWriteImplementationDraftStatus,
): boolean =>
  status === 'implementation_draft_ready' ||
  status === 'implementation_draft_ready_with_warnings';

export const validateRealRegistryWriteImplementationDraft = (
  draft: RealRegistryWriteImplementationDraft,
): RealRegistryWriteImplementationDraftValidationResult => {
  const payloadText = validationPayloadText(draft);
  const tracePreserved =
    draft.qaTrace.trim().length > 0 &&
    draft.humanReviewTrace.trim().length > 0 &&
    draft.candidateTrace.trim().length > 0 &&
    draft.contractTrace.trim().length > 0 &&
    Boolean(draft.previewTrace) &&
    Boolean(draft.gateTrace) &&
    Boolean(draft.writerTrace) &&
    Boolean(draft.executionTrace) &&
    Boolean(draft.implementationGateTrace);
  const writerInterfacePresent =
    Boolean(draft.writerInterfaceDraft) &&
    draft.writerInterfaceDraft?.dryRunOnly === true &&
    draft.writerInterfaceDraft?.actualWriteBlocked === true &&
    draft.writerInterfaceDraft?.productionWriterBlocked === true &&
    draft.writerInterfaceDraft.methods.length > 0 &&
    draft.writerInterfaceDraft.methods.every(
      (method) => method.dryRunOnly && method.actualMutationBlocked,
    );
  const transactionPresent =
    Boolean(draft.transactionDraft) &&
    draft.transactionDraft?.dryRunOnly === true &&
    draft.transactionDraft?.actualWriteBlocked === true &&
    draft.transactionDraft.steps.length > 0 &&
    draft.transactionDraft.steps.every((step) => step.actualMutationBlocked);
  const writeLockPresent =
    Boolean(draft.writeLockDraft) &&
    draft.writeLockDraft?.dryRunOnly === true &&
    draft.writeLockDraft?.requiredBeforeAnyFutureWrite === true &&
    draft.writeLockDraft.locks.length > 0 &&
    draft.writeLockDraft.locks.every(
      (lock) => lock.required && lock.status !== 'blocked',
    );
  const auditEventPresent =
    Boolean(draft.auditEventDraft) &&
    draft.auditEventDraft?.dryRunOnly === true &&
    draft.auditEventDraft?.actualAuditOnly === true &&
    draft.auditEventDraft.events.length > 0;
  const rollbackCommandPresent =
    Boolean(draft.rollbackCommandDraft) &&
    draft.rollbackCommandDraft?.dryRunOnly === true &&
    draft.rollbackCommandDraft?.actualRollbackBlocked === true &&
    draft.rollbackCommandDraft.commands.length > 0 &&
    draft.rollbackCommandDraft.commands.every(
      (command) => command.actualMutationBlocked,
    );
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
    draft.actualWriteBlocked &&
    draft.noActualRegistryWrite &&
    draft.trace.noActualRegistryWrite &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    draft.packageReplacementBlocked &&
    draft.noUserAppShellPackageReplacement &&
    draft.trace.noUserAppShellPackageReplacement &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    draft.notProductionPackage &&
    draft.notProductionWriter &&
    draft.productionWriterBlocked &&
    draft.trace.noProductionPackageMarker &&
    !registryPreparationProductionMarkerPattern.test(payloadText);
  const jsonRoundTripStable =
    draft.jsonRoundTripStable && isJsonRoundTripStable(draft);

  const checks: RealRegistryWriteImplementationDraftValidationCheck[] = [
    createCheck(
      'source_implementation_gate_ready',
      'Source implementation gate ready',
      draft.trace.source.sourceReadyForImplementationDraft &&
        draftStatusReady(draft.implementationDraftStatus),
      'blocking',
      'Implementation draft validation requires a ready Phase 10N implementation gate.',
    ),
    createCheck(
      'dry_run_only_true',
      'Dry-run only true',
      draft.dryRunOnly,
      'blocking',
      'Implementation draft must keep dryRunOnly true.',
    ),
    createCheck(
      'actual_write_blocked_true',
      'Actual write blocked true',
      draft.actualWriteBlocked,
      'blocking',
      'Implementation draft must keep actual registry writes blocked.',
    ),
    createCheck(
      'publish_blocked_true',
      'Publish blocked true',
      draft.publishBlocked,
      'blocking',
      'Implementation draft must keep publication blocked.',
    ),
    createCheck(
      'package_replacement_blocked_true',
      'Package replacement blocked true',
      draft.packageReplacementBlocked,
      'blocking',
      'Implementation draft must not replace the current User App Shell package.',
    ),
    createCheck(
      'production_writer_blocked_true',
      'Production writer blocked true',
      draft.productionWriterBlocked && draft.notProductionWriter,
      'blocking',
      'Implementation draft must not create a production writer.',
    ),
    createCheck(
      'writer_interface_draft_present',
      'Writer interface draft present',
      writerInterfacePresent,
      'blocking',
      'Implementation draft requires a dry-run writer interface draft.',
    ),
    createCheck(
      'transaction_draft_present',
      'Transaction draft present',
      transactionPresent,
      'blocking',
      'Implementation draft requires a dry-run transaction draft.',
    ),
    createCheck(
      'write_lock_draft_present',
      'Write lock draft present',
      writeLockPresent,
      'blocking',
      'Implementation draft requires write lock draft requirements.',
    ),
    createCheck(
      'audit_event_draft_present',
      'Audit event draft present',
      auditEventPresent,
      'blocking',
      'Implementation draft requires audit event draft requirements.',
    ),
    createCheck(
      'rollback_command_draft_present',
      'Rollback command draft present',
      rollbackCommandPresent,
      'blocking',
      'Implementation draft requires rollback command draft requirements.',
    ),
    createCheck(
      'trace_preserved',
      'Trace preserved',
      tracePreserved,
      'blocking',
      'Implementation draft requires QA, human review, candidate, contract, preview, gate, writer, execution, and implementation gate trace.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      noRawImageReference,
      'blocking',
      'Implementation draft must not include raw images, object URLs, base64, local paths, or runtime asset names.',
    ),
    createCheck(
      'no_personal_data',
      'No personal data',
      noPersonalData,
      'blocking',
      'Implementation draft must not include personal, contact, health, sensitive identity, or biometric data.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      noMedicalClaims,
      'blocking',
      'Implementation draft must not include medical, diagnosis, or treatment claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      noProductShadeClaims,
      'blocking',
      'Implementation draft must not include product shade or brand-specific claims.',
    ),
    createCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      noUnsupportedFinalClaims,
      'blocking',
      'Implementation draft must not include final recognition, final approval, or AI confirmation claims.',
    ),
    createCheck(
      'no_actual_registry_write',
      'No actual registry write',
      noActualRegistryWrite,
      'blocking',
      'Implementation draft must not execute, persist, or mark actual registry writes.',
    ),
    createCheck(
      'no_user_app_shell_package_replacement',
      'No User App Shell package replacement',
      noUserAppShellPackageReplacement,
      'blocking',
      'Implementation draft must not replace the current User App Shell package.',
    ),
    createCheck(
      'no_production_package_marker',
      'No production package marker',
      noProductionPackageMarker,
      'blocking',
      'Implementation draft must not include production writer or package markers.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'blocking',
      'Implementation draft must be JSON round-trip stable.',
    ),
  ];

  const recommendationsByCheck: Record<
    RealRegistryWriteImplementationDraftValidationCheckId,
    string
  > = {
    source_implementation_gate_ready:
      'Return to Phase 10N and resolve implementation gate readiness first.',
    dry_run_only_true:
      'Restore dryRunOnly before any final real write review gate.',
    actual_write_blocked_true:
      'Restore actualWriteBlocked and remove registry write execution markers.',
    publish_blocked_true:
      'Restore publishBlocked and keep publication out of scope.',
    package_replacement_blocked_true:
      'Restore packageReplacementBlocked and preserve the current User App Shell package.',
    production_writer_blocked_true:
      'Restore productionWriterBlocked and keep the writer non-production.',
    writer_interface_draft_present:
      'Add a dry-run writer interface draft before final review.',
    transaction_draft_present:
      'Add a dry-run transaction draft before final review.',
    write_lock_draft_present:
      'Add write lock draft requirements before final review.',
    audit_event_draft_present:
      'Add audit event draft requirements before final review.',
    rollback_command_draft_present:
      'Add rollback command draft requirements before final review.',
    trace_preserved:
      'Restore all QA, review, package, preview, gate, writer, execution, and implementation traces.',
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
      'Remove actual registry write markers and keep 10O as an implementation draft.',
    no_user_app_shell_package_replacement:
      'Remove shell replacement markers and preserve the current User App Shell package.',
    no_production_package_marker:
      'Remove production markers and keep this draft non-production.',
    json_round_trip_safe: 'Remove non-serializable values before handoff.',
  };
  const issues = checks
    .map((check) => issueForCheck(check, recommendationsByCheck[check.id]))
    .filter(
      (issue): issue is RealRegistryWriteImplementationDraftValidationIssue =>
        Boolean(issue),
    );
  const hasWarnings =
    draft.implementationDraftStatus === 'implementation_draft_ready_with_warnings' ||
    draft.warnings.length > 0;
  const status: RealRegistryWriteImplementationDraftValidationStatus =
    issues.some((issue) => issue.severity === 'blocking')
      ? 'implementation_draft_validation_blocked'
      : hasWarnings
        ? 'implementation_draft_validation_ready_with_warnings'
        : 'implementation_draft_validation_ready';
  const action = actionForIssues(issues, hasWarnings);
  return {
    status,
    checks,
    issues,
    recommendations: [
      {
        id: 'real_registry_write_implementation_draft_next_action',
        message:
          status === 'implementation_draft_validation_blocked'
            ? 'Do not create a production writer. Resolve blocked implementation draft checks first.'
            : status === 'implementation_draft_validation_ready_with_warnings'
              ? 'Keep as implementation draft only until warnings are reviewed.'
              : 'Implementation draft can proceed to a future final real write review gate only.',
        action,
      },
    ],
    readyForFinalRealWriteReviewGate:
      status === 'implementation_draft_validation_ready' ||
      status === 'implementation_draft_validation_ready_with_warnings',
    implementationDraftOnly: true,
    dryRunOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    jsonRoundTripStable: true,
  };
};
