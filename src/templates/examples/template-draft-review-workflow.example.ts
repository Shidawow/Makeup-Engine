import { createTemplateDraftReviewWorkflow } from '../../template-engine';
import {
  templateDraftHumanReviewApprovedCandidateExample,
  templateDraftHumanReviewPrivacyBlockedExample,
  templateDraftHumanReviewQaBlockedExample,
  templateDraftHumanReviewRequiredExample,
} from './template-draft-human-review.example';
import {
  templateDraftQaReadyExample,
  templateDraftQaRegionBlockedExample,
} from './template-draft-qa.example';

export const templateDraftReviewWorkflowReadyExample =
  createTemplateDraftReviewWorkflow({
    qa: templateDraftQaReadyExample,
    review: templateDraftHumanReviewRequiredExample,
  });

export const templateDraftReviewWorkflowApprovedCandidateExample =
  createTemplateDraftReviewWorkflow({
    qa: templateDraftQaReadyExample,
    review: templateDraftHumanReviewApprovedCandidateExample,
  });

export const templateDraftReviewWorkflowQaBlockedExample =
  createTemplateDraftReviewWorkflow({
    qa: templateDraftQaRegionBlockedExample,
    review: templateDraftHumanReviewQaBlockedExample,
  });

export const templateDraftReviewWorkflowPrivacyBlockedExample =
  createTemplateDraftReviewWorkflow({
    qa: templateDraftQaReadyExample,
    review: templateDraftHumanReviewPrivacyBlockedExample,
  });
