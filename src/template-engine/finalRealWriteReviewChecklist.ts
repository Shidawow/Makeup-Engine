import type { RealRegistryWriteImplementationDraft } from './realRegistryWriteImplementationDraft';
import type { RealRegistryWriteImplementationDraftValidationResult } from './realRegistryWriteImplementationDraftValidation';
import {
  finalRealWriteOwnerAuthorizationText,
  type FinalRealWriteOwnerAuthorizationScope,
} from './finalRealWriteReviewGate';

export type FinalRealWriteReviewChecklistStatus =
  | 'final_review_checklist_ready'
  | 'final_review_checklist_ready_with_warnings'
  | 'final_review_checklist_blocked'
  | 'final_review_checklist_example_only';

export type FinalRealWriteReviewRequirement =
  | 'confirm_owner_authorized_review_gate_only'
  | 'confirm_owner_did_not_authorize_actual_registry_write'
  | 'confirm_owner_did_not_authorize_publish'
  | 'confirm_owner_did_not_authorize_user_app_shell_package_replacement'
  | 'confirm_implementation_draft_is_dry_run_only'
  | 'confirm_no_production_writer_in_this_phase'
  | 'confirm_writer_interface_draft_reviewed'
  | 'confirm_transaction_draft_reviewed'
  | 'confirm_write_lock_draft_reviewed'
  | 'confirm_audit_event_draft_reviewed'
  | 'confirm_rollback_command_draft_reviewed'
  | 'confirm_future_actual_write_requires_separate_approval'
  | 'confirm_production_write_remains_disabled';

export interface FinalRealWriteReviewOwnerAuthorizationEvidence {
  scope: FinalRealWriteOwnerAuthorizationScope;
  text: string;
  ownerAuthorizedReviewGateOnly: boolean;
  ownerAuthorizedActualWrite: boolean;
  ownerAuthorizedPublish: boolean;
  ownerAuthorizedUserAppShellReplacement: boolean;
  doesNotTriggerWrite: true;
}

export interface FinalRealWriteReviewChecklistItem {
  id: FinalRealWriteReviewRequirement;
  label: string;
  description: string;
  status: 'ready' | 'warning' | 'blocked';
  requirement: FinalRealWriteReviewRequirement;
}

export interface FinalRealWriteReviewChecklist {
  checklistId: string;
  sourceImplementationDraftId: string;
  sourceImplementationDraftValidationStatus: RealRegistryWriteImplementationDraftValidationResult['status'];
  status: FinalRealWriteReviewChecklistStatus;
  items: FinalRealWriteReviewChecklistItem[];
  requirements: FinalRealWriteReviewRequirement[];
  ownerAuthorizationEvidence: FinalRealWriteReviewOwnerAuthorizationEvidence;
  doesNotTriggerWrite: true;
  doesNotCreateProductionWriter: true;
  doesNotModifyRegistry: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  productionWriteStillDisabled: true;
  futureActualWriteRequiresSeparateApproval: true;
  notes: string[];
  jsonRoundTripStable: boolean;
}

export interface FinalRealWriteReviewChecklistOverrides {
  ownerAuthorizationScope?: FinalRealWriteOwnerAuthorizationScope;
  ownerAuthorizationText?: string;
  omitRequirements?: FinalRealWriteReviewRequirement[];
  futureActualWriteRequiresSeparateApproval?: boolean;
  productionWriteStillDisabled?: boolean;
  note?: string;
}

