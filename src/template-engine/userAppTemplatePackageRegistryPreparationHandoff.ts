import type { UserAppTemplatePackageRegistryPreparation } from './userAppTemplatePackageRegistryPreparation';
import type {
  UserAppTemplatePackageRegistryPreparationValidationIssue,
  UserAppTemplatePackageRegistryPreparationValidationResult,
} from './userAppTemplatePackageRegistryPreparationValidation';

export type UserAppTemplatePackageRegistryPreparationNextAction =
  | 'ready_for_registry_write_gate'
  | 'request_package_metadata_revision'
  | 'request_versioning_review'
  | 'request_privacy_review'
  | 'request_user_app_shell_boundary_review'
  | 'keep_as_registry_preview_only'
  | 'blocked_do_not_write_registry';

export type UserAppTemplatePackageRegistryPreparationHandoffStatus =
  | 'registry_preparation_handoff_ready'
  | 'registry_preparation_handoff_ready_with_warnings'
  | 'registry_preparation_handoff_blocked'
  | 'registry_preparation_handoff_example_only';

export interface UserAppTemplatePackageRegistryPreparationHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface UserAppTemplatePackageRegistryPreparationHandoff {
  id: string;
  preparationId: string;
  sourceOfficialDraftId: string;
  sourceDraftPublishGateId: string;
  validationStatus: UserAppTemplatePackageRegistryPreparationValidationResult['status'];
  status: UserAppTemplatePackageRegistryPreparationHandoffStatus;
  nextAction: UserAppTemplatePackageRegistryPreparationNextAction;
  items: UserAppTemplatePackageRegistryPreparationHandoffItem[];
  notes: string[];
  registryPreparationOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionPackage: true;
  readyForFutureRegistryWriteGate: boolean;
  jsonRoundTripStable: boolean;
}

const issueRequestsPrivacyReview = (
  issue: UserAppTemplatePackageRegistryPreparationValidationIssue,
): boolean =>
  [
    'no_raw_image_reference',
    'no_personal_data',
    'no_medical_claims',
    'no_product_shade_claims',
    'no_unsupported_final_claims',
  ].includes(issue.checkId);

const issueRequestsMetadataRevision = (
  issue: UserAppTemplatePackageRegistryPreparationValidationIssue,
): boolean =>
  ['registry_entry_preview_present', 'package_id_candidate_present'].includes(
    issue.checkId,
  );

const nextActionForValidation = (
  validation: UserAppTemplatePackageRegistryPreparationValidationResult,
): UserAppTemplatePackageRegistryPreparationNextAction => {
  if (validation.status === 'registry_preparation_validation_ready') {
    return 'ready_for_registry_write_gate';
  }
  if (validation.status === 'registry_preparation_validation_ready_with_warnings') {
    return 'keep_as_registry_preview_only';
  }
  if (
    validation.issues.some(
      (issue) =>
        issue.checkId === 'no_actual_registry_write' ||
        issue.checkId === 'source_publish_gate_ready' ||
        issue.checkId === 'draft_only_true' ||
        issue.checkId === 'publish_blocked_true' ||
        issue.checkId === 'no_production_package_marker',
    )
  ) {
    return 'blocked_do_not_write_registry';
  }
  if (validation.issues.some((issue) => issue.checkId === 'package_version_candidate_present')) {
    return 'request_versioning_review';
  }
  if (validation.issues.some(issueRequestsPrivacyReview)) {
    return 'request_privacy_review';
  }
  if (
    validation.issues.some(
      (issue) => issue.checkId === 'no_user_app_shell_package_replacement',
    )
  ) {
    return 'request_user_app_shell_boundary_review';
  }
  if (validation.issues.some(issueRequestsMetadataRevision)) {
    return 'request_package_metadata_revision';
  }
  return 'blocked_do_not_write_registry';
};

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

export const createUserAppTemplatePackageRegistryPreparationHandoff = ({
  preparation,
  validation,
  id = `user-app-template-package-registry-preparation-handoff-${preparation.preparationId}`,
}: {
  preparation: UserAppTemplatePackageRegistryPreparation;
  validation: UserAppTemplatePackageRegistryPreparationValidationResult;
  id?: string;
}): UserAppTemplatePackageRegistryPreparationHandoff => {
  const nextAction = nextActionForValidation(validation);
  const status: UserAppTemplatePackageRegistryPreparationHandoffStatus =
    preparation.preparationStatus === 'registry_preparation_example_only'
      ? 'registry_preparation_handoff_example_only'
      : validation.status === 'registry_preparation_validation_blocked'
        ? 'registry_preparation_handoff_blocked'
        : validation.status === 'registry_preparation_validation_ready_with_warnings'
          ? 'registry_preparation_handoff_ready_with_warnings'
          : 'registry_preparation_handoff_ready';
  const handoff: UserAppTemplatePackageRegistryPreparationHandoff = {
    id,
    preparationId: preparation.preparationId,
    sourceOfficialDraftId: preparation.sourceOfficialDraftId,
    sourceDraftPublishGateId: preparation.sourceDraftPublishGateId,
    validationStatus: validation.status,
    status,
    nextAction,
    items: [
      {
        id: 'preparation_status',
        label: 'Preparation status',
        value: preparation.preparationStatus,
        status:
          preparation.preparationStatus === 'registry_preparation_blocked'
            ? 'blocked'
            : preparation.preparationStatus === 'registry_preparation_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'validation_status',
        label: 'Validation status',
        value: validation.status,
        status:
          validation.status === 'registry_preparation_validation_blocked'
            ? 'blocked'
            : validation.status === 'registry_preparation_validation_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'future_registry_write_gate',
        label: 'Future registry write gate',
        value: validation.readyForRegistryWriteGate ? 'eligible' : 'not eligible',
        status: validation.readyForRegistryWriteGate ? 'ready' : 'blocked',
      },
      {
        id: 'actual_registry_write',
        label: 'Actual registry write',
        value: preparation.noActualRegistryWrite ? 'blocked' : 'risk',
        status: preparation.noActualRegistryWrite ? 'ready' : 'blocked',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Ready means eligible for a future registry write gate only.',
      'Handoff does not write a user app package registry.',
      'Handoff does not publish to the user app.',
      'Handoff does not replace the current User App Shell package.',
      'Handoff does not mark a production UserAppTemplatePackage.',
    ],
    registryPreparationOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionPackage: true,
    readyForFutureRegistryWriteGate: validation.readyForRegistryWriteGate,
    jsonRoundTripStable: true,
  };

  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
