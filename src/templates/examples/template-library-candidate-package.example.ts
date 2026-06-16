import { createTemplateLibraryCandidatePackage } from '../../template-engine';
import {
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  ruleBasedStepSequenceReadyExample,
} from './makeup-attribute-candidates.example';
import {
  templateDraftHumanReviewApprovedCandidateExample,
  templateDraftHumanReviewRequiredExample,
  templateDraftHumanReviewQaBlockedExample,
} from './template-draft-human-review.example';
import {
  templateDraftQaReadyExample,
  templateDraftQaRegionBlockedExample,
} from './template-draft-qa.example';
import {
  templateDraftReviewWorkflowApprovedCandidateExample,
  templateDraftReviewWorkflowQaBlockedExample,
  templateDraftReviewWorkflowReadyExample,
} from './template-draft-review-workflow.example';

const baseInput = {
  attributeCandidates: makeupAttributeCandidatesReadyExample,
  stepSequence: ruleBasedStepSequenceReadyExample,
  templateDraft: makeupTemplateDraftReadyExample,
  draftQa: templateDraftQaReadyExample,
  humanReview: templateDraftHumanReviewApprovedCandidateExample,
  reviewWorkflow: templateDraftReviewWorkflowApprovedCandidateExample,
};

export const templateLibraryCandidatePackageReadyExample =
  createTemplateLibraryCandidatePackage(baseInput);

export const templateLibraryCandidatePackageWarningExample =
  createTemplateLibraryCandidatePackage({
    ...baseInput,
    draftQa: {
      ...templateDraftQaReadyExample,
      status: 'draft_qa_ready_with_warnings',
      issues: [
        {
          id: 'copy_polish_warning',
          checkId: 'no_final_claims',
          severity: 'warning',
          message: '示例：文案还需要人工润色。',
          recommendation: '候选库复核前做 copy polish。',
        },
      ],
    },
  });

export const templateLibraryCandidatePackageMissingHumanReviewExample =
  createTemplateLibraryCandidatePackage({
    ...baseInput,
    humanReview: templateDraftHumanReviewRequiredExample,
    reviewWorkflow: templateDraftReviewWorkflowReadyExample,
  });

export const templateLibraryCandidatePackageQaBlockedExample =
  createTemplateLibraryCandidatePackage({
    ...baseInput,
    draftQa: templateDraftQaRegionBlockedExample,
    humanReview: templateDraftHumanReviewQaBlockedExample,
    reviewWorkflow: templateDraftReviewWorkflowQaBlockedExample,
  });

export const templateLibraryCandidatePackageRawImageBlockedExample =
  createTemplateLibraryCandidatePackage({
    ...baseInput,
    templateDraft: {
      ...makeupTemplateDraftReadyExample,
      notes: [
        ...(makeupTemplateDraftReadyExample.notes ?? []),
        'Unsafe example: data:image/png;base64,AAAA must be blocked.',
      ],
    },
  });

export const templateLibraryCandidatePackageUserAppMutationBlockedExample =
  createTemplateLibraryCandidatePackage({
    ...baseInput,
    templateDraft: {
      ...makeupTemplateDraftReadyExample,
      notes: [
        ...(makeupTemplateDraftReadyExample.notes ?? []),
        'Unsafe example: generatedUserAppTemplatePackage should be blocked.',
      ],
    },
  });

export const templateLibraryCandidatePackageExampleOnlyExample =
  createTemplateLibraryCandidatePackage({
    ...baseInput,
    humanReview: {
      ...templateDraftHumanReviewApprovedCandidateExample,
      status: 'example_only',
      decision: 'keep_as_example_only',
      approvedAsTemplateLibraryCandidate: false,
    },
  });
