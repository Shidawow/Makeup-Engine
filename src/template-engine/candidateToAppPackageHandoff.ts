import type { CandidateToAppPackageContractPreparation } from './candidateToAppPackageContract';
import type { CandidateToAppPackageValidationResult } from './candidateToAppPackageValidation';

export type CandidateToAppPackageNextAction =
  | 'ready_for_user_app_package_draft'
  | 'request_candidate_copy_polish'
  | 'request_step_revision'
  | 'request_region_guidance_revision'
  | 'request_privacy_review'
  | 'keep_as_template_library_candidate_only'
  | 'blocked_do_not_prepare_app_package';

export type CandidateToAppPackageHandoffStatus =
  | 'candidate_to_app_handoff_ready'
  | 'candidate_to_app_handoff_ready_with_warnings'
  | 'candidate_to_app_handoff_blocked'
  | 'candidate_to_app_handoff_example_only';

export type CandidateToAppPackageDecision =
  | 'handoff_to_user_app_package_draft_preview'
  | 'revise_contract_preparation'
  | 'block_app_package_preparation'
  | 'retain_template_library_candidate_only';

export interface CandidateToAppPackagePreview {
  id: string;
  label: string;
  value: string;
}

export interface CandidateToAppPackageHandoff {
  id: string;
  preparationId: string;
  sourceCandidatePackageId: string;
  status: CandidateToAppPackageHandoffStatus;
  decision: CandidateToAppPackageDecision;
  nextAction: CandidateToAppPackageNextAction;
  preview: CandidateToAppPackagePreview[];
  notes: string[];
  mappingPreviewOnly: true;
  notPublished: true;
  formalUserAppTemplatePackageGenerationBlocked: true;
  userAppPackageRegistryWriteBlocked: true;
  jsonRoundTripStable: boolean;
}

const nextActionFor = (
  preparation: CandidateToAppPackageContractPreparation,
  validation: CandidateToAppPackageValidationResult,
): CandidateToAppPackageNextAction => {
  const text = JSON.stringify({
    blockedReasons: preparation.blockedReasons,
    issues: validation.issues,
    warnings: preparation.warnings,
  });

  if (preparation.contractStatus === 'contract_preparation_example_only') {
    return 'keep_as_template_library_candidate_only';
  }
  if (validation.status === 'app_contract_validation_blocked') {
    if (/privacy|personal|raw_image|UserAppTemplatePackage|mutation|medical|shade|final/i.test(text)) {
      return 'request_privacy_review';
    }
    if (/region/i.test(text)) {
      return 'request_region_guidance_revision';
    }
    if (/step|guidance|tools/i.test(text)) {
      return 'request_step_revision';
    }
    return 'blocked_do_not_prepare_app_package';
  }
  if (validation.status === 'app_contract_validation_ready_with_warnings') {
    return 'request_candidate_copy_polish';
  }
  return 'ready_for_user_app_package_draft';
};

export const createCandidateToAppPackageHandoff = ({
  preparation,
  validation,
  id = `candidate-to-app-handoff-${preparation.preparationId}`,
}: {
  preparation: CandidateToAppPackageContractPreparation;
  validation: CandidateToAppPackageValidationResult;
  id?: string;
}): CandidateToAppPackageHandoff => {
  const nextAction = nextActionFor(preparation, validation);
  const status: CandidateToAppPackageHandoffStatus =
    nextAction === 'keep_as_template_library_candidate_only'
      ? 'candidate_to_app_handoff_example_only'
      : validation.status === 'app_contract_validation_blocked'
        ? 'candidate_to_app_handoff_blocked'
        : validation.status === 'app_contract_validation_ready_with_warnings'
          ? 'candidate_to_app_handoff_ready_with_warnings'
          : 'candidate_to_app_handoff_ready';
  const decision: CandidateToAppPackageDecision =
    status === 'candidate_to_app_handoff_example_only'
      ? 'retain_template_library_candidate_only'
      : status === 'candidate_to_app_handoff_blocked'
        ? 'block_app_package_preparation'
        : status === 'candidate_to_app_handoff_ready_with_warnings'
          ? 'revise_contract_preparation'
          : 'handoff_to_user_app_package_draft_preview';

  const handoff: CandidateToAppPackageHandoff = {
    id,
    preparationId: preparation.preparationId,
    sourceCandidatePackageId: preparation.sourceCandidatePackageId,
    status,
    decision,
    nextAction,
    preview: [
      {
        id: 'title',
        label: 'Title mapping',
        value: preparation.titleMapping.previewValue,
      },
      {
        id: 'steps',
        label: 'Step preview',
        value: preparation.stepSequenceMapping.previewValue,
      },
      {
        id: 'region_guidance',
        label: 'Region guidance preview',
        value: preparation.regionGuidanceMapping.previewValue,
      },
      {
        id: 'validation',
        label: 'Validation',
        value: validation.status,
      },
      {
        id: 'next_action',
        label: 'Next action',
        value: nextAction,
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Handoff does not generate UserAppTemplatePackage.',
      'Handoff does not publish to the user app.',
      'Handoff does not write a user app package registry.',
      'This handoff can feed a later User App Package Draft Preview phase.',
    ],
    mappingPreviewOnly: true,
    notPublished: true,
    formalUserAppTemplatePackageGenerationBlocked: true,
    userAppPackageRegistryWriteBlocked: true,
    jsonRoundTripStable: true,
  };

  handoff.jsonRoundTripStable = JSON.stringify(JSON.parse(JSON.stringify(handoff))) === JSON.stringify(handoff);
  return handoff;
};
