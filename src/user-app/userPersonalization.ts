import type { UserAppTemplateDetailViewModel } from './userAppViewModel';

export type UserPersonalizationCapability =
  | 'skill_level'
  | 'preferred_makeup_style'
  | 'available_time'
  | 'available_tools'
  | 'comfort_level'
  | 'occasion'
  | 'guidance_verbosity';

export interface UserPersonalizationPreference {
  preferenceId: string;
  label: string;
  value: string;
  sensitivity: 'non_sensitive_placeholder';
  durable: false;
}

export interface UserPersonalizationBoundary {
  placeholderOnly: true;
  storesSensitiveProfile: false;
  storesFaceEmbedding: false;
  storesUserPhoto: false;
  writesTrainingData: false;
  writesDurableExport: false;
  notes: string[];
}

export interface UserPersonalizationReadiness {
  ready: boolean;
  warnings: string[];
  blockingIssues: string[];
}

export interface UserPersonalizationPlaceholder {
  placeholderId: string;
  capabilities: UserPersonalizationCapability[];
  preferences: UserPersonalizationPreference[];
  readiness: UserPersonalizationReadiness;
  boundary: UserPersonalizationBoundary;
  createdAt: string;
}

export interface UserGuidancePersonalizationHints {
  skillLevelHint: string;
  pacingHint: string;
  toolHint: string;
  verbosityHint: string;
  photoStatusHint: string;
  modifiesTemplate: false;
  writesUserProfile: false;
}

const defaultPreferences: UserPersonalizationPreference[] = [
  {
    preferenceId: 'skill-level',
    label: 'Skill level',
    value: 'beginner',
    sensitivity: 'non_sensitive_placeholder',
    durable: false,
  },
  {
    preferenceId: 'guidance-verbosity',
    label: 'Guidance verbosity',
    value: 'detailed',
    sensitivity: 'non_sensitive_placeholder',
    durable: false,
  },
  {
    preferenceId: 'available-time',
    label: 'Available time',
    value: '10 minutes',
    sensitivity: 'non_sensitive_placeholder',
    durable: false,
  },
  {
    preferenceId: 'occasion',
    label: 'Occasion',
    value: 'daily',
    sensitivity: 'non_sensitive_placeholder',
    durable: false,
  },
  {
    preferenceId: 'preferred-style',
    label: 'Preferred style',
    value: 'soft natural',
    sensitivity: 'non_sensitive_placeholder',
    durable: false,
  },
];

const defaultCapabilities: UserPersonalizationCapability[] = [
  'skill_level',
  'preferred_makeup_style',
  'available_time',
  'available_tools',
  'comfort_level',
  'occasion',
  'guidance_verbosity',
];

export const validateUserPersonalizationBoundary = (
  placeholder: Pick<UserPersonalizationPlaceholder, 'preferences' | 'boundary'>,
): UserPersonalizationReadiness => {
  const blockingIssues = [
    ...placeholder.preferences
      .filter((preference) => preference.durable)
      .map((preference) => `${preference.preferenceId} cannot be durable in Phase 7C.`),
    ...(placeholder.boundary.storesSensitiveProfile
      ? ['Sensitive user profile storage is blocked.']
      : []),
    ...(placeholder.boundary.storesFaceEmbedding
      ? ['Face embedding storage is blocked.']
      : []),
    ...(placeholder.boundary.storesUserPhoto ? ['User photo storage is blocked.'] : []),
    ...(placeholder.boundary.writesTrainingData
      ? ['Personalization placeholder cannot write training data.']
      : []),
    ...(placeholder.boundary.writesDurableExport
      ? ['Personalization placeholder cannot write durable export data.']
      : []),
  ];

  return {
    ready: blockingIssues.length === 0,
    warnings: ['Personalization is a local placeholder and does not persist user profile data.'],
    blockingIssues,
  };
};

