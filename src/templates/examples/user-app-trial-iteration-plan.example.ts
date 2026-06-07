import {
  createUserAppTrialIterationPlan,
  type UserAppTrialIterationPlan,
} from '../../user-app/userAppTrialIterationPlan';
import { userAppTrialDecisionReadyFor9CExample } from './user-app-trial-decision-framework.example';
import {
  userAppTrialIterationBacklogCleanExample,
  userAppTrialIterationBacklogContentHeavyExample,
  userAppTrialIterationBacklogLowConfidenceExample,
  userAppTrialIterationBacklogPrivacyBlockerExample,
  userAppTrialIterationBacklogShellHeavyExample,
} from './user-app-trial-iteration-backlog.example';

export const userAppTrialIterationPlanCleanExample: UserAppTrialIterationPlan =
  createUserAppTrialIterationPlan({
    planId: 'trial-iteration-plan-clean',
    backlog: userAppTrialIterationBacklogCleanExample,
    decisionFramework: userAppTrialDecisionReadyFor9CExample,
    readyForNextInternalTrial: false,
  });

export const userAppTrialIterationPlanReadyForNextInternalTrialExample: UserAppTrialIterationPlan =
  createUserAppTrialIterationPlan({
    planId: 'trial-iteration-plan-ready-next-internal-trial',
    backlog: userAppTrialIterationBacklogCleanExample,
    decisionFramework: userAppTrialDecisionReadyFor9CExample,
    readyForNextInternalTrial: true,
  });

export const userAppTrialIterationPlanContentHeavyExample: UserAppTrialIterationPlan =
  createUserAppTrialIterationPlan({
    planId: 'trial-iteration-plan-content-heavy',
    backlog: userAppTrialIterationBacklogContentHeavyExample,
  });

export const userAppTrialIterationPlanShellHeavyExample: UserAppTrialIterationPlan =
  createUserAppTrialIterationPlan({
    planId: 'trial-iteration-plan-shell-heavy',
    backlog: userAppTrialIterationBacklogShellHeavyExample,
  });

export const userAppTrialIterationPlanPrivacyBlockerExample: UserAppTrialIterationPlan =
  createUserAppTrialIterationPlan({
    planId: 'trial-iteration-plan-privacy-blocker',
    backlog: userAppTrialIterationBacklogPrivacyBlockerExample,
  });

export const userAppTrialIterationPlanLowConfidenceObserveMoreExample: UserAppTrialIterationPlan =
  createUserAppTrialIterationPlan({
    planId: 'trial-iteration-plan-low-confidence-observe-more',
    backlog: userAppTrialIterationBacklogLowConfidenceExample,
  });
