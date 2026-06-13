import {
  createUserAppAnonymousTrialFollowUpIteration,
} from '../../user-app/userAppAnonymousTrialFollowUpIteration';
import {
  userAppAnonymousTrialDecisionInputDoNotAdvanceExample,
  userAppAnonymousTrialDecisionInputPrepareMvpValidationExample,
  userAppAnonymousTrialDecisionInputRepeatExample,
  userAppAnonymousTrialDecisionInputReviseLaunchPackExample,
  userAppAnonymousTrialDecisionInputReviseProtocolExample,
} from './user-app-anonymous-trial-decision-input.example';
import {
  userAppAnonymousTrialGapActionPlanInsufficientSampleExample,
  userAppAnonymousTrialGapActionPlanMissingParticipantNoticeExample,
  userAppAnonymousTrialGapActionPlanMissingPostLaunchHandoffExample,
  userAppAnonymousTrialGapActionPlanMissingStopConditionsExample,
  userAppAnonymousTrialGapActionPlanPrivacyBlockerExample,
  userAppAnonymousTrialGapActionPlanReadyExample,
} from './user-app-anonymous-trial-gap-action-plan.example';

export const userAppAnonymousTrialFollowUpIterationReadyExample =
  createUserAppAnonymousTrialFollowUpIteration({
    decisionInput: userAppAnonymousTrialDecisionInputPrepareMvpValidationExample,
    gapActionPlan: userAppAnonymousTrialGapActionPlanReadyExample,
    completedActionTypes: ['prepare_mvp_validation_plan_preconditions'],
  });

export const userAppAnonymousTrialFollowUpIterationWarningExample =
  createUserAppAnonymousTrialFollowUpIteration({
    decisionInput: userAppAnonymousTrialDecisionInputRepeatExample,
    gapActionPlan: userAppAnonymousTrialGapActionPlanInsufficientSampleExample,
    completedActionTypes: ['collect_more_anonymous_evidence'],
  });

export const userAppAnonymousTrialFollowUpIterationPrivacyBlockerExample =
  createUserAppAnonymousTrialFollowUpIteration({
    gapActionPlan: userAppAnonymousTrialGapActionPlanPrivacyBlockerExample,
  });

export const userAppAnonymousTrialFollowUpIterationMissingParticipantNoticeExample =
  createUserAppAnonymousTrialFollowUpIteration({
    decisionInput: userAppAnonymousTrialDecisionInputReviseLaunchPackExample,
    gapActionPlan: userAppAnonymousTrialGapActionPlanMissingParticipantNoticeExample,
  });

export const userAppAnonymousTrialFollowUpIterationMissingStopConditionsExample =
  createUserAppAnonymousTrialFollowUpIteration({
    decisionInput: userAppAnonymousTrialDecisionInputReviseProtocolExample,
    gapActionPlan: userAppAnonymousTrialGapActionPlanMissingStopConditionsExample,
  });

export const userAppAnonymousTrialFollowUpIterationMissingPostLaunchHandoffExample =
  createUserAppAnonymousTrialFollowUpIteration({
    decisionInput: userAppAnonymousTrialDecisionInputReviseLaunchPackExample,
    gapActionPlan: userAppAnonymousTrialGapActionPlanMissingPostLaunchHandoffExample,
  });

export const userAppAnonymousTrialFollowUpIterationRepeatDryRunExample =
  createUserAppAnonymousTrialFollowUpIteration({
    decisionInput: userAppAnonymousTrialDecisionInputRepeatExample,
    gapActionPlan: userAppAnonymousTrialGapActionPlanInsufficientSampleExample,
  });

export const userAppAnonymousTrialFollowUpIterationReviseProtocolExample =
  createUserAppAnonymousTrialFollowUpIteration({
    decisionInput: userAppAnonymousTrialDecisionInputReviseProtocolExample,
    gapActionPlan: userAppAnonymousTrialGapActionPlanMissingStopConditionsExample,
  });

export const userAppAnonymousTrialFollowUpIterationDoNotAdvanceExample =
  createUserAppAnonymousTrialFollowUpIteration({
    decisionInput: userAppAnonymousTrialDecisionInputDoNotAdvanceExample,
  });
