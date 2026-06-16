import { describe, expect, it } from 'vitest';
import { createTemplateDraftReviewWorkflow } from '../src/template-engine';
import {
  templateDraftHumanReviewApprovedCandidateExample,
  templateDraftHumanReviewRequiredExample,
  templateDraftQaReadyExample,
  templateDraftReviewWorkflowApprovedCandidateExample,
  templateDraftReviewWorkflowPrivacyBlockedExample,
  templateDraftReviewWorkflowQaBlockedExample,
  templateDraftReviewWorkflowReadyExample,
} from '../src/templates/examples';

describe('template draft review workflow', () => {
  it('queues QA-ready drafts for human review', () => {
    expect(templateDraftReviewWorkflowReadyExample.queueItem.status).toBe(
      'ready_for_human_review',
    );
    expect(templateDraftReviewWorkflowReadyExample.queueItem.nextAction).toContain(
      '草稿可进入人工审核',
    );
  });

  it('prioritizes blocked QA and privacy risks', () => {
    expect(templateDraftReviewWorkflowQaBlockedExample.queueItem.status).toBe('qa_blocked');
    expect(templateDraftReviewWorkflowPrivacyBlockedExample.queueItem.status).toBe('blocked');
    expect(templateDraftReviewWorkflowPrivacyBlockedExample.queueItem.priority).toBe(
      'p0_privacy_blocker',
    );
  });

  it('marks approved drafts as library candidates only', () => {
    expect(templateDraftReviewWorkflowApprovedCandidateExample.queueItem.status).toBe(
      'approved_as_library_candidate',
    );
    expect(templateDraftReviewWorkflowApprovedCandidateExample.candidateHandoff.ready).toBe(true);
    expect(templateDraftReviewWorkflowApprovedCandidateExample.publishBlocked).toBe(true);
    expect(
      templateDraftReviewWorkflowApprovedCandidateExample.userAppTemplatePackageGenerationBlocked,
    ).toBe(true);
  });

  it('round-trips workflow JSON in a stable form', () => {
    const workflow = createTemplateDraftReviewWorkflow({
      qa: templateDraftQaReadyExample,
      review: templateDraftHumanReviewRequiredExample,
    });
    const roundTrip = JSON.parse(JSON.stringify(workflow));

    expect(roundTrip).toEqual(workflow);
    expect(JSON.stringify(roundTrip)).not.toContain('data:image');
    expect(JSON.stringify(roundTrip)).not.toContain('faceEmbedding');
  });

  it('does not treat approval as package generation', () => {
    const workflow = createTemplateDraftReviewWorkflow({
      qa: templateDraftQaReadyExample,
      review: templateDraftHumanReviewApprovedCandidateExample,
    });

    expect(workflow.candidateHandoff.label).toBe('已作为模板库候选');
    expect(workflow.candidateHandoff.userAppTemplatePackageGenerationBlocked).toBe(true);
  });
});
