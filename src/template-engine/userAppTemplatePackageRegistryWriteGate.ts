import type { UserAppTemplatePackageRegistryPreparation } from './userAppTemplatePackageRegistryPreparation';
import {
  registryPreparationActualRegistryWritePattern,
  registryPreparationFinalClaimPattern,
  registryPreparationMedicalClaimPattern,
  registryPreparationPersonalDataPattern,
  registryPreparationProductionMarkerPattern,
  registryPreparationRawImageReferencePattern,
  registryPreparationShadeClaimPattern,
  registryPreparationShellReplacementPattern,
  userAppTemplatePackageRegistryPreparationPayloadText,
} from './userAppTemplatePackageRegistryPreparation';
import type { UserAppTemplatePackageRegistryPreparationValidationResult } from './userAppTemplatePackageRegistryPreparationValidation';

export type UserAppTemplatePackageRegistryWriteGateSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type UserAppTemplatePackageRegistryWriteGateStatus =
  | 'registry_write_gate_ready'
  | 'registry_write_gate_ready_with_warnings'
  | 'registry_write_gate_blocked'
  | 'registry_write_gate_example_only';

export type UserAppTemplatePackageRegistryWriteGateDecision =
  | 'eligible_for_future_controlled_registry_writer'
  | 'request_package_metadata_revision'
  | 'request_versioning_review'
  | 'request_privacy_review'
  | 'request_user_app_shell_boundary_review'
  | 'keep_as_registry_preview_only'
  | 'blocked_do_not_write_registry';

export type UserAppTemplatePackageRegistryWriteGateCheckId =
  | 'source_registry_preparation_validation_ready'
  | 'registry_entry_preview_present'
  | 'package_id_candidate_present'
  | 'package_version_candidate_present'
  | 'draft_only_true'
  | 'publish_blocked_true'
  | 'registry_write_blocked_true'
  | 'trace_preserved'
  | 'no_raw_image_reference'
  | 'no_personal_data'
  | 'no_medical_claims'
  | 'no_product_shade_claims'
  | 'no_unsupported_final_claims'
  | 'no_actual_registry_write'
  | 'no_user_app_shell_package_replacement'
  | 'no_production_package_marker'
  | 'user_app_contract_boundary_safe'
  | 'json_round_trip_safe';

export interface UserAppTemplatePackageRegistryWriteGateCheck {
  id: UserAppTemplatePackageRegistryWriteGateCheckId;
  label: string;
  passed: boolean;
  severity: UserAppTemplatePackageRegistryWriteGateSeverity;
  message: string;
}

