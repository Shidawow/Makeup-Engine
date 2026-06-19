import type { ControlledRegistryWriterDraft } from './controlledUserAppTemplatePackageRegistryWriterDraft';
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

export type ControlledRegistryWriterValidationSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type ControlledRegistryWriterValidationStatus =
  | 'writer_validation_ready'
  | 'writer_validation_ready_with_warnings'
  | 'writer_validation_blocked';

export type ControlledRegistryWriterValidationCheckId =
  | 'source_registry_write_gate_ready'
  | 'dry_run_only_true'
  | 'actual_write_blocked_true'
  | 'publish_blocked_true'
  | 'package_replacement_blocked_true'
  | 'write_plan_present'
  | 'diff_preview_present'
  | 'rollback_plan_present'
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

export interface ControlledRegistryWriterValidationCheck {
  id: ControlledRegistryWriterValidationCheckId;
  label: string;
  passed: boolean;
  severity: ControlledRegistryWriterValidationSeverity;
  message: string;
}

export interface ControlledRegistryWriterValidationIssue {
  id: string;
  checkId: ControlledRegistryWriterValidationCheckId;
  severity: Exclude<ControlledRegistryWriterValidationSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface ControlledRegistryWriterValidationRecommendation {
  id: string;
  message: string;
  action:
    | 'continue_to_explicit_write_authorization_gate'
    | 'request_write_plan_revision'
    | 'request_versioning_review'
    | 'request_rollback_plan_review'
    | 'request_privacy_review'
    | 'request_user_app_shell_boundary_review'
    | 'keep_as_dry_run_only'
    | 'block_explicit_write_authorization';
}

export interface ControlledRegistryWriterValidationResult {
  status: ControlledRegistryWriterValidationStatus;
  checks: ControlledRegistryWriterValidationCheck[];
  issues: ControlledRegistryWriterValidationIssue[];
  recommendations: ControlledRegistryWriterValidationRecommendation[];
  readyForExplicitWriteAuthorizationGate: boolean;
  writerDraftOnly: true;
  dryRunOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionPackage: true;
  jsonRoundTripStable: boolean;
}

const createCheck = (
  id: ControlledRegistryWriterValidationCheckId,
  label: string,
  passed: boolean,
  severity: ControlledRegistryWriterValidationSeverity,
  message: string,
): ControlledRegistryWriterValidationCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

const issueForCheck = (
  check: ControlledRegistryWriterValidationCheck,
  recommendation: string,
): ControlledRegistryWriterValidationIssue | null => {
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

const writerValidationPayloadText = (draft: ControlledRegistryWriterDraft): string =>
  JSON.stringify({
    writerDraftId: draft.writerDraftId,
    proposedRegistryEntry: draft.proposedRegistryEntry,
    existingRegistryEntryPreview: draft.existingRegistryEntryPreview,
    writePlan: draft.writePlan,
    diffPreview: draft.diffPreview,
    rollbackPlan: draft.rollbackPlan,
    packageIdCandidate: draft.packageIdCandidate,
    packageVersionCandidate: draft.packageVersionCandidate,
    summary: draft.summary,
  });

const recommendationAction = (
  issues: readonly ControlledRegistryWriterValidationIssue[],
  hasWarnings: boolean,
): ControlledRegistryWriterValidationRecommendation['action'] => {
  if (issues.length === 0) {
    return hasWarnings
      ? 'keep_as_dry_run_only'
      : 'continue_to_explicit_write_authorization_gate';
  }
  if (
    issues.some((issue) =>
      [
        'dry_run_only_true',
        'actual_write_blocked_true',
        'publish_blocked_true',
        'no_actual_registry_write',
        'no_production_package_marker',
        'json_round_trip_safe',
      ].includes(issue.checkId),
    )
  ) {
    return 'block_explicit_write_authorization';
  }
  if (
    issues.some((issue) =>
      [
        'package_replacement_blocked_true',
        'no_user_app_shell_package_replacement',
      ].includes(issue.checkId),
    )
  ) {
    return 'request_user_app_shell_boundary_review';
  }
  if (issues.some((issue) => issue.checkId === 'source_registry_write_gate_ready')) {
    return 'block_explicit_write_authorization';
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
      ['write_plan_present', 'diff_preview_present'].includes(issue.checkId),
    )
  ) {
    return 'request_write_plan_revision';
  }
  if (issues.some((issue) => issue.checkId === 'rollback_plan_present')) {
    return 'request_rollback_plan_review';
  }
  return 'block_explicit_write_authorization';
};

export const validateControlledUserAppTemplatePackageRegistryWriterDraft = (
  draft: ControlledRegistryWriterDraft,
): ControlledRegistryWriterValidationResult => {
  const payloadText = writerValidationPayloadText(draft);
  const tracePreserved =
    draft.qaTrace.trim().length > 0 &&
    draft.humanReviewTrace.trim().length > 0 &&
    draft.candidateTrace.trim().length > 0 &&
    draft.contractTrace.trim().length > 0 &&
    Boolean(draft.previewTrace) &&
    Boolean(draft.gateTrace) &&
    Boolean(draft.draftTrace) &&
    Boolean(draft.registryPreparationTrace) &&
    Boolean(draft.registryWriteGateTrace);
  const jsonRoundTripStable =
    draft.jsonRoundTripStable && isJsonRoundTripStable(draft);
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
    draft.writePlan.actualWriteBlocked &&
    draft.writePlan.executionBlocked &&
    draft.diffPreview.actualMutationBlocked &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    draft.packageReplacementBlocked &&
    draft.noUserAppShellPackageReplacement &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    draft.notProductionPackage &&
    !registryPreparationProductionMarkerPattern.test(payloadText);

  const checks: ControlledRegistryWriterValidationCheck[] = [
    createCheck(
      'source_registry_write_gate_ready',
      'Source registry write gate ready',
      draft.trace.source.sourceReadyForWriterDraft &&
        draft.writerDraftStatus !== 'writer_draft_blocked',
      'blocking',
      'Controlled writer validation requires a ready Phase 10J registry write gate.',
    ),
    createCheck(
      'dry_run_only_true',
      'Dry-run only flag true',
      draft.dryRunOnly && draft.writePlan.dryRunOnly && draft.diffPreview.dryRunOnly,
      'blocking',
      'Controlled writer validation must keep dryRunOnly true.',
    ),
    createCheck(
      'actual_write_blocked_true',
      'Actual write blocked flag true',
      draft.actualWriteBlocked && draft.writePlan.actualWriteBlocked,
      'blocking',
      'Controlled writer validation must keep actualWriteBlocked true.',
    ),
    createCheck(
      'publish_blocked_true',
      'Publish blocked flag true',
      draft.publishBlocked && draft.notPublished,
      'blocking',
      'Controlled writer validation must keep publish blocked.',
    ),
    createCheck(
      'package_replacement_blocked_true',
      'Package replacement blocked flag true',
      draft.packageReplacementBlocked && draft.noUserAppShellPackageReplacement,
      'blocking',
      'Controlled writer validation must block current User App Shell package replacement.',
    ),
    createCheck(
      'write_plan_present',
      'Write plan present',
      draft.writePlan.operations.length > 0 && draft.writePlan.executionBlocked,
      'blocking',
      'Controlled writer validation requires a blocked dry-run write plan.',
    ),
    createCheck(
      'diff_preview_present',
      'Diff preview present',
      draft.diffPreview.added.length > 0 && draft.diffPreview.actualMutationBlocked,
      'blocking',
      'Controlled writer validation requires a local diff preview.',
    ),
    createCheck(
      'rollback_plan_present',
      'Rollback plan present',
      draft.rollbackPlan.requiredBeforeAnyWrite &&
        draft.rollbackPlan.steps.length > 0 &&
        draft.rollbackPlan.actualRollbackBlocked,
      'blocking',
      'Controlled writer validation requires a rollback plan before any future write.',
    ),
    createCheck(
      'trace_preserved',
      'Trace preserved',
      tracePreserved,
      'blocking',
      'Controlled writer validation requires QA, human review, candidate, contract, preview, gate, draft, preparation, and write gate trace.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      noRawImageReference,
      'blocking',
      'Controlled writer validation must not include raw images, object URLs, base64, local paths, or runtime asset names.',
    ),
    createCheck(
      'no_personal_data',
      'No personal data',
      noPersonalData,
      'blocking',
      'Controlled writer validation must not include personal, contact, health, sensitive identity, or biometric data.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      noMedicalClaims,
      'blocking',
      'Controlled writer validation must not include medical, diagnosis, or treatment claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      noProductShadeClaims,
      'blocking',
      'Controlled writer validation must not include product shade or brand-specific claims.',
    ),
    createCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      noUnsupportedFinalClaims,
      'blocking',
      'Controlled writer validation must not include final recognition, final approval, or AI confirmation claims.',
    ),
    createCheck(
      'no_actual_registry_write',
      'No actual registry write',
      noActualRegistryWrite,
      'blocking',
      'Controlled writer validation must not execute, persist, or mark actual registry writes.',
    ),
    createCheck(
      'no_user_app_shell_package_replacement',
      'No User App Shell package replacement',
      noUserAppShellPackageReplacement,
      'blocking',
      'Controlled writer validation must not replace the current User App Shell package.',
    ),
    createCheck(
      'no_production_package_marker',
      'No production package marker',
      noProductionPackageMarker,
      'blocking',
      'Controlled writer validation must not carry production package markers.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'blocking',
      'Controlled writer validation requires JSON round-trip stability.',
    ),
  ];

