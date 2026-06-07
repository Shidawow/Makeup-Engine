import {
  createUserAppTrialIterationPriorityRecommendation,
  type UserAppTrialIterationPriorityRecommendation,
} from '../../user-app/userAppTrialIterationPriority';

export const userAppTrialIterationPriorityP0Example: UserAppTrialIterationPriorityRecommendation =
  createUserAppTrialIterationPriorityRecommendation({
    issueCategory: 'blocked_boundary_issue',
    severity: 'critical',
    actionability: 'blocked_by_boundary',
    confidence: 'high',
    issueCount: 1,
  });

export const userAppTrialIterationPriorityP1ShellExample: UserAppTrialIterationPriorityRecommendation =
  createUserAppTrialIterationPriorityRecommendation({
    issueCategory: 'shell_usability_issue',
    severity: 'high',
    actionability: 'clear_fix',
    confidence: 'high',
    issueCount: 2,
  });

export const userAppTrialIterationPriorityP1ContentExample: UserAppTrialIterationPriorityRecommendation =
  createUserAppTrialIterationPriorityRecommendation({
    issueCategory: 'content_issue',
    severity: 'high',
    actionability: 'clear_fix',
    confidence: 'high',
    issueCount: 2,
  });

export const userAppTrialIterationPriorityP2Example: UserAppTrialIterationPriorityRecommendation =
  createUserAppTrialIterationPriorityRecommendation({
    issueCategory: 'trial_ops_issue',
    severity: 'medium',
    actionability: 'needs_product_decision',
    confidence: 'medium',
    issueCount: 1,
  });

export const userAppTrialIterationPriorityP3Example: UserAppTrialIterationPriorityRecommendation =
  createUserAppTrialIterationPriorityRecommendation({
    issueCategory: 'recommendation_issue',
    severity: 'low',
    actionability: 'needs_more_trials',
    confidence: 'medium',
    issueCount: 2,
  });

export const userAppTrialIterationPriorityObserveMoreExample: UserAppTrialIterationPriorityRecommendation =
  createUserAppTrialIterationPriorityRecommendation({
    issueCategory: 'unknown_issue',
    severity: 'medium',
    actionability: 'not_actionable_yet',
    confidence: 'low',
    issueCount: 1,
  });