export interface UserAppTemplatePackageRegistryWriteGateIssue {
  id: string;
  checkId: UserAppTemplatePackageRegistryWriteGateCheckId;
  severity: Exclude<UserAppTemplatePackageRegistryWriteGateSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface UserAppTemplatePackageRegistryWriteGateBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface UserAppTemplatePackageRegistryWriteGateTrace {
  sourcePreparationId: string;
  sourceOfficialDraftId: string;
  sourceDraftPublishGateId: string;
  sourceValidationStatus: UserAppTemplatePackageRegistryPreparationValidationResult['status'];
  sourceReadyForRegistryWriteGate: boolean;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: UserAppTemplatePackageRegistryPreparation['previewTrace'];
  publishGateTrace: UserAppTemplatePackageRegistryPreparation['gateTrace'];
  registryPreparationTrace: UserAppTemplatePackageRegistryPreparation['trace'];
  noRawImageReference: boolean;
  noPersonalData: boolean;
  noMedicalClaims: boolean;
  noProductShadeClaims: boolean;
  noUnsupportedFinalClaims: boolean;
  noActualRegistryWrite: boolean;
  noUserAppShellPackageReplacement: boolean;
  noProductionPackageMarker: boolean;
  userAppContractBoundarySafe: boolean;
}

export interface UserAppTemplatePackageRegistryWriteGateResult {
  gateId: string;
  sourcePreparationId: string;
  sourceOfficialDraftId: string;
  sourceDraftPublishGateId: string;
  registryEntryPreview: UserAppTemplatePackageRegistryPreparation['registryEntryPreview'];
  packageIdCandidate: string;
  packageVersionCandidate: string;
  checks: UserAppTemplatePackageRegistryWriteGateCheck[];
  issues: UserAppTemplatePackageRegistryWriteGateIssue[];
  blockedReasons: UserAppTemplatePackageRegistryWriteGateBlockedReason[];
  warnings: string[];
  status: UserAppTemplatePackageRegistryWriteGateStatus;
  decision: UserAppTemplatePackageRegistryWriteGateDecision;
  eligibleForFutureControlledRegistryWriter: boolean;
  registryWriteGateOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionPackage: true;
  draftOnly: true;
  publishBlocked: true;
  registryWriteBlocked: true;
  trace: UserAppTemplatePackageRegistryWriteGateTrace;
  summary: string;
  jsonRoundTripStable: boolean;
}

const createCheck = (
  id: UserAppTemplatePackageRegistryWriteGateCheckId,
  label: string,
  passed: boolean,
  severity: UserAppTemplatePackageRegistryWriteGateSeverity,
  message: string,
): UserAppTemplatePackageRegistryWriteGateCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

const issueForCheck = (
  check: UserAppTemplatePackageRegistryWriteGateCheck,
  recommendation: string,
): UserAppTemplatePackageRegistryWriteGateIssue | null => {
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

const gatePayloadText = (preparation: UserAppTemplatePackageRegistryPreparation): string =>
  JSON.stringify({
    registryEntryPreview: preparation.registryEntryPreview,
    packageIdCandidate: preparation.packageIdCandidate,
    packageVersionCandidate: preparation.packageVersionCandidate,
    title: preparation.title,
    summary: preparation.summary,
    safetyFlags: preparation.safetyFlags,
    privacyNotice: preparation.privacyNotice,
  });

const decisionForIssues = (
  issues: readonly UserAppTemplatePackageRegistryWriteGateIssue[],
  hasWarnings: boolean,
): UserAppTemplatePackageRegistryWriteGateDecision => {
  if (issues.length === 0) {
    return hasWarnings
      ? 'keep_as_registry_preview_only'
      : 'eligible_for_future_controlled_registry_writer';
  }
  if (
    issues.some((issue) =>
      [
        'draft_only_true',
        'publish_blocked_true',
        'registry_write_blocked_true',
        'no_actual_registry_write',
        'no_production_package_marker',
        'user_app_contract_boundary_safe',
        'json_round_trip_safe',
      ].includes(issue.checkId),
    )
  ) {
    return 'blocked_do_not_write_registry';
  }
  if (issues.some((issue) => issue.checkId === 'package_version_candidate_present')) {
    return 'request_versioning_review';
  }
  if (issues.some((issue) => issue.checkId === 'no_user_app_shell_package_replacement')) {
    return 'request_user_app_shell_boundary_review';
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
      ['registry_entry_preview_present', 'package_id_candidate_present'].includes(
        issue.checkId,
      ),
    )
  ) {
    return 'request_package_metadata_revision';
  }
  return 'blocked_do_not_write_registry';
};

export const createUserAppTemplatePackageRegistryWriteGate = ({
  preparation,
  validation,
  gateId = `user-app-template-package-registry-write-gate-${preparation.preparationId}`,
}: {
  preparation: UserAppTemplatePackageRegistryPreparation;
  validation: UserAppTemplatePackageRegistryPreparationValidationResult;
  gateId?: string;
}): UserAppTemplatePackageRegistryWriteGateResult => {
  const payloadText = `${userAppTemplatePackageRegistryPreparationPayloadText(
    preparation,
  )}\n${gatePayloadText(preparation)}`;
  const sourceValidationReady =
    validation.status === 'registry_preparation_validation_ready' ||
    validation.status === 'registry_preparation_validation_ready_with_warnings';
  const tracePreserved =
    preparation.qaTrace.trim().length > 0 &&
    preparation.humanReviewTrace.trim().length > 0 &&
    preparation.candidateTrace.trim().length > 0 &&
    preparation.contractTrace.trim().length > 0 &&
    Boolean(preparation.previewTrace) &&
    Boolean(preparation.gateTrace) &&
    Boolean(preparation.trace);
  const noRawImageReference =
    validation.checks.find((check) => check.id === 'no_raw_image_reference')?.passed ===
      true && !registryPreparationRawImageReferencePattern.test(payloadText);
  const noPersonalData =
    validation.checks.find((check) => check.id === 'no_personal_data')?.passed ===
      true && !registryPreparationPersonalDataPattern.test(payloadText);
  const noMedicalClaims =
    preparation.trace.noMedicalClaims &&
    !registryPreparationMedicalClaimPattern.test(payloadText);
  const noProductShadeClaims =
    preparation.trace.noProductShadeClaims &&
    !registryPreparationShadeClaimPattern.test(payloadText);
  const noUnsupportedFinalClaims =
    preparation.trace.noUnsupportedFinalClaims &&
    !registryPreparationFinalClaimPattern.test(payloadText);
  const noActualRegistryWrite =
    preparation.noActualRegistryWrite &&
    preparation.registryWriteBlocked &&
    preparation.registryEntryPreview.registryWriteBlocked &&
    validation.noActualRegistryWrite &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    preparation.noUserAppShellPackageReplacement &&
    preparation.registryEntryPreview.noUserAppShellPackageReplacement &&
    validation.noUserAppShellPackageReplacement &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    preparation.notProductionPackage &&
    validation.notProductionPackage &&
    !registryPreparationProductionMarkerPattern.test(payloadText);
  const userAppContractBoundarySafe =
    preparation.registryPreparationOnly &&
    preparation.noActualRegistryWrite &&
    preparation.notPublished &&
    preparation.noUserAppShellPackageReplacement &&
    preparation.notProductionPackage &&
    validation.registryPreparationOnly &&
    validation.noActualRegistryWrite &&
    validation.notPublished &&
    validation.noUserAppShellPackageReplacement &&
    validation.notProductionPackage;

  const draftOnlyTrue =
    preparation.draftOnly &&
    preparation.registryEntryPreview.draftOnly &&
    preparation.draftTrace.draftOnly;
  const publishBlockedTrue =
    preparation.publishBlocked &&
    preparation.registryEntryPreview.publishBlocked &&
    preparation.draftTrace.publishBlocked &&
    preparation.notPublished;
  const registryWriteBlockedTrue = noActualRegistryWrite;

  const checks: UserAppTemplatePackageRegistryWriteGateCheck[] = [
    createCheck(
      'source_registry_preparation_validation_ready',
      'Source registry preparation validation ready',
      sourceValidationReady && validation.readyForRegistryWriteGate,
      'blocking',
      'Registry write gate requires a ready Phase 10I registry preparation validation result.',
    ),
    createCheck(
      'registry_entry_preview_present',
      'Registry entry preview present',
      Boolean(preparation.registryEntryPreview) &&
        preparation.registryEntryPreview.title.trim().length > 0 &&
        preparation.registryEntryPreview.summary.trim().length > 0,
      'blocking',
      'Registry write gate requires a reviewable registry entry preview.',
    ),
    createCheck(
      'package_id_candidate_present',
      'Package id candidate present',
      preparation.packageIdCandidate.trim().length > 0,
      'blocking',
      'Registry write gate requires a package id candidate.',
    ),
    createCheck(
      'package_version_candidate_present',
      'Package version candidate present',
      preparation.packageVersionCandidate.trim().length > 0,
      'blocking',
      'Registry write gate requires a package version candidate.',
    ),
    createCheck(
      'draft_only_true',
      'Draft-only flag true',
      draftOnlyTrue,
      'blocking',
      'Registry write gate must keep draftOnly true.',
    ),
    createCheck(
      'publish_blocked_true',
      'Publish blocked flag true',
      publishBlockedTrue,
      'blocking',
      'Registry write gate must keep publishBlocked true and must not publish.',
    ),
    createCheck(
      'registry_write_blocked_true',
      'Registry write blocked flag true',
      registryWriteBlockedTrue,
      'blocking',
      'Registry write gate must keep registryWriteBlocked true and must not write registry.',
    ),
    createCheck(
      'trace_preserved',
      'Trace preserved',
      tracePreserved,
      'blocking',
      'Registry write gate requires QA, human review, candidate, contract, preview, publish gate, and registry preparation trace.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      noRawImageReference,
      'blocking',
      'Registry write gate must not include raw image data, object URLs, base64, local paths, or runtime asset names.',
    ),
    createCheck(
      'no_personal_data',
      'No personal data',
      noPersonalData,
      'blocking',
      'Registry write gate must not include personal, contact, health, sensitive identity, or biometric data.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      noMedicalClaims,
      'blocking',
      'Registry write gate must not include medical, diagnosis, or treatment claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      noProductShadeClaims,
      'blocking',
      'Registry write gate must not include product shade or brand-specific claims.',
    ),
    createCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      noUnsupportedFinalClaims,
      'blocking',
      'Registry write gate must not claim final recognition, final approval, or AI confirmation.',
    ),
    createCheck(
      'no_actual_registry_write',
      'No actual registry write',
      noActualRegistryWrite,
      'blocking',
      'Registry write gate must not execute, persist, or mark actual registry writes.',
    ),
    createCheck(
      'no_user_app_shell_package_replacement',
      'No User App Shell package replacement',
      noUserAppShellPackageReplacement,
      'blocking',
      'Registry write gate must not replace the current User App Shell package.',
    ),
    createCheck(
      'no_production_package_marker',
      'No production package marker',
      noProductionPackageMarker,
      'blocking',
      'Registry write gate must not carry production package markers.',
    ),
    createCheck(
      'user_app_contract_boundary_safe',
      'User App contract boundary safe',
      userAppContractBoundarySafe,
      'blocking',
      'Registry write gate must remain a local boundary check and must not mutate the UserAppTemplatePackage contract or registry.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      validation.jsonRoundTripStable && preparation.jsonRoundTripStable,
      'blocking',
      'Registry write gate input must survive JSON round-trip unchanged.',
    ),
  ];