  const recommendationsByCheck: Record<
    ControlledRegistryWriterValidationCheckId,
    string
  > = {
    source_registry_write_gate_ready:
      'Return to Phase 10J and resolve the registry write gate first.',
    dry_run_only_true: 'Restore dryRunOnly before any writer draft can continue.',
    actual_write_blocked_true:
      'Restore actualWriteBlocked and remove write execution markers.',
    publish_blocked_true:
      'Restore publishBlocked and keep publication out of scope.',
    package_replacement_blocked_true:
      'Restore packageReplacementBlocked and preserve the current User App Shell package.',
    write_plan_present:
      'Add a blocked dry-run write plan with explicit authorization required.',
    diff_preview_present:
      'Add a local diff preview without mutation.',
    rollback_plan_present:
      'Add a rollback plan before any future write authorization gate.',
    trace_preserved:
      'Restore all QA, review, package, gate, preparation, and write gate trace.',
    no_raw_image_reference:
      'Remove raw images, object URLs, base64, local paths, and runtime assets.',
    no_personal_data:
      'Remove personal, contact, health, sensitive identity, and biometric data.',
    no_medical_claims: 'Remove medical, diagnosis, or treatment claims.',
    no_product_shade_claims:
      'Keep products as category placeholders without shade claims.',
    no_unsupported_final_claims:
      'Keep copy draft-only and human-review-only.',
    no_actual_registry_write:
      'Remove actual registry write markers and keep the writer draft dry-run only.',
    no_user_app_shell_package_replacement:
      'Remove shell replacement markers and preserve current shell package.',
    no_production_package_marker:
      'Remove production package markers and keep draft-only status.',
    json_round_trip_safe: 'Remove non-serializable values before handoff.',
  };

