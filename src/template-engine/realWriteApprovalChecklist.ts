import type { RealWriteApprovalBoundaryResult } from './realWriteApprovalBoundary';

export type RealWriteApprovalChecklistStatus =
  | 'real_write_approval_checklist_ready'
  | 'real_write_approval_checklist_ready_with_warnings'
  | 'real_write_approval_checklist_blocked';

export interface RealWriteApprovalRequirement {
  id: string;
  label: string;
  required: boolean;
  satisfied: boolean;
  summary: string;
}

export interface RealWriteApprovalBoundaryEvidence {
  id: string;
  label: string;
  value: string;
}

export interface RealWriteApprovalChecklistItem {
  id: string;
  label: string;
  status: 'ready' | 'warning' | 'blocked';
  requirementIds: string[];
  summary: string;
}

export interface RealWriteApprovalChecklist {
  checklistId: string;
  sourceBoundaryId: string;
  status: RealWriteApprovalChecklistStatus;
  requirements: RealWriteApprovalRequirement[];
  evidence: RealWriteApprovalBoundaryEvidence[];
  items: RealWriteApprovalChecklistItem[];
  approvalBoundaryOnly: true;
  doesNotTriggerWrite: true;
  noActualRegistryWrite: true;
  noRegistryMutation: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  doesNotCreateProductionWriter: true;
  productionWriteStillDisabled: true;
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
  boundary: RealWriteApprovalBoundaryResult,
  checkId: string,
): boolean => boundary.checks.some((check) => check.id === checkId && check.passed);

const statusForItem = (
  requirements: readonly RealWriteApprovalRequirement[],
): RealWriteApprovalChecklistItem['status'] => {
  if (requirements.some((requirement) => requirement.required && !requirement.satisfied)) {
    return 'blocked';
  }
  if (requirements.some((requirement) => !requirement.satisfied)) {
    return 'warning';
  }
  return 'ready';
};

