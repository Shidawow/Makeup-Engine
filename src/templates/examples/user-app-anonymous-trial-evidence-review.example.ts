import { createUserAppAnonymousTrialPostLaunchHandoff } from '../../user-app/userAppAnonymousTrialPostLaunchHandoff';
import {
  createUserAppAnonymousTrialEvidenceReview,
} from '../../user-app/userAppAnonymousTrialEvidenceReview';

export const userAppAnonymousTrialEvidenceReviewCompleteSafeExample =
  createUserAppAnonymousTrialEvidenceReview({
    source: 'anonymous_internal_trial_summary',
    sampleSize: 4,
  });

export const userAppAnonymousTrialEvidenceReviewWarningExample =
  createUserAppAnonymousTrialEvidenceReview({
    source: 'mock_example_summary',
    sampleSize: 1,
  });

export const userAppAnonymousTrialEvidenceReviewMissingPostLaunchHandoffExample =
  createUserAppAnonymousTrialEvidenceReview({
    source: 'anonymous_internal_trial_summary',
    sampleSize: 3,
    missingDimensions: ['post_launch_handoff_evidence'],
  });

export const userAppAnonymousTrialEvidenceReviewMissingPrivacyClarityExample =
  createUserAppAnonymousTrialEvidenceReview({
    source: 'anonymous_internal_trial_summary',
    sampleSize: 3,
    missingDimensions: ['privacy_clarity_evidence'],
  });

export const userAppAnonymousTrialEvidenceReviewInsufficientSampleExample =
  createUserAppAnonymousTrialEvidenceReview({
    source: 'anonymous_internal_trial_summary',
    sampleSize: 1,
  });

export const userAppAnonymousTrialEvidenceReviewForbiddenDataExample =
  createUserAppAnonymousTrialEvidenceReview({
    source: 'anonymous_internal_trial_summary',
    sampleSize: 3,
    containsForbiddenData: true,
  });

export const userAppAnonymousTrialEvidenceReviewPrivacyIncidentExample =
  createUserAppAnonymousTrialEvidenceReview({
    source: 'anonymous_internal_trial_summary',
    sampleSize: 3,
    privacyIncidents: ['管理员记录中出现联系方式字段，已停止复盘并标记清理。'],
  });

export const userAppAnonymousTrialEvidenceReviewStoppedHandoffExample =
  createUserAppAnonymousTrialEvidenceReview({
    source: 'anonymous_internal_trial_summary',
    sampleSize: 3,
    postLaunchHandoff: createUserAppAnonymousTrialPostLaunchHandoff({
      evidenceHandoff: {
        ...createUserAppAnonymousTrialPostLaunchHandoff().evidenceHandoff,
        stoppedSessionReason: '参与者主动提到上传照片，管理员按停止条件暂停。',
      },
    }),
  });