export const createDefaultUserPersonalizationPlaceholder = (input?: {
  placeholderId?: string;
  preferences?: UserPersonalizationPreference[];
  createdAt?: string;
}): UserPersonalizationPlaceholder => {
  const boundary: UserPersonalizationBoundary = {
    placeholderOnly: true,
    storesSensitiveProfile: false,
    storesFaceEmbedding: false,
    storesUserPhoto: false,
    writesTrainingData: false,
    writesDurableExport: false,
    notes: [
      'No health information, precise identity attributes, biometrics, or real photo data are collected.',
      'Placeholder preferences may affect display hints only.',
      'Template data and UserAppTemplatePackage are not modified.',
    ],
  };
  const draft = {
    preferences: input?.preferences ?? defaultPreferences,
    boundary,
  };

  return {
    placeholderId: input?.placeholderId ?? 'user-personalization-placeholder-v0',
    capabilities: defaultCapabilities,
    preferences: draft.preferences,
    readiness: validateUserPersonalizationBoundary(draft),
    boundary,
    createdAt: input?.createdAt ?? '2026-06-02T00:00:00.000Z',
  };
};

const preferenceValue = (
  placeholder: UserPersonalizationPlaceholder,
  preferenceId: string,
  fallback: string,
): string =>
  placeholder.preferences.find((preference) => preference.preferenceId === preferenceId)
    ?.value ?? fallback;

export const mapPersonalizationToGuidanceHints = (
  placeholder: UserPersonalizationPlaceholder,
): UserGuidancePersonalizationHints => {
  const skillLevel = preferenceValue(placeholder, 'skill-level', 'beginner');
  const verbosity = preferenceValue(placeholder, 'guidance-verbosity', 'detailed');
  const availableTime = preferenceValue(placeholder, 'available-time', '10 minutes');

  return {
    skillLevelHint:
      skillLevel === 'beginner'
        ? 'Beginner mode: slow down and check each edge before moving on.'
        : 'Experienced mode: keep the flow concise and focus on finish quality.',
    pacingHint: `Use the template at a ${availableTime} pace without changing the template itself.`,
    toolHint: 'Use only the tools listed by the template unless the user manually adapts at runtime.',
    verbosityHint:
      verbosity === 'brief'
        ? 'Show compact reminders.'
        : 'Show detailed reminders, common mistakes, and correction tips.',
    photoStatusHint: 'No user photo is loaded; guidance remains template-driven.',
    modifiesTemplate: false,
    writesUserProfile: false,
  };
};

export const createPersonalizedGuidancePreview = (input: {
  template?: UserAppTemplateDetailViewModel | null;
  personalization: UserPersonalizationPlaceholder;
}): string => {
  const hints = mapPersonalizationToGuidanceHints(input.personalization);

  return JSON.stringify({
    templateId: input.template?.appTemplateId,
    templateTitle: input.template?.title,
    hints,
    stepsUnchanged: input.template?.steps.length ?? 0,
    modifiesTemplate: false,
    writesUserProfile: false,
    writesTrainingData: false,
  });
};

export const applyPlaceholderPersonalizationToGuidance = (input: {
  template?: UserAppTemplateDetailViewModel | null;
  personalization: UserPersonalizationPlaceholder;
}): UserGuidancePersonalizationHints => mapPersonalizationToGuidanceHints(input.personalization);

export const createGuidancePersonalizationHints = (
  personalization: UserPersonalizationPlaceholder,
): UserGuidancePersonalizationHints => mapPersonalizationToGuidanceHints(personalization);

export const summarizeGuidanceWithoutUserPhoto = (): string =>
  'No user photo is loaded. Step guidance still works from UserAppTemplatePackage.';

export const summarizeFuturePhotoPersonalization = (): string =>
  'Future photo personalization may adapt region emphasis and pacing after a new phase gate; Phase 7C does not collect or analyze photos.';

export const summarizeUserPersonalization = (
  placeholder: UserPersonalizationPlaceholder,
): string =>
  JSON.stringify({
    placeholderId: placeholder.placeholderId,
    placeholderOnly: true,
    preferences: placeholder.preferences.length,
    ready: placeholder.readiness.ready,
    blockingIssues: placeholder.readiness.blockingIssues.length,
    storesSensitiveProfile: false,
    storesUserPhoto: false,
    writesTrainingData: false,
    writesDurableExport: false,
  });
