import {
  createDefaultPhotoToTemplateHumanReviewChecklist,
  createPhotoToTemplateDraftIntegrationReport,
  createPhotoToTemplateDraftPreviewQaReport,
  createPhotoToTemplateHumanReviewEditingSession,
  createPhotoToTemplateOperatorWorkflowReport,
  evaluateTemplateDraftQa,
} from '../../template-engine';
import type { MakeupSemanticExtractionReport } from '../../vision';
import {
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  ruleBasedStepSequenceReadyExample,
} from './makeup-attribute-candidates.example';
import { faceMeshRegionQaReadyExample } from './facemesh-region-qa.example';
import { makeupSemanticExtractionReadyExample } from './makeup-semantic-extraction.example';
import { photoToTemplateRealitySemanticIntegratedExample } from './photo-to-template-reality-check.example';

const sanitizeShadeCopy = (value: string): string =>
  value.replace(/色号/g, '颜色编号').replace(/\bshade\b/gi, 'color code');

const photoToTemplateOperatorSemanticReadyExample = {
  ...makeupSemanticExtractionReadyExample,
  candidates: Object.fromEntries(
    Object.entries(makeupSemanticExtractionReadyExample.candidates).map(([key, candidate]) => [
      key,
      {
        ...candidate,
        evidence: candidate.evidence.map((item) => ({
          ...item,
          notes: item.notes.map(sanitizeShadeCopy),
        })),
        limitations: candidate.limitations.map(sanitizeShadeCopy),
      },
    ]),
  ),
} as MakeupSemanticExtractionReport;

const photoToTemplateOperatorAttributeCandidatesReadyExample = {
  ...makeupAttributeCandidatesReadyExample,
  candidates: makeupAttributeCandidatesReadyExample.candidates.map((candidate) => ({
    ...candidate,
    confidence: Math.max(candidate.confidence, 0.72),
    evidence: candidate.evidence.map(sanitizeShadeCopy),
  })),
};

const photoToTemplateOperatorDraftIntegrationReadyExample =
  createPhotoToTemplateDraftIntegrationReport({
    semanticReport: photoToTemplateOperatorSemanticReadyExample,
    attributeCandidates: photoToTemplateOperatorAttributeCandidatesReadyExample,
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
        decision: 'accept_candidate',
        reviewerNote: '步骤顺序已进入 12D 演示草稿，后续仍需人工审核。',
      },
    },
  });

export const photoToTemplateOperatorHumanReviewReadyExample =
  createPhotoToTemplateHumanReviewEditingSession({
    integration: photoToTemplateOperatorDraftIntegrationReadyExample,
    checklist: createDefaultPhotoToTemplateHumanReviewChecklist(true),
    edits: photoToTemplateOperatorDraftIntegrationReadyExample.bindings.map((binding) => ({
      field: binding.field,
      decision: binding.field === 'title' || binding.field === 'stepSequence'
        ? 'edit_candidate'
        : 'accept_candidate',
      editedValue:
        binding.field === 'title'
          ? '柔和珊瑚日常妆草稿'
          : binding.field === 'stepSequence'
            ? '1. 准备工具并观察区域；2. 少量叠加眼部；3. 轻扫腮红；4. 完成唇部并人工复核。'
            : undefined,
      reviewerNote: '已人工审核进入草稿；仍不是最终模板、发布或 registry 写入。',
    })),
  });

export const photoToTemplateOperatorDraftQaReadyExample = evaluateTemplateDraftQa({
  regionQa: faceMeshRegionQaReadyExample,
  attributeCandidates: photoToTemplateOperatorAttributeCandidatesReadyExample,
  stepSequence: ruleBasedStepSequenceReadyExample,
  templateDraft: makeupTemplateDraftReadyExample,
  draftIntegration: photoToTemplateOperatorDraftIntegrationReadyExample,
});

export const photoToTemplateDraftPreviewQaReadyExample =
  createPhotoToTemplateDraftPreviewQaReport({
    integration: photoToTemplateOperatorDraftIntegrationReadyExample,
    humanReviewEditing: photoToTemplateOperatorHumanReviewReadyExample,
    draftQa: photoToTemplateOperatorDraftQaReadyExample,
  });

export const photoToTemplateDraftPreviewQaBlockedInternalTermsExample =
  createPhotoToTemplateDraftPreviewQaReport({
    integration: photoToTemplateOperatorDraftIntegrationReadyExample,
    humanReviewEditing: photoToTemplateOperatorHumanReviewReadyExample,
    draftQa: photoToTemplateOperatorDraftQaReadyExample,
    userVisibleOverrides: {
      title: 'sourceType confidenceBand reviewerNote registry publish production writer',
    },
  });

export const photoToTemplateDraftPreviewQaBlockedClaimsExample =
  createPhotoToTemplateDraftPreviewQaReport({
    integration: photoToTemplateOperatorDraftIntegrationReadyExample,
    humanReviewEditing: photoToTemplateOperatorHumanReviewReadyExample,
    draftQa: photoToTemplateOperatorDraftQaReadyExample,
    userVisibleOverrides: {
      summary: 'AI 已确认 fully automatic extraction Dior shade #001 medical diagnosis',
    },
  });

export const photoToTemplateOperatorWorkflowReadyExample =
  createPhotoToTemplateOperatorWorkflowReport({
    regionQa: faceMeshRegionQaReadyExample,
    realityReport: photoToTemplateRealitySemanticIntegratedExample,
    semanticReport: photoToTemplateOperatorSemanticReadyExample,
    draftIntegration: photoToTemplateOperatorDraftIntegrationReadyExample,
    humanReviewEditing: photoToTemplateOperatorHumanReviewReadyExample,
    draftQa: photoToTemplateOperatorDraftQaReadyExample,
    draftPreviewQa: photoToTemplateDraftPreviewQaReadyExample,
  });

export const photoToTemplateOperatorWorkflowBlockedByPreviewExample =
  createPhotoToTemplateOperatorWorkflowReport({
    regionQa: faceMeshRegionQaReadyExample,
    realityReport: photoToTemplateRealitySemanticIntegratedExample,
    semanticReport: photoToTemplateOperatorSemanticReadyExample,
    draftIntegration: photoToTemplateOperatorDraftIntegrationReadyExample,
    humanReviewEditing: photoToTemplateOperatorHumanReviewReadyExample,
    draftQa: photoToTemplateOperatorDraftQaReadyExample,
    draftPreviewQa: photoToTemplateDraftPreviewQaBlockedInternalTermsExample,
  });
