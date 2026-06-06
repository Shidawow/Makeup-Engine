import {
  createUserAppTrialGoNoGoDecision,
  type UserAppTrialGoNoGoDecision,
} from '../../user-app/userAppTrialGoNoGo';
import { createUserAppTrialFeedbackForm } from '../../user-app/userAppTrialFeedback';
import {
  userAppMvpReleaseReadinessContentBlockedExample,
  userAppMvpReleaseReadinessNoTrialTemplateExample,
  userAppMvpReleaseReadinessProductionViolationExample,
  userAppMvpReleaseReadinessReadyExample,
  userAppMvpReleaseReadinessUnsafeFeedbackExample,
  userAppMvpReleaseReadinessWarningExample,
} from './user-app-mvp-release-readiness.example';
import {
  userAppTrialContentReadinessBlockedExample,
  userAppTrialContentReadinessReadyExample,
  userAppTrialContentReadinessWarningExample,
  userAppTrialTemplateSelectionBlockedExample,
  userAppTrialTemplateSelectionReadyExample,
  userAppTrialTemplateSelectionWarningExample,
} from './user-app-trial-template-selection.example';

export const userAppTrialGoNoGoReadyExample: UserAppTrialGoNoGoDecision =
  createUserAppTrialGoNoGoDecision({
    releaseReadinessReport: userAppMvpReleaseReadinessReadyExample,
    trialContentReadinessReport: userAppTrialContentReadinessReadyExample,
    trialTemplateSelectionReport: userAppTrialTemplateSelectionReadyExample,
    testsPassed: true,
    knownLimitationsDocumented: true,
  });

export const userAppTrialGoNoGoWarningExample: UserAppTrialGoNoGoDecision =
  createUserAppTrialGoNoGoDecision({
    releaseReadinessReport: userAppMvpReleaseReadinessWarningExample,
    trialContentReadinessReport: userAppTrialContentReadinessWarningExample,
    trialTemplateSelectionReport: userAppTrialTemplateSelectionWarningExample,
    testsPassed: true,
    knownLimitationsDocumented: true,
  });

export const userAppTrialNoGoNoTemplatesExample: UserAppTrialGoNoGoDecision =
  createUserAppTrialGoNoGoDecision({
    releaseReadinessReport: userAppMvpReleaseReadinessNoTrialTemplateExample,
    trialContentReadinessReport: userAppTrialContentReadinessBlockedExample,
    trialTemplateSelectionReport: userAppTrialTemplateSelectionBlockedExample,
    testsPassed: true,
  });

export const userAppTrialNoGoUnsafeFeedbackExample: UserAppTrialGoNoGoDecision =
  createUserAppTrialGoNoGoDecision({
    releaseReadinessReport: userAppMvpReleaseReadinessUnsafeFeedbackExample,
    trialContentReadinessReport: userAppTrialContentReadinessReadyExample,
    trialTemplateSelectionReport: userAppTrialTemplateSelectionReadyExample,
    feedbackForm: createUserAppTrialFeedbackForm({
      boundaryOverrides: {
        collectsContact: true,
      },
    }),
    testsPassed: true,
  });

export const userAppTrialNoGoContentQaBlockedExample: UserAppTrialGoNoGoDecision =
  createUserAppTrialGoNoGoDecision({
    releaseReadinessReport: userAppMvpReleaseReadinessContentBlockedExample,
    trialContentReadinessReport: userAppTrialContentReadinessBlockedExample,
    trialTemplateSelectionReport: userAppTrialTemplateSelectionBlockedExample,
    hasBlockedContentQa: true,
    testsPassed: true,
  });

export const userAppTrialNoGoProductionViolationExample: UserAppTrialGoNoGoDecision =
  createUserAppTrialGoNoGoDecision({
    releaseReadinessReport: userAppMvpReleaseReadinessProductionViolationExample,
    trialContentReadinessReport: userAppTrialContentReadinessReadyExample,
    trialTemplateSelectionReport: userAppTrialTemplateSelectionReadyExample,
    usesBackend: true,
    usesCamera: true,
    writesTrainingInput: true,
    productionNonGoalsViolated: true,
    testsPassed: true,
  });
