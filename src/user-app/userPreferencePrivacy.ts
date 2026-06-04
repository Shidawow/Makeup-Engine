export interface UserPreferencePrivacyIssue {
  code:
    | 'preference_photo_object_url'
    | 'preference_base64_image'
    | 'preference_local_path'
    | 'preference_photo_bytes'
    | 'preference_biometric_identifier'
    | 'preference_training_input'
    | 'sensitive_preference_field';
  path: string;
  message: string;
  blocking: true;
}

const objectUrlPattern = /^blob:/i;
const dataImagePattern = /^data:image\//i;
const base64ImageLikePattern =
  /^(?:\/9j\/|iVBORw0KGgo|R0lGODlh|R0lGODdh|UklGR)[A-Za-z0-9+/=]{24,}/;
const windowsAbsolutePathPattern = /^[A-Za-z]:[\\/]/;
const unixAbsolutePathPattern = /^\/(?:Users|home|var|tmp|private|Volumes|mnt)\//;

const issue = (
  code: UserPreferencePrivacyIssue['code'],
  path: string,
  message: string,
): UserPreferencePrivacyIssue => ({
  code,
  path,
  message,
  blocking: true,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const walk = (
  value: unknown,
  visitor: (
    value: unknown,
    path: string,
    key?: string,
  ) => UserPreferencePrivacyIssue[],
  path = '$',
  key?: string,
): UserPreferencePrivacyIssue[] => {
  const issues = visitor(value, path, key);

  if (Array.isArray(value)) {
    return [
      ...issues,
      ...value.flatMap((item, index) => walk(item, visitor, `${path}[${index}]`)),
    ];
  }

  if (isRecord(value)) {
    return [
      ...issues,
      ...Object.entries(value).flatMap(([entryKey, entryValue]) =>
        walk(entryValue, visitor, `${path}.${entryKey}`, entryKey),
      ),
    ];
  }

  return issues;
};

const normalizedKey = (key?: string): string => key?.toLowerCase() ?? '';

export const validateNoPreferenceObjectUrl = (
  value: unknown,
): UserPreferencePrivacyIssue[] =>
  walk(value, (current, path) =>
    typeof current === 'string' && objectUrlPattern.test(current)
      ? [
          issue(
            'preference_photo_object_url',
            path,
            'Local preferences cannot contain object URLs or runtime-only photo references.',
          ),
        ]
      : [],
  );

export const validateNoPreferenceBase64Image = (
  value: unknown,
): UserPreferencePrivacyIssue[] =>
  walk(value, (current, path) =>
    typeof current === 'string' &&
    (dataImagePattern.test(current) || base64ImageLikePattern.test(current))
      ? [
          issue(
            'preference_base64_image',
            path,
            'Local preferences cannot contain data:image strings or base64 image-like values.',
          ),
        ]
      : [],
  );

export const validateNoPreferencePhotoBytes = (
  value: unknown,
): UserPreferencePrivacyIssue[] =>
  walk(value, (current, path, key) => {
    const keyName = normalizedKey(key);
    const keyLooksLikeBytes =
      keyName.includes('imagebytes') ||
      keyName.includes('photobytes') ||
      keyName === 'bytes' ||
      keyName.endsWith('bytes');

    return keyLooksLikeBytes || current instanceof Uint8Array
      ? [
          issue(
            'preference_photo_bytes',
            path,
            'Local preferences cannot contain image bytes, photoBytes, imageBytes, or binary photo data.',
          ),
        ]
      : [];
  });

export const validateNoPreferenceLocalPath = (
  value: unknown,
): UserPreferencePrivacyIssue[] =>
  walk(value, (current, path) =>
    typeof current === 'string' &&
    (windowsAbsolutePathPattern.test(current) || unixAbsolutePathPattern.test(current))
      ? [
          issue(
            'preference_local_path',
            path,
            'Local preferences cannot contain local absolute paths.',
          ),
        ]
      : [],
  );

export const validateNoPreferenceBiometricIdentifier = (
  value: unknown,
): UserPreferencePrivacyIssue[] =>
  walk(value, (_current, path, key) => {
    const keyName = normalizedKey(key);

    return keyName.includes('faceembedding') ||
      keyName.includes('biometricid') ||
      keyName.includes('biometricidentifier') ||
      keyName.includes('faceprint')
      ? [
          issue(
            'preference_biometric_identifier',
            path,
            'Local preferences cannot contain face embeddings, faceprints, or biometric identifiers.',
          ),
        ]
      : [];
  });

export const validateNoSensitivePreferenceFields = (
  value: unknown,
): UserPreferencePrivacyIssue[] =>
  walk(value, (_current, path, key) => {
    const keyName = normalizedKey(key);
    const sensitiveKeys = [
      'health',
      'medical',
      'diagnosis',
      'ethnicity',
      'race',
      'religion',
      'political',
      'legalname',
      'governmentid',
      'passport',
      'address',
      'phone',
      'email',
      'preciseidentity',
      'sensitiveidentity',
    ];

    return sensitiveKeys.some((sensitiveKey) => keyName.includes(sensitiveKey))
      ? [
          issue(
            'sensitive_preference_field',
            path,
            'Local preferences cannot contain health, sensitive identity, or precise personal identity fields.',
          ),
        ]
      : [];
  });

export const validateNoTrainingInputFromPreferences = (
  value: unknown,
): UserPreferencePrivacyIssue[] =>
  walk(value, (current, path, key) => {
    const keyName = normalizedKey(key);
    const isTrainingMarker =
      keyName.includes('traininginput') ||
      keyName.includes('trainingdataset') ||
      current === 'trainingInput' ||
      current === 'trainingDataset';

    return isTrainingMarker
      ? [
          issue(
            'preference_training_input',
            path,
            'Local preferences cannot become training input or training dataset material.',
          ),
        ]
      : [];
  });

export const createPreferenceBoundaryWarnings = (
  value: unknown,
): UserPreferencePrivacyIssue[] => [
  ...validateNoPreferencePhotoBytes(value),
  ...validateNoPreferenceObjectUrl(value),
  ...validateNoPreferenceLocalPath(value),
  ...validateNoPreferenceBase64Image(value),
  ...validateNoPreferenceBiometricIdentifier(value),
  ...validateNoSensitivePreferenceFields(value),
  ...validateNoTrainingInputFromPreferences(value),
];

export const createPreferencePrivacySummary = (value: unknown): string => {
  const issues = createPreferenceBoundaryWarnings(value);

  return JSON.stringify({
    ready: issues.length === 0,
    blockingIssues: issues.length,
    noPhotoBytes: validateNoPreferencePhotoBytes(value).length === 0,
    noObjectUrl: validateNoPreferenceObjectUrl(value).length === 0,
    noLocalPath: validateNoPreferenceLocalPath(value).length === 0,
    noBase64Image: validateNoPreferenceBase64Image(value).length === 0,
    noBiometricIdentifier:
      validateNoPreferenceBiometricIdentifier(value).length === 0,
    noSensitiveFields: validateNoSensitivePreferenceFields(value).length === 0,
    notTrainingInput: validateNoTrainingInputFromPreferences(value).length === 0,
  });
};
