import type { OfficialUserAppTemplatePackageDraft } from './officialUserAppTemplatePackageDraft';
import type {
  OfficialUserAppTemplatePackageDraftValidationIssue,
  OfficialUserAppTemplatePackageDraftValidationResult,
} from './officialUserAppTemplatePackageDraftValidation';
import { isOfficialDraftJsonRoundTripStable } from './officialUserAppTemplatePackageDraft';

export type OfficialUserAppTemplatePackageDraftNextAction =
  | 'ready_for_draft_publish_gate'
  | 'request_user_facing_copy_revision'
  | 'request_step_guidance_revision'
  | 'request_region_guidance_revision'
  | 'request_privacy_notice_revision'
  | 'keep_as_draft_only'
  | 'blocked_do_not_publish';

export type OfficialUserAppTemplatePackageDraftHandoffStatus =
  | 'official_draft_handoff_ready'
  | 'official_draft_handoff_ready_with_warnings'
  | 'official_draft_handoff_blocked'
  | 'official_draft_handoff_example_only';

export type OfficialUserAppTemplatePackageDraftDecision =
  | 'send_to_phase_10h_draft_publish_gate'
  | 'revise_user_facing_copy_before_publish_gate'
  | 'revise_step_guidance_before_publish_gate'
  | 'revise_region_guidance_before_publish_gate'
  | 'revise_privacy_notice_before_publish_gate'
  | 'retain_as_local_draft_only'
  | 'blocked_no_publish_gate_entry';

export interface OfficialUserAppTemplatePackageDraftHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface OfficialUserAppTemplatePackageDraftHandoff {
  id: string;
  draftId: string;
  sourceGateResultId: string;
  sourcePreviewId: string;
  sourceCandidatePackageId: string;
  status: OfficialUserAppTemplatePackageDraftHandoffStatus;
  decision: OfficialUserAppTemplatePackageDraftDecision;
  nextAction: OfficialUserAppTemplatePackageDraftNextAction;
  items: OfficialUserAppTemplatePackageDraftHandoffItem[];
  notes: string[];
  draftOnly: true;
  publishBlocked: true;
  noUserAppPackageRegistryWrite: true;
  noUserAppShellPackageReplacement: true;
  notPublished: true;
  jsonRoundTripStable: boolean;
}

const issueIds = (
  validation: OfficialUserAppTemplatePackageDraftValidationResult,
): Set<string> => new Set(validation.issues.map((issue) => issue.checkId));

const hasBlocking = (
  validation: OfficialUserAppTemplatePackageDraftValidationResult,
): boolean => validation.issues.some((issue) => issue.severity === 'blocking');

const hasWarning = (
  validation: OfficialUserAppTemplatePackageDraftValidationResult,
): boolean =>
  validation.status === 'official_draft_validation_ready_with_warnings' ||
  validation.issues.some((issue) => issue.severity === 'warning');

const chooseNextAction = (
  validation: OfficialUserAppTemplatePackageDraftValidationResult,
): OfficialUserAppTemplatePackageDraftNextAction => {
  const ids = issueIds(validation);
  if (ids.has('step_sequence_ready')) {
    return 'request_step_guidance_revision';
  }
  if (ids.has('region_guidance_ready')) {
    return 'request_region_guidance_revision';
  }
  if (ids.has('title_summary_ready')) {
    return 'request_user_facing_copy_revision';
  }
  if (
    ids.has('privacy_notice_ready') ||
    ids.has('no_raw_image_reference') ||
    ids.has('no_personal_data') ||
    ids.has('no_medical_claims') ||
    ids.has('no_product_shade_claims') ||
    ids.has('no_unsupported_final_claims')
  ) {
    return 'request_privacy_notice_revision';
  }
  if (hasBlocking(validation)) {
    return 'blocked_do_not_publish';
  }
  if (hasWarning(validation)) {
    return 'keep_as_draft_only';
  }
  return 'ready_for_draft_publish_gate';
};

