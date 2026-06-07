import {
  createUserAppTrialIterationBacklog,
  type UserAppTrialIterationBacklog,
} from '../../user-app/userAppTrialIterationBacklog';
import { createUserAppTrialIssueSummary } from '../../user-app/userAppTrialIssueTaxonomy';
import {
  userAppTrialResultReviewContentHeavyExample,
  userAppTrialResultReviewPrivacyBoundaryExample,
  userAppTrialResultReviewReadyFor9CExample,
  userAppTrialResultReviewShellHeavyExample,
} from './user-app-trial-result-review.example';

export const userAppTrialIterationBacklogCleanExample: UserAppTrialIterationBacklog =
  createUserAppTrialIterationBacklog({
    backlogId: 'trial-iteration-backlog-clean',
    issueSummary: userAppTrialResultReviewReadyFor9CExample.issueSummary,
  });

export const userAppTrialIterationBacklogContentHeavyExample: UserAppTrialIterationBacklog =
  createUserAppTrialIterationBacklog({
    backlogId: 'trial-iteration-backlog-content-heavy',
    issueSummary: userAppTrialResultReviewContentHeavyExample.issueSummary,
  });

export const userAppTrialIterationBacklogShellHeavyExample: UserAppTrialIterationBacklog =
  createUserAppTrialIterationBacklog({
    backlogId: 'trial-iteration-backlog-shell-heavy',
    issueSummary: userAppTrialResultReviewShellHeavyExample.issueSummary,
  });

export const userAppTrialIterationBacklogPrivacyBlockerExample: UserAppTrialIterationBacklog =
  createUserAppTrialIterationBacklog({
    backlogId: 'trial-iteration-backlog-privacy-blocker',
    issueSummary: userAppTrialResultReviewPrivacyBoundaryExample.issueSummary,
  });

export const userAppTrialIterationBacklogLowConfidenceExample: UserAppTrialIterationBacklog =
  createUserAppTrialIterationBacklog({
    backlogId: 'trial-iteration-backlog-low-confidence',
    issueSummary: createUserAppTrialIssueSummary(
      [
        {
          signalId: 'unknown-low-confidence',
          dimension: 'user_confusion_points',
          score: 3,
          summary: '只有一个匿名示例提到卡点，但无法判断来自内容还是 Shell。',
          evidenceCount: 1,
        },
      ],
      { summaryId: 'trial-iteration-low-confidence-summary' },
    ),
    confidenceByCategory: {
      guidance_clarity_issue: 'low',
    },
  });
