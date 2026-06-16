import type { TemplateLibraryCandidatePackage } from './templateLibraryCandidatePackage';
import type { TemplateLibraryCandidateValidationResult } from './templateLibraryCandidateValidation';

export type TemplateLibraryCandidateNextAction =
  | 'ready_for_candidate_library_review'
  | 'request_copy_polish'
  | 'request_region_fix'
  | 'request_step_revision'
  | 'request_privacy_review'
  | 'keep_as_example_only'
  | 'blocked_do_not_package';

export type TemplateLibraryCandidateHandoffStatus =
  | 'candidate_handoff_ready'
  | 'candidate_handoff_ready_with_warnings'
  | 'candidate_handoff_blocked'
  | 'candidate_handoff_example_only';

export type TemplateLibraryCandidatePackagingDecision =
  | 'handoff_to_candidate_library_review'
  | 'revise_candidate_package'
  | 'block_candidate_package'
  | 'retain_example_only';

export interface TemplateLibraryCandidateHandoffItem {
  id: string;
  label: string;
  value: string;
}

export interface TemplateLibraryCandidateHandoff {
  id: string;
  candidateId: string;
  status: TemplateLibraryCandidateHandoffStatus;
  packagingDecision: TemplateLibraryCandidatePackagingDecision;
  nextAction: TemplateLibraryCandidateNextAction;
  items: TemplateLibraryCandidateHandoffItem[];
  notes: string[];
  notPublished: true;
  formalTemplateLibraryWriteBlocked: true;
  userAppTemplatePackageGenerationBlocked: true;
  jsonRoundTripStable: boolean;
}

const nextActionFor = (
  candidatePackage: TemplateLibraryCandidatePackage,
  validation: TemplateLibraryCandidateValidationResult,
): TemplateLibraryCandidateNextAction => {
  const text = JSON.stringify({
    blockedReasons: candidatePackage.blockedReasons,
    issues: validation.issues,
    warnings: candidatePackage.packagingWarnings,
  });

  if (candidatePackage.packageStatus === 'candidate_package_example_only') {
    return 'keep_as_example_only';
  }
  if (validation.status === 'candidate_validation_blocked') {
    if (/privacy|personal|raw_image|UserAppTemplatePackage|mutation|medical|shade|final/i.test(text)) {
      return 'request_privacy_review';
    }
    if (/region|qa/i.test(text)) {
      return 'request_region_fix';
    }
    if (/step|guidance|tools/i.test(text)) {
      return 'request_step_revision';
    }
    return 'blocked_do_not_package';
  }
  if (validation.status === 'candidate_validation_ready_with_warnings') {
    return 'request_copy_polish';
  }
  return 'ready_for_candidate_library_review';
};

export const createTemplateLibraryCandidateHandoff = ({
  candidatePackage,
  validation,
  id = 'phase-10c-template-library-candidate-handoff',
}: {
  candidatePackage: TemplateLibraryCandidatePackage;
  validation: TemplateLibraryCandidateValidationResult;
  id?: string;
}): TemplateLibraryCandidateHandoff => {
  const nextAction = nextActionFor(candidatePackage, validation);
  const status: TemplateLibraryCandidateHandoffStatus =
    nextAction === 'keep_as_example_only'
      ? 'candidate_handoff_example_only'
      : validation.status === 'candidate_validation_blocked'
        ? 'candidate_handoff_blocked'
        : validation.status === 'candidate_validation_ready_with_warnings'
          ? 'candidate_handoff_ready_with_warnings'
          : 'candidate_handoff_ready';
  const packagingDecision: TemplateLibraryCandidatePackagingDecision =
    status === 'candidate_handoff_example_only'
      ? 'retain_example_only'
      : status === 'candidate_handoff_blocked'
        ? 'block_candidate_package'
        : status === 'candidate_handoff_ready_with_warnings'
          ? 'revise_candidate_package'
          : 'handoff_to_candidate_library_review';

  return {
    id,
    candidateId: candidatePackage.candidateId,
    status,
    packagingDecision,
    nextAction,
    items: [
      {
        id: 'candidate_id',
        label: 'Candidate ID',
        value: candidatePackage.candidateId,
      },
      {
        id: 'source_draft',
        label: 'Source Draft',
        value: candidatePackage.sourceDraftId ?? 'missing',
      },
      {
        id: 'validation_status',
        label: 'Validation',
        value: validation.status,
      },
      {
        id: 'next_action',
        label: 'Next Action',
        value: nextAction,
      },
    ],
    notes: [
      'Candidate handoff is local and admin-only.',
      'Handoff does not write the formal Template Library.',
      'Handoff does not publish templates.',
      'Handoff does not generate UserAppTemplatePackage.',
      'This handoff can feed Phase 10D candidate-to-app package contract preparation.',
    ],
    notPublished: true,
    formalTemplateLibraryWriteBlocked: true,
    userAppTemplatePackageGenerationBlocked: true,
    jsonRoundTripStable:
      JSON.stringify(JSON.parse(JSON.stringify({ candidatePackage, validation }))).length > 0,
  };
};
