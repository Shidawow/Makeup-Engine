import type { RealWriteExecutionPlan } from './realWriteExecutionPlan';
import type {
  RealWriteExecutionPlanValidationRecommendation,
  RealWriteExecutionPlanValidationResult,
} from './realWriteExecutionPlanValidation';

export type RealWriteExecutionPlanNextAction =
  | 'ready_for_future_guarded_execution_simulator'
  | 'request_execution_sequence_revision'
  | 'request_preflight_revision'
  | 'request_write_lock_revision'
  | 'request_audit_plan_revision'
  | 'request_rollback_plan_revision'
  | 'request_failure_handling_revision'
  | 'request_owner_authorization_for_actual_write'
  | 'keep_as_execution_plan_only'
  | 'blocked_do_not_execute_real_write';

export type RealWriteExecutionPlanHandoffStatus =
  | 'execution_plan_handoff_ready'
  | 'execution_plan_handoff_ready_with_warnings'
  | 'execution_plan_handoff_blocked'
  | 'execution_plan_handoff_example_only';

export interface RealWriteExecutionPlanHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface RealWriteExecutionPlanHandoff {
  id: string;
  sourceExecutionPlanId: string;
  sourceExecutionAuthorizationId: string;
  sourceFinalReviewGateId: string;
  sourceImplementationDraftId: string;
  sourceImplementationGateId: string;
  sourceExecutionDesignId: string;
  sourceWriterDraftId: string;
  status: RealWriteExecutionPlanHandoffStatus;
  nextAction: RealWriteExecutionPlanNextAction;
  items: RealWriteExecutionPlanHandoffItem[];
  notes: string[];
  executionPlanOnly: true;
  dryRunOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  doesNotCreateProductionWriter: true;
  readyForFutureGuardedExecutionSimulator: boolean;
  jsonRoundTripStable: boolean;
}

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const statusForPlan = (
  plan: RealWriteExecutionPlan,
  validation: RealWriteExecutionPlanValidationResult,
): RealWriteExecutionPlanHandoffStatus => {
  if (plan.executionPlanStatus === 'execution_plan_example_only') {
    return 'execution_plan_handoff_example_only';
  }
  if (
    plan.executionPlanStatus === 'execution_plan_blocked' ||
    validation.status === 'execution_plan_validation_blocked'
  ) {
    return 'execution_plan_handoff_blocked';
  }
  if (
    plan.executionPlanStatus === 'execution_plan_ready_with_warnings' ||
    validation.status === 'execution_plan_validation_ready_with_warnings'
  ) {
    return 'execution_plan_handoff_ready_with_warnings';
  }
  return 'execution_plan_handoff_ready';
};

const nextActionForValidation = (
  recommendation: RealWriteExecutionPlanValidationRecommendation | undefined,
): RealWriteExecutionPlanNextAction => {
  switch (recommendation?.action) {
    case 'continue_to_guarded_execution_simulator':
      return 'ready_for_future_guarded_execution_simulator';
    case 'request_execution_sequence_revision':
      return 'request_execution_sequence_revision';
    case 'request_preflight_revision':
      return 'request_preflight_revision';
    case 'request_write_lock_revision':
      return 'request_write_lock_revision';
    case 'request_audit_plan_revision':
      return 'request_audit_plan_revision';
    case 'request_rollback_plan_revision':
      return 'request_rollback_plan_revision';
    case 'request_failure_handling_revision':
      return 'request_failure_handling_revision';
    case 'request_owner_authorization_for_actual_write':
      return 'request_owner_authorization_for_actual_write';
    case 'keep_as_execution_plan_only':
      return 'keep_as_execution_plan_only';
    case 'block_real_write_execution':
    default:
      return 'blocked_do_not_execute_real_write';
  }
};

export const createRealWriteExecutionPlanHandoff = ({
  plan,
  validation,
  id = `real-write-execution-plan-handoff-${plan.executionPlanId}`,
}: {
  plan: RealWriteExecutionPlan;
  validation: RealWriteExecutionPlanValidationResult;
  id?: string;
}): RealWriteExecutionPlanHandoff => {
  const handoff: RealWriteExecutionPlanHandoff = {
    id,
    sourceExecutionPlanId: plan.executionPlanId,
    sourceExecutionAuthorizationId: plan.sourceExecutionAuthorizationId,
    sourceFinalReviewGateId: plan.sourceFinalReviewGateId,
    sourceImplementationDraftId: plan.sourceImplementationDraftId,
    sourceImplementationGateId: plan.sourceImplementationGateId,
    sourceExecutionDesignId: plan.sourceExecutionDesignId,
    sourceWriterDraftId: plan.sourceWriterDraftId,
    status: statusForPlan(plan, validation),
    nextAction: nextActionForValidation(validation.recommendations[0]),
    items: [
      {
        id: 'execution_plan_status',
        label: 'Real write execution plan',
        value: plan.executionPlanStatus,
        status:
          plan.executionPlanStatus === 'execution_plan_blocked'
            ? 'blocked'
            : plan.executionPlanStatus === 'execution_plan_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'execution_plan_validation_status',
        label: 'Execution plan validation',
        value: validation.status,
        status:
          validation.status === 'execution_plan_validation_blocked'
            ? 'blocked'
            : validation.status ===
                'execution_plan_validation_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'execution_sequence',
        label: 'Execution sequence',
        value: `${plan.executionSequencePlan.length} planned steps`,
        status: plan.executionSequencePlan.length > 0 ? 'ready' : 'blocked',
      },
      {
        id: 'preflight_lock_audit_rollback',
        label: 'Preflight / lock / audit / rollback',
        value:
          plan.preflightPlan && plan.writeLockPlan && plan.auditPlan && plan.rollbackPlan
            ? 'present'
            : 'missing',
        status:
          plan.preflightPlan && plan.writeLockPlan && plan.auditPlan && plan.rollbackPlan
            ? 'ready'
            : 'blocked',
      },
      {
        id: 'dry_run_no_write',
        label: 'Dry-run / no actual write',
        value:
          plan.dryRunOnly && plan.actualWriteBlocked
            ? 'dry-run only; actual write blocked'
            : 'missing safety flags',
        status: plan.dryRunOnly && plan.actualWriteBlocked ? 'ready' : 'blocked',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Handoff does not write a UserAppTemplatePackage registry.',
      'Handoff does not publish to the user app.',
      'Handoff does not replace the current User App Shell package.',
      'Handoff does not create a production writer.',
      'Handoff is for Phase 10S or later guarded execution simulator only.',
      'Future actual registry write still requires separate explicit owner authorization.',
    ],
    executionPlanOnly: true,
    dryRunOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    doesNotCreateProductionWriter: true,
    readyForFutureGuardedExecutionSimulator:
      validation.readyForFutureGuardedExecutionSimulator,
    jsonRoundTripStable: true,
  };
  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