export const createRealWriteApprovalChecklist = ({
  boundary,
  checklistId = `real-write-approval-checklist-${boundary.boundaryId}`,
}: {
  boundary: RealWriteApprovalBoundaryResult;
  checklistId?: string;
}): RealWriteApprovalChecklist => {
  const requirements: RealWriteApprovalRequirement[] = [
    {
      id: 'confirm_approval_boundary_only',
      label: 'Confirm approval boundary only',
      required: true,
      satisfied: checkPassed(boundary, 'approval_boundary_only'),
      summary: '确认 10U 只是批准边界，不是实际写入许可。',
    },
    {
      id: 'confirm_owner_has_not_authorized_actual_registry_write',
      label: 'Confirm owner has not authorized actual registry write',
      required: true,
      satisfied: checkPassed(boundary, 'owner_has_not_authorized_actual_write'),
      summary: '确认老板没有授权真实写入 registry。',
    },
    {
      id: 'confirm_owner_has_not_authorized_registry_mutation',
      label: 'Confirm owner has not authorized registry mutation',
      required: true,
      satisfied: checkPassed(boundary, 'owner_has_not_authorized_registry_mutation'),
      summary: '确认老板没有授权 mutation registry。',
    },
    {
      id: 'confirm_owner_has_not_authorized_publish',
      label: 'Confirm owner has not authorized publish',
      required: true,
      satisfied: checkPassed(boundary, 'owner_has_not_authorized_publish'),
      summary: '确认老板没有授权发布。',
    },
    {
      id: 'confirm_owner_has_not_authorized_user_app_shell_package_replacement',
      label: 'Confirm owner has not authorized User App Shell package replacement',
      required: true,
      satisfied: checkPassed(
        boundary,
        'owner_has_not_authorized_user_app_shell_replacement',
      ),
      summary: '确认老板没有授权替换当前 User App Shell package。',
    },
    {
      id: 'confirm_owner_has_not_authorized_production_writer_creation',
      label: 'Confirm owner has not authorized production writer creation',
      required: true,
      satisfied: checkPassed(
        boundary,
        'owner_has_not_authorized_production_writer_creation',
      ),
      summary: '确认老板没有授权创建 production writer。',
    },
    {
      id: 'confirm_simulator_review_gate_ready',
      label: 'Confirm simulator review gate ready',
      required: true,
      satisfied: checkPassed(boundary, 'source_simulator_review_gate_ready'),
      summary: '确认 10T simulator review gate ready 或 ready-with-warnings。',
    },
    {
      id: 'confirm_audit_requirements_reviewed',
      label: 'Confirm audit requirements reviewed',
      required: true,
      satisfied: checkPassed(boundary, 'audit_requirements_present'),
      summary: '确认 audit requirements 已列出并复核。',
    },
    {
      id: 'confirm_rollback_approval_requirements_reviewed',
      label: 'Confirm rollback approval requirements reviewed',
      required: true,
      satisfied: checkPassed(boundary, 'rollback_approval_requirements_present'),
      summary: '确认 rollback approval requirements 已列出并复核。',
    },
    {
      id: 'confirm_future_actual_write_requires_separate_approval',
      label: 'Confirm future actual write requires separate approval',
      required: true,
      satisfied: checkPassed(
        boundary,
        'future_actual_write_requires_separate_approval',
      ),
      summary: '确认未来真实写入仍需老板单独明确授权。',
    },
    {
      id: 'confirm_production_write_remains_disabled',
      label: 'Confirm production write remains disabled',
      required: true,
      satisfied:
        checkPassed(boundary, 'dry_run_only_true') &&
        checkPassed(boundary, 'actual_write_blocked_true') &&
        checkPassed(boundary, 'registry_mutation_blocked_true') &&
        checkPassed(boundary, 'publish_blocked_true') &&
        checkPassed(boundary, 'package_replacement_blocked_true') &&
        checkPassed(boundary, 'production_writer_blocked_true'),
      summary: '确认 production write / mutation / publish / replacement / writer 均保持 disabled。',
    },
  ];

  const itemGroups = [
    {
      id: 'approval_scope_review',
      label: 'Approval scope review',
      requirementIds: [
        'confirm_approval_boundary_only',
        'confirm_owner_has_not_authorized_actual_registry_write',
        'confirm_owner_has_not_authorized_registry_mutation',
        'confirm_owner_has_not_authorized_publish',
        'confirm_owner_has_not_authorized_user_app_shell_package_replacement',
        'confirm_owner_has_not_authorized_production_writer_creation',
      ],
      summary: '复核 10U 批准范围仍是 boundary only。',
    },
    {
      id: 'source_and_audit_review',
      label: 'Source and audit review',
      requirementIds: [
        'confirm_simulator_review_gate_ready',
        'confirm_audit_requirements_reviewed',
        'confirm_rollback_approval_requirements_reviewed',
      ],
      summary: '复核 10T 来源、audit requirements 和 rollback approval requirements。',
    },
    {
      id: 'future_authorization_review',
      label: 'Future authorization review',
      requirementIds: [
        'confirm_future_actual_write_requires_separate_approval',
        'confirm_production_write_remains_disabled',
      ],
      summary: '复核未来真实写入仍需单独授权，当前 production write disabled。',
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
    boundary.status === 'real_write_approval_boundary_ready_with_warnings' ||
    items.some((item) => item.status === 'warning');
  const checklist: RealWriteApprovalChecklist = {
    checklistId,
    sourceBoundaryId: boundary.boundaryId,
    status: hasBlocked
      ? 'real_write_approval_checklist_blocked'
      : hasWarnings
        ? 'real_write_approval_checklist_ready_with_warnings'
        : 'real_write_approval_checklist_ready',
    requirements,
    evidence: [
      {
        id: 'source_boundary_status',
        label: 'Source boundary status',
        value: boundary.status,
      },
      {
        id: 'approval_scope',
        label: 'Approval scope',
        value: boundary.approvalScope,
      },
      {
        id: 'next_decision',
        label: 'Boundary decision',
        value: boundary.decision,
      },
    ],
    items,
    approvalBoundaryOnly: true,
    doesNotTriggerWrite: true,
    noActualRegistryWrite: true,
    noRegistryMutation: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    doesNotCreateProductionWriter: true,
    productionWriteStillDisabled: true,
    futureActualWriteRequiresSeparateApproval: true,
    jsonRoundTripStable: true,
  };
  checklist.jsonRoundTripStable = isJsonRoundTripStable(checklist);
  return checklist;
};
