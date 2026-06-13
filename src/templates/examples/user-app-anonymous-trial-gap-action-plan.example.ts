import {
  createUserAppAnonymousTrialGapActionPlan,
} from '../../user-app/userAppAnonymousTrialGapActionPlan';
import {
  userAppAnonymousTrialDecisionInputInsufficientSampleExample,
  userAppAnonymousTrialDecisionInputPauseForbiddenDataExample,
  userAppAnonymousTrialDecisionInputPausePrivacyExample,
  userAppAnonymousTrialDecisionInputPrepareMvpValidationExample,
  userAppAnonymousTrialDecisionInputRepeatExample,
  userAppAnonymousTrialDecisionInputReviseProtocolExample,
  userAppAnonymousTrialDecisionInputReviseLaunchPackExample,
} from './user-app-anonymous-trial-decision-input.example';

export const userAppAnonymousTrialGapActionPlanReadyExample =
  createUserAppAnonymousTrialGapActionPlan({
    decisionInput: userAppAnonymousTrialDecisionInputPrepareMvpValidationExample,
    resolvedIssueTypes: ['no_gap'],
  });

export const userAppAnonymousTrialGapActionPlanPrivacyBlockerExample =
  createUserAppAnonymousTrialGapActionPlan({
    decisionInput: userAppAnonymousTrialDecisionInputPausePrivacyExample,
  });

export const userAppAnonymousTrialGapActionPlanForbiddenDataExample =
  createUserAppAnonymousTrialGapActionPlan({
    decisionInput: userAppAnonymousTrialDecisionInputPauseForbiddenDataExample,
  });

export const userAppAnonymousTrialGapActionPlanMissingParticipantNoticeExample =
  createUserAppAnonymousTrialGapActionPlan({
    decisionInput: userAppAnonymousTrialDecisionInputPrepareMvpValidationExample,
    manualIssueTypes: ['missing_participant_notice'],
  });

export const userAppAnonymousTrialGapActionPlanMissingStopConditionsExample =
  createUserAppAnonymousTrialGapActionPlan({
    decisionInput: userAppAnonymousTrialDecisionInputReviseProtocolExample,
    manualIssueTypes: ['missing_stop_condition_record'],
  });

export const userAppAnonymousTrialGapActionPlanMissingPostLaunchHandoffExample =
  createUserAppAnonymousTrialGapActionPlan({
    decisionInput: userAppAnonymousTrialDecisionInputReviseLaunchPackExample,
    manualIssueTypes: ['missing_post_launch_handoff'],
  });

export const userAppAnonymousTrialGapActionPlanInsufficientSampleExample =
  createUserAppAnonymousTrialGapActionPlan({
    decisionInput: userAppAnonymousTrialDecisionInputInsufficientSampleExample,
  });

export const userAppAnonymousTrialGapActionPlanLowConfidenceExample =
  createUserAppAnonymousTrialGapActionPlan({
    decisionInput: userAppAnonymousTrialDecisionInputRepeatExample,
    manualIssueTypes: ['low_confidence_issue'],
    resolvedIssueTypes: ['insufficient_sample_size'],
  });
