import {
  createUserAppTrialDecisionFramework,
  type UserAppTrialDecisionFramework,
} from '../../user-app/userAppTrialDecisionFramework';
import {
  createDefaultUserAppTrialResultSignals,
  createUserAppTrialResultReview,
} from '../../user-app/userAppTrialResultReview';
import {
  userAppTrialResultReviewContentHeavyExample,
  userAppTrialResultReviewInsufficientSignalsExample,
  userAppTrialResultReviewPrivacyBoundaryExample,
  userAppTrialResultReviewReadyFor9CExample,
  userAppTrialResultReviewShellHeavyExample,
} from './user-app-trial-result-review.example';

export const userAppTrialDecisionContinueExample: UserAppTrialDecisionFramework =
  createUserAppTrialDecisionFramework({
    frameworkId: 'trial-decision-continue',
  });

export const userAppTrialDecisionReviseContentExample: UserAppTrialDecisionFramework =
  createUserAppTrialDecisionFramework({
    frameworkId: 'trial-decision-revise-content',
    review: userAppTrialResultReviewContentHeavyExample,
  });

export const userAppTrialDecisionReviseShellExample: UserAppTrialDecisionFramework =
  createUserAppTrialDecisionFramework({
    frameworkId: 'trial-decision-revise-shell',
    review: userAppTrialResultReviewShellHeavyExample,
  });

export const userAppTrialDecisionReviseTrialPackExample: UserAppTrialDecisionFramework =
  createUserAppTrialDecisionFramework({
    frameworkId: 'trial-decision-revise-trial-pack',
    review: createUserAppTrialResultReview({
      reviewId: 'trial-result-review-trial-ops-heavy',
      signals: createDefaultUserAppTrialResultSignals().map((signal) =>
        signal.signalId === 'trial-operation-quality'
          ? {
              ...signal,
              score: 2,
              summary: '试用脚本说明不清，主持人需要临场解释。',
            }
          : signal.signalId === 'confusion-points'
            ? {
                ...signal,
                dimension: 'trial_operation_quality',
                score: 2,
                summary: '观察模板无法区分内容问题和 Shell 问题。',
              }
            : signal,
      ),
    }),
  });

export const userAppTrialDecisionPauseExample: UserAppTrialDecisionFramework =
  createUserAppTrialDecisionFramework({
    frameworkId: 'trial-decision-pause',
    review: userAppTrialResultReviewPrivacyBoundaryExample,
  });

export const userAppTrialDecisionInsufficientSignalsExample: UserAppTrialDecisionFramework =
  createUserAppTrialDecisionFramework({
    frameworkId: 'trial-decision-insufficient-signals',
    review: userAppTrialResultReviewInsufficientSignalsExample,
  });

export const userAppTrialDecisionReadyFor9CExample: UserAppTrialDecisionFramework =
  createUserAppTrialDecisionFramework({
    frameworkId: 'trial-decision-ready-9c',
    readyForPhase9C: true,
    review: userAppTrialResultReviewReadyFor9CExample,
  });
