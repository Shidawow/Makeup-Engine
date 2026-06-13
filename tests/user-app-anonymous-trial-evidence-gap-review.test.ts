import { describe, expect, it } from 'vitest';
import { createUserAppAnonymousTrialEvidenceGapReview } from '../src/user-app/userAppAnonymousTrialEvidenceGapReview';
import { createUserAppAnonymousTrialEvidenceReview } from '../src/user-app/userAppAnonymousTrialEvidenceReview';
import {
  userAppAnonymousTrialEvidenceGapReviewClearExample,
  userAppAnonymousTrialEvidenceGapReviewForbiddenDataExample,
  userAppAnonymousTrialEvidenceGapReviewInsufficientSampleExample,
  userAppAnonymousTrialEvidenceGapReviewMissingPostLaunchHandoffExample,
  userAppAnonymousTrialEvidenceGapReviewMissingPrivacyClarityExample,
  userAppAnonymousTrialEvidenceGapReviewPrivacyIncidentExample,
  userAppAnonymousTrialEvidenceGapReviewUnclearAdminNotesExample,
} from '../src/templates/examples';

describe('User App anonymous internal trial evidence gap review', () => {
  it('marks complete gap review clear', () => {
    expect(userAppAnonymousTrialEvidenceGapReviewClearExample.status).toBe(
      'gap_review_clear',
    );
    expect(userAppAnonymousTrialEvidenceGapReviewClearExample.gaps).toHaveLength(0);
  });

  it('classifies gap severity low, medium, high, and critical', () => {
    const lowGapReview = createUserAppAnonymousTrialEvidenceGapReview({
      evidenceReview: createUserAppAnonymousTrialEvidenceReview({
        source: 'anonymous_internal_trial_summary',
        sampleSize: 3,
        missingDimensions: ['task_completion_evidence'],
      }),
    });
    expect(
      lowGapReview.gaps.find((gap) => gap.type === 'missing_task_completion_evidence')
        ?.severity,
    ).toBe('low');
    expect(
      userAppAnonymousTrialEvidenceGapReviewMissingPrivacyClarityExample.gaps.find(
        (gap) => gap.type === 'missing_privacy_clarity_evidence',
      )?.severity,
    ).toBe('medium');
    expect(
      userAppAnonymousTrialEvidenceGapReviewMissingPostLaunchHandoffExample.gaps.find(
        (gap) => gap.type === 'missing_post_launch_handoff',
      )?.severity,
    ).toBe('high');
    expect(
      userAppAnonymousTrialEvidenceGapReviewForbiddenDataExample.gaps.find(
        (gap) => gap.type === 'over_collected_forbidden_data',
      )?.severity,
    ).toBe('critical');
    expect(
      userAppAnonymousTrialEvidenceGapReviewUnclearAdminNotesExample.gaps.find(
        (gap) => gap.type === 'unclear_admin_notes',
      )?.severity,
    ).toBe('medium');
  });

  it('blocks MVP validation planning for insufficient samples and privacy incidents', () => {
    expect(
      userAppAnonymousTrialEvidenceGapReviewInsufficientSampleExample.gaps.find(
        (gap) => gap.type === 'insufficient_sample_size',
      )?.blocksMvpValidationPlanning,
    ).toBe(true);
    expect(userAppAnonymousTrialEvidenceGapReviewPrivacyIncidentExample.status).toBe(
      'gap_review_blocked',
    );
  });
});
