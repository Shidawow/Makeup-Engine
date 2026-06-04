import type { UserAppTemplateDetailViewModel } from './userAppViewModel';

export type UserMakeupSkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'unknown';
export type UserGuidanceVerbosity = 'concise' | 'balanced' | 'detailed';
export type UserAvailableTimePreference =
  | 'under_5_minutes'
  | '5_to_10_minutes'
  | '10_to_20_minutes'
  | 'over_20_minutes'
  | 'flexible';
export type UserAvailableToolPreference =
  | 'fingers'
  | 'sponge'
  | 'brush'
  | 'lash_curler'
  | 'brow_pencil'
  | 'cotton_swab';
export type UserPreferredStyleTag =
  | 'natural'
  | 'soft'
  | 'polished'
  | 'glowy'
  | 'bold'
  | 'minimal';
export type UserOccasionPreference =
  | 'daily'
  | 'work'
  | 'date'
  | 'evening'
  | 'special_event'
  | 'practice';
export type UserComfortLevel = 'cautious' | 'normal' | 'adventurous';

export interface UserLocalPreferences {
  preferenceId: string;
  skillLevel: UserMakeupSkillLevel;
  guidanceVerbosity: UserGuidanceVerbosity;
  availableTime: UserAvailableTimePreference;
  availableTools: UserAvailableToolPreference[];
  preferredStyleTags: UserPreferredStyleTag[];
  occasion: UserOccasionPreference;
  comfortLevel: UserComfortLevel;
  onboardingCompleted: boolean;
  localOnly: true;
  containsUserPhoto: false;
  containsSensitiveProfile: false;
  writesTrainingInput: false;
  modifiesTemplatePackage: false;
}

export interface UserPreferenceIssue {
  code:
    | 'missing_preference_id'
    | 'invalid_available_tools'
    | 'invalid_style_tags'
    | 'sensitive_or_durable_preference';
  message: string;
  blocking: boolean;
}

export interface UserPreferenceReadiness {
  ready: boolean;
  warnings: string[];
  blockingIssues: string[];
}

export interface UserPreferenceSummary {
  preferenceId: string;
  skillLevel: UserMakeupSkillLevel;
  guidanceVerbosity: UserGuidanceVerbosity;
  availableTime: UserAvailableTimePreference;
  availableToolsCount: number;
  preferredStyleTags: UserPreferredStyleTag[];
  occasion: UserOccasionPreference;
  comfortLevel: UserComfortLevel;
  onboardingCompleted: boolean;
  localOnly: true;
  modifiesTemplatePackage: false;
  writesTrainingInput: false;
}

export interface PreferenceGuidanceHints {
  summary: string;
  skillLevelHint: string;
  verbosityHint: string;
  timeHint: string;
  toolAvailabilityHint: string;
  styleHint: string;
  comfortHint: string;
  stepTips: string[];
  modifiesTemplatePackage: false;
  writesTrainingInput: false;
  writesProjectState: false;
}

const allowedTools: UserAvailableToolPreference[] = [
  'fingers',
  'sponge',
  'brush',
  'lash_curler',
  'brow_pencil',
  'cotton_swab',
];

const allowedStyles: UserPreferredStyleTag[] = [
  'natural',
  'soft',
  'polished',
  'glowy',
  'bold',
  'minimal',
];

const unique = <T extends string>(items: readonly T[]): T[] => Array.from(new Set(items));

export const createDefaultUserLocalPreferences = (
  input?: Partial<
    Pick<
      UserLocalPreferences,
      | 'preferenceId'
      | 'skillLevel'
      | 'guidanceVerbosity'
      | 'availableTime'
      | 'availableTools'
      | 'preferredStyleTags'
      | 'occasion'
      | 'comfortLevel'
      | 'onboardingCompleted'
    >
  >,
): UserLocalPreferences => ({
  preferenceId: input?.preferenceId ?? 'local-preferences-default',
  skillLevel: input?.skillLevel ?? 'beginner',
  guidanceVerbosity: input?.guidanceVerbosity ?? 'balanced',
  availableTime: input?.availableTime ?? '10_to_20_minutes',
  availableTools: unique(input?.availableTools ?? ['fingers', 'brush']),
  preferredStyleTags: unique(input?.preferredStyleTags ?? ['natural', 'soft']),
  occasion: input?.occasion ?? 'daily',
  comfortLevel: input?.comfortLevel ?? 'normal',
  onboardingCompleted: input?.onboardingCompleted ?? false,
  localOnly: true,
  containsUserPhoto: false,
  containsSensitiveProfile: false,
  writesTrainingInput: false,
  modifiesTemplatePackage: false,
});

