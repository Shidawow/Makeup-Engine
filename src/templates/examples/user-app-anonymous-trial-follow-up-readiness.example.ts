import {
  createUserAppAnonymousTrialFollowUpReadiness,
} from '../../user-app/userAppAnonymousTrialFollowUpReadiness';
import {
  userAppAnonymousTrialGapActionPlanInsufficientSampleExample,
  userAppAnonymousTrialGapActionPlanMissingParticipantNoticeExample,
  userAppAnonymousTrialGapActionPlanMissingPostLaunchHandoffExample,
  userAppAnonymousTrialGapActionPlanMissingStopConditionsExample,
  userAppAnonymousTrialGapActionPlanPrivacyBlockerExample,
  userAppAnonymousTrialGapActionPlanReadyExample,
} from './user-app-anonymous-trial-gap-action-plan.example';
import {
  userAppAnonymousTrialFollowUpIterationDoNotAdvanceExample,
  userAppAnonymousTrialFollowUpIterationMissingParticipantNoticeExample,
  userAppAnonymousTrialFollowUpIterationMissingPostLaunchHandoffExample,
  userAppAnonymousTrialFollowUpIterationMissingStopConditionsExample,
  userAppAnonymousTrialFollowUpIterationPrivacyBlockerExample,
  userAppAnonymousTrialFollowUpIterationReadyExample,
  userAppAnonymousTrialFollowUpIterationRepeatDryRunExample,
  userAppAnonymousTrialFollowUpIterationReviseProtocolExample,
  userAppAnonymousTrialFollowUpIterationWarningExample,
} from './user-app-anonymous-trial-follow-up-iteration.example';

export const userAppAnonymousTrialFollowUpReadinessReadyForNextTrialExample =
  createUserAppAnonymousTrialFollowUpReadiness({
    followUpIteration: userAppAnonymousTrialFollowUpIterationWarningExample,
    gapActionPlan: userAppAnonymousTrialGapActionPlanInsufficientSampleExample,
    evidenceSufficientForMvpPreconditions: false,
  });

export const userAppAnonymousTrialFollowUpReadinessReadyForMvpPreconditionsExample =
  createUserAppAnonymousTrialFollowUpReadiness({
    followUpIteration: userAppAnonymousTrialFollowUpIterationReadyExample,
    gapActionPlan: userAppAnonymousTrialGapActionPlanReadyExample,
    evidenceSufficientForMvpPreconditions: true,
  });

export const userAppAnonymousTrialFollowUpReadinessRepeatDryRunExample =
  createUserAppAnonymousTrialFollowUpReadiness({
    followUpIteration: userAppAnonymousTrialFollowUpIterationRepeatDryRunExample,
    gapActionPlan: userAppAnonymousTrialGapActionPlanInsufficientSampleExample,
    evidenceSufficientForMvpPreconditions: false,
  });

export const userAppAnonymousTrialFollowUpReadinessReviseProtocolExample =
  createUserAppAnonymousTrialFollowUpReadiness({
    followUpIteration: userAppAnonymousTrialFollowUpIterationReviseProtocolExample,
    gapActionPlan: userAppAnonymousTrialGapActionPlanMissingStopConditionsExample,
  });

export const userAppAnonymousTrialFollowUpReadinessReviseLaunchPackExample =
  createUserAppAnonymousTrialFollowUpReadiness({
    followUpIteration: userAppAnonymousTrialFollowUpIterationMissingPostLaunchHandoffExample,
    gapActionPlan: userAppAnonymousTrialGapActionPlanMissingPostLaunchHandoffExample,
  });

export const userAppAnonymousTrialFollowUpReadinessMissingNoticeExample =
  createUserAppAnonymousTrialFollowUpReadiness({
    followUpIteration: userAppAnonymousTrialFollowUpIterationMissingParticipantNoticeExample,
    gapActionPlan: userAppAnonymousTrialGapActionPlanMissingParticipantNoticeExample,
  });

export const userAppAnonymousTrialFollowUpReadinessPausePrivacyExample =
  createUserAppAnonymousTrialFollowUpReadiness({
    followUpIteration: userAppAnonymousTrialFollowUpIterationPrivacyBlockerExample,
    gapActionPlan: userAppAnonymousTrialGapActionPlanPrivacyBlockerExample,
  });

export const userAppAnonymousTrialFollowUpReadinessDoNotAdvanceExample =
  createUserAppAnonymousTrialFollowUpReadiness({
    followUpIteration: userAppAnonymousTrialFollowUpIterationDoNotAdvanceExample,
  });

export const userAppAnonymousTrialFollowUpReadinessMissingStopConditionsExample =
  createUserAppAnonymousTrialFollowUpReadiness({
    followUpIteration: userAppAnonymousTrialFollowUpIterationMissingStopConditionsExample,
    gapActionPlan: userAppAnonymousTrialGapActionPlanMissingStopConditionsExample,
  });