const decisionForNextAction = (
  nextAction: OfficialUserAppTemplatePackageDraftNextAction,
): OfficialUserAppTemplatePackageDraftDecision => {
  switch (nextAction) {
    case 'ready_for_draft_publish_gate':
      return 'send_to_phase_10h_draft_publish_gate';
    case 'request_user_facing_copy_revision':
      return 'revise_user_facing_copy_before_publish_gate';
    case 'request_step_guidance_revision':
      return 'revise_step_guidance_before_publish_gate';
    case 'request_region_guidance_revision':
      return 'revise_region_guidance_before_publish_gate';
    case 'request_privacy_notice_revision':
      return 'revise_privacy_notice_before_publish_gate';
    case 'keep_as_draft_only':
      return 'retain_as_local_draft_only';
    case 'blocked_do_not_publish':
      return 'blocked_no_publish_gate_entry';
  }
};

const issueSummary = (
  issues: OfficialUserAppTemplatePackageDraftValidationIssue[],
  severity: 'warning' | 'blocking',
): string => String(issues.filter((issue) => issue.severity === severity).length);

export const createOfficialUserAppTemplatePackageDraftHandoff = ({
  draft,
  validation,
  id = `official-user-app-template-package-draft-handoff-${draft.draftId}`,
}: {
  draft: OfficialUserAppTemplatePackageDraft;
  validation: OfficialUserAppTemplatePackageDraftValidationResult;
  id?: string;
}): OfficialUserAppTemplatePackageDraftHandoff => {
  const nextAction = chooseNextAction(validation);
  const status: OfficialUserAppTemplatePackageDraftHandoffStatus =
    draft.draftStatus === 'official_package_draft_example_only'
      ? 'official_draft_handoff_example_only'
      : validation.status === 'official_draft_validation_blocked'
        ? 'official_draft_handoff_blocked'
        : validation.status === 'official_draft_validation_ready_with_warnings'
          ? 'official_draft_handoff_ready_with_warnings'
          : 'official_draft_handoff_ready';

  const handoff: OfficialUserAppTemplatePackageDraftHandoff = {
    id,
    draftId: draft.draftId,
    sourceGateResultId: draft.sourceGateResultId,
    sourcePreviewId: draft.sourcePreviewId,
    sourceCandidatePackageId: draft.sourceCandidatePackageId,
    status,
    decision: decisionForNextAction(nextAction),
    nextAction,
    items: [
      {
        id: 'draft_status',
        label: 'Draft status',
        value: draft.draftStatus,
        status: draft.draftStatus.includes('blocked')
          ? 'blocked'
          : draft.draftStatus.includes('warning')
            ? 'warning'
            : 'ready',
      },
      {
        id: 'validation_status',
        label: 'Validation status',
        value: validation.status,
        status: validation.status.includes('blocked')
          ? 'blocked'
          : validation.status.includes('warning')
            ? 'warning'
            : 'ready',
      },
      {
        id: 'blocking_issues',
        label: 'Blocking issues',
        value: issueSummary(validation.issues, 'blocking'),
        status: hasBlocking(validation) ? 'blocked' : 'ready',
      },
      {
        id: 'warning_issues',
        label: 'Warning issues',
        value: issueSummary(validation.issues, 'warning'),
        status: hasWarning(validation) ? 'warning' : 'ready',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Ready means this draft may enter a future draft publish gate.',
      'Handoff does not publish to the user app.',
      'Handoff does not write a user app package registry.',
      'Handoff does not replace the current User App Shell package.',
    ],
    draftOnly: true,
    publishBlocked: true,
    noUserAppPackageRegistryWrite: true,
    noUserAppShellPackageReplacement: true,
    notPublished: true,
    jsonRoundTripStable: true,
  };

  handoff.jsonRoundTripStable = isOfficialDraftJsonRoundTripStable(handoff);
  return handoff;
};
