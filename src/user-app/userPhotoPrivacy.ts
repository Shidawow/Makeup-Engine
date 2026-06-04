export interface UserPhotoPrivacyIssue {
  code:
    | 'user_photo_object_url'
    | 'user_photo_base64_image'
    | 'user_photo_local_path'
    | 'user_photo_bytes'
    | 'biometric_identifier'
    | 'user_photo_training_input'
    | 'persistent_photo_reference';
  path: string;
  message: string;
  blocking: true;
}

const objectUrlPattern = /^blob:/i;
const dataImagePattern = /^data:image\//i;
const base64ImageLikePattern =
  /^(?:\/9j\/|iVBORw0KGgo|R0lGODlh|R0lGODdh|UklGR)[A-Za-z0-9+/=]{32,}/;
const windowsAbsolutePathPattern = /^[A-Za-z]:[\\/]/;
const unixAbsolutePathPattern = /^\/(?:Users|home|var|tmp|private|Volumes)\//;

const issue = (
  code: UserPhotoPrivacyIssue['code'],
  path: string,
  message: string,
): UserPhotoPrivacyIssue => ({
  code,
  path,
  message,
  blocking: true,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const walk = (
  value: unknown,
  visitor: (value: unknown, path: string, key?: string) => UserPhotoPrivacyIssue[],
  path = '$',
  key?: string,
): UserPhotoPrivacyIssue[] => {
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

export const validateNoUserPhotoObjectUrl = (value: unknown): UserPhotoPrivacyIssue[] =>
  walk(value, (current, path) =>
    typeof current === 'string' && objectUrlPattern.test(current)
      ? [
          issue(
            'user_photo_object_url',
            path,
            'User photo placeholder contains an object URL, which is runtime-only and cannot be durable state.',
          ),
        ]
      : [],
  );

export const validateNoUserPhotoBytes = (value: unknown): UserPhotoPrivacyIssue[] =>
  walk(value, (current, path, key) => {
    const normalizedKey = key?.toLowerCase() ?? '';
    const keyLooksLikeBytes =
      normalizedKey.includes('imagebytes') ||
      normalizedKey.includes('photobytes') ||
      normalizedKey.includes('bytes');
    const valueLooksLikeImage =
      typeof current === 'string' &&
      (dataImagePattern.test(current) || base64ImageLikePattern.test(current));

    if (keyLooksLikeBytes || valueLooksLikeImage) {
      return [
        issue(
          valueLooksLikeImage ? 'user_photo_base64_image' : 'user_photo_bytes',
          path,
          'User photo placeholder cannot contain inline image bytes, base64 image data, or byte fields.',
        ),
      ];
    }

    return [];
  });

export const validateNoUserPhotoLocalPath = (value: unknown): UserPhotoPrivacyIssue[] =>
  walk(value, (current, path) =>
    typeof current === 'string' &&
    (windowsAbsolutePathPattern.test(current) || unixAbsolutePathPattern.test(current))
      ? [
          issue(
            'user_photo_local_path',
            path,
            'User photo placeholder cannot contain a local absolute path.',
          ),
        ]
      : [],
  );

export const validateNoBiometricIdentifier = (value: unknown): UserPhotoPrivacyIssue[] =>
  walk(value, (_current, path, key) => {
    const normalizedKey = key?.toLowerCase() ?? '';

    if (
      normalizedKey.includes('faceembedding') ||
      normalizedKey.includes('biometricid') ||
      normalizedKey.includes('biometricidentifier') ||
      normalizedKey.includes('faceprint')
    ) {
      return [
        issue(
          'biometric_identifier',
          path,
          'User photo placeholder cannot contain face embeddings or biometric identifiers.',
        ),
      ];
    }

    return [];
  });

export const validateUserPhotoNotTrainingInput = (
  value: unknown,
): UserPhotoPrivacyIssue[] =>
  walk(value, (current, path, key) => {
    const normalizedKey = key?.toLowerCase() ?? '';
    const marksTrainingInput =
      normalizedKey.includes('traininginput') ||
      normalizedKey.includes('trainingdataset') ||
      current === 'trainingInput';
    const marksPersistentPhotoReference =
      normalizedKey.includes('persistentphotoreference') ||
      normalizedKey.includes('durablephotoreference');

    return [
      ...(marksTrainingInput
        ? [
            issue(
              'user_photo_training_input',
              path,
              'User photo placeholder cannot become training input.',
            ),
          ]
        : []),
      ...(marksPersistentPhotoReference
        ? [
            issue(
              'persistent_photo_reference',
              path,
              'User photo placeholder cannot contain durable photo references.',
            ),
          ]
        : []),
    ];
  });

export const createUserPhotoBoundaryWarnings = (
  value: unknown,
): UserPhotoPrivacyIssue[] => [
  ...validateNoUserPhotoObjectUrl(value),
  ...validateNoUserPhotoBytes(value),
  ...validateNoUserPhotoLocalPath(value),
  ...validateNoBiometricIdentifier(value),
  ...validateUserPhotoNotTrainingInput(value),
];

export const createUserPhotoPrivacySummary = (value: unknown): string => {
  const issues = createUserPhotoBoundaryWarnings(value);

  return JSON.stringify({
    ready: issues.length === 0,
    blockingIssues: issues.length,
    noPhotoBytes: validateNoUserPhotoBytes(value).length === 0,
    noObjectUrl: validateNoUserPhotoObjectUrl(value).length === 0,
    noLocalPath: validateNoUserPhotoLocalPath(value).length === 0,
    noBiometricIdentifier: validateNoBiometricIdentifier(value).length === 0,
    notTrainingInput: validateUserPhotoNotTrainingInput(value).length === 0,
  });
};
