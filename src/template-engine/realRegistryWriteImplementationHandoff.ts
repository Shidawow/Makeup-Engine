import type {
  RealRegistryWriteImplementationChecklist,
} from './realRegistryWriteImplementationChecklist';
import type {
  RealRegistryWriteImplementationGateDecision,
  RealRegistryWriteImplementationGateResult,
} from './realRegistryWriteImplementationGate';

export type RealRegistryWriteImplementationNextAction =
  | 'ready_for_future_real_write_implementation_draft'
  | 'request_execution_plan_revision'
  | 'request_audit_plan_revision'
  | 'request_rollback_design_revision'
  | 'request_write_lock_review'
  | 'request_owner_authorization_review'
  | 'keep_as_execution_design_only'
  | 'blocked_do_not_implement_real_write';

export type RealRegistryWriteImplementationHandoffStatus =
  | 'real_write_implementation_handoff_ready'
  | 'real_write_implementation_handoff_ready_with_warnings'
  | 'real_write_implementation_handoff_blocked'
  | 'real_write_implementation_handoff_example_only';

export interface RealRegistryWriteImplementationHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface RealRegistryWriteImplementationHandoff {
  id: string;
  sourceGateId: string;
  sourceExecutionDesignId: string;
  sourceAuthorizationGateId: string;
  status: RealRegistryWriteImplementationHandoffStatus;
  nextAction: RealRegistryWriteImplementationNextAction;
  items: RealRegistryWriteImplementationHandoffItem[];
  notes: string[];
  gateOnly: true;
  dryRunOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  futureExplicitApprovalRequired: true;
  readyForFutureRealWriteImplementationDraft: boolean;
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
  gate: RealRegistryWriteImplementationGateResult,
  checklist: RealRegistryWriteImplementationChecklist,
): RealRegistryWriteImplementationHandoffStatus => {
  if (gate.status === 'real_write_implementation_gate_example_only') {
    return 'real_write_implementation_handoff_example_only';
  }
  if (
    gate.status === 'real_write_implementation_gate_blocked' ||
    checklist.status === 'implementation_checklist_blocked'
  ) {
    return 'real_write_implementation_handoff_blocked';
  }
  if (
    gate.status === 'real_write_implementation_gate_ready_with_warnings' ||
    checklist.status === 'implementation_checklist_ready_with_warnings'
  ) {
    return 'real_write_implementation_handoff_ready_with_warnings';
  }
  return 'real_write_implementation_handoff_ready';
};

const nextActionForDecision = (
  decision: RealRegistryWriteImplementationGateDecision,
  checklist: RealRegistryWriteImplementationChecklist,
): RealRegistryWriteImplementationNextAction => {
  if (checklist.status === 'implementation_checklist_blocked') {
    return 'blocked_do_not_implement_real_write';
  }
  switch (decision) {
    case 'eligible_for_future_real_write_implementation_draft':
      return 'ready_for_future_real_write_implementation_draft';
    case 'request_execution_plan_revision':
      return 'request_execution_plan_revision';
    case 'request_audit_plan_revision':
      return 'request_audit_plan_revision';
    case 'request_rollback_design_revision':
      return 'request_rollback_design_revision';
    case 'request_write_lock_review':
      return 'request_write_lock_review';
    case 'request_owner_authorization_review':
      return 'request_owner_authorization_review';
    case 'keep_as_execution_design_only':
      return 'keep_as_execution_design_only';
    case 'blocked_do_not_implement_real_write':
    default:
      return 'blocked_do_not_implement_real_write';
  }
};

export const createRealRegistryWriteImplementationHandoff = ({
  gate,
  checklist,
  id = `real-registry-write-implementation-handoff-${gate.gateId}`,
}: {
  gate: RealRegistryWriteImplementationGateResult;
  checklist: RealRegistryWriteImplementationChecklist;
  id?: string;
}): RealRegistryWriteImplementationHandoff => {
  const handoff: RealRegistryWriteImplementationHandoff = {
    id,
    sourceGateId: gate.gateId,
    sourceExecutionDesignId: gate.sourceExecutionDesignId,
    sourceAuthorizationGateId: gate.sourceAuthorizationGateId,
    status: statusForGate(gate, checklist),
    nextAction: nextActionForDecision(gate.decision, checklist),
    items: [
      {
        id: 'implementation_gate_status',
        label: 'Real write implementation gate',
        value: gate.status,
        status:
          gate.status === 'real_write_implementation_gate_blocked'
            ? 'blocked'
            : gate.status === 'real_write_implementation_gate_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'checklist_status',
        label: 'Implementation checklist',
        value: checklist.status,
        status:
          checklist.status === 'implementation_checklist_blocked'
            ? 'blocked'
            : checklist.status === 'implementation_checklist_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'production_write_disabled',
        label: 'Production write disabled',
        value: gate.productionWriteStillDisabled ? 'disabled' : 'not disabled',
        status: gate.productionWriteStillDisabled ? 'ready' : 'blocked',
      },
      {
        id: 'future_approval',
        label: 'Future approval required',
        value: gate.futureExplicitApprovalRequired ? 'required' : 'missing',
        status: gate.futureExplicitApprovalRequired ? 'ready' : 'blocked',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Handoff does not write a UserAppTemplatePackage registry.',
      'Handoff does not publish to the user app.',
      'Handoff does not replace the current User App Shell package.',
      'Handoff is for Phase 10O or a later real write implementation draft only.',
      'Future real implementation still requires separate owner authorization.',
    ],
    gateOnly: true,
    dryRunOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    futureExplicitApprovalRequired: true,
    readyForFutureRealWriteImplementationDraft:
      gate.readyForFutureRealWriteImplementationDraft &&
      checklist.status !== 'implementation_checklist_blocked',
    jsonRoundTripStable: true,
  };
  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
