import type { FinalRealWriteReviewChecklist } from './finalRealWriteReviewChecklist';
import type {
  FinalRealWriteReviewGateDecision,
  FinalRealWriteReviewGateResult,
} from './finalRealWriteReviewGate';

export type FinalRealWriteReviewNextAction =
  | 'ready_for_future_real_write_execution_authorization'
  | 'request_writer_interface_revision'
  | 'request_transaction_draft_revision'
  | 'request_write_lock_revision'
  | 'request_audit_event_revision'
  | 'request_rollback_command_revision'
  | 'request_owner_authorization_clarification'
  | 'keep_as_final_review_only'
  | 'blocked_do_not_execute_real_write';

export type FinalRealWriteReviewHandoffStatus =
  | 'final_real_write_review_handoff_ready'
  | 'final_real_write_review_handoff_ready_with_warnings'
  | 'final_real_write_review_handoff_blocked'
  | 'final_real_write_review_handoff_example_only';

export interface FinalRealWriteReviewHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface FinalRealWriteReviewHandoff {
  id: string;
  sourceFinalReviewGateId: string;
  sourceImplementationDraftId: string;
  sourceImplementationGateId: string;
  sourceExecutionDesignId: string;
  sourceWriterDraftId: string;
  checklistId: string;
  status: FinalRealWriteReviewHandoffStatus;
  nextAction: FinalRealWriteReviewNextAction;
  items: FinalRealWriteReviewHandoffItem[];
  notes: string[];
  ownerAuthorizationText: string;
  finalReviewGateOnly: true;
  notActualWriteAuthorization: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  readyForFutureRealWriteExecutionAuthorization: boolean;
  jsonRoundTripStable: boolean;
}

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const nextActionForDecision = (
  decision: FinalRealWriteReviewGateDecision,
): FinalRealWriteReviewNextAction => {
  switch (decision) {
    case 'eligible_for_future_real_write_execution_authorization':
      return 'ready_for_future_real_write_execution_authorization';
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
    case 'request_owner_authorization_clarification':
      return 'request_owner_authorization_clarification';
    case 'keep_as_final_review_only':
      return 'keep_as_final_review_only';
    case 'blocked_do_not_execute_real_write':
    default:
      return 'blocked_do_not_execute_real_write';
  }
};

const statusForGate = (
  gate: FinalRealWriteReviewGateResult,
  checklist: FinalRealWriteReviewChecklist,
): FinalRealWriteReviewHandoffStatus => {
  if (gate.status === 'final_real_write_review_gate_example_only') {
    return 'final_real_write_review_handoff_example_only';
  }
  if (
    gate.status === 'final_real_write_review_gate_blocked' ||
    checklist.status === 'final_review_checklist_blocked'
  ) {
    return 'final_real_write_review_handoff_blocked';
  }
  if (
    gate.status === 'final_real_write_review_gate_ready_with_warnings' ||
    checklist.status === 'final_review_checklist_ready_with_warnings'
  ) {
    return 'final_real_write_review_handoff_ready_with_warnings';
  }
  return 'final_real_write_review_handoff_ready';
};

export const createFinalRealWriteReviewHandoff = ({
  gate,
  checklist,
  id = `final-real-write-review-handoff-${gate.gateId}`,
}: {
  gate: FinalRealWriteReviewGateResult;
  checklist: FinalRealWriteReviewChecklist;
  id?: string;
}): FinalRealWriteReviewHandoff => {
  const handoff: FinalRealWriteReviewHandoff = {
    id,
    sourceFinalReviewGateId: gate.gateId,
    sourceImplementationDraftId: gate.sourceImplementationDraftId,
    sourceImplementationGateId: gate.sourceImplementationGateId,
    sourceExecutionDesignId: gate.sourceExecutionDesignId,
    sourceWriterDraftId: gate.sourceWriterDraftId,
    checklistId: checklist.checklistId,
    status: statusForGate(gate, checklist),
    nextAction: nextActionForDecision(gate.decision),
    items: [
      {
        id: 'final_review_gate_status',
        label: 'Final real write review gate',
        value: gate.status,
        status:
          gate.status === 'final_real_write_review_gate_blocked'
            ? 'blocked'
            : gate.status === 'final_real_write_review_gate_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'owner_authorization_scope',
        label: 'Owner authorization scope',
        value: gate.ownerAuthorizationScope,
        status:
          gate.ownerAuthorizationScope === 'review_gate_only'
            ? 'ready'
            : 'blocked',
      },
      {
        id: 'checklist_status',
        label: 'Final review checklist',
        value: checklist.status,
        status:
          checklist.status === 'final_review_checklist_blocked'
            ? 'blocked'
            : checklist.status === 'final_review_checklist_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'no_actual_write',
        label: 'No actual registry write',
        value: gate.actualWriteBlocked ? 'actual write blocked' : 'not blocked',
        status: gate.actualWriteBlocked ? 'ready' : 'blocked',
      },
      {
        id: 'no_publish_no_replacement',
        label: 'No publish / no shell replacement',
        value:
          gate.publishBlocked && gate.packageReplacementBlocked
            ? 'publish blocked; shell replacement blocked'
            : 'missing boundary flag',
        status:
          gate.publishBlocked && gate.packageReplacementBlocked
            ? 'ready'
            : 'blocked',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Handoff does not write a UserAppTemplatePackage registry.',
      'Handoff does not publish to the user app.',
      'Handoff does not replace the current User App Shell package.',
      'Handoff does not create a production writer.',
      'Handoff is for Phase 10Q or later real write execution authorization only.',
      'Future real write execution still requires separate explicit owner authorization.',
    ],
    ownerAuthorizationText: gate.ownerAuthorizationText,
    finalReviewGateOnly: true,
    notActualWriteAuthorization: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    readyForFutureRealWriteExecutionAuthorization:
      gate.eligibleForFutureRealWriteExecutionAuthorization &&
      checklist.status === 'final_review_checklist_ready',
    jsonRoundTripStable: true,
  };
  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