export const updateUserLocalPreference = <K extends keyof UserLocalPreferences>(
  preferences: UserLocalPreferences,
  key: K,
  value: UserLocalPreferences[K],
): UserLocalPreferences => ({
  ...preferences,
  [key]: value,
  localOnly: true,
  containsUserPhoto: false,
  containsSensitiveProfile: false,
  writesTrainingInput: false,
  modifiesTemplatePackage: false,
});

export const resetUserLocalPreferences = (): UserLocalPreferences =>
  createDefaultUserLocalPreferences();

export const validateUserLocalPreferences = (
  preferences: UserLocalPreferences,
): UserPreferenceIssue[] => {
  const issues: UserPreferenceIssue[] = [];

  if (!preferences.preferenceId.trim()) {
    issues.push({
      code: 'missing_preference_id',
      message: 'Local preferences must keep a deterministic preference id.',
      blocking: true,
    });
  }

  if (preferences.availableTools.some((tool) => !allowedTools.includes(tool))) {
    issues.push({
      code: 'invalid_available_tools',
      message: 'Available tools must use the Phase 7D non-sensitive local enum.',
      blocking: true,
    });
  }

  if (preferences.preferredStyleTags.some((tag) => !allowedStyles.includes(tag))) {
    issues.push({
      code: 'invalid_style_tags',
      message: 'Preferred style tags must use the Phase 7D non-sensitive local enum.',
      blocking: true,
    });
  }

  if (
    preferences.localOnly !== true ||
    preferences.containsUserPhoto !== false ||
    preferences.containsSensitiveProfile !== false ||
    preferences.writesTrainingInput !== false ||
    preferences.modifiesTemplatePackage !== false
  ) {
    issues.push({
      code: 'sensitive_or_durable_preference',
      message:
        'Phase 7D preferences must remain local-only, non-sensitive, not training input, and must not modify UserAppTemplatePackage.',
      blocking: true,
    });
  }

  return issues;
};

export const createPreferenceReadiness = (
  preferences: UserLocalPreferences,
): UserPreferenceReadiness => {
  const issues = validateUserLocalPreferences(preferences);

  return {
    ready: issues.every((issue) => !issue.blocking),
    warnings: [
      'Preferences are local-only display hints and are not an account profile.',
      ...(preferences.onboardingCompleted
        ? []
        : ['Onboarding is optional; default preferences are being used.']),
    ],
    blockingIssues: issues.filter((issue) => issue.blocking).map((issue) => issue.message),
  };
};

export const mergeOnboardingPreferences = (input: {
  preferences: UserLocalPreferences;
  onboardingCompleted: boolean;
}): UserLocalPreferences => ({
  ...input.preferences,
  onboardingCompleted: input.onboardingCompleted,
  localOnly: true,
  containsUserPhoto: false,
  containsSensitiveProfile: false,
  writesTrainingInput: false,
  modifiesTemplatePackage: false,
});

export const summarizeUserLocalPreferences = (
  preferences: UserLocalPreferences,
): UserPreferenceSummary => ({
  preferenceId: preferences.preferenceId,
  skillLevel: preferences.skillLevel,
  guidanceVerbosity: preferences.guidanceVerbosity,
  availableTime: preferences.availableTime,
  availableToolsCount: preferences.availableTools.length,
  preferredStyleTags: [...preferences.preferredStyleTags],
  occasion: preferences.occasion,
  comfortLevel: preferences.comfortLevel,
  onboardingCompleted: preferences.onboardingCompleted,
  localOnly: true,
  modifiesTemplatePackage: false,
  writesTrainingInput: false,
});