  const issues = checks
    .map((check) => issueForCheck(check, recommendationsByCheck[check.id]))
    .filter((issue): issue is ControlledRegistryWriterValidationIssue =>
      Boolean(issue),
    );
  const hasWarnings =
    draft.writerDraftStatus === 'writer_draft_ready_with_warnings' ||
    draft.warnings.length > 0;
  const status: ControlledRegistryWriterValidationStatus =
    issues.some((issue) => issue.severity === 'blocking')
      ? 'writer_validation_blocked'
      : hasWarnings
        ? 'writer_validation_ready_with_warnings'
        : 'writer_validation_ready';
  const action = recommendationAction(issues, hasWarnings);
  const recommendations: ControlledRegistryWriterValidationRecommendation[] = [
    {
      id: 'controlled_registry_writer_next_action',
      message:
        status === 'writer_validation_blocked'
          ? 'Do not authorize registry write. Resolve blocked writer draft checks first.'
          : 'Writer draft is dry-run ready only; it may proceed to a future explicit write authorization gate.',
      action,
    },
  ];

  return {
    status,
    checks,
    issues,
    recommendations,
    readyForExplicitWriteAuthorizationGate:
      status === 'writer_validation_ready' ||
      status === 'writer_validation_ready_with_warnings',
    writerDraftOnly: true,
    dryRunOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionPackage: true,
    jsonRoundTripStable,
  };
};
