export interface UserAppSessionPrivacyIssue {
  code:
    | 'session_photo_object_url'
    | 'session_base64_image'
    | 'session_local_path'
    | 'session_photo_bytes'
    | 'session_biometric_identifier'
    | 'session_training_input'
    | 'session_sensitive_profile'
    | 'session_react_state'
    | 'session_non_serializable_value';
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
  code: UserAppSessionPrivacyIssue['code'],
  path: string,
  message: string,
): UserAppSessionPrivacyIssue => ({
  code,
  path,
  message,
  blocking: true,
});

const isPlainRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value) as unknown;
  return prototype === Object.prototype || prototype === null;
};

const normalizedKey = (key?: string): string => key?.toLowerCase() ?? '';

const walk = (
  value: unknown,
  visitor: (
    value: unknown,
    path: string,
    key?: string,
  ) => UserAppSessionPrivacyIssue[],
  path = '$',
  key?: string,
): UserAppSessionPrivacyIssue[] => {
  const issues = visitor(value, path, key);

  if (Array.isArray(value)) {
    return [
      ...issues,
      ...value.flatMap((item, index) => walk(item, visitor, `${path}[${index}]`)),
    ];
  }

  if (isPlainRecord(value)) {
    return [
      ...issues,
      ...Object.entries(value).flatMap(([entryKey, entryValue]) =>
        walk(entryValue, visitor, `${path}.${entryKey}`, entryKey),
      ),
    ];
  }

  return issues;
};

export const validateNoSessionObjectUrl = (
  value: unknown,
): UserAppSessionPrivacyIssue[] =>
  walk(value, (current, path) =>
    typeof current === 'string' && objectUrlPattern.test(current)
      ? [
          issue(
            'session_photo_object_url',
            path,
            'User App session cannot contain object URLs or runtime-only photo references.',
          ),
        ]
      : [],
  );

export const validateNoSessionBase64Image = (
  value: unknown,
): UserAppSessionPrivacyIssue[] =>
  walk(value, (current, path) =>
    typeof current === 'string' &&
    (dataImagePattern.test(current) || base64ImageLikePattern.test(current))
      ? [
          issue(
            'session_base64_image',
            path,
            'User App session cannot contain data:image strings or base64 image-like values.',
          ),
        ]
      : [],
  );

export const validateNoSessionLocalPath = (
  value: unknown,
): UserAppSessionPrivacyIssue[] =>
  walk(value, (current, path) =>
    typeof current === 'string' &&
    (windowsAbsolutePathPattern.test(current) || unixAbsolutePathPattern.test(current))
      ? [
          issue(
            'session_local_path',
            path,
            'User App session cannot contain local absolute paths.',
          ),
        ]
      : [],
  );

export const validateNoSessionPhotoBytes = (
  value: unknown,
): UserAppSessionPrivacyIssue[] =>
  walk(value, (current, path, key) => {
    const keyName = normalizedKey(key);
    const keyLooksLikeBytes =
      keyName.includes('imagebytes') ||
      keyName.includes('photobytes') ||
      keyName === 'bytes' ||
      keyName.endsWith('bytes');

    return keyLooksLikeBytes || current instanceof Uint8Array || current instanceof ArrayBuffer
      ? [
          issue(
            'session_photo_bytes',
            path,
            'User App session cannot contain image bytes, photoBytes, imageBytes, or binary photo data.',
          ),
        ]
      : [];
  });

export const validateNoSessionBiometricIdentifier = (
  value: unknown,
): UserAppSessionPrivacyIssue[] =>
  walk(value, (_current, path, key) => {
    const keyName = normalizedKey(key);

    return keyName.includes('faceembedding') ||
      keyName.includes('biometricid') ||
      keyName.includes('biometricidentifier') ||
      keyName.includes('faceprint')
      ? [
          issue(
            'session_biometric_identifier',
            path,
            'User App session cannot contain face embeddings, faceprints, or biometric identifiers.',
          ),
        ]
      : [];
  });

