import { describe, expect, it } from 'vitest';
import {
  createDefaultTemplateDraftHumanReviewChecklist,
  evaluateTemplateDraftHumanReview,
} from '../src/template-engine';
import {
  templateDraftHumanReviewApprovedCandidateExample,
  templateDraftHumanReviewPrivacyBlockedExample,
  templateDraftQaReadyExample,
  templateDraftQaRegionBlockedExample,
} from '../src/templates/examples';

describe('template draft human review', () => {
  it('does not approve without a human reviewer decision', () => {
    const review = evaluateTemplateDraftHumanReview({ qa: templateDraftQaReadyExample });

    expect(review.status).toBe('human_review_required');
    expect(review.approvedAsTemplateLibraryCandidate).toBe(false);
    expect(review.issues.map((issue) => issue.id)).toContain('missing_review_decision');
  });

  it('does not approve when QA is blocked', () => {
    const review = evaluateTemplateDraftHumanReview({
      qa: templateDraftQaRegionBlockedExample,
      decision: 'approve_for_template_library_candidate',
      checklist: createDefaultTemplateDraftHumanReviewChecklist(true),
    });

    expect(review.status).toBe('blocked');
    expect(review.approvedAsTemplateLibraryCandidate).toBe(false);
  });

  it('blocks privacy and scope risks', () => {
    expect(templateDraftHumanReviewPrivacyBlockedExample.status).toBe('blocked');
    expect(templateDraftHumanReviewPrivacyBlockedExample.issues.map((issue) => issue.id)).toContain(
      'privacy_scope_block',
    );
  });

  it('approves only as a template library candidate', () => {
    expect(templateDraftHumanReviewApprovedCandidateExample.status).toBe(
      'approved_as_template_library_candidate',
    );
    expect(templateDraftHumanReviewApprovedCandidateExample.approvedAsTemplateLibraryCandidate).toBe(
      true,
    );
    expect(templateDraftHumanReviewApprovedCandidateExample.publishBlocked).toBe(true);
    expect(
      templateDraftHumanReviewApprovedCandidateExample.userAppTemplatePackageGenerationBlocked,
    ).toBe(true);
    expect(templateDraftHumanReviewApprovedCandidateExample.notes.join('\n')).toContain(
      'template library candidate only',
    );
  });
});
