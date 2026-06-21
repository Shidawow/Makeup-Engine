import type { RealWriteApprovalChecklist } from './realWriteApprovalChecklist';
import type {
  RealWriteApprovalBoundaryDecision,
  RealWriteApprovalBoundaryResult,
} from './realWriteApprovalBoundary';

export type RealWriteApprovalNextAction =
  | 'ready_for_future_actual_write_authorization_request'
  | 'request_approval_scope_clarification'
  | 'request_audit_requirement_revision'
  | 'request_rollback_approval_revision'
  | 'request_owner_authorization_for_actual_write'
  | 'keep_as_approval_boundary_only'
  | 'blocked_do_not_execute_real_write';

export type RealWriteApprovalHandoffStatus =
  | 'real_write_approval_handoff_ready'
  | 'real_write_approval_handoff_ready_with_warnings'
  | 'real_write_approval_handoff_blocked'
  | 'real_write_approval_handoff_example_only';

export interface RealWriteApprovalHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface RealWriteApprovalHandoff {
  id: string;
  sourceBoundaryId: string;
  sourceGateId: string;
  sourceSimulatorId: string;
  sourceExecutionPlanId: string;
  sourceExecutionAuthorizationId: string;
  status: RealWriteApprovalHandoffStatus;
  nextAction: RealWriteApprovalNextAction;
  items: RealWriteApprovalHandoffItem[];
  notes: string[];
  approvalBoundaryOnly: true;
  dryRunOnly: true;
  noActualRegistryWrite: true;
  noRegistryMutation: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  doesNotCreateProductionWriter: true;
  futureActualWriteRequiresSeparateApproval: true;
  readyForFutureActualWriteAuthorizationRequest: boolean;
  jsonRoundTripStable: boolean;
}

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const handoffStatusForBoundary = (
  boundary: RealWriteApprovalBoundaryResult,
  checklist: RealWriteApprovalChecklist,
): RealWriteApprovalHandoffStatus => {
  if (boundary.status === 'real_write_approval_boundary_example_only') {
    return 'real_write_approval_handoff_example_only';
  }
  if (
    boundary.status === 'real_write_approval_boundary_blocked' ||
    checklist.status === 'real_write_approval_checklist_blocked'
  ) {
    return 'real_write_approval_handoff_blocked';
  }
  if (
    boundary.status === 'real_write_approval_boundary_ready_with_warnings' ||
    checklist.status === 'real_write_approval_checklist_ready_with_warnings'
  ) {
    return 'real_write_approval_handoff_ready_with_warnings';
  }
  return 'real_write_approval_handoff_ready';
};

const nextActionForBoundary = (
  decision: RealWriteApprovalBoundaryDecision,
): RealWriteApprovalNextAction => {
  switch (decision) {
    case 'ready_for_future_actual_write_authorization_request':
      return 'ready_for_future_actual_write_authorization_request';
    case 'request_approval_scope_clarification':
      return 'request_approval_scope_clarification';
    case 'request_audit_requirement_revision':
      return 'request_audit_requirement_revision';
    case 'request_rollback_approval_revision':
      return 'request_rollback_approval_revision';
    case 'request_owner_authorization_for_actual_write':
      return 'request_owner_authorization_for_actual_write';
    case 'keep_as_approval_boundary_only':
      return 'keep_as_approval_boundary_only';
    case 'blocked_do_not_execute_real_write':
    default:
      return 'blocked_do_not_execute_real_write';
  }
};

export const createRealWriteApprovalHandoff = ({
  boundary,
  checklist,
  id = `real-write-approval-handoff-${boundary.boundaryId}`,
}: {
  boundary: RealWriteApprovalBoundaryResult;
  checklist: RealWriteApprovalChecklist;
  id?: string;
}): RealWriteApprovalHandoff => {
  const status = handoffStatusForBoundary(boundary, checklist);
  const nextAction =
    status === 'real_write_approval_handoff_blocked'
      ? boundary.decision
      : nextActionForBoundary(boundary.decision);
  const handoff: RealWriteApprovalHandoff = {
    id,
    sourceBoundaryId: boundary.boundaryId,
    sourceGateId: boundary.sourceGateId,
    sourceSimulatorId: boundary.sourceSimulatorId,
    sourceExecutionPlanId: boundary.sourceExecutionPlanId,
    sourceExecutionAuthorizationId: boundary.sourceExecutionAuthorizationId,
    status,
    nextAction,
    items: [
      {
        id: 'boundary_status',
        label: 'Real write approval boundary',
        value: boundary.status,
        status:
          boundary.status === 'real_write_approval_boundary_blocked'
            ? 'blocked'
            : boundary.status === 'real_write_approval_boundary_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'checklist_status',
        label: 'Approval checklist',
        value: checklist.status,
        status:
          checklist.status === 'real_write_approval_checklist_blocked'
            ? 'blocked'
            : checklist.status === 'real_write_approval_checklist_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'approval_scope',
        label: 'Approval scope',
        value: boundary.approvalScope,
        status: boundary.approvalScope === 'boundary_only' ? 'ready' : 'blocked',
      },
      {
        id: 'no_write_no_mutation',
        label: 'No write / no mutation',
        value:
          boundary.noActualRegistryWrite && boundary.noRegistryMutation
            ? 'actual registry write and registry mutation remain blocked'
            : 'missing no-write boundary',
        status:
          boundary.noActualRegistryWrite && boundary.noRegistryMutation
            ? 'ready'
            : 'blocked',
      },
      {
        id: 'no_publish_no_replacement_no_writer',
        label: 'No publish / no shell replacement / no writer',
        value:
          boundary.notPublished &&
          boundary.noUserAppShellPackageReplacement &&
          boundary.doesNotCreateProductionWriter
            ? 'publish, shell package replacement, and production writer creation remain blocked'
            : 'missing publish, shell, or writer boundary',
        status:
          boundary.notPublished &&
          boundary.noUserAppShellPackageReplacement &&
          boundary.doesNotCreateProductionWriter
            ? 'ready'
            : 'blocked',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Handoff does not write a UserAppTemplatePackage registry.',
      'Handoff does not mutate registry state.',
      'Handoff does not publish to the user app.',
      'Handoff does not replace the current User App Shell package.',
      'Handoff does not create a production writer.',
      'Handoff remains approval-boundary-only.',
      'Handoff is for Phase 10V or later actual write authorization request only.',
      'Future actual registry write still requires separate explicit owner authorization.',
    ],
    approvalBoundaryOnly: true,
    dryRunOnly: true,
    noActualRegistryWrite: true,
    noRegistryMutation: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    doesNotCreateProductionWriter: true,
    futureActualWriteRequiresSeparateApproval: true,
    readyForFutureActualWriteAuthorizationRequest:
      status === 'real_write_approval_handoff_ready' &&
      boundary.readyForFutureActualWriteAuthorizationRequest &&
      checklist.status === 'real_write_approval_checklist_ready',
    jsonRoundTripStable: true,
  };
  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
