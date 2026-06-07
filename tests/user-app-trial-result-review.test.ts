import { describe, expect, it } from 'vitest';
import { createUserAppTrialResultReview } from '../src/user-app';
import {
  userAppTrialResultReviewCleanExample,
  userAppTrialResultReviewContentHeavyExample,
  userAppTrialResultReviewInsufficientSignalsExample,
  userAppTrialResultReviewPrivacyBoundaryExample,
  userAppTrialResultReviewReadyFor9CExample,
  userAppTrialResultReviewShellHeavyExample,
} from '../src/templates/examples';

describe('User App trial result review framework', () => {
  it('creates a ready anonymous local-only review', () => {
    expect(userAppTrialResultReviewCleanExample.schemaVersion).toBe(
      'user-app-trial-result-review-v0.1',
    );
    expect(userAppTrialResultReviewCleanExample.status).toBe('review_ready');
    expect(userAppTrialResultReviewCleanExample.signals).toHaveLength(10);
    expect(userAppTrialResultReviewCleanExample.localOnly).toBe(true);
    expect(userAppTrialResultReviewCleanExample.mockOnly).toBe(true);
    expect(userAppTrialResultReviewCleanExample.anonymousOrExampleOnly).toBe(true);
    expect(userAppTrialResultReviewCleanExample.backendRecordSystem).toBe(false);
    expect(userAppTrialResultReviewCleanExample.usesAiAnalysis).toBe(false);
    expect(userAppTrialResultReviewCleanExample.writesTrainingInput).toBe(false);
  });

  it('surfaces content and shell warnings from mock signals', () => {
    expect(userAppTrialResultReviewContentHeavyExample.status).toBe(
      'review_ready_with_warnings',
    );
    expect(
      userAppTrialResultReviewContentHeavyExample.issueSummary.categoryCounts.content_issue,
    ).toBe(1);
    expect(
      userAppTrialResultReviewContentHeavyExample.issueSummary.categoryCounts
        .guidance_clarity_issue,
    ).toBe(1);

    expect(userAppTrialResultReviewShellHeavyExample.status).toBe(
      'review_ready_with_warnings',
    );
    expect(
      userAppTrialResultReviewShellHeavyExample.issueSummary.categoryCounts
        .shell_usability_issue,
    ).toBe(2);
  });

  it('blocks unsafe review input without storing real records', () => {
    expect(userAppTrialResultReviewPrivacyBoundaryExample.status).toBe('review_blocked');
    expect(userAppTrialResultReviewPrivacyBoundaryExample.collectsContact).toBe(true);
    expect(userAppTrialResultReviewPrivacyBoundaryExample.collectsPhotos).toBe(true);
    expect(userAppTrialResultReviewPrivacyBoundaryExample.containsRealParticipantRecords).toBe(
      false,
    );
    expect(userAppTrialResultReviewPrivacyBoundaryExample.issueSummary.status).toBe(
      'summary_blocked',
    );
  });

  it('warns when signals are insufficient and can mark ready-for-9C examples', () => {
    expect(userAppTrialResultReviewInsufficientSignalsExample.status).toBe(
      'review_ready_with_warnings',
    );
    expect(userAppTrialResultReviewInsufficientSignalsExample.resultSummary.reviewedSignals).toBe(
      3,
    );

    expect(userAppTrialResultReviewReadyFor9CExample.status).toBe('review_ready');
    expect(userAppTrialResultReviewReadyFor9CExample.recommendations[0].priority).toBe(
      'phase_9c',
    );
  });

  it('blocks backend record systems, AI analysis, training writes, and project-state user records', () => {
    const review = createUserAppTrialResultReview({
      usesBackendRecordSystem: true,
      usesAiAnalysis: true,
      writesTrainingInput: true,
      writesProjectStateUserRecords: true,
      collectsHealthInfo: true,
      collectsSensitiveIdentity: true,
    });

    expect(review.status).toBe('review_blocked');
    expect(review.issueSummary.issues[0].category).toBe('blocked_boundary_issue');
    expect(review.backendRecordSystem).toBe(false);
    expect(review.usesAiAnalysis).toBe(false);
    expect(review.writesTrainingInput).toBe(true);
    expect(review.writesProjectStateUserRecords).toBe(true);
  });
});
