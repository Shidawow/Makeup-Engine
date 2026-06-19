import type {
  UserAppTemplatePackageDraftPublishGateDecision,
  UserAppTemplatePackageDraftPublishGateResult,
} from './userAppTemplatePackageDraftPublishGate';

export type UserAppTemplatePackageDraftPublishGateNextAction =
  | 'ready_for_future_registry_preparation'
  | 'request_user_facing_copy_revision'
  | 'request_step_guidance_revision'
  | 'request_region_guidance_revision'
  | 'request_privacy_notice_revision'
  | 'keep_as_draft_only'
  | 'blocked_do_not_prepare_registry';

export type UserAppTemplatePackageDraftPublishGateHandoffStatus =
  | 'draft_publish_gate_handoff_ready'
  | 'draft_publish_gate_handoff_ready_with_warnings'
  | 'draft_publish_gate_handoff_blocked'
  | 'draft_publish_gate_handoff_example_only';

export interface UserAppTemplatePackageDraftPublishGateHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface UserAppTemplatePackageDraftPublishGateHandoff {
  id: string;
  gateId: string;
  sourceDraftId: string;
  sourceDraftValidationStatus: UserAppTemplatePackageDraftPublishGateResult['sourceDraftValidationStatus'];
  status: UserAppTemplatePackageDraftPublishGateHandoffStatus;
  gateDecision: UserAppTemplatePackageDraftPublishGateDecision;
  nextAction: UserAppTemplatePackageDraftPublishGateNextAction;
  items: UserAppTemplatePackageDraftPublishGateHandoffItem[];
  notes: string[];
  draftOnly: true;
  publishBlocked: true;
  noUserAppPackageRegistryWrite: true;
  noUserAppShellPackageReplacement: true;
  notPublished: true;
  registryPreparationOnly: true;
  jsonRoundTripStable: boolean;
}

const nextActionForDecision = (
  decision: UserAppTemplatePackageDraftPublishGateDecision,
): UserAppTemplatePackageDraftPublishGateNextAction => {
  switch (decision) {
    case 'eligible_for_future_registry_preparation':
      return 'ready_for_future_registry_preparation';
    case 'request_user_facing_copy_revision':
      return 'request_user_facing_copy_revision';
    case 'request_step_guidance_revision':
      return 'request_step_guidance_revision';
    case 'request_region_guidance_revision':
      return 'request_region_guidance_revision';
    case 'request_privacy_notice_revision':
      return 'request_privacy_notice_revision';
    case 'keep_as_draft_only':
      return 'keep_as_draft_only';
    case 'blocked_do_not_prepare_registry':
      return 'blocked_do_not_prepare_registry';
  }
};

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

export const createUserAppTemplatePackageDraftPublishGateHandoff = ({
  gate,
  id = `user-app-template-package-draft-publish-gate-handoff-${gate.gateId}`,
}: {
  gate: UserAppTemplatePackageDraftPublishGateResult;
  id?: string;
}): UserAppTemplatePackageDraftPublishGateHandoff => {
  const status: UserAppTemplatePackageDraftPublishGateHandoffStatus =
    gate.status === 'draft_publish_gate_example_only'
      ? 'draft_publish_gate_handoff_example_only'
      : gate.status === 'draft_publish_gate_blocked'
        ? 'draft_publish_gate_handoff_blocked'
        : gate.status === 'draft_publish_gate_ready_with_warnings'
          ? 'draft_publish_gate_handoff_ready_with_warnings'
          : 'draft_publish_gate_handoff_ready';
  const nextAction = nextActionForDecision(gate.decision);
  const handoff: UserAppTemplatePackageDraftPublishGateHandoff = {
    id,
    gateId: gate.gateId,
    sourceDraftId: gate.sourceDraftId,
    sourceDraftValidationStatus: gate.sourceDraftValidationStatus,
    status,
    gateDecision: gate.decision,
    nextAction,
    items: [
      {
        id: 'gate_status',
        label: 'Gate status',
        value: gate.status,
        status:
          gate.status === 'draft_publish_gate_blocked'
            ? 'blocked'
            : gate.status === 'draft_publish_gate_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'blocked_reasons',
        label: 'Blocked reasons',
        value: String(gate.blockedReasons.length),
        status: gate.blockedReasons.length > 0 ? 'blocked' : 'ready',
      },
      {
        id: 'warnings',
        label: 'Warnings',
        value: String(gate.warnings.length),
        status: gate.warnings.length > 0 ? 'warning' : 'ready',
      },
      {
        id: 'future_registry_preparation',
        label: 'Future registry preparation',
        value: gate.eligibleForFutureRegistryPreparation ? 'eligible' : 'not eligible',
        status: gate.eligibleForFutureRegistryPreparation ? 'ready' : 'blocked',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Gate ready means eligible for future registry preparation only.',
      'Handoff does not publish to the user app.',
      'Handoff does not write a user app package registry.',
      'Handoff does not replace the current User App Shell package.',
      'Handoff does not mark a production UserAppTemplatePackage.',
    ],
    draftOnly: true,
    publishBlocked: true,
    noUserAppPackageRegistryWrite: true,
    noUserAppShellPackageReplacement: true,
    notPublished: true,
    registryPreparationOnly: true,
    jsonRoundTripStable: true,
  };

  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
