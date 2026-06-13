import {
  createUserAppAnonymousTrialDecisionInput,
  type UserAppAnonymousTrialDecisionSignal,
} from '../../user-app/userAppAnonymousTrialDecisionInput';
import { createUserAppAnonymousTrialEvidenceGapReview } from '../../user-app/userAppAnonymousTrialEvidenceGapReview';
import { createUserAppAnonymousTrialEvidenceReview } from '../../user-app/userAppAnonymousTrialEvidenceReview';
import {
  userAppAnonymousTrialEvidenceGapReviewClearExample,
  userAppAnonymousTrialEvidenceGapReviewForbiddenDataExample,
  userAppAnonymousTrialEvidenceGapReviewInsufficientSampleExample,
  userAppAnonymousTrialEvidenceGapReviewMissingPrivacyClarityExample,
  userAppAnonymousTrialEvidenceGapReviewPrivacyIncidentExample,
} from './user-app-anonymous-trial-evidence-gap-review.example';
import {
  userAppAnonymousTrialEvidenceReviewCompleteSafeExample,
  userAppAnonymousTrialEvidenceReviewForbiddenDataExample,
  userAppAnonymousTrialEvidenceReviewInsufficientSampleExample,
  userAppAnonymousTrialEvidenceReviewMissingPostLaunchHandoffExample,
  userAppAnonymousTrialEvidenceReviewMissingPrivacyClarityExample,
  userAppAnonymousTrialEvidenceReviewPrivacyIncidentExample,
  userAppAnonymousTrialEvidenceReviewWarningExample,
} from './user-app-anonymous-trial-evidence-review.example';

const strongMvpSignals: UserAppAnonymousTrialDecisionSignal[] = [
  {
    signalId: 'anonymous-trial-decision-strong-task',
    label: '任务完成强信号',
    strength: 'strong',
    supportsMvpValidationPlanning: true,
    summary: '匿名真实摘要显示核心任务完成稳定。',
  },
  {
    signalId: 'anonymous-trial-decision-strong-value',
    label: '模板价值强信号',
    strength: 'strong',
    supportsMvpValidationPlanning: true,
    summary: '匿名真实摘要显示模板价值被明确理解。',
  },
  {
    signalId: 'anonymous-trial-decision-strong-privacy',
    label: '隐私清晰强信号',
    strength: 'strong',
    supportsMvpValidationPlanning: true,
    summary: '匿名真实摘要显示参与者理解不上传、不训练、不收集照片。',
  },
];

export const userAppAnonymousTrialDecisionInputRepeatExample =
  createUserAppAnonymousTrialDecisionInput({
    evidenceReview: userAppAnonymousTrialEvidenceReviewWarningExample,
  });

export const userAppAnonymousTrialDecisionInputReviseLaunchPackExample =
  createUserAppAnonymousTrialDecisionInput({
    evidenceReview: userAppAnonymousTrialEvidenceReviewCompleteSafeExample,
    gapReview: createUserAppAnonymousTrialEvidenceGapReview({
      evidenceReview: userAppAnonymousTrialEvidenceReviewCompleteSafeExample,
      manualGapTypes: ['missing_post_launch_handoff'],
    }),
  });

export const userAppAnonymousTrialDecisionInputReviseProtocolExample =
  createUserAppAnonymousTrialDecisionInput({
    evidenceReview: userAppAnonymousTrialEvidenceReviewMissingPrivacyClarityExample,
    gapReview: userAppAnonymousTrialEvidenceGapReviewMissingPrivacyClarityExample,
  });

export const userAppAnonymousTrialDecisionInputPausePrivacyExample =
  createUserAppAnonymousTrialDecisionInput({
    evidenceReview: userAppAnonymousTrialEvidenceReviewPrivacyIncidentExample,
    gapReview: userAppAnonymousTrialEvidenceGapReviewPrivacyIncidentExample,
  });

export const userAppAnonymousTrialDecisionInputPauseForbiddenDataExample =
  createUserAppAnonymousTrialDecisionInput({
    evidenceReview: userAppAnonymousTrialEvidenceReviewForbiddenDataExample,
    gapReview: userAppAnonymousTrialEvidenceGapReviewForbiddenDataExample,
  });

export const userAppAnonymousTrialDecisionInputInsufficientSampleExample =
  createUserAppAnonymousTrialDecisionInput({
    evidenceReview: userAppAnonymousTrialEvidenceReviewInsufficientSampleExample,
    gapReview: userAppAnonymousTrialEvidenceGapReviewInsufficientSampleExample,
  });

export const userAppAnonymousTrialDecisionInputPrepareMvpValidationExample =
  createUserAppAnonymousTrialDecisionInput({
    evidenceReview: userAppAnonymousTrialEvidenceReviewCompleteSafeExample,
    gapReview: userAppAnonymousTrialEvidenceGapReviewClearExample,
    signals: strongMvpSignals,
  });

export const userAppAnonymousTrialDecisionInputDoNotAdvanceExample =
  createUserAppAnonymousTrialDecisionInput({
    evidenceReview: createUserAppAnonymousTrialEvidenceReview({
      source: 'anonymous_internal_trial_summary',
      sampleSize: 3,
      missingDimensions: ['post_launch_handoff_evidence'],
    }),
  });
