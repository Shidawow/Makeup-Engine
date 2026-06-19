import type { ExplicitRegistryWriteAuthorizationChecklist } from './explicitRegistryWriteAuthorizationChecklist';
import type {
  ExplicitRegistryWriteAuthorizationGateDecision,
  ExplicitRegistryWriteAuthorizationGateResult,
} from './explicitRegistryWriteAuthorizationGate';

export type ExplicitRegistryWriteAuthorizationNextAction =
  | 'ready_for_future_controlled_write_execution_design'
  | 'request_write_plan_revision'
  | 'request_versioning_review'
  | 'request_rollback_plan_review'
  | 'request_privacy_review'
  | 'request_owner_authorization'
  | 'keep_as_dry_run_only'
  | 'blocked_do_not_execute_write';

export type ExplicitRegistryWriteAuthorizationHandoffStatus =
  | 'explicit_authorization_handoff_ready'
  | 'explicit_authorization_handoff_ready_with_warnings'
  | 'explicit_authorization_handoff_blocked'
  | 'explicit_authorization_handoff_example_only';

export interface ExplicitRegistryWriteAuthorizationHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface ExplicitRegistryWriteAuthorizationHandoff {
  id: string;
  sourceAuthorizationGateId: string;
  sourceWriterDraftId: string;
  sourceChecklistId: string;
  status: ExplicitRegistryWriteAuthorizationHandoffStatus;
  nextAction: ExplicitRegistryWriteAuthorizationNextAction;
  items: ExplicitRegistryWriteAuthorizationHandoffItem[];
  notes: string[];
  dryRunOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionPackage: true;
  futureOwnerApprovalRequired: true;
  readyForFutureControlledWriteExecutionDesign: boolean;
  jsonRoundTripStable: boolean;
}

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const statusForGate = (
  gate: ExplicitRegistryWriteAuthorizationGateResult,
): ExplicitRegistryWriteAuthorizationHandoffStatus => {
  if (gate.status === 'explicit_authorization_gate_example_only') {
    return 'explicit_authorization_handoff_example_only';
  }
  if (gate.status === 'explicit_authorization_gate_blocked') {
    return 'explicit_authorization_handoff_blocked';
  }
  if (gate.status === 'explicit_authorization_gate_ready_with_warnings') {
    return 'explicit_authorization_handoff_ready_with_warnings';
  }
  return 'explicit_authorization_handoff_ready';
};

const nextActionForDecision = (
  decision: ExplicitRegistryWriteAuthorizationGateDecision,
): ExplicitRegistryWriteAuthorizationNextAction => {
  switch (decision) {
    case 'eligible_for_future_controlled_write_execution_design':
      return 'ready_for_future_controlled_write_execution_design';
    case 'request_write_plan_revision':
      return 'request_write_plan_revision';
    case 'request_versioning_review':
      return 'request_versioning_review';
    case 'request_rollback_plan_review':
      return 'request_rollback_plan_review';
    case 'request_privacy_review':
      return 'request_privacy_review';
    case 'request_owner_authorization':
      return 'request_owner_authorization';
    case 'keep_as_dry_run_only':
      return 'keep_as_dry_run_only';
    case 'blocked_do_not_execute_write':
    default:
      return 'blocked_do_not_execute_write';
  }
};

export const createExplicitRegistryWriteAuthorizationHandoff = ({
  gate,
  checklist,
  id = `explicit-registry-write-authorization-handoff-${gate.gateId}`,
}: {
  gate: ExplicitRegistryWriteAuthorizationGateResult;
  checklist: ExplicitRegistryWriteAuthorizationChecklist;
  id?: string;
}): ExplicitRegistryWriteAuthorizationHandoff => {
  const handoff: ExplicitRegistryWriteAuthorizationHandoff = {
    id,
    sourceAuthorizationGateId: gate.gateId,
    sourceWriterDraftId: gate.sourceWriterDraftId,
    sourceChecklistId: checklist.checklistId,
    status: statusForGate(gate),
    nextAction: nextActionForDecision(gate.decision),
    items: [
      {
        id: 'authorization_gate_status',
        label: 'Explicit authorization gate',
        value: gate.status,
        status:
          gate.status === 'explicit_authorization_gate_blocked'
            ? 'blocked'
            : gate.status === 'explicit_authorization_gate_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'authorization_checklist',
        label: 'Authorization checklist',
        value: checklist.status,
        status:
          checklist.status === 'authorization_checklist_blocked'
            ? 'blocked'
            : checklist.status === 'authorization_checklist_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'future_owner_approval',
        label: 'Future owner approval',
        value: gate.futureOwnerApprovalRequired
          ? 'required before any future real write'
          : 'missing',
        status: gate.futureOwnerApprovalRequired ? 'ready' : 'blocked',
      },
      {
        id: 'no_write_publish_replace',
        label: 'No write / publish / replacement',
        value: 'registry write blocked; publish blocked; shell replacement blocked',
        status:
          gate.noActualRegistryWrite &&
          gate.notPublished &&
          gate.noUserAppShellPackageReplacement
            ? 'ready'
            : 'blocked',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Handoff does not write a UserAppTemplatePackage registry.',
      'Handoff does not publish to the user app.',
      'Handoff does not replace the current User App Shell package.',
      'Ready only means Phase 10M may design a future controlled write execution path.',
      'Future real write still requires a separate owner authorization.',
    ],
    dryRunOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionPackage: true,
    futureOwnerApprovalRequired: true,
    readyForFutureControlledWriteExecutionDesign:
      gate.eligibleForFutureControlledWriteExecutionDesign,
    jsonRoundTripStable: true,
  };
  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
