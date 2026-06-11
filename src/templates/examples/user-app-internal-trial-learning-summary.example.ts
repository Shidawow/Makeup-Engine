import {
  createUserAppInternalTrialLearningSummary,
  type UserAppInternalTrialLearningSummary,
} from '../../user-app/userAppInternalTrialLearningSummary';
import { createUserAppTrialResultReview } from '../../user-app/userAppTrialResultReview';
import {
  userAppTrialIterationPlanContentHeavyExample,
  userAppTrialIterationPlanPrivacyBlockerExample,
  userAppTrialIterationPlanReadyForNextInternalTrialExample,
  userAppTrialIterationPlanShellHeavyExample,
} from './user-app-trial-iteration-plan.example';
import {
  userAppTrialResultReviewContentHeavyExample,
  userAppTrialResultReviewInsufficientSignalsExample,
  userAppTrialResultReviewPrivacyBoundaryExample,
  userAppTrialResultReviewShellHeavyExample,
} from './user-app-trial-result-review.example';

export const userAppInternalTrialLearningSummaryStrongValueExample: UserAppInternalTrialLearningSummary =
  createUserAppInternalTrialLearningSummary({
    summaryId: 'learning-summary-strong-value',
    iterationPlan: userAppTrialIterationPlanReadyForNextInternalTrialExample,
  });

export const userAppInternalTrialLearningSummaryContentIssueExample: UserAppInternalTrialLearningSummary =
  createUserAppInternalTrialLearningSummary({
    summaryId: 'learning-summary-content-issue',
    resultReview: userAppTrialResultReviewContentHeavyExample,
    iterationPlan: userAppTrialIterationPlanContentHeavyExample,
  });

export const userAppInternalTrialLearningSummaryShellIssueExample: UserAppInternalTrialLearningSummary =
  createUserAppInternalTrialLearningSummary({
    summaryId: 'learning-summary-shell-issue',
    resultReview: userAppTrialResultReviewShellHeavyExample,
    iterationPlan: userAppTrialIterationPlanShellHeavyExample,
  });

export const userAppInternalTrialLearningSummaryTrialOpsIssueExample: UserAppInternalTrialLearningSummary =
  createUserAppInternalTrialLearningSummary({
    summaryId: 'learning-summary-trial-ops-issue',
    resultReview: createUserAppTrialResultReview({
      reviewId: 'trial-result-review-trial-ops-heavy',
      signals: [
        {
          signalId: 'trial-ops-script-order',
          dimension: 'trial_operation_quality',
          label: '试用脚本顺序',
          score: 2,
          summary: '主持人脚本让参与者先看管理员区域，导致路径混乱。',
          evidenceCount: 3,
          mockOnly: true,
          containsPersonalData: false,
        },
        {
          signalId: 'trial-ops-observation-template',
          dimension: 'trial_operation_quality',
          label: '观察模板',
          score: 2,
          summary: '观察记录没有区分内容问题和 Shell 问题。',
          evidenceCount: 3,
          mockOnly: true,
          containsPersonalData: false,
        },
      ],
    }),
  });

export const userAppInternalTrialLearningSummaryPrivacyBlockerExample: UserAppInternalTrialLearningSummary =
  createUserAppInternalTrialLearningSummary({
    summaryId: 'learning-summary-privacy-blocker',
    resultReview: userAppTrialResultReviewPrivacyBoundaryExample,
    iterationPlan: userAppTrialIterationPlanPrivacyBlockerExample,
  });

export const userAppInternalTrialLearningSummaryInsufficientSignalsExample: UserAppInternalTrialLearningSummary =
  createUserAppInternalTrialLearningSummary({
    summaryId: 'learning-summary-insufficient-signals',
    resultReview: userAppTrialResultReviewInsufficientSignalsExample,
    minimumSignals: 8,
  });
