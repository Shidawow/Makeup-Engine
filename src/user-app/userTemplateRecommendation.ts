import type { UserAppTemplatePackage } from '../templates/schema';
import { validateNoRuntimeOnlyReferences, validateUserAppTemplate } from '../template-engine/app-contract';
import type {
  UserAvailableTimePreference,
  UserLocalPreferences,
  UserMakeupSkillLevel,
} from './userLocalPreferences';
import { createDefaultUserLocalPreferences } from './userLocalPreferences';
import {
  createTemplateDiscoveryResult,
  type UserTemplateDiscoveryResult,
} from './userTemplateDiscovery';
import {
  createRecommendationWarningMessage,
  createUserFriendlyRecommendationReason,
  createWhyRecommendedMessage,
  type UserFriendlyRecommendationReason,
  type UserRecommendationReasonCode,
} from './userRecommendationReasons';

export interface UserTemplateRecommendationScore {
  value: number;
  normalized: number;
  positiveReasonCodes: UserRecommendationReasonCode[];
  negativeReasonCodes: UserRecommendationReasonCode[];
  deterministic: true;
}

export interface UserTemplateRecommendationReason extends UserFriendlyRecommendationReason {
  source: 'local-preference' | 'template-metadata' | 'compatibility';
}

export interface UserTemplateRecommendation {
  appTemplateId: string;
  title: string;
  subtitle: string;
  score: UserTemplateRecommendationScore;
  rank: number;
  recommended: boolean;
  status: UserTemplateDiscoveryResult['status'];
  warningMessages: string[];
  blockingMessages: string[];
  reasons: UserTemplateRecommendationReason[];
  whyRecommended: string;
  localOnly: true;
  ruleBased: true;
  usesAiApi: false;
  writesTrainingInput: false;
  modifiesTemplatePackage: false;
}

export interface UserTemplateRecommendationContext {
  packageData?: UserAppTemplatePackage | null;
  preferences?: UserLocalPreferences | null;
  discoveryResults?: UserTemplateDiscoveryResult[];
  maxRecommendations?: number;
  localOnly: true;
  ruleBased: true;
  usesAiApi: false;
  writesTrainingInput: false;
  modifiesTemplatePackage: false;
  writesProjectState: false;
}

export interface UserTemplateRecommendationReadiness {
  ready: boolean;
  recommendationCount: number;
  blockedTemplateCount: number;
  warningTemplateCount: number;
  localOnly: true;
  ruleBased: true;
  usesAiApi: false;
  writesTrainingInput: false;
  modifiesTemplatePackage: false;
}

export interface UserTemplateRecommendationIssue {
  code:
    | 'missing_package'
    | 'unsafe_boundary'
    | 'ai_api_not_allowed'
    | 'training_input_not_allowed'
    | 'template_mutation_not_allowed';
  message: string;
  blocking: boolean;
}

