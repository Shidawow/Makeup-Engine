import type { FinalRealWriteReviewGateResult } from './finalRealWriteReviewGate';
import {
  realWriteExecutionAuthorizationOwnerText,
  type RealWriteExecutionAuthorizationScope,
} from './realWriteExecutionAuthorization';

export type RealWriteExecutionAuthorizationChecklistStatus =
  | 'execution_authorization_checklist_ready'
  | 'execution_authorization_checklist_ready_with_warnings'
  | 'execution_authorization_checklist_blocked'
  | 'execution_authorization_checklist_example_only';

export type RealWriteExecutionAuthorizationRequirement =
  | 'confirm_owner_authorized_phase_10q_only'
  | 'confirm_owner_did_not_authorize_actual_registry_write'
  | 'confirm_owner_did_not_authorize_publish'
  | 'confirm_owner_did_not_authorize_user_app_shell_package_replacement'
  | 'confirm_owner_did_not_authorize_production_writer_creation'
  | 'confirm_no_actual_registry_write_in_this_phase'
  | 'confirm_no_production_writer_in_this_phase'
  | 'confirm_final_review_gate_ready'
  | 'confirm_implementation_draft_remains_dry_run_only'
  | 'confirm_future_actual_write_requires_separate_approval'
  | 'confirm_production_write_remains_disabled';

export interface RealWriteExecutionAuthorizationEvidence {
  scope: RealWriteExecutionAuthorizationScope;
  text: string;
  ownerAuthorizedExecutionAuthorizationPhaseOnly: boolean;
  ownerAuthorizedActualRegistryWrite: boolean;
  ownerAuthorizedPublish: boolean;
  ownerAuthorizedUserAppShellReplacement: boolean;
  ownerAuthorizedProductionWriterCreation: boolean;
  doesNotTriggerWrite: true;
}

export interface RealWriteExecutionAuthorizationChecklistItem {
  id: RealWriteExecutionAuthorizationRequirement;
  label: string;
  description: string;
  status: 'ready' | 'warning' | 'blocked';
  requirement: RealWriteExecutionAuthorizationRequirement;
}

export interface RealWriteExecutionAuthorizationChecklist {
  checklistId: string;
  sourceFinalReviewGateId: string;
  sourceFinalReviewGateStatus: FinalRealWriteReviewGateResult['status'];
  status: RealWriteExecutionAuthorizationChecklistStatus;
  items: RealWriteExecutionAuthorizationChecklistItem[];
  requirements: RealWriteExecutionAuthorizationRequirement[];
  ownerAuthorizationEvidence: RealWriteExecutionAuthorizationEvidence;
  doesNotTriggerWrite: true;
  doesNotCreateProductionWriter: true;
  doesNotModifyRegistry: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  productionWriteStillDisabled: true;
  futureActualWriteRequiresSeparateApproval: true;
  notes: string[];
  jsonRoundTripStable: boolean;
}

export interface RealWriteExecutionAuthorizationChecklistOverrides {
  ownerAuthorizationScope?: RealWriteExecutionAuthorizationScope;
  ownerAuthorizationText?: string;
  omitRequirements?: RealWriteExecutionAuthorizationRequirement[];
  futureActualWriteRequiresSeparateApproval?: boolean;
  productionWriteStillDisabled?: boolean;
  note?: string;
}

const requiredChecklistItems: Array<{
  id: RealWriteExecutionAuthorizationRequirement;
  label: string;
  description: string;
}> = [
  {
    id: 'confirm_owner_authorized_phase_10q_only',
    label: 'Owner authorized Phase 10Q only',
    description:
      'Confirm the owner authorization only allows entering Phase 10Q execution authorization.',
  },
  {
    id: 'confirm_owner_did_not_authorize_actual_registry_write',
    label: 'Owner did not authorize actual registry write',
    description: 'Confirm this phase cannot execute or mark an actual registry write.',
  },
  {
    id: 'confirm_owner_did_not_authorize_publish',
    label: 'Owner did not authorize publish',
    description: 'Confirm this phase cannot publish to the user app.',
  },
  {
    id: 'confirm_owner_did_not_authorize_user_app_shell_package_replacement',
    label: 'Owner did not authorize User App Shell package replacement',
    description: 'Confirm the current User App Shell package remains unchanged.',
  },
  {
    id: 'confirm_owner_did_not_authorize_production_writer_creation',
    label: 'Owner did not authorize production writer creation',
    description: 'Confirm this phase cannot create or execute a production writer.',
  },
  {
    id: 'confirm_no_actual_registry_write_in_this_phase',
    label: 'No actual registry write in this phase',
    description: 'Confirm Phase 10Q remains authorization-model-only.',
  },
  {
    id: 'confirm_no_production_writer_in_this_phase',
    label: 'No production writer in this phase',
    description: 'Confirm Phase 10Q does not create or execute a production writer.',
  },
  {
    id: 'confirm_final_review_gate_ready',
    label: 'Final review gate ready',
    description: 'Confirm Phase 10P final real write review gate is ready.',
  },
  {
    id: 'confirm_implementation_draft_remains_dry_run_only',
    label: 'Implementation draft remains dry-run only',
    description: 'Confirm the Phase 10O implementation draft keeps dryRunOnly true.',
  },
  {
    id: 'confirm_future_actual_write_requires_separate_approval',
    label: 'Future actual write requires separate approval',
    description:
      'Confirm any future real write execution needs separate owner authorization.',
  },
  {
    id: 'confirm_production_write_remains_disabled',
    label: 'Production write remains disabled',
    description: 'Confirm production write remains disabled after execution authorization.',
  },
];

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const finalReviewReady = (gate: FinalRealWriteReviewGateResult): boolean =>
  gate.status === 'final_real_write_review_gate_ready' ||
  gate.status === 'final_real_write_review_gate_ready_with_warnings';

