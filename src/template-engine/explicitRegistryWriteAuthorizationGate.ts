import type { ControlledRegistryWriterDraft } from './controlledUserAppTemplatePackageRegistryWriterDraft';
import type { ControlledRegistryWriterValidationResult } from './controlledUserAppTemplatePackageRegistryWriterValidation';
import type { ExplicitRegistryWriteAuthorizationChecklist } from './explicitRegistryWriteAuthorizationChecklist';
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

export type ExplicitRegistryWriteAuthorizationGateSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type ExplicitRegistryWriteAuthorizationGateStatus =
  | 'explicit_authorization_gate_ready'
  | 'explicit_authorization_gate_ready_with_warnings'
  | 'explicit_authorization_gate_blocked'
  | 'explicit_authorization_gate_example_only';

export type ExplicitRegistryWriteAuthorizationGateDecision =
  | 'eligible_for_future_controlled_write_execution_design'
  | 'request_write_plan_revision'
  | 'request_versioning_review'
  | 'request_rollback_plan_review'
  | 'request_privacy_review'
  | 'request_owner_authorization'
  | 'keep_as_dry_run_only'
  | 'blocked_do_not_execute_write';

export type ExplicitRegistryWriteAuthorizationGateCheckId =
  | 'source_writer_validation_ready'
  | 'dry_run_only_true'
  | 'actual_write_blocked_true'
  | 'publish_blocked_true'
  | 'package_replacement_blocked_true'
  | 'write_plan_present'
  | 'diff_preview_present'
  | 'rollback_plan_present'
  | 'reviewer_ack_required'
  | 'owner_authorization_required'
  | 'production_write_disabled'
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

export interface ExplicitRegistryWriteAuthorizationGateCheck {
  id: ExplicitRegistryWriteAuthorizationGateCheckId;
  label: string;
  passed: boolean;
  severity: ExplicitRegistryWriteAuthorizationGateSeverity;
  message: string;
}

export interface ExplicitRegistryWriteAuthorizationGateIssue {
  id: string;
  checkId: ExplicitRegistryWriteAuthorizationGateCheckId;
  severity: Exclude<ExplicitRegistryWriteAuthorizationGateSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface ExplicitRegistryWriteAuthorizationGateBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface ExplicitRegistryWriteAuthorizationGateTrace {
  sourceWriterDraftId: string;
  sourceWriterValidationStatus: ControlledRegistryWriterValidationResult['status'];
  sourceReadyForAuthorizationGate: boolean;
  checklistId: string;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: ControlledRegistryWriterDraft['previewTrace'];
  gateTrace: ControlledRegistryWriterDraft['gateTrace'];
  draftTrace: ControlledRegistryWriterDraft['draftTrace'];
  registryPreparationTrace: ControlledRegistryWriterDraft['registryPreparationTrace'];
  registryWriteGateTrace: ControlledRegistryWriterDraft['registryWriteGateTrace'];
  writerDraftTrace: ControlledRegistryWriterDraft['trace'];
  reviewerAckRequired: boolean;
  ownerAuthorizationRequired: boolean;
  futureApprovalRequired: boolean;
  productionWriteDisabled: boolean;
  noRawImageReference: boolean;
  noPersonalData: boolean;
  noMedicalClaims: boolean;
  noProductShadeClaims: boolean;
  noUnsupportedFinalClaims: boolean;
  noActualRegistryWrite: boolean;
  noUserAppShellPackageReplacement: boolean;
  noProductionPackageMarker: boolean;
}

export interface ExplicitRegistryWriteAuthorizationGateResult {
  gateId: string;
  sourceWriterDraftId: string;
  sourceRegistryWriteGateId: string;
  sourceRegistryPreparationId: string;
  checklistId: string;
  packageIdCandidate: string;
  packageVersionCandidate: string;
  status: ExplicitRegistryWriteAuthorizationGateStatus;
  decision: ExplicitRegistryWriteAuthorizationGateDecision;
  checks: ExplicitRegistryWriteAuthorizationGateCheck[];
  issues: ExplicitRegistryWriteAuthorizationGateIssue[];
  blockedReasons: ExplicitRegistryWriteAuthorizationGateBlockedReason[];
  warnings: ExplicitRegistryWriteAuthorizationGateIssue[];
  dryRunOnly: true;
  actualWriteBlocked: true;
  publishBlocked: true;
  packageReplacementBlocked: true;
  productionWriteDisabled: true;
  ownerAuthorizationRequired: true;
  futureOwnerApprovalRequired: true;
  notActualWriteAuthorization: true;
  authorizationGateOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionPackage: true;
  eligibleForFutureControlledWriteExecutionDesign: boolean;
  trace: ExplicitRegistryWriteAuthorizationGateTrace;
  summary: string;
  jsonRoundTripStable: boolean;
}

export interface ExplicitRegistryWriteAuthorizationGateOverrides {
  dryRunOnly?: boolean;
  actualWriteBlocked?: boolean;
  publishBlocked?: boolean;
  packageReplacementBlocked?: boolean;
  reviewerAckRequired?: boolean;
  ownerAuthorizationRequired?: boolean;
  productionWriteDisabled?: boolean;
  note?: string;
}

const createCheck = (
  id: ExplicitRegistryWriteAuthorizationGateCheckId,
  label: string,
  passed: boolean,
  severity: ExplicitRegistryWriteAuthorizationGateSeverity,
  message: string,
): ExplicitRegistryWriteAuthorizationGateCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

const issueForCheck = (
  check: ExplicitRegistryWriteAuthorizationGateCheck,
  recommendation: string,
): ExplicitRegistryWriteAuthorizationGateIssue | null => {
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
  draft,
  checklist,
  note = '',
}: {
  draft: ControlledRegistryWriterDraft;
  checklist: ExplicitRegistryWriteAuthorizationChecklist;
  note?: string;
}): string =>
  JSON.stringify({
    writerDraftId: draft.writerDraftId,
    writePlan: draft.writePlan,
    diffPreview: draft.diffPreview,
    rollbackPlan: draft.rollbackPlan,
    proposedRegistryEntry: draft.proposedRegistryEntry,
    checklistLabels: checklist.items.map((item) => item.label),
    checklistDescriptions: checklist.items.map((item) => item.description),
    checklistNotes: checklist.notes,
    note,
  });

