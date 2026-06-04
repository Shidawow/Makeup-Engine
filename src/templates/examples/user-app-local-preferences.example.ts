import {
  createDefaultUserLocalPreferences,
  createInitialUserOnboardingState,
  markOnboardingCompleted,
  skipOnboarding,
  type UserLocalPreferences,
  type UserOnboardingState,
} from '../../user-app';

export const beginnerUserLocalPreferencesExample: UserLocalPreferences =
  createDefaultUserLocalPreferences({
    preferenceId: 'local-preferences-beginner-example',
    skillLevel: 'beginner',
    guidanceVerbosity: 'detailed',
    availableTime: '10_to_20_minutes',
    availableTools: ['fingers', 'brush', 'cotton_swab'],
    preferredStyleTags: ['natural', 'soft'],
    occasion: 'daily',
    comfortLevel: 'cautious',
    onboardingCompleted: true,
  });

export const intermediateUserLocalPreferencesExample: UserLocalPreferences =
  createDefaultUserLocalPreferences({
    preferenceId: 'local-preferences-intermediate-example',
    skillLevel: 'intermediate',
    guidanceVerbosity: 'balanced',
    availableTime: '5_to_10_minutes',
    availableTools: ['sponge', 'brush', 'brow_pencil'],
    preferredStyleTags: ['polished', 'glowy'],
    occasion: 'work',
    comfortLevel: 'normal',
    onboardingCompleted: true,
  });

export const advancedUserLocalPreferencesExample: UserLocalPreferences =
  createDefaultUserLocalPreferences({
    preferenceId: 'local-preferences-advanced-example',
    skillLevel: 'advanced',
    guidanceVerbosity: 'concise',
    availableTime: 'under_5_minutes',
    availableTools: ['brush', 'lash_curler', 'brow_pencil'],
    preferredStyleTags: ['bold', 'polished'],
    occasion: 'evening',
    comfortLevel: 'adventurous',
    onboardingCompleted: true,
  });

export const minimalToolsUserLocalPreferencesExample: UserLocalPreferences =
  createDefaultUserLocalPreferences({
    preferenceId: 'local-preferences-minimal-tools-example',
    skillLevel: 'beginner',
    guidanceVerbosity: 'detailed',
    availableTime: 'flexible',
    availableTools: [],
    preferredStyleTags: ['minimal', 'natural'],
    occasion: 'practice',
    comfortLevel: 'cautious',
  });

export const skippedUserOnboardingExample: UserOnboardingState = skipOnboarding(
  createInitialUserOnboardingState(),
);

export const completedUserOnboardingExample: UserOnboardingState =
  markOnboardingCompleted(createInitialUserOnboardingState());

export const unsafeUserPreferenceFixture = {
  fixtureId: 'unsafe-user-preference-fixture',
  objectUrl: 'blob:http://local/preference-photo',
  localPath: 'C:\\Users\\person\\preference-selfie.png',
  dataImage: 'data:image/png;base64,iVBORw0KGgoAAAA',
  imageBytes: [1, 2, 3],
  faceEmbedding: [0.1, 0.2],
  biometricId: 'blocked-biometric-id',
  trainingInput: true,
  healthInformation: 'blocked-sensitive-field',
};
