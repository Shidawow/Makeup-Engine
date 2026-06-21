import type { GuardedSimulatorReviewGateResult } from './guardedSimulatorReviewGate';

export type GuardedSimulatorReviewChecklistStatus =
  | 'simulator_review_checklist_ready'
  | 'simulator_review_checklist_ready_with_warnings'
  | 'simulator_review_checklist_blocked';

export interface GuardedSimulatorReviewRequirement {
  id: string;
  label: string;
  required: boolean;
  satisfied: boolean;
  summary: string;
}

export interface GuardedSimulatorReviewChecklistItem {
  id: string;
  label: string;
  status: 'ready' | 'warning' | 'blocked';
  requirementIds: string[];
  summary: string;
}

export interface GuardedSimulatorReviewChecklist {
  checklistId: string;
  sourceGateId: string;
  status: GuardedSimulatorReviewChecklistStatus;
  requirements: GuardedSimulatorReviewRequirement[];
  items: GuardedSimulatorReviewChecklistItem[];
  reviewGateOnly: true;
  doesNotTriggerWrite: true;
  noActualRegistryWrite: true;
  noRegistryMutation: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  futureActualWriteRequiresSeparateApproval: true;
  jsonRoundTripStable: boolean;
}

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const checkPassed = (
  gate: GuardedSimulatorReviewGateResult,
  checkId: string,
): boolean => gate.checks.some((check) => check.id === checkId && check.passed);

const statusForItem = (
  requirements: readonly GuardedSimulatorReviewRequirement[],
): GuardedSimulatorReviewChecklistItem['status'] => {
  if (requirements.some((requirement) => requirement.required && !requirement.satisfied)) {
    return 'blocked';
  }
  if (requirements.some((requirement) => !requirement.satisfied)) {
    return 'warning';
  }
  return 'ready';
};

