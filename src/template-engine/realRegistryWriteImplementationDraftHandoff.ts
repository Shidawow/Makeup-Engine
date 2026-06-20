import type {
  RealRegistryWriteImplementationDraft,
} from './realRegistryWriteImplementationDraft';
import type {
  RealRegistryWriteImplementationDraftValidationResult,
} from './realRegistryWriteImplementationDraftValidation';

export type RealRegistryWriteImplementationDraftNextAction =
  | 'ready_for_final_real_write_review_gate'
  | 'request_writer_interface_revision'
  | 'request_transaction_draft_revision'
  | 'request_write_lock_revision'
  | 'request_audit_event_revision'
  | 'request_rollback_command_revision'
  | 'request_owner_authorization_review'
  | 'keep_as_implementation_draft_only'
  | 'blocked_do_not_create_production_writer';

export type RealRegistryWriteImplementationDraftHandoffStatus =
  | 'implementation_draft_handoff_ready'
  | 'implementation_draft_handoff_ready_with_warnings'
  | 'implementation_draft_handoff_blocked'
  | 'implementation_draft_handoff_example_only';

export interface RealRegistryWriteImplementationDraftHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface RealRegistryWriteImplementationDraftHandoff {
  id: string;
  sourceImplementationDraftId: string;
  sourceImplementationGateId: string;
  sourceExecutionDesignId: string;
  sourceWriterDraftId: string;
  status: RealRegistryWriteImplementationDraftHandoffStatus;
  nextAction: RealRegistryWriteImplementationDraftNextAction;
  items: RealRegistryWriteImplementationDraftHandoffItem[];
  notes: string[];
  implementationDraftOnly: true;
  dryRunOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  readyForFinalRealWriteReviewGate: boolean;
  jsonRoundTripStable: boolean;
}

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const statusForDraft = (
  draft: RealRegistryWriteImplementationDraft,
  validation: RealRegistryWriteImplementationDraftValidationResult,
): RealRegistryWriteImplementationDraftHandoffStatus => {
  if (draft.implementationDraftStatus === 'implementation_draft_example_only') {
    return 'implementation_draft_handoff_example_only';
  }
  if (
    draft.implementationDraftStatus === 'implementation_draft_blocked' ||
    validation.status === 'implementation_draft_validation_blocked'
  ) {
    return 'implementation_draft_handoff_blocked';
  }
  if (
    draft.implementationDraftStatus === 'implementation_draft_ready_with_warnings' ||
    validation.status === 'implementation_draft_validation_ready_with_warnings'
  ) {
    return 'implementation_draft_handoff_ready_with_warnings';
  }
  return 'implementation_draft_handoff_ready';
};

const nextActionForValidation = (
  validation: RealRegistryWriteImplementationDraftValidationResult,
): RealRegistryWriteImplementationDraftNextAction => {
  const action = validation.recommendations[0]?.action;
  switch (action) {
    case 'continue_to_final_real_write_review_gate':
      return 'ready_for_final_real_write_review_gate';
    case 'request_writer_interface_revision':
      return 'request_writer_interface_revision';
    case 'request_transaction_draft_revision':
      return 'request_transaction_draft_revision';
    case 'request_write_lock_revision':
      return 'request_write_lock_revision';
    case 'request_audit_event_revision':
      return 'request_audit_event_revision';
    case 'request_rollback_command_revision':
      return 'request_rollback_command_revision';
    case 'request_owner_authorization_review':
      return 'request_owner_authorization_review';
    case 'keep_as_implementation_draft_only':
      return 'keep_as_implementation_draft_only';
    case 'block_production_writer_creation':
    default:
      return 'blocked_do_not_create_production_writer';
  }
};

export const createRealRegistryWriteImplementationDraftHandoff = ({
  draft,
  validation,
  id = `real-registry-write-implementation-draft-handoff-${draft.implementationDraftId}`,
}: {
  draft: RealRegistryWriteImplementationDraft;
  validation: RealRegistryWriteImplementationDraftValidationResult;
  id?: string;
}): RealRegistryWriteImplementationDraftHandoff => {
  const handoff: RealRegistryWriteImplementationDraftHandoff = {
    id,
    sourceImplementationDraftId: draft.implementationDraftId,
    sourceImplementationGateId: draft.sourceImplementationGateId,
    sourceExecutionDesignId: draft.sourceExecutionDesignId,
    sourceWriterDraftId: draft.sourceWriterDraftId,
    status: statusForDraft(draft, validation),
    nextAction: nextActionForValidation(validation),
    items: [
      {
        id: 'implementation_draft_status',
        label: 'Real registry write implementation draft',
        value: draft.implementationDraftStatus,
        status:
          draft.implementationDraftStatus === 'implementation_draft_blocked'
            ? 'blocked'
            : draft.implementationDraftStatus ===
                'implementation_draft_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'implementation_draft_validation_status',
        label: 'Implementation draft validation',
        value: validation.status,
        status:
          validation.status === 'implementation_draft_validation_blocked'
            ? 'blocked'
            : validation.status ===
                'implementation_draft_validation_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'dry_run_no_write',
        label: 'Dry-run / no actual write',
        value:
          draft.dryRunOnly && draft.actualWriteBlocked
            ? 'dry-run only; actual write blocked'
            : 'missing safety flags',
        status: draft.dryRunOnly && draft.actualWriteBlocked ? 'ready' : 'blocked',
      },
      {
        id: 'no_publish_no_replacement',
        label: 'No publish / no package replacement',
        value:
          draft.publishBlocked && draft.packageReplacementBlocked
            ? 'publish blocked; shell replacement blocked'
            : 'missing boundary flags',
        status:
          draft.publishBlocked && draft.packageReplacementBlocked
            ? 'ready'
            : 'blocked',
      },
      {
        id: 'production_writer_blocked',
        label: 'Production writer blocked',
        value: draft.productionWriterBlocked ? 'blocked' : 'not blocked',
        status: draft.productionWriterBlocked ? 'ready' : 'blocked',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Handoff does not write a UserAppTemplatePackage registry.',
      'Handoff does not publish to the user app.',
      'Handoff does not replace the current User App Shell package.',
      'Handoff does not create a production writer.',
      'Handoff is for Phase 10P or a later final real write review gate only.',
      'Future real writer implementation still requires separate owner authorization.',
    ],
    implementationDraftOnly: true,
    dryRunOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    readyForFinalRealWriteReviewGate:
      draft.readyForFinalRealWriteReviewGate &&
      validation.readyForFinalRealWriteReviewGate,
    jsonRoundTripStable: true,
  };
  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