export const validateNoSessionTrainingInput = (
  value: unknown,
): UserAppSessionPrivacyIssue[] =>
  walk(value, (current, path, key) => {
    const keyName = normalizedKey(key);
    const isTrainingMarker =
      keyName.includes('traininginput') ||
      keyName.includes('trainingdataset') ||
      current === 'trainingInput' ||
      current === 'trainingDataset';

    return isTrainingMarker && current !== false
      ? [
          issue(
            'session_training_input',
            path,
            'User App session cannot become training input or training dataset material.',
          ),
        ]
      : [];
  });

export const validateNoSessionSensitiveProfile = (
  value: unknown,
): UserAppSessionPrivacyIssue[] =>
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
      'sensitiveprofile',
    ];

    return sensitiveKeys.some((sensitiveKey) => keyName.includes(sensitiveKey)) &&
      _current !== false
      ? [
          issue(
            'session_sensitive_profile',
            path,
            'User App session cannot contain health, sensitive identity, or precise personal identity fields.',
          ),
        ]
      : [];
  });

export const validateNoSessionReactState = (
  value: unknown,
): UserAppSessionPrivacyIssue[] =>
  walk(value, (_current, path, key) => {
    const keyName = normalizedKey(key);
    const looksLikeReactState =
      keyName.includes('reactstate') ||
      keyName.includes('__react') ||
      keyName === 'setstate' ||
      keyName === 'componentstate' ||
      keyName === 'fiber' ||
      keyName === 'hookstate';

    return looksLikeReactState
      ? [
          issue(
            'session_react_state',
            path,
            'User App session cannot persist React component state or internal React fields.',
          ),
        ]
      : [];
  });

export const validateNoSessionNonSerializableValues = (
  value: unknown,
  path = '$',
): UserAppSessionPrivacyIssue[] => {
  if (typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint') {
    return [
      issue(
        'session_non_serializable_value',
        path,
        'User App session can persist JSON-serializable plain data only.',
      ),
    ];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      validateNoSessionNonSerializableValues(item, `${path}[${index}]`),
    );
  }

  if (typeof value === 'object' && value !== null) {
    if (!isPlainRecord(value)) {
      return [
        issue(
          'session_non_serializable_value',
          path,
          'User App session cannot persist class instances or non-plain objects.',
        ),
      ];
    }

    return Object.entries(value).flatMap(([key, nextValue]) =>
      validateNoSessionNonSerializableValues(nextValue, `${path}.${key}`),
    );
  }

  return [];
};

export const createSessionBoundaryWarnings = (
  value: unknown,
): UserAppSessionPrivacyIssue[] => [
  ...validateNoSessionPhotoBytes(value),
  ...validateNoSessionObjectUrl(value),
  ...validateNoSessionLocalPath(value),
  ...validateNoSessionBase64Image(value),
  ...validateNoSessionBiometricIdentifier(value),
  ...validateNoSessionTrainingInput(value),
  ...validateNoSessionSensitiveProfile(value),
  ...validateNoSessionReactState(value),
  ...validateNoSessionNonSerializableValues(value),
];

export const createSessionPrivacySummary = (value: unknown): string => {
  const issues = createSessionBoundaryWarnings(value);

  return JSON.stringify({
    ready: issues.length === 0,
    blockingIssues: issues.length,
    noPhotoBytes: validateNoSessionPhotoBytes(value).length === 0,
    noObjectUrl: validateNoSessionObjectUrl(value).length === 0,
    noLocalPath: validateNoSessionLocalPath(value).length === 0,
    noBase64Image: validateNoSessionBase64Image(value).length === 0,
    noBiometricIdentifier: validateNoSessionBiometricIdentifier(value).length === 0,
    notTrainingInput: validateNoSessionTrainingInput(value).length === 0,
    noSensitiveProfile: validateNoSessionSensitiveProfile(value).length === 0,
    noReactState: validateNoSessionReactState(value).length === 0,
  });
};
