import { describe, expect, it } from 'vitest';
import { buildTemplateStudioWorkflowState } from '../src/template-engine';
import {
  faceMeshRegionQaBlockedExample,
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

describe('template studio workflow IA', () => {
  it('routes blocked region QA back to the Vision Analysis tab', () => {
    const workflow = buildTemplateStudioWorkflowState({
      regionQa: faceMeshRegionQaBlockedExample,
    });

    expect(workflow.state).toBe('region_qa_blocked');
    expect(workflow.nextAction.ownerTab).toBe('vision_analysis');
    expect(workflow.nextAction.message).toContain('回到视觉分析 Tab');
  });

  it('routes ready region QA into the template workbench', () => {
    const workflow = buildTemplateStudioWorkflowState({
      regionQa: faceMeshRegionQaReadyExample,
    });

    expect(workflow.state).toBe('region_qa_ready');
    expect(workflow.nextAction.ownerTab).toBe('template_workbench');
    expect(workflow.nextAction.message).toContain('可以进入模板工作台');
  });

  it('shows the full workflow through human review and candidate handoff', () => {
    const workflow = buildTemplateStudioWorkflowState({
      regionQa: faceMeshRegionQaReadyExample,
      attributeCandidates: makeupAttributeCandidatesReadyExample,
      stepSequence: ruleBasedStepSequenceReadyExample,
      templateDraft: makeupTemplateDraftReadyExample,
      draftQa: templateDraftQaReadyExample,
      humanReview: templateDraftHumanReviewRequiredExample,
      reviewWorkflow: templateDraftReviewWorkflowReadyExample,
    });

    expect(workflow.steps.map((step) => step.label)).toEqual([
      '图片分析',
      '区域 QA',
      '属性候选',
      '步骤草稿',
      '模板草稿',
      '草稿 QA',
      '人工审核',
      '候选入库 handoff',
    ]);
    expect(workflow.nextAction.message).toContain('人工审核 checklist');
  });

  it('marks approved handoff as a candidate, not a publish event', () => {
    const workflow = buildTemplateStudioWorkflowState({
      regionQa: faceMeshRegionQaReadyExample,
      attributeCandidates: makeupAttributeCandidatesReadyExample,
      stepSequence: ruleBasedStepSequenceReadyExample,
      templateDraft: makeupTemplateDraftReadyExample,
      draftQa: templateDraftQaReadyExample,
      humanReview: templateDraftHumanReviewApprovedCandidateExample,
      reviewWorkflow: templateDraftReviewWorkflowApprovedCandidateExample,
    });

    expect(workflow.state).toBe('candidate_handoff_ready');
    expect(workflow.steps.at(-1)?.status).toBe('approved_candidate');
    expect(workflow.nextAction.message).toBe('已作为模板库候选。');
  });
});