export interface UserTemplateRecommendationSummary {
  totalCandidates: number;
  recommendedTemplates: number;
  blockedTemplates: number;
  warningTemplates: number;
  topTemplateId?: string;
  summary: string;
  localOnly: true;
  ruleBased: true;
  usesAiApi: false;
  writesTrainingInput: false;
  modifiesTemplatePackage: false;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const timePreferenceMaxMinutes: Record<UserAvailableTimePreference, number | undefined> = {
  under_5_minutes: 5,
  '5_to_10_minutes': 10,
  '10_to_20_minutes': 20,
  over_20_minutes: undefined,
  flexible: undefined,
};

const normalizeToolText = (value: string): string =>
  value.toLowerCase().replace(/[_-]/g, ' ').trim();

const requiredToolMatchesPreference = (
  requiredToolLabel: string,
  preferences: UserLocalPreferences,
): boolean => {
  const normalizedTool = normalizeToolText(requiredToolLabel);

  return preferences.availableTools.some((tool) => {
    const normalizedPreference = normalizeToolText(tool);
    return (
      normalizedTool.includes(normalizedPreference) ||
      normalizedPreference.includes(normalizedTool)
    );
  });
};

const addReason = (
  target: UserRecommendationReasonCode[],
  code: UserRecommendationReasonCode,
): void => {
  if (!target.includes(code)) {
    target.push(code);
  }
};

const scoreSkillLevel = (input: {
  skillLevel: UserMakeupSkillLevel;
  result: UserTemplateDiscoveryResult;
  positive: UserRecommendationReasonCode[];
  negative: UserRecommendationReasonCode[];
}): number => {
  if (input.skillLevel === 'beginner') {
    if (input.result.difficulty === 'easy') {
      addReason(input.positive, 'beginner_friendly');
      return 18;
    }
    if (input.result.difficulty === 'advanced') {
      addReason(input.negative, 'tool_mismatch');
      return -20;
    }
    return 4;
  }

  if (input.skillLevel === 'advanced' && input.result.difficulty === 'advanced') {
    addReason(input.positive, 'advanced_fit');
    return 10;
  }

  if (input.skillLevel === 'unknown') {
    addReason(input.positive, 'default_discovery');
  }

  return 0;
};

const scoreDuration = (input: {
  availableTime: UserAvailableTimePreference;
  result: UserTemplateDiscoveryResult;
  positive: UserRecommendationReasonCode[];
  negative: UserRecommendationReasonCode[];
}): number => {
  const maxMinutes = timePreferenceMaxMinutes[input.availableTime];

  if (!maxMinutes) {
    return 0;
  }

  if (input.result.estimatedDurationMinutes <= maxMinutes) {
    addReason(input.positive, 'short_duration');
    return input.availableTime === 'under_5_minutes' ? 20 : 14;
  }

  if (input.result.estimatedDurationMinutes > maxMinutes + 6) {
    addReason(input.negative, 'time_mismatch');
    return -14;
  }

  return -4;
};

const scoreTools = (input: {
  preferences: UserLocalPreferences;
  result: UserTemplateDiscoveryResult;
  positive: UserRecommendationReasonCode[];
  negative: UserRecommendationReasonCode[];
}): number => {
  if (input.result.requiredToolCount === 0) {
    addReason(input.positive, 'minimal_tools');
    return 10;
  }

  if (input.preferences.availableTools.length === 0) {
    if (input.result.requiredToolCount <= 1) {
      addReason(input.positive, 'minimal_tools');
      return 12;
    }

    addReason(input.negative, 'tool_mismatch');
    return -12;
  }

  const matchedTools = input.result.requiredToolLabels.filter((label) =>
    requiredToolMatchesPreference(label, input.preferences),
  );
  const missingTools = input.result.requiredToolCount - matchedTools.length;

  if (missingTools === 0) {
    addReason(input.positive, 'minimal_tools');
    return 12;
  }

  if (missingTools >= 2) {
    addReason(input.negative, 'tool_mismatch');
    return -10;
  }

  return -2;
};

export const scoreTemplateForLocalPreferences = (input: {
  result: UserTemplateDiscoveryResult;
  preferences?: UserLocalPreferences | null;
}): UserTemplateRecommendationScore => {
  const validation = validateUserAppTemplate(input.result.template);
  const positiveReasonCodes: UserRecommendationReasonCode[] = [];
  const negativeReasonCodes: UserRecommendationReasonCode[] = [];

  if (validation.blockingIssues.length > 0) {
    addReason(negativeReasonCodes, 'blocked_template');
    return {
      value: -999,
      normalized: 0,
      positiveReasonCodes,
      negativeReasonCodes,
      deterministic: true,
    };
  }

  const preferences = input.preferences ?? createDefaultUserLocalPreferences({
    preferenceId: 'recommendation-default-preferences',
    skillLevel: 'unknown',
    preferredStyleTags: [],
    availableTime: 'flexible',
    availableTools: [],
    occasion: 'practice',
  });

  let value = 50 + input.result.sortPriority / 10;
  value += scoreSkillLevel({
    skillLevel: preferences.skillLevel,
    result: input.result,
    positive: positiveReasonCodes,
    negative: negativeReasonCodes,
  });
  value += scoreDuration({
    availableTime: preferences.availableTime,
    result: input.result,
    positive: positiveReasonCodes,
    negative: negativeReasonCodes,
  });
  value += scoreTools({
    preferences,
    result: input.result,
    positive: positiveReasonCodes,
    negative: negativeReasonCodes,
  });

  const preferredStyleTags = new Set<string>(preferences.preferredStyleTags);
  const styleMatches = input.result.styleTags.filter((tag) => preferredStyleTags.has(tag));
  if (styleMatches.length > 0) {
    addReason(positiveReasonCodes, 'style_match');
    value += styleMatches.length * 10;
  }

  if (input.result.suitableOccasions.includes(preferences.occasion)) {
    addReason(positiveReasonCodes, 'occasion_match');
    value += 10;
  }

  if (input.result.warningMessages.length > 0) {
    addReason(negativeReasonCodes, 'warning_present');
    value -= 4;
  }

  if (positiveReasonCodes.length === 0 && negativeReasonCodes.length === 0) {
    addReason(positiveReasonCodes, 'default_discovery');
  }

  return {
    value,
    normalized: clamp(Math.round(value), 0, 100),
    positiveReasonCodes,
    negativeReasonCodes,
    deterministic: true,
  };
};

export const createRecommendationReasons = (
  score: UserTemplateRecommendationScore,
): UserTemplateRecommendationReason[] => [
  ...score.positiveReasonCodes.map((code): UserTemplateRecommendationReason => ({
    ...createUserFriendlyRecommendationReason(code),
    source:
      code === 'style_match' || code === 'occasion_match'
        ? 'local-preference'
        : 'template-metadata',
  })),
  ...score.negativeReasonCodes.map((code): UserTemplateRecommendationReason => ({
    ...createUserFriendlyRecommendationReason(code),
    source: code === 'warning_present' || code === 'blocked_template'
      ? 'compatibility'
      : 'template-metadata',
  })),
];

export const rankTemplatesForUser = (input: {
  results: readonly UserTemplateDiscoveryResult[];
  preferences?: UserLocalPreferences | null;
  maxRecommendations?: number;
}): UserTemplateRecommendation[] => {
  const recommendations = input.results
    .map((result) => {
      const score = scoreTemplateForLocalPreferences({
        result,
        preferences: input.preferences,
      });
      const reasons = createRecommendationReasons(score);

      return {
        appTemplateId: result.appTemplateId,
        title: result.title,
        subtitle: result.subtitle,
        score,
        rank: 0,
        recommended: result.status !== 'blocked',
        status: result.status,
        warningMessages: result.warningMessages.map(createRecommendationWarningMessage),
        blockingMessages: result.blockingMessages.map(createRecommendationWarningMessage),
        reasons,
        whyRecommended: createWhyRecommendedMessage(reasons),
        localOnly: true,
        ruleBased: true,
        usesAiApi: false,
        writesTrainingInput: false,
        modifiesTemplatePackage: false,
      } satisfies UserTemplateRecommendation;
    })
    .filter((recommendation) => recommendation.recommended)
    .sort((left, right) =>
      left.score.value === right.score.value
        ? left.title.localeCompare(right.title)
        : right.score.value - left.score.value,
    )
    .slice(0, input.maxRecommendations);

  return recommendations.map((recommendation, index) => ({
    ...recommendation,
    rank: index + 1,
  }));
};

export const createTemplateRecommendations = (
  context: UserTemplateRecommendationContext,
): UserTemplateRecommendation[] => {
  const discoveryResults =
    context.discoveryResults ??
    context.packageData?.templates.map((template) =>
      createTemplateDiscoveryResult({
        template,
        preferredStyleTags: context.preferences?.preferredStyleTags,
      }),
    ) ??
    [];

  return rankTemplatesForUser({
    results: discoveryResults,
    preferences: context.preferences,
    maxRecommendations: context.maxRecommendations,
  });
};

const collectBoundaryMarkers = (value: unknown, path = '$'): string[] => {
  const issues: string[] = [];

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      issues.push(...collectBoundaryMarkers(item, `${path}[${index}]`));
    });
    return issues;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, nextValue]) => {
      const normalizedKey = key.toLowerCase();
      if (
        [
          'faceembedding',
          'biometricid',
          'traininginput',
          'trainingdataset',
          'sensitiveprofile',
          'healthinformation',
          'recommendationapiurl',
        ].includes(normalizedKey)
      ) {
        issues.push(`${path}.${key} is not allowed in recommendation placeholder context`);
      }
      issues.push(...collectBoundaryMarkers(nextValue, `${path}.${key}`));
    });
  }

  return issues;
};

