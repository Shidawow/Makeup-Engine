import {
  createDefaultUserPersonalizationPlaceholder,
  createUserPhotoIntakePlaceholder,
  type UserPersonalizationPlaceholder,
  type UserPhotoIntakePlaceholder,
} from '../../user-app';

export const defaultUserPhotoIntakePlaceholderExample: UserPhotoIntakePlaceholder =
  createUserPhotoIntakePlaceholder({
    placeholderId: 'photo-placeholder-default-example',
    status: 'placeholder_only',
  });

export const disabledCameraPhotoIntakePlaceholderExample: UserPhotoIntakePlaceholder =
  createUserPhotoIntakePlaceholder({
    placeholderId: 'photo-placeholder-disabled-camera-example',
    status: 'disabled_by_boundary',
    capabilities: ['camera_capture_future'],
  });

export const futureManualUploadPhotoIntakePlaceholderExample: UserPhotoIntakePlaceholder =
  createUserPhotoIntakePlaceholder({
    placeholderId: 'photo-placeholder-manual-upload-future-example',
    status: 'ready_for_future_phase',
    capabilities: ['manual_upload_future', 'skin_tone_reference_future'],
  });

export const beginnerPersonalizationPlaceholderExample: UserPersonalizationPlaceholder =
  createDefaultUserPersonalizationPlaceholder({
    placeholderId: 'personalization-placeholder-beginner-example',
  });

export const advancedPersonalizationPlaceholderExample: UserPersonalizationPlaceholder =
  createDefaultUserPersonalizationPlaceholder({
    placeholderId: 'personalization-placeholder-advanced-example',
    preferences: [
      {
        preferenceId: 'skill-level',
        label: 'Skill level',
        value: 'advanced',
        sensitivity: 'non_sensitive_placeholder',
        durable: false,
      },
      {
        preferenceId: 'guidance-verbosity',
        label: 'Guidance verbosity',
        value: 'brief',
        sensitivity: 'non_sensitive_placeholder',
        durable: false,
      },
      {
        preferenceId: 'available-time',
        label: 'Available time',
        value: '6 minutes',
        sensitivity: 'non_sensitive_placeholder',
        durable: false,
      },
    ],
  });

export const blockedUnsafeUserPhotoReferenceFixture = {
  fixtureId: 'blocked-unsafe-user-photo-reference',
  faceEmbedding: [0.1, 0.2, 0.3],
  biometricId: 'redacted-biometric-fixture',
  trainingInput: true,
  persistentPhotoReference: 'redacted-persistent-user-photo-reference',
};
