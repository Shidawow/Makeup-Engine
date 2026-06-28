import {
  createDefaultPhotoToTemplateHumanReviewChecklist,
  createPhotoToTemplateDraftIntegrationReport,
  createPhotoToTemplateHumanReviewEditingSession,
} from '../../template-engine';
import {
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  ruleBasedStepSequenceReadyExample,
} from './makeup-attribute-candidates.example';
import {
  makeupSemanticExtractionBlockedExample,
  makeupSemanticExtractionInsufficientExample,
  makeupSemanticExtractionReadyExample,
} from './makeup-semantic-extraction.example';

export const photoToTemplateDraftIntegrationReadyExample =
  createPhotoToTemplateDraftIntegrationReport({
    semanticReport: makeupSemanticExtractionReadyExample,
    attributeCandidates: makeupAttributeCandidatesReadyExample,
    stepSequence: ruleBasedStepSequenceReadyExample,
    templateDraft: makeupTemplateDraftReadyExample,
    reviewerDecisions: {
      title: {
        decision: 'edit_candidate',
        editableDraftValue: '柔和珊瑚日常妆草稿',
        reviewerNote: '标题使用自然用户文案，但仍是草稿。',
      },
      summary: {
        decision: 'accept_candidate',
        reviewerNote: '摘要候选可以进入草稿，后续还要审核语气。',
      },
      stepSequence: {
        decision: 'require_more_review',
        reviewerNote: '步骤顺序需要人工确认后再进入 draft QA。',
      },
    },
  });

export const photoToTemplateDraftIntegrationInsufficientExample =
  createPhotoToTemplateDraftIntegrationReport({
    semanticReport: makeupSemanticExtractionInsufficientExample,
    attributeCandidates: makeupAttributeCandidatesReadyExample,
    stepSequence: ruleBasedStepSequenceReadyExample,
    templateDraft: makeupTemplateDraftReadyExample,
  });

export const photoToTemplateDraftIntegrationBlockedExample =
  createPhotoToTemplateDraftIntegrationReport({
    semanticReport: makeupSemanticExtractionBlockedExample,
    attributeCandidates: makeupAttributeCandidatesReadyExample,
    stepSequence: ruleBasedStepSequenceReadyExample,
    templateDraft: null,
  });

export const photoToTemplateHumanReviewEditingReadyExample =
  createPhotoToTemplateHumanReviewEditingSession({
    integration: photoToTemplateDraftIntegrationReadyExample,
    checklist: createDefaultPhotoToTemplateHumanReviewChecklist(true),
    edits: [
      {
        field: 'title',
        decision: 'edit_candidate',
        editedValue: '柔和珊瑚日常妆草稿',
        reviewerNote: '保留原始候选，编辑为用户可读草稿标题。',
      },
      {
        field: 'summary',
        decision: 'accept_candidate',
        reviewerNote: '接受进入草稿，不代表定稿或发布。',
      },
      {
        field: 'toolList',
        decision: 'accept_candidate',
        reviewerNote: '工具仍是类别建议，不含品牌或具体颜色编号。',
      },
      {
        field: 'stepSequence',
        decision: 'edit_candidate',
        editedValue: '1. 准备底妆区域；2. 轻扫眼部；3. 少量叠加唇部；4. 审核者确认区域说明。',
        reviewerNote: '步骤从语义候选改写为可读草稿，仍需 draft QA。',
      },
    ],
  });

export const photoToTemplateHumanReviewEditingBlockedExample =
  createPhotoToTemplateHumanReviewEditingSession({
    integration: photoToTemplateDraftIntegrationReadyExample,
    checklist: createDefaultPhotoToTemplateHumanReviewChecklist(true),
    edits: [
      {
        field: 'title',
        decision: 'block_template_draft',
        editedValue: 'AI 已确认正式模板',
        reviewerNote: 'unsafe final/AI wording fixture',
      },
    ],
  });