export const validateRecommendationBoundary = (
  context: UserTemplateRecommendationContext | unknown,
): UserTemplateRecommendationIssue[] => {
  const runtimeIssues = validateNoRuntimeOnlyReferences(context);
  const markerIssues = collectBoundaryMarkers(context);
  const issues: UserTemplateRecommendationIssue[] = [
    ...runtimeIssues.map((issue): UserTemplateRecommendationIssue => ({
      code: 'unsafe_boundary',
      message: issue,
      blocking: true,
    })),
    ...markerIssues.map((issue): UserTemplateRecommendationIssue => ({
      code: 'unsafe_boundary',
      message: issue,
      blocking: true,
    })),
  ];

  if (context && typeof context === 'object') {
    const candidate = context as Partial<UserTemplateRecommendationContext>;

    if (candidate.usesAiApi !== false) {
      issues.push({
        code: 'ai_api_not_allowed',
        message: 'Phase 7E recommendation placeholder must not call AI or recommendation APIs.',
        blocking: true,
      });
    }

    if (candidate.writesTrainingInput !== false) {
      issues.push({
        code: 'training_input_not_allowed',
        message: 'Recommendation results and preferences cannot become training input.',
        blocking: true,
      });
    }

    if (candidate.modifiesTemplatePackage !== false) {
      issues.push({
        code: 'template_mutation_not_allowed',
        message: 'Recommendation placeholder must not modify UserAppTemplatePackage.',
        blocking: true,
      });
    }
  }

  return issues;
};

