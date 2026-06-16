import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplateDraftReviewWorkflowPanel } from '../src/components/template-studio/TemplateDraftReviewWorkflowPanel';
import { buildTemplateStudioWorkflowState } from '../src/template-engine';
import {
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  ruleBasedStepSequenceReadyExample,
  templateDraftHumanReviewApprovedCandidateExample,
  templateDraftHumanReviewRequiredExample,
  templateDraftQaReadyExample,
  templateDraftReviewWorkflowApprovedCandidateExample,
  templateDraftReviewWorkflowReadyExample,
} from '../src/templates/examples';

const renderPanel = (approved = false) => {
  const humanReview = approved
    ? templateDraftHumanReviewApprovedCandidateExample
    : templateDraftHumanReviewRequiredExample;
  const reviewWorkflow = approved
    ? templateDraftReviewWorkflowApprovedCandidateExample
    : templateDraftReviewWorkflowReadyExample;
  const studioWorkflow = buildTemplateStudioWorkflowState({
    regionQa: faceMeshRegionQaReadyExample,
    attributeCandidates: makeupAttributeCandidatesReadyExample,
    stepSequence: ruleBasedStepSequenceReadyExample,
    templateDraft: makeupTemplateDraftReadyExample,
    draftQa: templateDraftQaReadyExample,
    humanReview,
    reviewWorkflow,
  });

  return renderToStaticMarkup(
    <TemplateDraftReviewWorkflowPanel
      draftQa={templateDraftQaReadyExample}
      humanReview={humanReview}
      reviewWorkflow={reviewWorkflow}
      studioWorkflow={studioWorkflow}
    />,
  );
};

describe('TemplateDraftReviewWorkflowPanel', () => {
  it('renders draft QA, human review checklist, and candidate handoff', () => {
    const html = renderPanel();

    expect(html).toContain('模板草稿审核工作流');
    expect(html).toContain('草稿 QA');
    expect(html).toContain('人工审核 checklist');
    expect(html).toContain('候选入库 handoff');
    expect(html).toContain('请求修改');
    expect(html).toContain('不会自动生成 UserAppTemplatePackage');
    expect(html).toContain('草稿可进入人工审核，但不能发布。');
  });

  it('shows approval as a library candidate only', () => {
    const html = renderPanel(true);

    expect(html).toContain('已作为模板库候选');
    expect(html).toContain('不是发布模板');
    expect(html).not.toContain('自动发布成功');
    expect(html).not.toContain('已生成正式用户模板包');
  });
});
