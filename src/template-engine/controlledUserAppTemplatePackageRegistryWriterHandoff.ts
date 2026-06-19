import type { ControlledRegistryWriterDraft } from './controlledUserAppTemplatePackageRegistryWriterDraft';
import type {
  ControlledRegistryWriterValidationRecommendation,
  ControlledRegistryWriterValidationResult,
} from './controlledUserAppTemplatePackageRegistryWriterValidation';

export type ControlledRegistryWriterNextAction =
  | 'ready_for_explicit_write_authorization_gate'
  | 'request_write_plan_revision'
  | 'request_versioning_review'
  | 'request_rollback_plan_review'
  | 'request_privacy_review'
  | 'request_user_app_shell_boundary_review'
  | 'keep_as_dry_run_only'
  | 'blocked_do_not_authorize_write';

export type ControlledRegistryWriterHandoffStatus =
  | 'controlled_writer_handoff_ready'
  | 'controlled_writer_handoff_ready_with_warnings'
  | 'controlled_writer_handoff_blocked'
  | 'controlled_writer_handoff_example_only';

export interface ControlledRegistryWriterHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface ControlledRegistryWriterHandoff {
  id: string;
  writerDraftId: string;
  sourceRegistryWriteGateId: string;
  sourceRegistryPreparationId: string;
  status: ControlledRegistryWriterHandoffStatus;
  nextAction: ControlledRegistryWriterNextAction;
  items: ControlledRegistryWriterHandoffItem[];
  notes: string[];
  dryRunOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionPackage: true;
  readyForExplicitWriteAuthorizationGate: boolean;
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
  draft: ControlledRegistryWriterDraft,
  validation: ControlledRegistryWriterValidationResult,
): ControlledRegistryWriterHandoffStatus => {
  if (draft.writerDraftStatus === 'writer_draft_example_only') {
    return 'controlled_writer_handoff_example_only';
  }
  if (validation.status === 'writer_validation_blocked') {
    return 'controlled_writer_handoff_blocked';
  }
  if (validation.status === 'writer_validation_ready_with_warnings') {
    return 'controlled_writer_handoff_ready_with_warnings';
  }
  return 'controlled_writer_handoff_ready';
};

const nextActionForValidation = (
  recommendation: ControlledRegistryWriterValidationRecommendation | undefined,
): ControlledRegistryWriterNextAction => {
  switch (recommendation?.action) {
    case 'continue_to_explicit_write_authorization_gate':
      return 'ready_for_explicit_write_authorization_gate';
    case 'request_write_plan_revision':
      return 'request_write_plan_revision';
    case 'request_versioning_review':
      return 'request_versioning_review';
    case 'request_rollback_plan_review':
      return 'request_rollback_plan_review';
    case 'request_privacy_review':
      return 'request_privacy_review';
    case 'request_user_app_shell_boundary_review':
      return 'request_user_app_shell_boundary_review';
    case 'keep_as_dry_run_only':
      return 'keep_as_dry_run_only';
    case 'block_explicit_write_authorization':
    default:
      return 'blocked_do_not_authorize_write';
  }
};

export const createControlledUserAppTemplatePackageRegistryWriterHandoff = ({
  draft,
  validation,
  id = `controlled-registry-writer-handoff-${draft.writerDraftId}`,
}: {
  draft: ControlledRegistryWriterDraft;
  validation: ControlledRegistryWriterValidationResult;
  id?: string;
}): ControlledRegistryWriterHandoff => {
  const handoff: ControlledRegistryWriterHandoff = {
    id,
    writerDraftId: draft.writerDraftId,
    sourceRegistryWriteGateId: draft.sourceRegistryWriteGateId,
    sourceRegistryPreparationId: draft.sourceRegistryPreparationId,
    status: statusForDraft(draft, validation),
    nextAction: nextActionForValidation(validation.recommendations[0]),
    items: [
      {
        id: 'writer_draft_status',
        label: 'Controlled registry writer draft',
        value: draft.writerDraftStatus,
        status:
          draft.writerDraftStatus === 'writer_draft_blocked'
            ? 'blocked'
            : draft.writerDraftStatus === 'writer_draft_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'writer_validation_status',
        label: 'Writer safety validation',
        value: validation.status,
        status:
          validation.status === 'writer_validation_blocked'
            ? 'blocked'
            : validation.status === 'writer_validation_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'write_plan',
        label: 'Dry-run write plan',
        value: draft.writePlan.summary,
        status: draft.writePlan.dryRunOnly && draft.writePlan.executionBlocked ? 'ready' : 'blocked',
      },
      {
        id: 'rollback_plan',
        label: 'Rollback plan',
        value: draft.rollbackPlan.summary,
        status: draft.rollbackPlan.requiredBeforeAnyWrite ? 'ready' : 'blocked',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Ready means eligible for a future explicit write authorization gate only.',
      'Handoff does not write a UserAppTemplatePackage registry.',
      'Handoff does not publish to the user app.',
      'Handoff does not replace the current User App Shell package.',
      'Handoff does not mark a production package.',
      'Handoff is for Phase 10L or later explicit write authorization review.',
    ],
    dryRunOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionPackage: true,
    readyForExplicitWriteAuthorizationGate:
      validation.readyForExplicitWriteAuthorizationGate,
    jsonRoundTripStable: true,
  };
  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
