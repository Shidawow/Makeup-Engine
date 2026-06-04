import {
  createDefaultUserLocalPreferences,
  createInitialTemplateDiscoveryState,
  createInitialUserAppSession,
  type UserAppSessionState,
} from '../../user-app';
import { userAppTemplateDiscoveryExamplePackage } from './user-app-template-discovery.example';

const template = userAppTemplateDiscoveryExamplePackage.templates[0];
const orderedStepIds = template.steps
  .slice()
  .sort((left, right) =>
    left.order === right.order
      ? left.stepId.localeCompare(right.stepId)
      : left.order - right.order,
  )
  .map((step) => step.stepId);
const discovery = createInitialTemplateDiscoveryState({
  preferredStyleTags: ['natural', 'minimal'],
});

export const emptyUserAppSessionExample: UserAppSessionState =
  createInitialUserAppSession({
    sessionId: 'user-app-session-example-empty',
  });

export const completedOnboardingUserAppSessionExample: UserAppSessionState =
  createInitialUserAppSession({
    sessionId: 'user-app-session-example-onboarding-complete',
    status: 'active',
    onboarding: {
      status: 'completed',
      currentStep: 'completed',
      completedStepIds: [
        'welcome',
        'skill_level',
        'guidance_style',
        'available_time',
        'available_tools',
        'preferred_styles',
        'privacy_reminder',
      ],
      skippedStepIds: [],
      progressPercent: 100,
    },
    localPreferences: createDefaultUserLocalPreferences({
      preferenceId: 'session-example-preferences',
      onboardingCompleted: true,
    }),
  });

export const partiallyCompletedTemplateSessionExample: UserAppSessionState =
  createInitialUserAppSession({
    sessionId: 'user-app-session-example-partial-progress',
    status: 'active',
    selectedTemplateId: template.appTemplateId,
    activeStepId: orderedStepIds[1],
    templateProgress: {
      templateId: template.appTemplateId,
      activeStepId: orderedStepIds[1],
      orderedStepIds,
      completedStepIds: [orderedStepIds[0]],
      skippedStepIds: [],
      progressPercent: 33,
    },
    discovery: {
      filter: discovery.filter,
      sortMode: 'recommended',
      preferredStyleTags: ['natural', 'minimal'],
    },
    lastVisitedSection: 'session',
  });

export const invalidSelectedTemplateSessionExample: UserAppSessionState =
  createInitialUserAppSession({
    sessionId: 'user-app-session-example-invalid-template',
    status: 'active',
    selectedTemplateId: 'missing-template-id',
    activeStepId: 'missing-step-id',
  });

export const invalidStepProgressSessionExample: UserAppSessionState =
  createInitialUserAppSession({
    sessionId: 'user-app-session-example-invalid-progress',
    status: 'active',
    selectedTemplateId: template.appTemplateId,
    activeStepId: 'stale-step-id',
    templateProgress: {
      templateId: template.appTemplateId,
      activeStepId: 'stale-step-id',
      orderedStepIds,
      completedStepIds: [orderedStepIds[0], 'stale-completed-step'],
      skippedStepIds: ['stale-skipped-step'],
      progressPercent: 50,
    },
  });

export const blockedPackageSessionExample: UserAppSessionState =
  createInitialUserAppSession({
    sessionId: 'user-app-session-example-blocked-package',
    status: 'active',
    selectedTemplateId: template.appTemplateId,
    activeStepId: orderedStepIds[0],
    templateProgress: {
      templateId: template.appTemplateId,
      activeStepId: orderedStepIds[0],
      orderedStepIds,
      completedStepIds: [],
      skippedStepIds: [],
      progressPercent: 0,
    },
  });

export const unsafeObjectUrlSessionExample = {
  ...partiallyCompletedTemplateSessionExample,
  objectUrl: 'blob:http://localhost/session-photo',
};

export const unsafeImageBytesSessionExample = {
  ...partiallyCompletedTemplateSessionExample,
  imageBytes: [1, 2, 3],
};

export const unsafeBiometricSessionExample = {
  ...partiallyCompletedTemplateSessionExample,
  biometricId: 'blocked-biometric-id',
};

export const versionMismatchSessionExample = {
  ...partiallyCompletedTemplateSessionExample,
  schemaVersion: 'user-app-session-v9',
};