const requiredChecklistItems: Array<{
  id: FinalRealWriteReviewRequirement;
  label: string;
  description: string;
}> = [
  {
    id: 'confirm_owner_authorized_review_gate_only',
    label: 'Owner authorized review gate only',
    description:
      'Confirm the owner authorization only allows entering Phase 10P final review gate.',
  },
  {
    id: 'confirm_owner_did_not_authorize_actual_registry_write',
    label: 'Owner did not authorize actual registry write',
    description:
      'Confirm this phase cannot execute or mark an actual registry write.',
  },
  {
    id: 'confirm_owner_did_not_authorize_publish',
    label: 'Owner did not authorize publish',
    description: 'Confirm this phase cannot publish to the user app.',
  },
  {
    id: 'confirm_owner_did_not_authorize_user_app_shell_package_replacement',
    label: 'Owner did not authorize User App Shell package replacement',
    description:
      'Confirm the current User App Shell package remains unchanged.',
  },
  {
    id: 'confirm_implementation_draft_is_dry_run_only',
    label: 'Implementation draft is dry-run only',
    description:
      'Confirm the Phase 10O implementation draft keeps dryRunOnly true.',
  },
  {
    id: 'confirm_no_production_writer_in_this_phase',
    label: 'No production writer in this phase',
    description:
      'Confirm Phase 10P does not create or execute a production writer.',
  },
  {
    id: 'confirm_writer_interface_draft_reviewed',
    label: 'Writer interface draft reviewed',
    description:
      'Confirm the dry-run writer interface draft is present for review.',
  },
  {
    id: 'confirm_transaction_draft_reviewed',
    label: 'Transaction draft reviewed',
    description: 'Confirm the transaction draft is present for review.',
  },
  {
    id: 'confirm_write_lock_draft_reviewed',
    label: 'Write lock draft reviewed',
    description:
      'Confirm the write lock draft is present and required before any future write.',
  },
  {
    id: 'confirm_audit_event_draft_reviewed',
    label: 'Audit event draft reviewed',
    description: 'Confirm the audit event draft is present for review.',
  },
  {
    id: 'confirm_rollback_command_draft_reviewed',
    label: 'Rollback command draft reviewed',
    description: 'Confirm the rollback command draft is present for review.',
  },
  {
    id: 'confirm_future_actual_write_requires_separate_approval',
    label: 'Future actual write requires separate approval',
    description:
      'Confirm any future real write execution needs separate owner authorization.',
  },
  {
    id: 'confirm_production_write_remains_disabled',
    label: 'Production write remains disabled',
    description:
      'Confirm production write remains disabled after final review.',
  },
];

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const sourceValidationReady = (
  validation: RealRegistryWriteImplementationDraftValidationResult,
): boolean =>
  validation.readyForFinalRealWriteReviewGate &&
  (validation.status === 'implementation_draft_validation_ready' ||
    validation.status === 'implementation_draft_validation_ready_with_warnings');