const decisionForIssues = (
  issues: readonly ExplicitRegistryWriteAuthorizationGateIssue[],
  hasWarnings: boolean,
): ExplicitRegistryWriteAuthorizationGateDecision => {
  if (issues.length === 0) {
    return hasWarnings
      ? 'keep_as_dry_run_only'
      : 'eligible_for_future_controlled_write_execution_design';
  }
  if (
    issues.some((issue) =>
      [
        'source_writer_validation_ready',
        'dry_run_only_true',
        'actual_write_blocked_true',
        'publish_blocked_true',
        'no_actual_registry_write',
        'no_production_package_marker',
        'json_round_trip_safe',
      ].includes(issue.checkId),
    )
  ) {
    return 'blocked_do_not_execute_write';
  }
  if (
    issues.some((issue) =>
      [
        'reviewer_ack_required',
        'owner_authorization_required',
        'production_write_disabled',
      ].includes(issue.checkId),
    )
  ) {
    return 'request_owner_authorization';
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
    return 'request_privacy_review';
  }
  if (
    issues.some((issue) =>
      [
        'package_replacement_blocked_true',
        'no_user_app_shell_package_replacement',
      ].includes(issue.checkId),
    )
  ) {
    return 'blocked_do_not_execute_write';
  }
  if (
    issues.some((issue) =>
      ['write_plan_present', 'diff_preview_present'].includes(issue.checkId),
    )
  ) {
    return 'request_write_plan_revision';
  }
  if (issues.some((issue) => issue.checkId === 'rollback_plan_present')) {
    return 'request_rollback_plan_review';
  }
  return 'blocked_do_not_execute_write';
};

