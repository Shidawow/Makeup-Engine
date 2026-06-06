import {
  createUserAppMvpReleaseReadinessReport,
  type UserAppMvpReleaseReadinessReport,
} from '../../user-app/userAppMvpReleaseReadiness';
import { createUserAppTrialFeedbackForm } from '../../user-app/userAppTrialFeedback';
import {
  userAppTrialContentReadinessBlockedExample,
  userAppTrialContentReadinessReadyExample,
  userAppTrialContentReadinessWarningExample,
  userAppTrialTemplateSelectionBlockedExample,
  userAppTrialTemplateSelectionReadyExample,
  userAppTrialTemplateSelectionWarningExample,
} from './user-app-trial-template-selection.example';

export const userAppMvpReleaseReadinessReadyExample: UserAppMvpReleaseReadinessReport =
  createUserAppMvpReleaseReadinessReport({
    trialContentReadinessReport: userAppTrialContentReadinessReadyExample,
    trialTemplateSelectionReport: userAppTrialTemplateSelectionReadyExample,
    testsPassed: true,
    browserMobileQaPassed: true,
  });

export const userAppMvpReleaseReadinessWarningExample: UserAppMvpReleaseReadinessReport =
  createUserAppMvpReleaseReadinessReport({
    trialContentReadinessReport: userAppTrialContentReadinessWarningExample,
    trialTemplateSelectionReport: userAppTrialTemplateSelectionWarningExample,
    knownLimitationsAccepted: false,
    testsPassed: true,
    browserMobileQaPassed: true,
  });

export const userAppMvpReleaseReadinessNoTrialTemplateExample: UserAppMvpReleaseReadinessReport =
  createUserAppMvpReleaseReadinessReport({
    trialContentReadinessReport: userAppTrialContentReadinessBlockedExample,
    trialTemplateSelectionReport: userAppTrialTemplateSelectionBlockedExample,
    testsPassed: true,
    browserMobileQaPassed: true,
  });

export const userAppMvpReleaseReadinessUnsafeFeedbackExample: UserAppMvpReleaseReadinessReport =
  createUserAppMvpReleaseReadinessReport({
    feedbackForm: createUserAppTrialFeedbackForm({
      boundaryOverrides: {
        collectsContact: true,
      },
    }),
    trialContentReadinessReport: userAppTrialContentReadinessReadyExample,
    trialTemplateSelectionReport: userAppTrialTemplateSelectionReadyExample,
    testsPassed: true,
    browserMobileQaPassed: true,
  });

export const userAppMvpReleaseReadinessContentBlockedExample: UserAppMvpReleaseReadinessReport =
  createUserAppMvpReleaseReadinessReport({
    trialContentReadinessReport: userAppTrialContentReadinessBlockedExample,
    trialTemplateSelectionReport: userAppTrialTemplateSelectionBlockedExample,
    testsPassed: true,
    browserMobileQaPassed: true,
  });

export const userAppMvpReleaseReadinessProductionViolationExample: UserAppMvpReleaseReadinessReport =
  createUserAppMvpReleaseReadinessReport({
    trialContentReadinessReport: userAppTrialContentReadinessReadyExample,
    trialTemplateSelectionReport: userAppTrialTemplateSelectionReadyExample,
    usesBackend: true,
    usesCamera: true,
    writesTrainingInput: true,
    productionNonGoalsDocumented: false,
    testsPassed: true,
  });