export const createFinalRealWriteReviewChecklist = ({
  draft,
  validation,
  checklistId = `final-real-write-review-checklist-${draft.implementationDraftId}`,
  overrides = {},
}: {
  draft: RealRegistryWriteImplementationDraft;
  validation: RealRegistryWriteImplementationDraftValidationResult;
  checklistId?: string;
  overrides?: FinalRealWriteReviewChecklistOverrides;
}): FinalRealWriteReviewChecklist => {
  const ownerAuthorizationScope =
    overrides.ownerAuthorizationScope ?? 'review_gate_only';
  const ownerAuthorizationText =
    overrides.ownerAuthorizationText ?? finalRealWriteOwnerAuthorizationText;
  const omitted = new Set(overrides.omitRequirements ?? []);
  const sourceReady = sourceValidationReady(validation);
  const futureActualWriteRequiresSeparateApproval =
    overrides.futureActualWriteRequiresSeparateApproval ?? true;
  const productionWriteStillDisabled =
    overrides.productionWriteStillDisabled ??
    (draft.actualWriteBlocked && draft.productionWriterBlocked);
  const ownerEvidence: FinalRealWriteReviewOwnerAuthorizationEvidence = {
    scope: ownerAuthorizationScope,
    text: ownerAuthorizationText,
    ownerAuthorizedReviewGateOnly: ownerAuthorizationScope === 'review_gate_only',
    ownerAuthorizedActualWrite: ownerAuthorizationScope === 'actual_write',
    ownerAuthorizedPublish: ownerAuthorizationScope === 'publish',
    ownerAuthorizedUserAppShellReplacement:
      ownerAuthorizationScope === 'user_app_shell_replacement',
    doesNotTriggerWrite: true,
  };
  const items = requiredChecklistItems.map(
    (item): FinalRealWriteReviewChecklistItem => {
      const omittedRequirement = omitted.has(item.id);
      const specificBlocked =
        (item.id === 'confirm_owner_authorized_review_gate_only' &&
          ownerAuthorizationScope !== 'review_gate_only') ||
        (item.id ===
          'confirm_owner_did_not_authorize_actual_registry_write' &&
          ownerAuthorizationScope === 'actual_write') ||
        (item.id === 'confirm_owner_did_not_authorize_publish' &&
          ownerAuthorizationScope === 'publish') ||
        (item.id ===
          'confirm_owner_did_not_authorize_user_app_shell_package_replacement' &&
          ownerAuthorizationScope === 'user_app_shell_replacement') ||
        (item.id === 'confirm_implementation_draft_is_dry_run_only' &&
          !draft.dryRunOnly) ||
        (item.id === 'confirm_no_production_writer_in_this_phase' &&
          !draft.productionWriterBlocked) ||
        (item.id === 'confirm_writer_interface_draft_reviewed' &&
          !draft.writerInterfaceDraft) ||
        (item.id === 'confirm_transaction_draft_reviewed' &&
          !draft.transactionDraft) ||
        (item.id === 'confirm_write_lock_draft_reviewed' &&
          !draft.writeLockDraft) ||
        (item.id === 'confirm_audit_event_draft_reviewed' &&
          !draft.auditEventDraft) ||
        (item.id === 'confirm_rollback_command_draft_reviewed' &&
          !draft.rollbackCommandDraft) ||
        (item.id === 'confirm_future_actual_write_requires_separate_approval' &&
          !futureActualWriteRequiresSeparateApproval) ||
        (item.id === 'confirm_production_write_remains_disabled' &&
          !productionWriteStillDisabled);
      return {
        ...item,
        requirement: item.id,
        status:
          sourceReady && !omittedRequirement && !specificBlocked
            ? 'ready'
            : 'blocked',
      };
    },
  );
  const hasBlocked = items.some((item) => item.status === 'blocked');
  const hasWarnings =
    draft.implementationDraftStatus === 'implementation_draft_ready_with_warnings' ||
    validation.status === 'implementation_draft_validation_ready_with_warnings';

  const checklist: FinalRealWriteReviewChecklist = {
    checklistId,
    sourceImplementationDraftId: draft.implementationDraftId,
    sourceImplementationDraftValidationStatus: validation.status,
    status:
      draft.implementationDraftStatus === 'implementation_draft_example_only'
        ? 'final_review_checklist_example_only'
        : hasBlocked || !sourceReady
          ? 'final_review_checklist_blocked'
          : hasWarnings
            ? 'final_review_checklist_ready_with_warnings'
            : 'final_review_checklist_ready',
    items,
    requirements: items
      .filter((item) => item.status !== 'blocked')
      .map((item) => item.id),
    ownerAuthorizationEvidence: ownerEvidence,
    doesNotTriggerWrite: true,
    doesNotCreateProductionWriter: true,
    doesNotModifyRegistry: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    productionWriteStillDisabled: true,
    futureActualWriteRequiresSeparateApproval: true,
    notes: [
      'Checklist is local and administrator-only.',
      'Checklist does not trigger a registry write.',
      'Checklist does not create a production writer.',
      'Checklist does not modify a registry.',
      'Checklist preserves the owner authorization text exactly as Phase 10P review-gate evidence.',
      'Phase 10P does not publish or replace the current User App Shell package.',
      overrides.note ??
        'Future actual registry write requires a separate explicit owner authorization phase.',
    ],
    jsonRoundTripStable: true,
  };
  checklist.jsonRoundTripStable = isJsonRoundTripStable(checklist);
  return checklist;
};
