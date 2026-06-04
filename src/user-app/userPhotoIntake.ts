import {
  createUserPhotoBoundaryWarnings,
  type UserPhotoPrivacyIssue,
} from './userPhotoPrivacy';

export type UserPhotoIntakeStatus =
  | 'unavailable'
  | 'placeholder_only'
  | 'not_started'
  | 'permission_required_future'
  | 'disabled_by_boundary'
  | 'ready_for_future_phase'
  | 'blocked';

export type UserPhotoIntakeCapability =
  | 'manual_upload_future'
  | 'camera_capture_future'
  | 'face_analysis_future'
  | 'skin_tone_reference_future'
  | 'face_shape_reference_future'
  | 'progress_photo_future';

export interface UserPhotoIntakeIssue {
  code: string;
  severity: 'warning' | 'blocking';
  message: string;
  source: 'placeholder' | 'privacy-boundary' | 'phase-boundary';
}

export interface UserPhotoIntakePrivacyNotice {
  title: string;
  statements: string[];
  localOnly: true;
  collectsPhoto: false;
  uploadsPhoto: false;
  analyzesPhoto: false;
  writesTrainingData: false;
}

export interface UserPhotoIntakeReadiness {
  ready: boolean;
  placeholderOnly: true;
  blockingIssues: UserPhotoIntakeIssue[];
  warnings: UserPhotoIntakeIssue[];
}

export interface UserPhotoIntakePlaceholder {
  placeholderId: string;
  title: string;
  status: UserPhotoIntakeStatus;
  capabilities: UserPhotoIntakeCapability[];
  disabledCapabilities: UserPhotoIntakeCapability[];
  phaseBoundary: 'phase-7c-placeholder-only';
  userFacingSummary: string;
  nextAction: string;
  privacyNotice: UserPhotoIntakePrivacyNotice;
  readiness: UserPhotoIntakeReadiness;
  createdAt: string;
}

export type UserPhotoIntakeState = UserPhotoIntakePlaceholder;

const defaultCapabilities: UserPhotoIntakeCapability[] = [
  'manual_upload_future',
  'camera_capture_future',
  'face_analysis_future',
  'skin_tone_reference_future',
  'face_shape_reference_future',
  'progress_photo_future',
];

export const createUserPhotoIntakePrivacyNotice = (): UserPhotoIntakePrivacyNotice => ({
  title: 'User photo privacy boundary',
  statements: [
    'Current version does not collect, upload, store, or analyze real user photos.',
    'Photo intake is a disabled placeholder for a future phase.',
    'No photo bytes, object URLs, base64 images, local paths, face embeddings, or biometric identifiers may be stored.',
    'User photos must not enter durable export, project-state, or training datasets.',
  ],
  localOnly: true,
  collectsPhoto: false,
  uploadsPhoto: false,
  analyzesPhoto: false,
  writesTrainingData: false,
});

const privacyIssuesToIntakeIssues = (
  issues: readonly UserPhotoPrivacyIssue[],
): UserPhotoIntakeIssue[] =>
  issues.map((privacyIssue) => ({
    code: privacyIssue.code,
    severity: 'blocking',
    message: privacyIssue.message,
    source: 'privacy-boundary',
  }));

const containsSourceImagePackageReference = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value === 'SourceImagePackage' || value.includes('source-image-package');
  }

  if (Array.isArray(value)) {
    return value.some(containsSourceImagePackageReference);
  }

  if (typeof value === 'object' && value !== null) {
    return Object.entries(value as Record<string, unknown>).some(([key, entryValue]) =>
      key === 'sourceImagePackageId' ||
      key === 'sourceImagePackage' ||
      containsSourceImagePackageReference(entryValue),
    );
  }

  return false;
};

export const validateUserPhotoIntakeBoundary = (
  value: unknown,
): UserPhotoIntakeReadiness => {
  const privacyIssues = createUserPhotoBoundaryWarnings(value);
  const sourcePackageIssues: UserPhotoIntakeIssue[] = containsSourceImagePackageReference(value)
    ? [
        {
          code: 'source-image-package-not-user-photo-intake',
          severity: 'blocking',
          message:
            'SourceImagePackage cannot directly enter User App photo intake; it remains an admin production input.',
          source: 'phase-boundary',
        },
      ]
    : [];

  return {
    ready: privacyIssues.length === 0 && sourcePackageIssues.length === 0,
    placeholderOnly: true,
    blockingIssues: [...privacyIssuesToIntakeIssues(privacyIssues), ...sourcePackageIssues],
    warnings: [
      {
        code: 'photo-intake-placeholder-only',
        severity: 'warning',
        message: 'Photo intake is visible only as a disabled future capability in Phase 7C.',
        source: 'phase-boundary',
      },
    ],
  };
};

export const getUserPhotoIntakeNextAction = (
  state: Pick<UserPhotoIntakePlaceholder, 'status' | 'readiness'>,
): string => {
  if (!state.readiness.ready || state.status === 'blocked') {
    return 'Remove unsafe photo references before showing any user-facing photo capability.';
  }

  if (state.status === 'placeholder_only' || state.status === 'disabled_by_boundary') {
    return 'Continue using template guidance without a user photo; real photo intake requires a future phase gate.';
  }

  return 'Keep photo intake disabled until a future phase explicitly enables camera or upload work.';
};

export const createUserPhotoIntakePlaceholder = (input?: {
  placeholderId?: string;
  status?: UserPhotoIntakeStatus;
  capabilities?: UserPhotoIntakeCapability[];
  createdAt?: string;
  unsafeFixture?: unknown;
}): UserPhotoIntakePlaceholder => {
  const readiness = validateUserPhotoIntakeBoundary(input?.unsafeFixture ?? {});
  const status = readiness.ready ? input?.status ?? 'placeholder_only' : 'blocked';
  const state: UserPhotoIntakePlaceholder = {
    placeholderId: input?.placeholderId ?? 'user-photo-intake-placeholder-v0',
    title: 'User photo intake placeholder',
    status,
    capabilities: input?.capabilities ?? defaultCapabilities,
    disabledCapabilities: input?.capabilities ?? defaultCapabilities,
    phaseBoundary: 'phase-7c-placeholder-only',
    userFacingSummary:
      'Photo and camera features are not enabled in this local prototype; template guidance still works without a user photo.',
    nextAction: 'Continue with template guidance. Photo personalization requires a future phase.',
    privacyNotice: createUserPhotoIntakePrivacyNotice(),
    readiness,
    createdAt: input?.createdAt ?? '2026-06-02T00:00:00.000Z',
  };

  return {
    ...state,
    nextAction: getUserPhotoIntakeNextAction(state),
  };
};

export const summarizeUserPhotoIntakeState = (
  state: UserPhotoIntakeState,
): string =>
  JSON.stringify({
    placeholderId: state.placeholderId,
    status: state.status,
    placeholderOnly: true,
    capabilities: state.capabilities.length,
    disabledCapabilities: state.disabledCapabilities.length,
    ready: state.readiness.ready,
    blockingIssues: state.readiness.blockingIssues.length,
    collectsPhoto: false,
    uploadsPhoto: false,
    trainingInput: false,
  });