export const summarizeTemplateRecommendations = (input: {
  recommendations: readonly UserTemplateRecommendation[];
  allResults?: readonly UserTemplateDiscoveryResult[];
}): UserTemplateRecommendationSummary => {
  const blockedTemplates = input.allResults?.filter((result) => result.status === 'blocked').length ?? 0;
  const warningTemplates =
    input.allResults?.filter((result) => result.status === 'warning').length ??
    input.recommendations.filter((recommendation) => recommendation.warningMessages.length > 0)
      .length;

  return {
    totalCandidates: input.allResults?.length ?? input.recommendations.length,
    recommendedTemplates: input.recommendations.length,
    blockedTemplates,
    warningTemplates,
    topTemplateId: input.recommendations[0]?.appTemplateId,
    summary:
      input.recommendations.length > 0
        ? `Local rule-based placeholder ranked ${input.recommendations.length} templates.`
        : 'No recommendable templates are available after local boundary checks.',
    localOnly: true,
    ruleBased: true,
    usesAiApi: false,
    writesTrainingInput: false,
    modifiesTemplatePackage: false,
  };
};

export const createRecommendationReadiness = (input: {
  context: UserTemplateRecommendationContext;
  recommendations: readonly UserTemplateRecommendation[];
  allResults?: readonly UserTemplateDiscoveryResult[];
}): UserTemplateRecommendationReadiness => {
  const issues = validateRecommendationBoundary(input.context);

  return {
    ready: issues.every((issue) => !issue.blocking),
    recommendationCount: input.recommendations.length,
    blockedTemplateCount:
      input.allResults?.filter((result) => result.status === 'blocked').length ?? 0,
    warningTemplateCount:
      input.allResults?.filter((result) => result.status === 'warning').length ?? 0,
    localOnly: true,
    ruleBased: true,
    usesAiApi: false,
    writesTrainingInput: false,
    modifiesTemplatePackage: false,
  };
};