export const createSkillLevelGuidanceHint = (
  preferences: UserLocalPreferences,
): string => {
  if (preferences.skillLevel === 'beginner') {
    return 'Beginner hint: slow down, use lighter pressure, and keep correction tips visible.';
  }

  if (preferences.skillLevel === 'advanced') {
    return 'Advanced hint: keep the steps concise and focus on finish quality.';
  }

  if (preferences.skillLevel === 'intermediate') {
    return 'Intermediate hint: show the main instruction plus one practical reminder.';
  }

  return 'Skill level is unknown; keep balanced instructions visible.';
};

export const createTimeAwareGuidanceHint = (
  preferences: UserLocalPreferences,
): string => {
  if (preferences.availableTime === 'under_5_minutes') {
    return 'Time hint: highlight key steps first and avoid optional detail.';
  }

  if (preferences.availableTime === '5_to_10_minutes') {
    return 'Time hint: keep a quick pace and call out estimated seconds.';
  }

  if (preferences.availableTime === 'over_20_minutes') {
    return 'Time hint: allow extra blending and correction time.';
  }

  return 'Time hint: use the template duration without changing the template.';
};

export const createToolAvailabilityGuidanceHint = (
  preferences: UserLocalPreferences,
): string => {
  if (preferences.availableTools.length === 0) {
    return 'Tool hint: no tools were selected; suggest checking the required tool list before starting.';
  }

  if (!preferences.availableTools.includes('brush')) {
    return 'Tool hint: brush is not selected, so mention fingers, sponge, or cotton swab as runtime alternatives where appropriate.';
  }

  return `Tool hint: selected local tools include ${preferences.availableTools.join(', ')}.`;
};

export const createPreferenceBasedStepTips = (
  preferences: UserLocalPreferences,
): string[] => [
  createSkillLevelGuidanceHint(preferences),
  createTimeAwareGuidanceHint(preferences),
  createToolAvailabilityGuidanceHint(preferences),
  preferences.preferredStyleTags.includes('natural')
    ? 'Style hint: keep color payoff soft and build gradually.'
    : 'Style hint: follow the selected style tags as display guidance only.',
  preferences.comfortLevel === 'cautious'
    ? 'Comfort hint: use smaller amounts first and check symmetry before adding intensity.'
    : 'Comfort hint: follow the template intensity while staying within personal comfort.',
];

export const createGuidanceHintsFromPreferences = (
  preferences: UserLocalPreferences,
): PreferenceGuidanceHints => ({
  summary: `Local preferences: ${preferences.skillLevel}, ${preferences.guidanceVerbosity}, ${preferences.availableTime}.`,
  skillLevelHint: createSkillLevelGuidanceHint(preferences),
  verbosityHint:
    preferences.guidanceVerbosity === 'detailed'
      ? 'Verbosity hint: show detailed steps, common mistakes, and correction tips.'
      : preferences.guidanceVerbosity === 'concise'
        ? 'Verbosity hint: show compact reminders and keep the main action prominent.'
        : 'Verbosity hint: keep a balanced instruction and supporting details.',
  timeHint: createTimeAwareGuidanceHint(preferences),
  toolAvailabilityHint: createToolAvailabilityGuidanceHint(preferences),
  styleHint: preferences.preferredStyleTags.includes('natural')
    ? 'Style hint: user prefers natural looks, so emphasize light pressure and soft edges.'
    : `Style hint: user selected ${preferences.preferredStyleTags.join(', ')}.`,
  comfortHint:
    preferences.comfortLevel === 'adventurous'
      ? 'Comfort hint: user is comfortable trying stronger looks, but template safety notes still apply.'
      : 'Comfort hint: keep guidance within the selected comfort level.',
  stepTips: createPreferenceBasedStepTips(preferences),
  modifiesTemplatePackage: false,
  writesTrainingInput: false,
  writesProjectState: false,
});

export const summarizePreferencesForStepGuidance = (
  preferences: UserLocalPreferences,
): string => JSON.stringify(createGuidanceHintsFromPreferences(preferences));

export const applyPreferencesToGuidanceViewModel = (input: {
  template: UserAppTemplateDetailViewModel;
  preferences: UserLocalPreferences;
}): UserAppTemplateDetailViewModel & { preferenceHints: PreferenceGuidanceHints } => {
  const templateClone = JSON.parse(
    JSON.stringify(input.template),
  ) as UserAppTemplateDetailViewModel;

  return {
    ...templateClone,
    preferenceHints: createGuidanceHintsFromPreferences(input.preferences),
  };
};