export const createRealWriteExecutionAuthorizationChecklist = ({
  finalReviewGate,
  checklistId = `real-write-execution-authorization-checklist-${finalReviewGate.gateId}`,
  overrides = {},
}: {
  finalReviewGate: FinalRealWriteReviewGateResult;
  checklistId?: string;
  overrides?: RealWriteExecutionAuthorizationChecklistOverrides;
}): RealWriteExecutionAuthorizationChecklist => {
  const ownerAuthorizationScope =
    overrides.ownerAuthorizationScope ?? 'execution_authorization_phase_only';
  const ownerAuthorizationText =
    overrides.ownerAuthorizationText ?? realWriteExecutionAuthorizationOwnerText;
  const omitted = new Set(overrides.omitRequirements ?? []);
  const sourceReady = finalReviewReady(finalReviewGate);
  const futureActualWriteRequiresSeparateApproval =
    overrides.futureActualWriteRequiresSeparateApproval ?? true;
  const productionWriteStillDisabled =
    overrides.productionWriteStillDisabled ??
    finalReviewGate.productionWriteStillDisabled;
  const ownerEvidence: RealWriteExecutionAuthorizationEvidence = {
    scope: ownerAuthorizationScope,
    text: ownerAuthorizationText,
    ownerAuthorizedExecutionAuthorizationPhaseOnly:
      ownerAuthorizationScope === 'execution_authorization_phase_only',
    ownerAuthorizedActualRegistryWrite:
      ownerAuthorizationScope === 'actual_registry_write',
    ownerAuthorizedPublish: ownerAuthorizationScope === 'publish',
    ownerAuthorizedUserAppShellReplacement:
      ownerAuthorizationScope === 'user_app_shell_replacement',
    ownerAuthorizedProductionWriterCreation:
      ownerAuthorizationScope === 'production_writer_creation',
    doesNotTriggerWrite: true,
  };
  const items = requiredChecklistItems.map(
    (item): RealWriteExecutionAuthorizationChecklistItem => {
      const omittedRequirement = omitted.has(item.id);
      const specificBlocked =
        (item.id === 'confirm_owner_authorized_phase_10q_only' &&
          ownerAuthorizationScope !== 'execution_authorization_phase_only') ||
        (item.id ===
          'confirm_owner_did_not_authorize_actual_registry_write' &&
          ownerAuthorizationScope === 'actual_registry_write') ||
        (item.id === 'confirm_owner_did_not_authorize_publish' &&
          ownerAuthorizationScope === 'publish') ||
        (item.id ===
          'confirm_owner_did_not_authorize_user_app_shell_package_replacement' &&
          ownerAuthorizationScope === 'user_app_shell_replacement') ||
        (item.id ===
          'confirm_owner_did_not_authorize_production_writer_creation' &&
          ownerAuthorizationScope === 'production_writer_creation') ||
        (item.id === 'confirm_no_actual_registry_write_in_this_phase' &&
          !finalReviewGate.actualWriteBlocked) ||
        (item.id === 'confirm_no_production_writer_in_this_phase' &&
          !finalReviewGate.productionWriterBlocked) ||
        (item.id === 'confirm_final_review_gate_ready' && !sourceReady) ||
        (item.id === 'confirm_implementation_draft_remains_dry_run_only' &&
          !finalReviewGate.dryRunOnly) ||
        (item.id === 'confirm_future_actual_write_requires_separate_approval' &&
          !futureActualWriteRequiresSeparateApproval) ||
        (item.id === 'confirm_production_write_remains_disabled' &&
          !productionWriteStillDisabled);
      return {
        ...item,
        requirement: item.id,
        status:
          sourceReady && !omittedRequirement && !specificBlocked
            ? 'ready'
            : 'blocked',
      };
    },
  );
  const hasBlocked = items.some((item) => item.status === 'blocked');
  const hasWarnings =
    finalReviewGate.status === 'final_real_write_review_gate_ready_with_warnings';
  const checklist: RealWriteExecutionAuthorizationChecklist = {
    checklistId,
    sourceFinalReviewGateId: finalReviewGate.gateId,
    sourceFinalReviewGateStatus: finalReviewGate.status,
    status:
      finalReviewGate.status === 'final_real_write_review_gate_example_only'
        ? 'execution_authorization_checklist_example_only'
        : hasBlocked || !sourceReady
          ? 'execution_authorization_checklist_blocked'
          : hasWarnings
            ? 'execution_authorization_checklist_ready_with_warnings'
            : 'execution_authorization_checklist_ready',
    items,
    requirements: items
      .filter((item) => item.status !== 'blocked')
      .map((item) => item.id),
    ownerAuthorizationEvidence: ownerEvidence,
    doesNotTriggerWrite: true,
    doesNotCreateProductionWriter: true,
    doesNotModifyRegistry: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    productionWriteStillDisabled: true,
    futureActualWriteRequiresSeparateApproval: true,
    notes: [
      'Checklist is local and administrator-only.',
      'Checklist does not trigger a registry write.',
      'Checklist does not create a production writer.',
      'Checklist does not modify a registry.',
      'Checklist preserves the owner authorization text exactly as Phase 10Q authorization evidence.',
      'Phase 10Q does not publish or replace the current User App Shell package.',
      overrides.note ??
        'Future actual registry write requires a separate explicit owner authorization phase.',
    ],
    jsonRoundTripStable: true,
  };
  checklist.jsonRoundTripStable = isJsonRoundTripStable(checklist);
  return checklist;
};
