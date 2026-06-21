import type { GuardedSimulatorReviewChecklist } from './guardedSimulatorReviewChecklist';
import type {
  GuardedSimulatorReviewGateDecision,
  GuardedSimulatorReviewGateResult,
} from './guardedSimulatorReviewGate';

export type GuardedSimulatorReviewNextAction =
  | 'ready_for_future_real_write_approval_boundary'
  | 'request_simulator_preflight_revision'
  | 'request_simulator_lock_revision'
  | 'request_simulator_audit_revision'
  | 'request_simulator_rollback_revision'
  | 'request_simulator_failure_handling_revision'
  | 'request_owner_authorization_for_actual_write'
  | 'keep_as_simulator_review_only'
  | 'blocked_do_not_execute_real_write';

export type GuardedSimulatorReviewHandoffStatus =
  | 'simulator_review_handoff_ready'
  | 'simulator_review_handoff_ready_with_warnings'
  | 'simulator_review_handoff_blocked'
  | 'simulator_review_handoff_example_only';

export interface GuardedSimulatorReviewHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface GuardedSimulatorReviewHandoff {
  id: string;
  sourceGateId: string;
  sourceSimulatorId: string;
  sourceExecutionPlanId: string;
  sourceExecutionAuthorizationId: string;
  status: GuardedSimulatorReviewHandoffStatus;
  nextAction: GuardedSimulatorReviewNextAction;
  items: GuardedSimulatorReviewHandoffItem[];
  notes: string[];
  reviewGateOnly: true;
  dryRunOnly: true;
  noActualRegistryWrite: true;
  noRegistryMutation: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  doesNotCreateProductionWriter: true;
  futureActualWriteRequiresSeparateApproval: true;
  readyForFutureRealWriteApprovalBoundary: boolean;
  jsonRoundTripStable: boolean;
}

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const handoffStatusForGate = (
  gate: GuardedSimulatorReviewGateResult,
  checklist: GuardedSimulatorReviewChecklist,
): GuardedSimulatorReviewHandoffStatus => {
  if (gate.status === 'simulator_review_gate_example_only') {
    return 'simulator_review_handoff_example_only';
  }
  if (
    gate.status === 'simulator_review_gate_blocked' ||
    checklist.status === 'simulator_review_checklist_blocked'
  ) {
    return 'simulator_review_handoff_blocked';
  }
  if (
    gate.status === 'simulator_review_gate_ready_with_warnings' ||
    checklist.status === 'simulator_review_checklist_ready_with_warnings'
  ) {
    return 'simulator_review_handoff_ready_with_warnings';
  }
  return 'simulator_review_handoff_ready';
};

const nextActionForGate = (
  decision: GuardedSimulatorReviewGateDecision,
): GuardedSimulatorReviewNextAction => {
  switch (decision) {
    case 'eligible_for_future_real_write_approval_boundary':
      return 'ready_for_future_real_write_approval_boundary';
    case 'request_simulator_preflight_revision':
      return 'request_simulator_preflight_revision';
    case 'request_simulator_lock_revision':
      return 'request_simulator_lock_revision';
    case 'request_simulator_audit_revision':
      return 'request_simulator_audit_revision';
    case 'request_simulator_rollback_revision':
      return 'request_simulator_rollback_revision';
    case 'request_simulator_failure_handling_revision':
      return 'request_simulator_failure_handling_revision';
    case 'request_owner_authorization_for_actual_write':
      return 'request_owner_authorization_for_actual_write';
    case 'keep_as_simulator_review_only':
      return 'keep_as_simulator_review_only';
    case 'blocked_do_not_execute_real_write':
    default:
      return 'blocked_do_not_execute_real_write';
  }
};

export const createGuardedSimulatorReviewHandoff = ({
  gate,
  checklist,
  id = `guarded-simulator-review-handoff-${gate.gateId}`,
}: {
  gate: GuardedSimulatorReviewGateResult;
  checklist: GuardedSimulatorReviewChecklist;
  id?: string;
}): GuardedSimulatorReviewHandoff => {
  const status = handoffStatusForGate(gate, checklist);
  const nextAction =
    status === 'simulator_review_handoff_blocked'
      ? 'blocked_do_not_execute_real_write'
      : nextActionForGate(gate.decision);
  const handoff: GuardedSimulatorReviewHandoff = {
    id,
    sourceGateId: gate.gateId,
    sourceSimulatorId: gate.sourceSimulatorId,
    sourceExecutionPlanId: gate.sourceExecutionPlanId,
    sourceExecutionAuthorizationId: gate.sourceExecutionAuthorizationId,
    status,
    nextAction,
    items: [
      {
        id: 'gate_status',
        label: 'Guarded simulator review gate',
        value: gate.status,
        status:
          gate.status === 'simulator_review_gate_blocked'
            ? 'blocked'
            : gate.status === 'simulator_review_gate_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'checklist_status',
        label: 'Simulator review checklist',
        value: checklist.status,
        status:
          checklist.status === 'simulator_review_checklist_blocked'
            ? 'blocked'
            : checklist.status === 'simulator_review_checklist_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'no_write_no_mutation',
        label: 'No write / no mutation',
        value:
          gate.noActualRegistryWrite && gate.noRegistryMutation
            ? 'actual registry write and registry mutation remain blocked'
            : 'missing no-write boundary',
        status:
          gate.noActualRegistryWrite && gate.noRegistryMutation
            ? 'ready'
            : 'blocked',
      },
      {
        id: 'no_publish_no_replacement',
        label: 'No publish / no package replacement',
        value:
          gate.notPublished && gate.noUserAppShellPackageReplacement
            ? 'publish and shell package replacement remain blocked'
            : 'missing publish or shell boundary',
        status:
          gate.notPublished && gate.noUserAppShellPackageReplacement
            ? 'ready'
            : 'blocked',
      },
      {
        id: 'future_approval_boundary',
        label: 'Future real write approval boundary',
        value: gate.readyForFutureRealWriteApprovalBoundary
          ? 'eligible for a future approval boundary only'
          : 'not eligible for future approval boundary',
        status: gate.readyForFutureRealWriteApprovalBoundary ? 'ready' : 'blocked',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Handoff does not write a UserAppTemplatePackage registry.',
      'Handoff does not mutate registry state.',
      'Handoff does not publish to the user app.',
      'Handoff does not replace the current User App Shell package.',
      'Handoff does not create a production writer.',
      'Handoff remains dry-run-only simulator review.',
      'Handoff is for Phase 10U or later real write approval boundary only.',
      'Future actual registry write still requires separate explicit owner authorization.',
    ],
    reviewGateOnly: true,
    dryRunOnly: true,
    noActualRegistryWrite: true,
    noRegistryMutation: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    doesNotCreateProductionWriter: true,
    futureActualWriteRequiresSeparateApproval: true,
    readyForFutureRealWriteApprovalBoundary:
      status === 'simulator_review_handoff_ready' &&
      gate.readyForFutureRealWriteApprovalBoundary &&
      checklist.status === 'simulator_review_checklist_ready',
    jsonRoundTripStable: true,
  };
  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