export const createExplicitRegistryWriteAuthorizationGate = ({
  draft,
  validation,
  checklist,
  gateId = `explicit-registry-write-authorization-gate-${draft.writerDraftId}`,
  overrides = {},
}: {
  draft: ControlledRegistryWriterDraft;
  validation: ControlledRegistryWriterValidationResult;
  checklist: ExplicitRegistryWriteAuthorizationChecklist;
  gateId?: string;
  overrides?: ExplicitRegistryWriteAuthorizationGateOverrides;
}): ExplicitRegistryWriteAuthorizationGateResult => {
  const sourceReady =
    validation.status === 'writer_validation_ready' ||
    validation.status === 'writer_validation_ready_with_warnings';
  const dryRunOnly = overrides.dryRunOnly ?? draft.dryRunOnly;
  const actualWriteBlocked = overrides.actualWriteBlocked ?? draft.actualWriteBlocked;
  const publishBlocked = overrides.publishBlocked ?? draft.publishBlocked;
  const packageReplacementBlocked =
    overrides.packageReplacementBlocked ?? draft.packageReplacementBlocked;
  const reviewerAckRequired =
    overrides.reviewerAckRequired ?? checklist.reviewerAckRequired;
  const ownerAuthorizationRequired =
    overrides.ownerAuthorizationRequired ?? checklist.ownerAuthorizationRequired;
  const productionWriteDisabled = overrides.productionWriteDisabled ?? true;
  const payloadText = gatePayloadText({
    draft,
    checklist,
    note: overrides.note,
  });
  const tracePreserved =
    draft.qaTrace.trim().length > 0 &&
    draft.humanReviewTrace.trim().length > 0 &&
    draft.candidateTrace.trim().length > 0 &&
    draft.contractTrace.trim().length > 0 &&
    Boolean(draft.previewTrace) &&
    Boolean(draft.gateTrace) &&
    Boolean(draft.draftTrace) &&
    Boolean(draft.registryPreparationTrace) &&
    Boolean(draft.registryWriteGateTrace) &&
    Boolean(draft.trace);
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
    draft.writePlan.actualWriteBlocked &&
    draft.writePlan.executionBlocked &&
    draft.diffPreview.actualMutationBlocked &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    packageReplacementBlocked &&
    draft.noUserAppShellPackageReplacement &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    productionWriteDisabled &&
    draft.notProductionPackage &&
    !registryPreparationProductionMarkerPattern.test(payloadText);
  const jsonRoundTripStable =
    draft.jsonRoundTripStable &&
    validation.jsonRoundTripStable &&
    checklist.jsonRoundTripStable &&
    isJsonRoundTripStable({ draft, validation, checklist });

  const checks: ExplicitRegistryWriteAuthorizationGateCheck[] = [
    createCheck(
      'source_writer_validation_ready',
      'Source writer validation ready',
      sourceReady && validation.readyForExplicitWriteAuthorizationGate,
      'blocking',
      'Explicit authorization gate requires a ready Phase 10K writer validation result.',
    ),
    createCheck(
      'dry_run_only_true',
      'Dry-run only remains true',
      dryRunOnly && draft.writePlan.dryRunOnly && draft.diffPreview.dryRunOnly,
      'blocking',
      'Explicit authorization gate must remain dry-run only.',
    ),
    createCheck(
      'actual_write_blocked_true',
      'Actual write remains blocked',
      actualWriteBlocked && draft.writePlan.actualWriteBlocked,
      'blocking',
      'Explicit authorization gate must block actual registry writes.',
    ),
    createCheck(
      'publish_blocked_true',
      'Publish remains blocked',
      publishBlocked && draft.notPublished,
      'blocking',
      'Explicit authorization gate must keep publish blocked.',
    ),
    createCheck(
      'package_replacement_blocked_true',
      'Package replacement remains blocked',
      packageReplacementBlocked && draft.noUserAppShellPackageReplacement,
      'blocking',
      'Explicit authorization gate must block current User App Shell package replacement.',
    ),
    createCheck(
      'write_plan_present',
      'Write plan present',
      draft.writePlan.operations.length > 0 && draft.writePlan.executionBlocked,
      'blocking',
      'Explicit authorization gate requires a blocked dry-run write plan.',
    ),
    createCheck(
      'diff_preview_present',
      'Diff preview present',
      draft.diffPreview.added.length > 0 && draft.diffPreview.actualMutationBlocked,
      'blocking',
      'Explicit authorization gate requires a local diff preview.',
    ),
    createCheck(
      'rollback_plan_present',
      'Rollback plan present',
      draft.rollbackPlan.requiredBeforeAnyWrite &&
        draft.rollbackPlan.steps.length > 0 &&
        draft.rollbackPlan.actualRollbackBlocked,
      'blocking',
      'Explicit authorization gate requires a rollback plan before any future write design.',
    ),
    createCheck(
      'reviewer_ack_required',
      'Reviewer acknowledgement required',
      reviewerAckRequired && checklist.items.every((item) => item.acknowledgement.reviewerAcknowledgementRequired),
      'blocking',
      'Explicit authorization gate must require reviewer acknowledgement.',
    ),
    createCheck(
      'owner_authorization_required',
      'Owner authorization required',
      ownerAuthorizationRequired &&
        checklist.ownerAuthorizationRequired &&
        checklist.futureApprovalRequired &&
        checklist.requirements.includes(
          'owner_confirms_future_write_requires_separate_explicit_approval',
        ),
      'blocking',
      'Explicit authorization gate must require separate future owner authorization.',
    ),
    createCheck(
      'production_write_disabled',
      'Production write disabled',
      productionWriteDisabled,
      'blocking',
      'Explicit authorization gate must explicitly disable production writes.',
    ),
    createCheck(
      'trace_preserved',
      'Trace preserved',
      tracePreserved,
      'blocking',
      'Explicit authorization gate requires QA, human review, candidate, contract, preview, gate, draft, preparation, write gate, and writer trace.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      noRawImageReference,
      'blocking',
      'Explicit authorization gate must not include raw images, object URLs, base64, local paths, or runtime asset names.',
    ),
    createCheck(
      'no_personal_data',
      'No personal data',
      noPersonalData,
      'blocking',
      'Explicit authorization gate must not include personal, contact, health, sensitive identity, or biometric data.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      noMedicalClaims,
      'blocking',
      'Explicit authorization gate must not include medical, diagnosis, or treatment claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      noProductShadeClaims,
      'blocking',
      'Explicit authorization gate must not include product shade or brand-specific claims.',
    ),
    createCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      noUnsupportedFinalClaims,
      'blocking',
      'Explicit authorization gate must not include final recognition, final approval, or AI confirmation claims.',
    ),
    createCheck(
      'no_actual_registry_write',
      'No actual registry write',
      noActualRegistryWrite,
      'blocking',
      'Explicit authorization gate must not execute, persist, or mark actual registry writes.',
    ),
    createCheck(
      'no_user_app_shell_package_replacement',
      'No User App Shell package replacement',
      noUserAppShellPackageReplacement,
      'blocking',
      'Explicit authorization gate must not replace the current User App Shell package.',
    ),
    createCheck(
      'no_production_package_marker',
      'No production package marker',
      noProductionPackageMarker,
      'blocking',
      'Explicit authorization gate must not carry production package markers.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'blocking',
      'Explicit authorization gate requires JSON round-trip stability.',
    ),
  ];

  const recommendationsByCheck: Record<
    ExplicitRegistryWriteAuthorizationGateCheckId,
    string
  > = {
    source_writer_validation_ready:
      'Return to Phase 10K and resolve writer validation before authorization gate review.',
    dry_run_only_true:
      'Restore dryRunOnly before any authorization gate can continue.',
    actual_write_blocked_true:
      'Restore actualWriteBlocked and remove write execution markers.',
    publish_blocked_true:
      'Restore publishBlocked and keep publication out of scope.',
    package_replacement_blocked_true:
      'Restore packageReplacementBlocked and preserve the current User App Shell package.',
    write_plan_present:
      'Add a blocked dry-run write plan before authorization gate review.',
    diff_preview_present:
      'Add a local diff preview without mutation.',
    rollback_plan_present:
      'Add a rollback plan before any future controlled write execution design.',
    reviewer_ack_required:
      'Add reviewer acknowledgement requirements to the authorization checklist.',
    owner_authorization_required:
      'Add explicit future owner authorization requirements; gate ready is not execution approval.',
    production_write_disabled:
      'Disable production write execution in this gate.',
    trace_preserved:
      'Restore all QA, review, package, gate, preparation, write gate, and writer trace.',
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
      'Remove actual registry write markers and keep Phase 10L as a gate only.',
    no_user_app_shell_package_replacement:
      'Remove shell replacement markers and preserve the current User App Shell package.',
    no_production_package_marker:
      'Remove production package markers and keep this gate non-production.',
    json_round_trip_safe: 'Remove non-serializable values before handoff.',
  };
  const issues = checks
    .map((check) => issueForCheck(check, recommendationsByCheck[check.id]))
    .filter((issue): issue is ExplicitRegistryWriteAuthorizationGateIssue =>
      Boolean(issue),
    );
  const hasWarnings =
    draft.writerDraftStatus === 'writer_draft_ready_with_warnings' ||
    validation.status === 'writer_validation_ready_with_warnings' ||
    checklist.status === 'authorization_checklist_ready_with_warnings';
  const status: ExplicitRegistryWriteAuthorizationGateStatus =
    draft.writerDraftStatus === 'writer_draft_example_only'
      ? 'explicit_authorization_gate_example_only'
      : issues.some((issue) => issue.severity === 'blocking')
        ? 'explicit_authorization_gate_blocked'
        : hasWarnings
          ? 'explicit_authorization_gate_ready_with_warnings'
          : 'explicit_authorization_gate_ready';
  const decision = decisionForIssues(issues, hasWarnings);
  const blockedReasons: ExplicitRegistryWriteAuthorizationGateBlockedReason[] =
    issues
      .filter((issue) => issue.severity === 'blocking')
      .map((issue) => ({
        id: issue.id,
        message: issue.message,
        recommendation: issue.recommendation,
      }));
  const warnings = issues.filter((issue) => issue.severity === 'warning');
  const eligibleForFutureControlledWriteExecutionDesign =
    status === 'explicit_authorization_gate_ready' ||
    status === 'explicit_authorization_gate_ready_with_warnings';

  const gate: ExplicitRegistryWriteAuthorizationGateResult = {
    gateId,
    sourceWriterDraftId: draft.writerDraftId,
    sourceRegistryWriteGateId: draft.sourceRegistryWriteGateId,
    sourceRegistryPreparationId: draft.sourceRegistryPreparationId,
    checklistId: checklist.checklistId,
    packageIdCandidate: draft.packageIdCandidate,
    packageVersionCandidate: draft.packageVersionCandidate,
    status,
    decision,
    checks,
    issues,
    blockedReasons,
    warnings,
    dryRunOnly: true,
    actualWriteBlocked: true,
    publishBlocked: true,
    packageReplacementBlocked: true,
    productionWriteDisabled: true,
    ownerAuthorizationRequired: true,
    futureOwnerApprovalRequired: true,
    notActualWriteAuthorization: true,
    authorizationGateOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionPackage: true,
    eligibleForFutureControlledWriteExecutionDesign,
    trace: {
      sourceWriterDraftId: draft.writerDraftId,
      sourceWriterValidationStatus: validation.status,
      sourceReadyForAuthorizationGate: sourceReady,
      checklistId: checklist.checklistId,
      qaTrace: draft.qaTrace,
      humanReviewTrace: draft.humanReviewTrace,
      candidateTrace: draft.candidateTrace,
      contractTrace: draft.contractTrace,
      previewTrace: draft.previewTrace,
      gateTrace: draft.gateTrace,
      draftTrace: draft.draftTrace,
      registryPreparationTrace: draft.registryPreparationTrace,
      registryWriteGateTrace: draft.registryWriteGateTrace,
      writerDraftTrace: draft.trace,
      reviewerAckRequired,
      ownerAuthorizationRequired,
      futureApprovalRequired: checklist.futureApprovalRequired,
      productionWriteDisabled,
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
      eligibleForFutureControlledWriteExecutionDesign
        ? 'Explicit authorization gate ready for future controlled write execution design only; no registry write, publish, or shell replacement occurs.'
        : 'Blocked: do not execute registry write. Keep the writer draft dry-run only.',
    jsonRoundTripStable: true,
  };
  gate.jsonRoundTripStable = isJsonRoundTripStable(gate);
  return gate;
};
