import {
  createUserAppTrialOutcomeReview,
  type UserAppTrialOutcomeReview,
} from '../../user-app/userAppTrialOutcome';

export const userAppTrialOutcomeContinueExample: UserAppTrialOutcomeReview =
  createUserAppTrialOutcomeReview({
    reviewId: 'trial-outcome-continue',
    participantSessionsReviewed: 1,
  });

export const userAppTrialOutcomeReviseContentExample: UserAppTrialOutcomeReview =
  createUserAppTrialOutcomeReview({
    reviewId: 'trial-outcome-revise-content',
    contentClarityScore: 2,
    contentIssues: ['步骤 2 的晕染区域说明不够清楚'],
  });

export const userAppTrialOutcomeReviseShellExample: UserAppTrialOutcomeReview =
  createUserAppTrialOutcomeReview({
    reviewId: 'trial-outcome-revise-shell',
    shellUsabilityScore: 2,
    shellIssues: ['参与者找不到推荐模板入口'],
  });

export const userAppTrialOutcomeBlockExample: UserAppTrialOutcomeReview =
  createUserAppTrialOutcomeReview({
    reviewId: 'trial-outcome-block-privacy',
    privacyOrScopeIssue: true,
    privacyTrustScore: 1,
  });

export const userAppTrialOutcomeReadyFor9BExample: UserAppTrialOutcomeReview =
  createUserAppTrialOutcomeReview({
    reviewId: 'trial-outcome-ready-9b',
    participantSessionsReviewed: 3,
    readyForPhase9B: true,
  });
