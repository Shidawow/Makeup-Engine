import type { RealRegistryWriteImplementationGateResult } from './realRegistryWriteImplementationGate';

export type RealRegistryWriteImplementationChecklistStatus =
  | 'implementation_checklist_ready'
  | 'implementation_checklist_ready_with_warnings'
  | 'implementation_checklist_blocked';

export type RealRegistryWriteImplementationRequirement =
  | 'confirm_execution_design_is_dry_run_only'
  | 'confirm_no_actual_registry_write_in_this_phase'
  | 'confirm_no_publish_in_this_phase'
  | 'confirm_no_user_app_shell_package_replacement'
  | 'confirm_audit_plan_reviewed'
  | 'confirm_rollback_design_reviewed'
  | 'confirm_write_lock_requirements_reviewed'
  | 'confirm_owner_authorization_trace_preserved'
  | 'confirm_future_real_implementation_needs_separate_approval'
  | 'confirm_production_write_remains_disabled';

export interface RealRegistryWriteImplementationChecklistItem {
  id: RealRegistryWriteImplementationRequirement;
  label: string;
  description: string;
  required: true;
  confirmed: boolean;
  blocksImplementationGate: boolean;
}

export interface RealRegistryWriteImplementationChecklist {
  checklistId: string;
  sourceGateId: string;
  status: RealRegistryWriteImplementationChecklistStatus;
  items: RealRegistryWriteImplementationChecklistItem[];
  notes: string[];
  checklistOnly: true;
  dryRunOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  futureExplicitApprovalRequired: true;
  jsonRoundTripStable: boolean;
}

export interface RealRegistryWriteImplementationChecklistOverrides {
  confirmations?: Partial<Record<RealRegistryWriteImplementationRequirement, boolean>>;
  note?: string;
}

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const checklistDefinitions: Array<
  Omit<RealRegistryWriteImplementationChecklistItem, 'confirmed'>
> = [
  {
    id: 'confirm_execution_design_is_dry_run_only',
    label: 'Confirm execution design is dry-run only',
    description:
      'Confirm the Phase 10M execution design remains dry-run only and cannot execute writes.',
    required: true,
    blocksImplementationGate: true,
  },
  {
    id: 'confirm_no_actual_registry_write_in_this_phase',
    label: 'Confirm no actual registry write in this phase',
    description:
      'Confirm Phase 10N is an implementation gate only and does not persist registry state.',
    required: true,
    blocksImplementationGate: true,
  },
  {
    id: 'confirm_no_publish_in_this_phase',
    label: 'Confirm no publish in this phase',
    description:
      'Confirm Phase 10N does not publish to the user app or mark anything live.',
    required: true,
    blocksImplementationGate: true,
  },
  {
    id: 'confirm_no_user_app_shell_package_replacement',
    label: 'Confirm no User App Shell package replacement',
    description:
      'Confirm Phase 10N does not replace the current User App Shell package.',
    required: true,
    blocksImplementationGate: true,
  },
  {
    id: 'confirm_audit_plan_reviewed',
    label: 'Confirm audit plan reviewed',
    description:
      'Confirm the audit plan is reviewed before any future implementation draft.',
    required: true,
    blocksImplementationGate: true,
  },
  {
    id: 'confirm_rollback_design_reviewed',
    label: 'Confirm rollback design reviewed',
    description:
      'Confirm rollback execution design is reviewed before any future implementation draft.',
    required: true,
    blocksImplementationGate: true,
  },
  {
    id: 'confirm_write_lock_requirements_reviewed',
    label: 'Confirm write lock requirements reviewed',
    description:
      'Confirm package, version, and owner authorization write locks are reviewed.',
    required: true,
    blocksImplementationGate: true,
  },
  {
    id: 'confirm_owner_authorization_trace_preserved',
    label: 'Confirm owner authorization trace preserved',
    description:
      'Confirm owner authorization trace remains attached to the future implementation decision.',
    required: true,
    blocksImplementationGate: true,
  },
  {
    id: 'confirm_future_real_implementation_needs_separate_approval',
    label: 'Confirm future implementation needs separate approval',
    description:
      'Confirm a future real write implementation draft still needs separate owner approval.',
    required: true,
    blocksImplementationGate: true,
  },
  {
    id: 'confirm_production_write_remains_disabled',
    label: 'Confirm production write remains disabled',
    description:
      'Confirm production write remains disabled in Phase 10N.',
    required: true,
    blocksImplementationGate: true,
  },
];

export const createRealRegistryWriteImplementationChecklist = ({
  gate,
  checklistId = `real-registry-write-implementation-checklist-${gate.gateId}`,
  overrides = {},
}: {
  gate: RealRegistryWriteImplementationGateResult;
  checklistId?: string;
  overrides?: RealRegistryWriteImplementationChecklistOverrides;
}): RealRegistryWriteImplementationChecklist => {
  const defaultConfirmed = gate.status !== 'real_write_implementation_gate_blocked';
  const items: RealRegistryWriteImplementationChecklistItem[] =
    checklistDefinitions.map((definition) => ({
      ...definition,
      confirmed: overrides.confirmations?.[definition.id] ?? defaultConfirmed,
    }));
  const missingRequired = items.some(
    (item) => item.required && item.blocksImplementationGate && !item.confirmed,
  );
  const status: RealRegistryWriteImplementationChecklistStatus = missingRequired
    ? 'implementation_checklist_blocked'
    : gate.status === 'real_write_implementation_gate_ready_with_warnings'
      ? 'implementation_checklist_ready_with_warnings'
      : 'implementation_checklist_ready';

  const checklist: RealRegistryWriteImplementationChecklist = {
    checklistId,
    sourceGateId: gate.gateId,
    status,
    items,
    notes: [
      'Checklist is local and administrator-only.',
      'Checklist does not trigger a registry write.',
      'Checklist does not generate a production writer.',
      'Checklist does not modify a registry.',
      'Phase 10N does not publish or replace the current User App Shell package.',
      overrides.note ??
        'Future real implementation, if ever drafted, requires separate owner approval.',
    ],
    checklistOnly: true,
    dryRunOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    futureExplicitApprovalRequired: true,
    jsonRoundTripStable: true,
  };
  checklist.jsonRoundTripStable = isJsonRoundTripStable(checklist);
  return checklist;
};
