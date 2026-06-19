import type {
  UserAppTemplatePackageRegistryWriteGateDecision,
  UserAppTemplatePackageRegistryWriteGateResult,
} from './userAppTemplatePackageRegistryWriteGate';

export type UserAppTemplatePackageRegistryWriteGateNextAction =
  | 'ready_for_future_controlled_registry_writer'
  | 'request_package_metadata_revision'
  | 'request_versioning_review'
  | 'request_privacy_review'
  | 'request_user_app_shell_boundary_review'
  | 'keep_as_registry_preview_only'
  | 'blocked_do_not_write_registry';

export type UserAppTemplatePackageRegistryWriteGateHandoffStatus =
  | 'registry_write_gate_handoff_ready'
  | 'registry_write_gate_handoff_ready_with_warnings'
  | 'registry_write_gate_handoff_blocked'
  | 'registry_write_gate_handoff_example_only';

export interface UserAppTemplatePackageRegistryWriteGateHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface UserAppTemplatePackageRegistryWriteGateHandoff {
  id: string;
  gateId: string;
  sourcePreparationId: string;
  sourceOfficialDraftId: string;
  status: UserAppTemplatePackageRegistryWriteGateHandoffStatus;
  nextAction: UserAppTemplatePackageRegistryWriteGateNextAction;
  items: UserAppTemplatePackageRegistryWriteGateHandoffItem[];
  notes: string[];
  registryWriteGateOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionPackage: true;
  readyForFutureControlledRegistryWriter: boolean;
  jsonRoundTripStable: boolean;
}

const nextActionForDecision = (
  decision: UserAppTemplatePackageRegistryWriteGateDecision,
): UserAppTemplatePackageRegistryWriteGateNextAction => {
  if (decision === 'eligible_for_future_controlled_registry_writer') {
    return 'ready_for_future_controlled_registry_writer';
  }
  return decision;
};

const statusForGate = (
  gate: UserAppTemplatePackageRegistryWriteGateResult,
): UserAppTemplatePackageRegistryWriteGateHandoffStatus => {
  if (gate.status === 'registry_write_gate_example_only') {
    return 'registry_write_gate_handoff_example_only';
  }
  if (gate.status === 'registry_write_gate_blocked') {
    return 'registry_write_gate_handoff_blocked';
  }
  if (gate.status === 'registry_write_gate_ready_with_warnings') {
    return 'registry_write_gate_handoff_ready_with_warnings';
  }
  return 'registry_write_gate_handoff_ready';
};

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

export const createUserAppTemplatePackageRegistryWriteGateHandoff = ({
  gate,
  id = `user-app-template-package-registry-write-gate-handoff-${gate.gateId}`,
}: {
  gate: UserAppTemplatePackageRegistryWriteGateResult;
  id?: string;
}): UserAppTemplatePackageRegistryWriteGateHandoff => {
  const handoff: UserAppTemplatePackageRegistryWriteGateHandoff = {
    id,
    gateId: gate.gateId,
    sourcePreparationId: gate.sourcePreparationId,
    sourceOfficialDraftId: gate.sourceOfficialDraftId,
    status: statusForGate(gate),
    nextAction: nextActionForDecision(gate.decision),
    items: [
      {
        id: 'gate_status',
        label: 'Registry write gate status',
        value: gate.status,
        status:
          gate.status === 'registry_write_gate_blocked'
            ? 'blocked'
            : gate.status === 'registry_write_gate_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'future_controlled_writer',
        label: 'Future controlled registry writer',
        value: gate.eligibleForFutureControlledRegistryWriter ? 'eligible' : 'not eligible',
        status: gate.eligibleForFutureControlledRegistryWriter ? 'ready' : 'blocked',
      },
      {
        id: 'actual_registry_write',
        label: 'Actual registry write',
        value: gate.noActualRegistryWrite ? 'blocked by gate' : 'risk',
        status: gate.noActualRegistryWrite ? 'ready' : 'blocked',
      },
      {
        id: 'shell_replacement',
        label: 'User App Shell package replacement',
        value: gate.noUserAppShellPackageReplacement ? 'blocked by gate' : 'risk',
        status: gate.noUserAppShellPackageReplacement ? 'ready' : 'blocked',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Ready means eligible for a future controlled registry writer only.',
      'Handoff does not write a user app package registry.',
      'Handoff does not publish to the user app.',
      'Handoff does not replace the current User App Shell package.',
      'Handoff does not mark a production UserAppTemplatePackage.',
      'Handoff is for Phase 10K or later controlled writer review.',
    ],
    registryWriteGateOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionPackage: true,
    readyForFutureControlledRegistryWriter: gate.eligibleForFutureControlledRegistryWriter,
    jsonRoundTripStable: true,
  };

  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
