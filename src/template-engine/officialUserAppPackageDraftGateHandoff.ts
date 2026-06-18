import type {
  OfficialUserAppPackageDraftGateDecision,
  OfficialUserAppPackageDraftGateResult,
} from './officialUserAppPackageDraftGate';

export type OfficialUserAppPackageDraftGateNextAction =
  | 'ready_for_official_user_app_package_draft_builder'
  | 'request_user_facing_copy_revision'
  | 'request_step_guidance_revision'
  | 'request_region_guidance_revision'
  | 'request_privacy_review'
  | 'keep_as_preview_only'
  | 'blocked_do_not_build_official_draft';

export type OfficialUserAppPackageDraftGateHandoffStatus =
  | 'official_draft_gate_handoff_ready'
  | 'official_draft_gate_handoff_ready_with_warnings'
  | 'official_draft_gate_handoff_blocked'
  | 'official_draft_gate_handoff_example_only';

export interface OfficialUserAppPackageDraftGateHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface OfficialUserAppPackageDraftGateHandoff {
  id: string;
  gateId: string;
  sourcePreviewId: string;
  sourceContractPreparationId: string;
  sourceCandidatePackageId: string;
  status: OfficialUserAppPackageDraftGateHandoffStatus;
  gateDecision: OfficialUserAppPackageDraftGateDecision;
  nextAction: OfficialUserAppPackageDraftGateNextAction;
  items: OfficialUserAppPackageDraftGateHandoffItem[];
  notes: string[];
  gateOnly: true;
  notFormalUserAppTemplatePackage: true;
  notPublished: true;
  noUserAppPackageRegistryWrite: true;
  formalUserAppTemplatePackageGenerationBlocked: true;
  jsonRoundTripStable: boolean;
}

const nextActionForDecision = (
  decision: OfficialUserAppPackageDraftGateDecision,
): OfficialUserAppPackageDraftGateNextAction => {
  switch (decision) {
    case 'eligible_for_official_user_app_package_draft_builder':
      return 'ready_for_official_user_app_package_draft_builder';
    case 'request_user_facing_copy_revision':
      return 'request_user_facing_copy_revision';
    case 'request_step_guidance_revision':
      return 'request_step_guidance_revision';
    case 'request_region_guidance_revision':
      return 'request_region_guidance_revision';
    case 'request_privacy_review':
      return 'request_privacy_review';
    case 'keep_as_preview_only':
      return 'keep_as_preview_only';
    case 'blocked_do_not_create_official_package_draft':
      return 'blocked_do_not_build_official_draft';
  }
};

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

export const createOfficialUserAppPackageDraftGateHandoff = ({
  gate,
  id = `official-user-app-package-draft-gate-handoff-${gate.gateId}`,
}: {
  gate: OfficialUserAppPackageDraftGateResult;
  id?: string;
}): OfficialUserAppPackageDraftGateHandoff => {
  const status: OfficialUserAppPackageDraftGateHandoffStatus =
    gate.status === 'official_draft_gate_example_only'
      ? 'official_draft_gate_handoff_example_only'
      : gate.status === 'official_draft_gate_blocked'
        ? 'official_draft_gate_handoff_blocked'
        : gate.status === 'official_draft_gate_ready_with_warnings'
          ? 'official_draft_gate_handoff_ready_with_warnings'
          : 'official_draft_gate_handoff_ready';
  const nextAction = nextActionForDecision(gate.decision);
  const handoff: OfficialUserAppPackageDraftGateHandoff = {
    id,
    gateId: gate.gateId,
    sourcePreviewId: gate.sourcePreviewId,
    sourceContractPreparationId: gate.sourceContractPreparationId,
    sourceCandidatePackageId: gate.sourceCandidatePackageId,
    status,
    gateDecision: gate.decision,
    nextAction,
    items: [
      {
        id: 'gate_status',
        label: 'Gate status',
        value: gate.status,
        status:
          gate.status === 'official_draft_gate_blocked'
            ? 'blocked'
            : gate.status === 'official_draft_gate_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'next_action',
        label: 'Next action',
        value: nextAction,
        status: nextAction.startsWith('blocked') ? 'blocked' : 'ready',
      },
      {
        id: 'blocked_reasons',
        label: 'Blocked reasons',
        value: String(gate.blockedReasons.length),
        status: gate.blockedReasons.length > 0 ? 'blocked' : 'ready',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Gate ready only means eligible for a future official User App package draft builder.',
      'Handoff does not generate a formal UserAppTemplatePackage.',
      'Handoff does not write a user app package registry.',
      'Handoff does not publish to the user app.',
    ],
    gateOnly: true,
    notFormalUserAppTemplatePackage: true,
    notPublished: true,
    noUserAppPackageRegistryWrite: true,
    formalUserAppTemplatePackageGenerationBlocked: true,
    jsonRoundTripStable: true,
  };

  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
