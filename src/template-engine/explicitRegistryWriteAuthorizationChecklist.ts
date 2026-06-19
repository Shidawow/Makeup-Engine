import type { ControlledRegistryWriterDraft } from './controlledUserAppTemplatePackageRegistryWriterDraft';
import type { ControlledRegistryWriterValidationResult } from './controlledUserAppTemplatePackageRegistryWriterValidation';

export type ExplicitRegistryWriteAuthorizationChecklistStatus =
  | 'authorization_checklist_ready'
  | 'authorization_checklist_ready_with_warnings'
  | 'authorization_checklist_blocked'
  | 'authorization_checklist_example_only';

export type ExplicitRegistryWriteAuthorizationRequirement =
  | 'owner_confirms_candidate_package'
  | 'owner_confirms_registry_entry_preview'
  | 'owner_confirms_diff_preview'
  | 'owner_confirms_rollback_plan'
  | 'owner_confirms_privacy_boundary'
  | 'owner_confirms_no_raw_image_or_personal_data'
  | 'owner_confirms_no_publish_in_this_phase'
  | 'owner_confirms_no_user_app_shell_package_replacement'
  | 'owner_confirms_future_write_requires_separate_explicit_approval';

export interface ExplicitRegistryWriteAuthorizationAcknowledgement {
  requirement: ExplicitRegistryWriteAuthorizationRequirement;
  label: string;
  reviewerAcknowledgementRequired: boolean;
  ownerAuthorizationRequired: boolean;
  futureApprovalRequired: boolean;
  doesNotTriggerWrite: true;
}

export interface ExplicitRegistryWriteAuthorizationChecklistItem {
  id: ExplicitRegistryWriteAuthorizationRequirement;
  label: string;
  description: string;
  acknowledgement: ExplicitRegistryWriteAuthorizationAcknowledgement;
  status: 'ready' | 'warning' | 'blocked';
}

export interface ExplicitRegistryWriteAuthorizationChecklist {
  checklistId: string;
  sourceWriterDraftId: string;
  sourceWriterValidationStatus: ControlledRegistryWriterValidationResult['status'];
  status: ExplicitRegistryWriteAuthorizationChecklistStatus;
  items: ExplicitRegistryWriteAuthorizationChecklistItem[];
  requirements: ExplicitRegistryWriteAuthorizationRequirement[];
  reviewerAckRequired: boolean;
  ownerAuthorizationRequired: boolean;
  futureApprovalRequired: boolean;
  doesNotTriggerWrite: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  noSensitiveUserData: true;
  notes: string[];
  jsonRoundTripStable: boolean;
}

export interface ExplicitRegistryWriteAuthorizationChecklistOverrides {
  omitRequirements?: ExplicitRegistryWriteAuthorizationRequirement[];
  reviewerAckRequired?: boolean;
  ownerAuthorizationRequired?: boolean;
  futureApprovalRequired?: boolean;
  note?: string;
}

const requiredChecklistItems: Array<{
  id: ExplicitRegistryWriteAuthorizationRequirement;
  label: string;
  description: string;
}> = [
  {
    id: 'owner_confirms_candidate_package',
    label: 'Owner confirms candidate package',
    description:
      'Confirm the reviewed candidate package is the only source for the future write design.',
  },
  {
    id: 'owner_confirms_registry_entry_preview',
    label: 'Owner confirms registry entry preview',
    description:
      'Confirm the registry entry preview is still a preview and not a persisted registry record.',
  },
  {
    id: 'owner_confirms_diff_preview',
    label: 'Owner confirms diff preview',
    description:
      'Confirm the local diff preview is reviewed before any future controlled write design.',
  },
  {
    id: 'owner_confirms_rollback_plan',
    label: 'Owner confirms rollback plan',
    description:
      'Confirm a rollback plan is required before any later execution phase can be considered.',
  },
  {
    id: 'owner_confirms_privacy_boundary',
    label: 'Owner confirms privacy boundary',
    description:
      'Confirm no raw image, personal data, health data, sensitive identity, or biometric data is present.',
  },
  {
    id: 'owner_confirms_no_raw_image_or_personal_data',
    label: 'Owner confirms no raw image / no personal data',
    description:
      'Confirm the authorization gate only carries metadata and trace, not runtime images or user records.',
  },
  {
    id: 'owner_confirms_no_publish_in_this_phase',
    label: 'Owner confirms no publish in this phase',
    description:
      'Confirm Phase 10L cannot publish to the user app or mark anything live.',
  },
  {
    id: 'owner_confirms_no_user_app_shell_package_replacement',
    label: 'Owner confirms no User App Shell package replacement',
    description:
      'Confirm the current User App Shell package remains unchanged in Phase 10L.',
  },
  {
    id: 'owner_confirms_future_write_requires_separate_explicit_approval',
    label: 'Owner confirms future write still requires separate explicit approval',
    description:
      'Confirm any real registry write after this gate still needs a later owner approval and execution design.',
  },
];

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

