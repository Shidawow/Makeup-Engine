import type { UserAppPackageDraftPreview } from './userAppPackageDraftPreview';
import type { UserAppPackageDraftPreviewValidationResult } from './userAppPackageDraftPreviewValidation';

export type UserAppPackageDraftPreviewNextAction =
  | 'ready_for_official_user_app_package_draft'
  | 'request_user_facing_copy_revision'
  | 'request_step_guidance_revision'
  | 'request_region_guidance_revision'
  | 'request_privacy_notice_revision'
  | 'keep_as_admin_preview_only'
  | 'blocked_do_not_create_app_package';

export type UserAppPackageDraftPreviewHandoffStatus =
  | 'draft_preview_handoff_ready'
  | 'draft_preview_handoff_ready_with_warnings'
  | 'draft_preview_handoff_blocked'
  | 'draft_preview_handoff_example_only';

export type UserAppPackageDraftPreviewDecision =
  | 'handoff_to_official_user_app_package_draft_gate'
  | 'revise_draft_preview'
  | 'block_app_package_creation'
  | 'retain_admin_preview_only';

export interface UserAppPackageDraftPreviewHandoff {
  id: string;
  previewId: string;
  sourceContractPreparationId: string;
  sourceCandidatePackageId: string;
  status: UserAppPackageDraftPreviewHandoffStatus;
  decision: UserAppPackageDraftPreviewDecision;
  nextAction: UserAppPackageDraftPreviewNextAction;
  previewSummary: {
    title: string;
    steps: number;
    regions: number;
    validationStatus: UserAppPackageDraftPreviewValidationResult['status'];
  };
  notes: string[];
  previewOnly: true;
  notFormalUserAppTemplatePackage: true;
  notPublished: true;
  noUserAppPackageRegistryWrite: true;
  formalUserAppTemplatePackageGenerationBlocked: true;
  jsonRoundTripStable: boolean;
}

const nextActionFor = (
  preview: UserAppPackageDraftPreview,
  validation: UserAppPackageDraftPreviewValidationResult,
): UserAppPackageDraftPreviewNextAction => {
  const issueText = JSON.stringify({
    blockedReasons: preview.blockedReasons,
    issues: validation.issues,
    warnings: preview.warnings,
  });

  if (preview.previewStatus === 'draft_preview_example_only') {
    return 'keep_as_admin_preview_only';
  }

  if (validation.status === 'draft_preview_validation_blocked') {
    if (/privacy|personal|raw_image|medical|shade|final|UserAppTemplatePackage|mutation/i.test(issueText)) {
      return 'request_privacy_notice_revision';
    }
    if (/step/i.test(issueText)) {
      return 'request_step_guidance_revision';
    }
    if (/region/i.test(issueText)) {
      return 'request_region_guidance_revision';
    }
    if (/title|summary|copy|用户可见|文案/i.test(issueText)) {
      return 'request_user_facing_copy_revision';
    }
    return 'blocked_do_not_create_app_package';
  }

  if (validation.status === 'draft_preview_validation_ready_with_warnings') {
    return 'request_user_facing_copy_revision';
  }

  return 'ready_for_official_user_app_package_draft';
};

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

export const createUserAppPackageDraftPreviewHandoff = ({
  preview,
  validation,
  id = `user-app-draft-preview-handoff-${preview.previewId}`,
}: {
  preview: UserAppPackageDraftPreview;
  validation: UserAppPackageDraftPreviewValidationResult;
  id?: string;
}): UserAppPackageDraftPreviewHandoff => {
  const nextAction = nextActionFor(preview, validation);
  const status: UserAppPackageDraftPreviewHandoffStatus =
    nextAction === 'keep_as_admin_preview_only'
      ? 'draft_preview_handoff_example_only'
      : validation.status === 'draft_preview_validation_blocked'
        ? 'draft_preview_handoff_blocked'
        : validation.status === 'draft_preview_validation_ready_with_warnings'
          ? 'draft_preview_handoff_ready_with_warnings'
          : 'draft_preview_handoff_ready';
  const decision: UserAppPackageDraftPreviewDecision =
    status === 'draft_preview_handoff_example_only'
      ? 'retain_admin_preview_only'
      : status === 'draft_preview_handoff_blocked'
        ? 'block_app_package_creation'
        : status === 'draft_preview_handoff_ready_with_warnings'
          ? 'revise_draft_preview'
          : 'handoff_to_official_user_app_package_draft_gate';

  const handoff: UserAppPackageDraftPreviewHandoff = {
    id,
    previewId: preview.previewId,
    sourceContractPreparationId: preview.sourceContractPreparationId,
    sourceCandidatePackageId: preview.sourceCandidatePackageId,
    status,
    decision,
    nextAction,
    previewSummary: {
      title: preview.titlePreview,
      steps: preview.stepGuidancePreview.length,
      regions: preview.regionGuidancePreview.length,
      validationStatus: validation.status,
    },
    notes: [
      'Handoff is local and administrator-only.',
      'Handoff can feed a later official User App package draft gate.',
      'Handoff does not generate a formal UserAppTemplatePackage.',
      'Handoff does not write a user app package registry.',
      'Handoff does not publish to the user app.',
    ],
    previewOnly: true,
    notFormalUserAppTemplatePackage: true,
    notPublished: true,
    noUserAppPackageRegistryWrite: true,
    formalUserAppTemplatePackageGenerationBlocked: true,
    jsonRoundTripStable: true,
  };

  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
