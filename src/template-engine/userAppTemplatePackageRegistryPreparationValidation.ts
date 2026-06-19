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

export type UserAppTemplatePackageRegistryPreparationSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type UserAppTemplatePackageRegistryPreparationValidationStatus =
  | 'registry_preparation_validation_ready'
  | 'registry_preparation_validation_ready_with_warnings'
  | 'registry_preparation_validation_blocked';

export type UserAppTemplatePackageRegistryPreparationValidationCheckId =
  | 'source_publish_gate_ready'
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
  | 'json_round_trip_safe';

export interface UserAppTemplatePackageRegistryPreparationValidationCheck {
  id: UserAppTemplatePackageRegistryPreparationValidationCheckId;
  label: string;
  passed: boolean;
  severity: UserAppTemplatePackageRegistryPreparationSeverity;
  message: string;
}

export interface UserAppTemplatePackageRegistryPreparationValidationIssue {
  id: string;
  checkId: UserAppTemplatePackageRegistryPreparationValidationCheckId;
  severity: Exclude<UserAppTemplatePackageRegistryPreparationSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface UserAppTemplatePackageRegistryPreparationValidationRecommendation {
  id: string;
  message: string;
  action:
    | 'continue_to_registry_write_gate'
    | 'request_metadata_revision'
    | 'request_versioning_review'
    | 'request_privacy_review'
    | 'request_shell_boundary_review'
    | 'keep_as_registry_preview_only'
    | 'block_registry_write_gate';
}

export interface UserAppTemplatePackageRegistryPreparationValidationResult {
  status: UserAppTemplatePackageRegistryPreparationValidationStatus;
  checks: UserAppTemplatePackageRegistryPreparationValidationCheck[];
  issues: UserAppTemplatePackageRegistryPreparationValidationIssue[];
  recommendations: UserAppTemplatePackageRegistryPreparationValidationRecommendation[];
  readyForRegistryWriteGate: boolean;
  registryPreparationOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionPackage: true;
  jsonRoundTripStable: boolean;
}

const createCheck = (
  id: UserAppTemplatePackageRegistryPreparationValidationCheckId,
  label: string,
  passed: boolean,
  severity: UserAppTemplatePackageRegistryPreparationSeverity,
  message: string,
): UserAppTemplatePackageRegistryPreparationValidationCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

const issueForCheck = (
  check: UserAppTemplatePackageRegistryPreparationValidationCheck,
  recommendation: string,
): UserAppTemplatePackageRegistryPreparationValidationIssue | null => {
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

export const validateUserAppTemplatePackageRegistryPreparation = (
  preparation: UserAppTemplatePackageRegistryPreparation,
): UserAppTemplatePackageRegistryPreparationValidationResult => {
  const payloadText = userAppTemplatePackageRegistryPreparationPayloadText(preparation);
  const tracePreserved =
    preparation.qaTrace.trim().length > 0 &&
    preparation.humanReviewTrace.trim().length > 0 &&
    preparation.candidateTrace.trim().length > 0 &&
    preparation.contractTrace.trim().length > 0 &&
    Boolean(preparation.previewTrace) &&
    Boolean(preparation.gateTrace) &&
    Boolean(preparation.trace);
  const jsonRoundTripStable =
    preparation.jsonRoundTripStable && isJsonRoundTripStable(preparation);

  const checks: UserAppTemplatePackageRegistryPreparationValidationCheck[] = [
    createCheck(
      'source_publish_gate_ready',
      'Source publish gate ready',
      preparation.trace.source.sourceReadyForRegistryPreparation &&
        preparation.preparationStatus !== 'registry_preparation_blocked',
      'blocking',
      'Registry preparation validation requires a ready Phase 10H draft publish gate.',
    ),
    createCheck(
      'registry_entry_preview_present',
      'Registry entry preview present',
      Boolean(preparation.registryEntryPreview) &&
        preparation.registryEntryPreview.title.trim().length > 0 &&
        preparation.registryEntryPreview.summary.trim().length > 0,
      'blocking',
      'Registry preparation requires a reviewable registry entry preview.',
    ),
    createCheck(
      'package_id_candidate_present',
      'Package id candidate present',
      preparation.packageIdCandidate.trim().length > 0,
      'blocking',
      'Registry preparation requires a package id candidate.',
    ),
    createCheck(
      'package_version_candidate_present',
      'Package version candidate present',
      preparation.packageVersionCandidate.trim().length > 0,
      'blocking',
      'Registry preparation requires a package version candidate.',
    ),
    createCheck(
      'draft_only_true',
      'Draft-only flag true',
      preparation.draftOnly &&
        preparation.registryEntryPreview.draftOnly &&
        preparation.draftTrace.draftOnly,
      'blocking',
      'Registry preparation must remain draft-only.',
    ),
    createCheck(
      'publish_blocked_true',
      'Publish blocked flag true',
      preparation.publishBlocked &&
        preparation.registryEntryPreview.publishBlocked &&
        preparation.draftTrace.publishBlocked &&
        preparation.notPublished,
      'blocking',
      'Registry preparation must keep publish blocked.',
    ),
    createCheck(
      'registry_write_blocked_true',
      'Registry write blocked flag true',
      preparation.registryWriteBlocked &&
        preparation.registryEntryPreview.registryWriteBlocked &&
        preparation.noActualRegistryWrite,
      'blocking',
      'Registry preparation must keep registryWriteBlocked true and must not execute registry writes.',
    ),
    createCheck(
      'trace_preserved',
      'Trace preserved',
      tracePreserved,
      'blocking',
      'Registry preparation requires QA, human review, candidate, contract, preview, gate, and draft trace.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      preparation.trace.noRawImageReference &&
        !registryPreparationRawImageReferencePattern.test(payloadText),
      'blocking',
      'Registry preparation must not include raw image data, object URLs, base64, local paths, or runtime asset names.',
    ),
    createCheck(
      'no_personal_data',
      'No personal data',
      preparation.trace.noPersonalData &&
        !registryPreparationPersonalDataPattern.test(payloadText),
      'blocking',
      'Registry preparation must not include personal, contact, health, sensitive identity, or biometric data.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      preparation.trace.noMedicalClaims &&
        !registryPreparationMedicalClaimPattern.test(payloadText),
      'blocking',
      'Registry preparation must not include medical, diagnosis, or treatment claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      preparation.trace.noProductShadeClaims &&
        !registryPreparationShadeClaimPattern.test(payloadText),
      'blocking',
      'Registry preparation must not include product shade or brand-specific claims.',
    ),
    createCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      preparation.trace.noUnsupportedFinalClaims &&
        !registryPreparationFinalClaimPattern.test(payloadText),
      'blocking',
      'Registry preparation must not claim final recognition, final approval, or AI confirmation.',
    ),
    createCheck(
      'no_actual_registry_write',
      'No actual registry write',
      preparation.noActualRegistryWrite &&
        preparation.trace.noActualRegistryWrite &&
        !registryPreparationActualRegistryWritePattern.test(payloadText),
      'blocking',
      'Registry preparation must not execute, persist, or mark actual registry writes.',
    ),
    createCheck(
      'no_user_app_shell_package_replacement',
      'No User App Shell package replacement',
      preparation.noUserAppShellPackageReplacement &&
        preparation.trace.noUserAppShellPackageReplacement &&
        !registryPreparationShellReplacementPattern.test(payloadText),
      'blocking',
      'Registry preparation must not replace the current User App Shell package.',
    ),
    createCheck(
      'no_production_package_marker',
      'No production package marker',
      preparation.notProductionPackage &&
        preparation.trace.noProductionPackageMarker &&
        !registryPreparationProductionMarkerPattern.test(payloadText),
      'blocking',
      'Registry preparation must not carry production package markers.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'blocking',
      'Registry preparation must survive JSON round-trip unchanged.',
    ),
  ];

  const recommendationsByCheck: Record<
    UserAppTemplatePackageRegistryPreparationValidationCheckId,
    string
  > = {
    source_publish_gate_ready:
      'Return to the Phase 10H draft publish gate and resolve blocked checks.',
    registry_entry_preview_present:
      'Restore registry entry preview title, summary, and metadata.',
    package_id_candidate_present: 'Add a package id candidate.',
    package_version_candidate_present: 'Add a package version candidate.',
    draft_only_true: 'Restore draft-only metadata.',
    publish_blocked_true: 'Restore publish-blocked metadata.',
    registry_write_blocked_true:
      'Keep registryWriteBlocked true and remove write markers.',
    trace_preserved:
      'Restore QA, human review, candidate, contract, preview, gate, and draft trace.',
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
      'Do not execute or mark a user app package registry write.',
    no_user_app_shell_package_replacement:
      'Do not replace the current User App Shell package.',
    no_production_package_marker: 'Remove production package markers.',
    json_round_trip_safe: 'Remove non-serializable values.',
  };
  const issues = checks
    .map((check) => issueForCheck(check, recommendationsByCheck[check.id]))
    .filter(
      (
        issue,
      ): issue is UserAppTemplatePackageRegistryPreparationValidationIssue =>
        Boolean(issue),
    );
  const hasBlockingIssue = issues.some((issue) => issue.severity === 'blocking');
  const hasWarnings =
    issues.some((issue) => issue.severity === 'warning') ||
    preparation.preparationStatus === 'registry_preparation_ready_with_warnings' ||
    preparation.warnings.length > 0;
  const status: UserAppTemplatePackageRegistryPreparationValidationStatus =
    hasBlockingIssue
      ? 'registry_preparation_validation_blocked'
      : hasWarnings
        ? 'registry_preparation_validation_ready_with_warnings'
        : 'registry_preparation_validation_ready';
  const readyForRegistryWriteGate =
    status === 'registry_preparation_validation_ready' ||
    status === 'registry_preparation_validation_ready_with_warnings';
  const recommendations: UserAppTemplatePackageRegistryPreparationValidationRecommendation[] =
    hasBlockingIssue
      ? [
          {
            id: 'blocked-do-not-write-registry',
            message: 'Blocked: do not write a registry from this preparation.',
            action: 'block_registry_write_gate',
          },
        ]
      : hasWarnings
        ? [
            {
              id: 'keep-warnings-visible',
              message: 'Ready with warnings: keep the preparation as local preview and carry warnings into the future registry write gate.',
              action: 'keep_as_registry_preview_only',
            },
          ]
        : [
            {
              id: 'continue-to-registry-write-gate',
              message: 'Ready for a future registry write gate; this is not a registry write.',
              action: 'continue_to_registry_write_gate',
            },
          ];

  return {
    status,
    checks,
    issues,
    recommendations,
    readyForRegistryWriteGate,
    registryPreparationOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionPackage: true,
    jsonRoundTripStable,
  };
};