  const recommendationsByCheck: Record<
    UserAppTemplatePackageRegistryWriteGateCheckId,
    string
  > = {
    source_registry_preparation_validation_ready:
      'Return to Phase 10I registry preparation validation and resolve blocked checks.',
    registry_entry_preview_present:
      'Restore registry entry preview title, summary, and metadata.',
    package_id_candidate_present: 'Add a package id candidate before any write gate.',
    package_version_candidate_present:
      'Add or review the package version candidate before any write gate.',
    draft_only_true: 'Restore draft-only metadata.',
    publish_blocked_true: 'Restore publish-blocked metadata.',
    registry_write_blocked_true:
      'Keep registryWriteBlocked true and remove all actual write markers.',
    trace_preserved:
      'Restore QA, human review, candidate, contract, preview, gate, and preparation trace.',
    no_raw_image_reference:
      'Remove image bytes, object URLs, local paths, and runtime asset names.',
    no_personal_data:
      'Remove personal, contact, health, sensitive identity, or biometric data.',
    no_medical_claims: 'Remove medical, diagnosis, or treatment claims.',
    no_product_shade_claims:
      'Keep products as category placeholders without shade claims.',
    no_unsupported_final_claims:
      'Keep wording as draft and human-review-only.',
    no_actual_registry_write:
      'Do not execute, persist, or mark a user app package registry write.',
    no_user_app_shell_package_replacement:
      'Do not replace the current User App Shell package.',
    no_production_package_marker: 'Remove production package markers.',
    user_app_contract_boundary_safe:
      'Keep this gate local and do not mutate package contracts, registries, or shell state.',
    json_round_trip_safe: 'Remove non-serializable values before handoff.',
  };
  const issues = checks
    .map((check) => issueForCheck(check, recommendationsByCheck[check.id]))
    .filter((issue): issue is UserAppTemplatePackageRegistryWriteGateIssue =>
      Boolean(issue),
    );
  const blockedReasons = issues
    .filter((issue) => issue.severity === 'blocking')
    .map((issue): UserAppTemplatePackageRegistryWriteGateBlockedReason => ({
      id: issue.checkId,
      message: issue.message,
      recommendation: issue.recommendation,
    }));
  const hasWarnings =
    validation.status === 'registry_preparation_validation_ready_with_warnings' ||
    preparation.preparationStatus === 'registry_preparation_ready_with_warnings' ||
    preparation.warnings.length > 0;
  const status: UserAppTemplatePackageRegistryWriteGateStatus =
    preparation.preparationStatus === 'registry_preparation_example_only'
      ? 'registry_write_gate_example_only'
      : blockedReasons.length > 0
        ? 'registry_write_gate_blocked'
        : hasWarnings
          ? 'registry_write_gate_ready_with_warnings'
          : 'registry_write_gate_ready';
  const decision = decisionForIssues(issues, hasWarnings);
  const eligibleForFutureControlledRegistryWriter =
    status === 'registry_write_gate_ready' ||
    status === 'registry_write_gate_ready_with_warnings';
  const gate: UserAppTemplatePackageRegistryWriteGateResult = {
    gateId,
    sourcePreparationId: preparation.preparationId,
    sourceOfficialDraftId: preparation.sourceOfficialDraftId,
    sourceDraftPublishGateId: preparation.sourceDraftPublishGateId,
    registryEntryPreview: preparation.registryEntryPreview,
    packageIdCandidate: preparation.packageIdCandidate,
    packageVersionCandidate: preparation.packageVersionCandidate,
    checks,
    issues,
    blockedReasons,
    warnings: hasWarnings
      ? [
          'Source registry preparation has warnings; keep this as a reviewable gate before any future controlled writer.',
        ]
      : [],
    status,
    decision,
    eligibleForFutureControlledRegistryWriter,
    registryWriteGateOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionPackage: true,
    draftOnly: true,
    publishBlocked: true,
    registryWriteBlocked: true,
    trace: {
      sourcePreparationId: preparation.preparationId,
      sourceOfficialDraftId: preparation.sourceOfficialDraftId,
      sourceDraftPublishGateId: preparation.sourceDraftPublishGateId,
      sourceValidationStatus: validation.status,
      sourceReadyForRegistryWriteGate: sourceValidationReady,
      qaTrace: preparation.qaTrace,
      humanReviewTrace: preparation.humanReviewTrace,
      candidateTrace: preparation.candidateTrace,
      contractTrace: preparation.contractTrace,
      previewTrace: preparation.previewTrace,
      publishGateTrace: preparation.gateTrace,
      registryPreparationTrace: preparation.trace,
      noRawImageReference,
      noPersonalData,
      noMedicalClaims,
      noProductShadeClaims,
      noUnsupportedFinalClaims,
      noActualRegistryWrite,
      noUserAppShellPackageReplacement,
      noProductionPackageMarker,
      userAppContractBoundarySafe,
    },
    summary:
      eligibleForFutureControlledRegistryWriter
        ? 'Eligible for a future controlled registry writer; this gate does not write registry, publish, or replace the User App Shell package.'
        : 'Blocked: do not write registry, publish, or replace the User App Shell package.',
    jsonRoundTripStable: true,
  };
  gate.jsonRoundTripStable = isJsonRoundTripStable(gate);
  return gate;
};
