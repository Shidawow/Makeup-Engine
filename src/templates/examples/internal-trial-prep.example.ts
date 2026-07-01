import {
  createInternalTrialPrepReport,
  validateInternalTrialPrep,
} from '../../template-engine';
import {
  internalFounderDemoRunBlockedByAutomationClaimExample,
  internalFounderDemoRunBlockedByRegistryExample,
  internalFounderDemoRunReadyExample,
} from './internal-founder-demo-run.example';
import {
  internalTrialFeedbackPromptsReadyExample,
  internalTrialFeedbackPromptsUnsafeExample,
} from './internal-trial-feedback-prompts.example';

export const internalTrialPrepReadyExample = createInternalTrialPrepReport({
  sourceFounderDemoRunReport: internalFounderDemoRunReadyExample,
  feedbackPrompts: internalTrialFeedbackPromptsReadyExample,
});

export const internalTrialPrepValidationReadyExample =
  validateInternalTrialPrep(internalTrialPrepReadyExample);

export const internalTrialPrepBlockedByContactExample = createInternalTrialPrepReport({
  reportId: 'internal-trial-prep-blocked-contact',
  sourceFounderDemoRunReport: internalFounderDemoRunReadyExample,
  feedbackPrompts: internalTrialFeedbackPromptsUnsafeExample,
  noContactCollection: false,
});

export const internalTrialPrepBlockedByPhotoExample = createInternalTrialPrepReport({
  reportId: 'internal-trial-prep-blocked-photo',
  sourceFounderDemoRunReport: internalFounderDemoRunReadyExample,
  noRealPhotos: false,
  noBase64OrLocalPhotoPath: false,
});

export const internalTrialPrepBlockedByAnalyticsExample = createInternalTrialPrepReport({
  reportId: 'internal-trial-prep-blocked-analytics',
  sourceFounderDemoRunReport: internalFounderDemoRunReadyExample,
  noAnalytics: false,
  noBackend: false,
  noDatabase: false,
});

export const internalTrialPrepBlockedByRegistryExample = createInternalTrialPrepReport({
  reportId: 'internal-trial-prep-blocked-registry',
  sourceFounderDemoRunReport: internalFounderDemoRunBlockedByRegistryExample,
  noRegistryWrite: false,
  noRegistryMutation: false,
  noPublish: false,
  noProductionWriter: false,
});

export const internalTrialPrepBlockedByAutomationClaimExample =
  createInternalTrialPrepReport({
    reportId: 'internal-trial-prep-blocked-automation-claim',
    sourceFounderDemoRunReport: internalFounderDemoRunBlockedByAutomationClaimExample,
    noFullyAutomaticExtractionClaim: false,
    noAiConfirmedClaim: false,
  });

export const internalTrialPrepSafeFixtureExample = {
  fakeTrialId: 'internal-trial-prep-local-fixture-v0',
  localOnly: true,
  roleBasedParticipantProfilesOnly: true,
  routes: internalTrialPrepReadyExample.trialRoutes.map((route) => route.id),
  feedbackPromptIds: internalTrialPrepReadyExample.feedbackPrompts.map(
    (prompt) => prompt.id,
  ),
  boundaryReminders: [
    'no real names',
    'no contact collection',
    'no real photos',
    'no base64 or local photo path',
    'no analytics/backend/database',
    'no registry write / no publish',
  ],
  containsRealName: false,
  containsContact: false,
  containsRealPhoto: false,
  containsBase64: false,
  containsLocalPhotoPath: false,
  containsBiometricId: false,
  containsFaceEmbedding: false,
  containsAnalyticsId: false,
};