export const createGuardedSimulatorReviewChecklist = ({
  gate,
  checklistId = `guarded-simulator-review-checklist-${gate.gateId}`,
}: {
  gate: GuardedSimulatorReviewGateResult;
  checklistId?: string;
}): GuardedSimulatorReviewChecklist => {
  const requirements: GuardedSimulatorReviewRequirement[] = [
    {
      id: 'confirm_simulator_is_dry_run_only',
      label: 'Confirm simulator is dry-run only',
      required: true,
      satisfied: checkPassed(gate, 'simulator_is_dry_run_only'),
      summary: '复核模拟器仍然 dry-run only。',
    },
    {
      id: 'confirm_no_actual_registry_write',
      label: 'Confirm no actual registry write',
      required: true,
      satisfied: checkPassed(gate, 'no_actual_registry_write'),
      summary: '复核没有 actual registry write。',
    },
    {
      id: 'confirm_no_registry_mutation',
      label: 'Confirm no registry mutation',
      required: true,
      satisfied: checkPassed(gate, 'no_registry_mutation'),
      summary: '复核没有 registry mutation。',
    },
    {
      id: 'confirm_no_publish',
      label: 'Confirm no publish',
      required: true,
      satisfied: checkPassed(gate, 'no_publish'),
      summary: '复核没有发布到用户 App。',
    },
    {
      id: 'confirm_no_user_app_shell_package_replacement',
      label: 'Confirm no User App Shell package replacement',
      required: true,
      satisfied: checkPassed(gate, 'no_user_app_shell_package_replacement'),
      summary: '复核没有替换当前 User App Shell package。',
    },
    {
      id: 'confirm_no_production_writer_creation',
      label: 'Confirm no production writer creation',
      required: true,
      satisfied: checkPassed(gate, 'no_production_writer_creation'),
      summary: '复核没有创建 production writer。',
    },
    {
      id: 'confirm_simulated_preflight_reviewed',
      label: 'Confirm simulated preflight reviewed',
      required: true,
      satisfied: checkPassed(gate, 'simulated_preflight_reviewed'),
      summary: '复核 simulated preflight。',
    },
    {
      id: 'confirm_simulated_write_lock_reviewed',
      label: 'Confirm simulated write lock reviewed',
      required: true,
      satisfied: checkPassed(gate, 'simulated_write_lock_reviewed'),
      summary: '复核 simulated write lock。',
    },
    {
      id: 'confirm_simulated_write_operation_reviewed',
      label: 'Confirm simulated write operation reviewed',
      required: true,
      satisfied: checkPassed(gate, 'simulated_write_operation_reviewed'),
      summary: '复核 simulated write operation。',
    },
    {
      id: 'confirm_simulated_audit_events_reviewed',
      label: 'Confirm simulated audit events reviewed',
      required: true,
      satisfied: checkPassed(gate, 'simulated_audit_events_reviewed'),
      summary: '复核 simulated audit events。',
    },
    {
      id: 'confirm_simulated_rollback_reviewed',
      label: 'Confirm simulated rollback reviewed',
      required: true,
      satisfied: checkPassed(gate, 'simulated_rollback_reviewed'),
      summary: '复核 simulated rollback。',
    },
    {
      id: 'confirm_simulated_failure_handling_reviewed',
      label: 'Confirm simulated failure handling reviewed',
      required: true,
      satisfied: checkPassed(gate, 'simulated_failure_handling_reviewed'),
      summary: '复核 simulated failure handling。',
    },
    {
      id: 'confirm_future_actual_write_requires_separate_approval',
      label: 'Confirm future actual write requires separate approval',
      required: true,
      satisfied: checkPassed(gate, 'future_actual_write_requires_separate_approval'),
      summary: '复核未来真实写入仍需老板另行明确授权。',
    },
  ];
  const itemGroups = [
    {
      id: 'write_boundary_review',
      label: 'Write boundary review',
      requirementIds: [
        'confirm_simulator_is_dry_run_only',
        'confirm_no_actual_registry_write',
        'confirm_no_registry_mutation',
        'confirm_no_publish',
        'confirm_no_user_app_shell_package_replacement',
        'confirm_no_production_writer_creation',
      ],
      summary: '复核 dry-run、no-write、no-mutation、no-publish、no-replacement、no-production-writer。',
    },
    {
      id: 'simulation_evidence_review',
      label: 'Simulation evidence review',
      requirementIds: [
        'confirm_simulated_preflight_reviewed',
        'confirm_simulated_write_lock_reviewed',
        'confirm_simulated_write_operation_reviewed',
        'confirm_simulated_audit_events_reviewed',
        'confirm_simulated_rollback_reviewed',
        'confirm_simulated_failure_handling_reviewed',
      ],
      summary: '复核模拟 preflight、write lock、operation、audit、rollback、failure handling。',
    },
    {
      id: 'future_approval_boundary_review',
      label: 'Future approval boundary review',
      requirementIds: ['confirm_future_actual_write_requires_separate_approval'],
      summary: '复核未来真实写入必须另行授权。',
    },
  ];
  const items = itemGroups.map((group) => {
    const groupRequirements = requirements.filter((requirement) =>
      group.requirementIds.includes(requirement.id),
    );
    return {
      id: group.id,
      label: group.label,
      requirementIds: group.requirementIds,
      status: statusForItem(groupRequirements),
      summary: group.summary,
    };
  });
  const hasBlocked = items.some((item) => item.status === 'blocked');
  const hasWarnings =
    gate.status === 'simulator_review_gate_ready_with_warnings' ||
    items.some((item) => item.status === 'warning');
  const checklist: GuardedSimulatorReviewChecklist = {
    checklistId,
    sourceGateId: gate.gateId,
    status: hasBlocked
      ? 'simulator_review_checklist_blocked'
      : hasWarnings
        ? 'simulator_review_checklist_ready_with_warnings'
        : 'simulator_review_checklist_ready',
    requirements,
    items,
    reviewGateOnly: true,
    doesNotTriggerWrite: true,
    noActualRegistryWrite: true,
    noRegistryMutation: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    futureActualWriteRequiresSeparateApproval: true,
    jsonRoundTripStable: true,
  };
  checklist.jsonRoundTripStable = isJsonRoundTripStable(checklist);
  return checklist;
};
