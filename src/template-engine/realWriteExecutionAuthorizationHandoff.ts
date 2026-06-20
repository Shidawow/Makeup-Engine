import type { RealWriteExecutionAuthorizationChecklist } from './realWriteExecutionAuthorizationChecklist';
import type {
  RealWriteExecutionAuthorizationDecision,
  RealWriteExecutionAuthorizationResult,
} from './realWriteExecutionAuthorization';

export type RealWriteExecutionAuthorizationNextAction =
  | 'ready_for_future_real_write_execution_plan'
  | 'request_authorization_scope_clarification'
  | 'request_final_review_revision'
  | 'request_owner_authorization_for_actual_write'
  | 'keep_as_authorization_model_only'
  | 'blocked_do_not_execute_real_write';

export type RealWriteExecutionAuthorizationHandoffStatus =
  | 'execution_authorization_handoff_ready'
  | 'execution_authorization_handoff_ready_with_warnings'
  | 'execution_authorization_handoff_blocked'
  | 'execution_authorization_handoff_example_only';

export interface RealWriteExecutionAuthorizationHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface RealWriteExecutionAuthorizationHandoff {
  id: string;
  sourceAuthorizationId: string;
  sourceFinalReviewGateId: string;
  sourceImplementationDraftId: string;
  sourceImplementationGateId: string;
  sourceExecutionDesignId: string;
  sourceWriterDraftId: string;
  checklistId: string;
  status: RealWriteExecutionAuthorizationHandoffStatus;
  nextAction: RealWriteExecutionAuthorizationNextAction;
  items: RealWriteExecutionAuthorizationHandoffItem[];
  notes: string[];
  ownerAuthorizationText: string;
  authorizationModelOnly: true;
  notActualWriteAuthorization: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  doesNotCreateProductionWriter: true;
  readyForFutureRealWriteExecutionPlan: boolean;
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
  decision: RealWriteExecutionAuthorizationDecision,
): RealWriteExecutionAuthorizationNextAction => {
  switch (decision) {
    case 'eligible_for_future_real_write_execution_plan':
      return 'ready_for_future_real_write_execution_plan';
    case 'request_authorization_scope_clarification':
      return 'request_authorization_scope_clarification';
    case 'request_final_review_revision':
      return 'request_final_review_revision';
    case 'request_owner_authorization_for_actual_write':
      return 'request_owner_authorization_for_actual_write';
    case 'keep_as_authorization_model_only':
      return 'keep_as_authorization_model_only';
    case 'blocked_do_not_execute_real_write':
    default:
      return 'blocked_do_not_execute_real_write';
  }
};

const statusForAuthorization = (
  authorization: RealWriteExecutionAuthorizationResult,
  checklist: RealWriteExecutionAuthorizationChecklist,
): RealWriteExecutionAuthorizationHandoffStatus => {
  if (authorization.status === 'real_write_execution_authorization_example_only') {
    return 'execution_authorization_handoff_example_only';
  }
  if (
    authorization.status === 'real_write_execution_authorization_blocked' ||
    checklist.status === 'execution_authorization_checklist_blocked'
  ) {
    return 'execution_authorization_handoff_blocked';
  }
  if (
    authorization.status === 'real_write_execution_authorization_ready_with_warnings' ||
    checklist.status === 'execution_authorization_checklist_ready_with_warnings'
  ) {
    return 'execution_authorization_handoff_ready_with_warnings';
  }
  return 'execution_authorization_handoff_ready';
};

export const createRealWriteExecutionAuthorizationHandoff = ({
  authorization,
  checklist,
  id = `real-write-execution-authorization-handoff-${authorization.authorizationId}`,
}: {
  authorization: RealWriteExecutionAuthorizationResult;
  checklist: RealWriteExecutionAuthorizationChecklist;
  id?: string;
}): RealWriteExecutionAuthorizationHandoff => {
  const handoff: RealWriteExecutionAuthorizationHandoff = {
    id,
    sourceAuthorizationId: authorization.authorizationId,
    sourceFinalReviewGateId: authorization.sourceFinalReviewGateId,
    sourceImplementationDraftId: authorization.sourceImplementationDraftId,
    sourceImplementationGateId: authorization.sourceImplementationGateId,
    sourceExecutionDesignId: authorization.sourceExecutionDesignId,
    sourceWriterDraftId: authorization.sourceWriterDraftId,
    checklistId: checklist.checklistId,
    status: statusForAuthorization(authorization, checklist),
    nextAction: nextActionForDecision(authorization.decision),
    items: [
      {
        id: 'execution_authorization_status',
        label: 'Real write execution authorization',
        value: authorization.status,
        status:
          authorization.status === 'real_write_execution_authorization_blocked'
            ? 'blocked'
            : authorization.status ===
                'real_write_execution_authorization_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'owner_authorization_scope',
        label: 'Owner authorization scope',
        value: authorization.ownerAuthorizationScope,
        status:
          authorization.ownerAuthorizationScope ===
          'execution_authorization_phase_only'
            ? 'ready'
            : 'blocked',
      },
      {
        id: 'checklist_status',
        label: 'Execution authorization checklist',
        value: checklist.status,
        status:
          checklist.status === 'execution_authorization_checklist_blocked'
            ? 'blocked'
            : checklist.status ===
                'execution_authorization_checklist_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'no_actual_write',
        label: 'No actual registry write',
        value: authorization.actualWriteBlocked
          ? 'actual write blocked'
          : 'not blocked',
        status: authorization.actualWriteBlocked ? 'ready' : 'blocked',
      },
      {
        id: 'no_production_writer',
        label: 'No production writer',
        value: authorization.productionWriterBlocked
          ? 'production writer blocked'
          : 'not blocked',
        status: authorization.productionWriterBlocked ? 'ready' : 'blocked',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Handoff does not write a UserAppTemplatePackage registry.',
      'Handoff does not publish to the user app.',
      'Handoff does not replace the current User App Shell package.',
      'Handoff does not create a production writer.',
      'Handoff is for Phase 10R or later real write execution plan only.',
      'Future actual registry write still requires separate explicit owner authorization.',
    ],
    ownerAuthorizationText: authorization.ownerAuthorizationText,
    authorizationModelOnly: true,
    notActualWriteAuthorization: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    doesNotCreateProductionWriter: true,
    readyForFutureRealWriteExecutionPlan:
      authorization.readyForFutureRealWriteExecutionPlan &&
      checklist.status === 'execution_authorization_checklist_ready',
    jsonRoundTripStable: true,
  };
  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
