import {
  createDefaultTemplateDraftHumanReviewChecklist,
  evaluateTemplateDraftHumanReview,
} from '../../template-engine';
import {
  templateDraftQaReadyExample,
  templateDraftQaRegionBlockedExample,
} from './template-draft-qa.example';

export const templateDraftHumanReviewRequiredExample =
  evaluateTemplateDraftHumanReview({
    qa: templateDraftQaReadyExample,
  });

export const templateDraftHumanReviewApprovedCandidateExample =
  evaluateTemplateDraftHumanReview({
    qa: templateDraftQaReadyExample,
    decision: 'approve_for_template_library_candidate',
    checklist: createDefaultTemplateDraftHumanReviewChecklist(true),
    comments: [
      {
        id: 'candidate-note',
        message: '匿名示例：步骤文案已复核，可作为模板库候选。',
        visibility: 'handoff_summary',
      },
    ],
  });

export const templateDraftHumanReviewQaBlockedExample =
  evaluateTemplateDraftHumanReview({
    qa: templateDraftQaRegionBlockedExample,
    decision: 'approve_for_template_library_candidate',
    checklist: createDefaultTemplateDraftHumanReviewChecklist(true),
  });

export const templateDraftHumanReviewPrivacyBlockedExample =
  evaluateTemplateDraftHumanReview({
    qa: templateDraftQaReadyExample,
    decision: 'block_for_privacy_or_scope',
    comments: [
      {
        id: 'unsafe-comment',
        message: '示例阻断：评论中不得要求上传照片或联系方式。',
        visibility: 'admin_only',
      },
    ],
  });
