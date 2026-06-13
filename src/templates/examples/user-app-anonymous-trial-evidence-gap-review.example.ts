import {
  createUserAppAnonymousTrialEvidenceGapReview,
} from '../../user-app/userAppAnonymousTrialEvidenceGapReview';
import {
  userAppAnonymousTrialEvidenceReviewCompleteSafeExample,
  userAppAnonymousTrialEvidenceReviewForbiddenDataExample,
  userAppAnonymousTrialEvidenceReviewInsufficientSampleExample,
  userAppAnonymousTrialEvidenceReviewMissingPostLaunchHandoffExample,
  userAppAnonymousTrialEvidenceReviewMissingPrivacyClarityExample,
  userAppAnonymousTrialEvidenceReviewPrivacyIncidentExample,
  userAppAnonymousTrialEvidenceReviewWarningExample,
} from './user-app-anonymous-trial-evidence-review.example';

export const userAppAnonymousTrialEvidenceGapReviewClearExample =
  createUserAppAnonymousTrialEvidenceGapReview({
    evidenceReview: userAppAnonymousTrialEvidenceReviewCompleteSafeExample,
  });

export const userAppAnonymousTrialEvidenceGapReviewWarningExample =
  createUserAppAnonymousTrialEvidenceGapReview({
    evidenceReview: userAppAnonymousTrialEvidenceReviewWarningExample,
  });

export const userAppAnonymousTrialEvidenceGapReviewMissingPostLaunchHandoffExample =
  createUserAppAnonymousTrialEvidenceGapReview({
    evidenceReview: userAppAnonymousTrialEvidenceReviewMissingPostLaunchHandoffExample,
  });

export const userAppAnonymousTrialEvidenceGapReviewMissingPrivacyClarityExample =
  createUserAppAnonymousTrialEvidenceGapReview({
    evidenceReview: userAppAnonymousTrialEvidenceReviewMissingPrivacyClarityExample,
  });

export const userAppAnonymousTrialEvidenceGapReviewInsufficientSampleExample =
  createUserAppAnonymousTrialEvidenceGapReview({
    evidenceReview: userAppAnonymousTrialEvidenceReviewInsufficientSampleExample,
  });

export const userAppAnonymousTrialEvidenceGapReviewForbiddenDataExample =
  createUserAppAnonymousTrialEvidenceGapReview({
    evidenceReview: userAppAnonymousTrialEvidenceReviewForbiddenDataExample,
  });

export const userAppAnonymousTrialEvidenceGapReviewPrivacyIncidentExample =
  createUserAppAnonymousTrialEvidenceGapReview({
    evidenceReview: userAppAnonymousTrialEvidenceReviewPrivacyIncidentExample,
  });

export const userAppAnonymousTrialEvidenceGapReviewUnclearAdminNotesExample =
  createUserAppAnonymousTrialEvidenceGapReview({
    evidenceReview: userAppAnonymousTrialEvidenceReviewCompleteSafeExample,
    manualGapTypes: ['unclear_admin_notes'],
  });