export const createExplicitRegistryWriteAuthorizationChecklist = ({
  draft,
  validation,
  checklistId = `explicit-registry-write-authorization-checklist-${draft.writerDraftId}`,
  overrides = {},
}: {
  draft: ControlledRegistryWriterDraft;
  validation: ControlledRegistryWriterValidationResult;
  checklistId?: string;
  overrides?: ExplicitRegistryWriteAuthorizationChecklistOverrides;
}): ExplicitRegistryWriteAuthorizationChecklist => {
  const omitted = new Set(overrides.omitRequirements ?? []);
  const reviewerAckRequired = overrides.reviewerAckRequired ?? true;
  const ownerAuthorizationRequired = overrides.ownerAuthorizationRequired ?? true;
  const futureApprovalRequired = overrides.futureApprovalRequired ?? true;
  const sourceReady =
    validation.status === 'writer_validation_ready' ||
    validation.status === 'writer_validation_ready_with_warnings';

  const items = requiredChecklistItems.map(
    (item): ExplicitRegistryWriteAuthorizationChecklistItem => {
      const omittedRequirement = omitted.has(item.id);
      return {
        ...item,
        acknowledgement: {
          requirement: item.id,
          label: item.label,
          reviewerAcknowledgementRequired: reviewerAckRequired,
          ownerAuthorizationRequired,
          futureApprovalRequired,
          doesNotTriggerWrite: true,
        },
        status:
          sourceReady &&
          !omittedRequirement &&
          reviewerAckRequired &&
          ownerAuthorizationRequired &&
          futureApprovalRequired
            ? 'ready'
            : 'blocked',
      };
    },
  );
  const hasBlocked = items.some((item) => item.status === 'blocked');
  const hasWarnings =
    draft.writerDraftStatus === 'writer_draft_ready_with_warnings' ||
    validation.status === 'writer_validation_ready_with_warnings';

  const checklist: ExplicitRegistryWriteAuthorizationChecklist = {
    checklistId,
    sourceWriterDraftId: draft.writerDraftId,
    sourceWriterValidationStatus: validation.status,
    status:
      draft.writerDraftStatus === 'writer_draft_example_only'
        ? 'authorization_checklist_example_only'
        : hasBlocked || !sourceReady
          ? 'authorization_checklist_blocked'
          : hasWarnings
            ? 'authorization_checklist_ready_with_warnings'
            : 'authorization_checklist_ready',
    items,
    requirements: items
      .filter((item) => item.status !== 'blocked')
      .map((item) => item.id),
    reviewerAckRequired,
    ownerAuthorizationRequired,
    futureApprovalRequired,
    doesNotTriggerWrite: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    noSensitiveUserData: true,
    notes: [
      'Checklist is local and administrator-only.',
      'Checklist does not trigger a registry write.',
      'Every confirmation keeps future owner approval required.',
      'Phase 10L does not publish or replace the current User App Shell package.',
      'Phase 10L does not store sensitive user data.',
      overrides.note ?? 'Future real write, if ever designed, requires a separate explicit approval.',
    ],
    jsonRoundTripStable: true,
  };
  checklist.jsonRoundTripStable = isJsonRoundTripStable(checklist);
  return checklist;
};
