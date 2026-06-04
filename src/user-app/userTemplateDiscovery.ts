import type {
  UserAppCompatibilityTarget,
  UserAppMakeupDifficulty,
  UserAppTemplate,
  UserAppTemplatePackage,
} from '../templates/schema';
import { validateUserAppTemplate } from '../template-engine/app-contract';
import type { UserAppShellReadinessStatus } from './userAppViewModel';

export type UserTemplateDiscoverySortMode =
  | 'recommended'
  | 'shortest_duration'
  | 'easiest'
  | 'most_steps'
  | 'style_match';

export interface UserTemplateDiscoveryFilter {
  difficulties: UserAppMakeupDifficulty[];
  maxEstimatedDurationMinutes?: number;
  styleTags: string[];
  suitableOccasions: string[];
  requiredTools: string[];
  minStepCount?: number;
  maxStepCount?: number;
  statuses: UserAppShellReadinessStatus[];
  compatibilityTargets: UserAppCompatibilityTarget[];
  includeBlocked: boolean;
}

export interface UserTemplateDiscoveryState {
  filter: UserTemplateDiscoveryFilter;
  sortMode: UserTemplateDiscoverySortMode;
  preferredStyleTags: string[];
  localOnly: true;
  modifiesTemplatePackage: false;
  writesTrainingInput: false;
  writesProjectState: false;
}

export interface UserTemplateDiscoveryResult {
  appTemplateId: string;
  title: string;
  subtitle: string;
  difficulty: UserAppMakeupDifficulty;
  estimatedDurationMinutes: number;
  styleTags: string[];
  suitableOccasions: string[];
  requiredToolCount: number;
  requiredToolLabels: string[];
  stepCount: number;
  compatibilityTarget: UserAppCompatibilityTarget;
  status: UserAppShellReadinessStatus;
  warningMessages: string[];
  blockingMessages: string[];
  sortPriority: number;
  styleMatchCount: number;
  template: UserAppTemplate;
}

export interface UserTemplateDiscoveryIssue {
  code:
    | 'missing_package'
    | 'invalid_duration_filter'
    | 'invalid_step_count_filter'
    | 'unsafe_boundary_flags';
  message: string;
  blocking: boolean;
}

export interface UserTemplateDiscoverySummary {
  totalTemplates: number;
  visibleTemplates: number;
  recommendedEligibleTemplates: number;
  blockedTemplates: number;
  warningTemplates: number;
  empty: boolean;
  activeFilters: string[];
  sortMode: UserTemplateDiscoverySortMode;
  localOnly: true;
  modifiesTemplatePackage: false;
  writesTrainingInput: false;
}

const difficultyRank: Record<UserAppMakeupDifficulty, number> = {
  easy: 1,
  medium: 2,
  advanced: 3,
};

const uniqueStrings = (items: readonly string[]): string[] => Array.from(new Set(items));

export const createInitialTemplateDiscoveryState = (
  input?: Partial<Pick<UserTemplateDiscoveryState, 'filter' | 'sortMode' | 'preferredStyleTags'>>,
): UserTemplateDiscoveryState => ({
  filter: {
    difficulties: [],
    styleTags: [],
    suitableOccasions: [],
    requiredTools: [],
    statuses: [],
    compatibilityTargets: [],
    includeBlocked: false,
    ...input?.filter,
  },
  sortMode: input?.sortMode ?? 'recommended',
  preferredStyleTags: uniqueStrings(input?.preferredStyleTags ?? []),
  localOnly: true,
  modifiesTemplatePackage: false,
  writesTrainingInput: false,
  writesProjectState: false,
});

const getTemplateStatus = (template: UserAppTemplate): UserAppShellReadinessStatus => {
  const validation = validateUserAppTemplate(template);

  if (validation.blockingIssues.length > 0) {
    return 'blocked';
  }

  if (validation.warnings.length > 0) {
    return 'warning';
  }

  return 'ready';
};

export const createTemplateDiscoveryResult = (input: {
  template: UserAppTemplate;
  preferredStyleTags?: readonly string[];
}): UserTemplateDiscoveryResult => {
  const validation = validateUserAppTemplate(input.template);
  const preferredStyleTags = new Set(input.preferredStyleTags ?? []);

  return {
    appTemplateId: input.template.appTemplateId,
    title: input.template.title,
    subtitle: input.template.subtitle,
    difficulty: input.template.difficulty,
    estimatedDurationMinutes: input.template.estimatedDurationMinutes,
    styleTags: [...input.template.styleTags],
    suitableOccasions: [...input.template.suitableOccasions],
    requiredToolCount: input.template.requiredTools.length,
    requiredToolLabels: input.template.requiredTools.map((tool) => tool.displayName),
    stepCount: input.template.steps.length,
    compatibilityTarget: input.template.compatibility.target,
    status: getTemplateStatus(input.template),
    warningMessages: uniqueStrings(validation.warnings),
    blockingMessages: uniqueStrings(validation.blockingIssues),
    sortPriority: input.template.appDisplayHints.sortPriority,
    styleMatchCount: input.template.styleTags.filter((tag) => preferredStyleTags.has(tag)).length,
    template: input.template,
  };
};

const matchesFilter = (
  result: UserTemplateDiscoveryResult,
  filter: UserTemplateDiscoveryFilter,
): boolean => {
  if (!filter.includeBlocked && result.status === 'blocked') {
    return false;
  }

  if (filter.difficulties.length > 0 && !filter.difficulties.includes(result.difficulty)) {
    return false;
  }

  if (
    typeof filter.maxEstimatedDurationMinutes === 'number' &&
    result.estimatedDurationMinutes > filter.maxEstimatedDurationMinutes
  ) {
    return false;
  }

  if (
    filter.styleTags.length > 0 &&
    !filter.styleTags.some((tag) => result.styleTags.includes(tag))
  ) {
    return false;
  }

  if (
    filter.suitableOccasions.length > 0 &&
    !filter.suitableOccasions.some((occasion) => result.suitableOccasions.includes(occasion))
  ) {
    return false;
  }

  if (
    filter.requiredTools.length > 0 &&
    !filter.requiredTools.every((requiredTool) =>
      result.requiredToolLabels.some((label) =>
        label.toLowerCase().includes(requiredTool.toLowerCase()),
      ),
    )
  ) {
    return false;
  }

  if (typeof filter.minStepCount === 'number' && result.stepCount < filter.minStepCount) {
    return false;
  }

  if (typeof filter.maxStepCount === 'number' && result.stepCount > filter.maxStepCount) {
    return false;
  }

  if (filter.statuses.length > 0 && !filter.statuses.includes(result.status)) {
    return false;
  }

  if (
    filter.compatibilityTargets.length > 0 &&
    !filter.compatibilityTargets.includes(result.compatibilityTarget)
  ) {
    return false;
  }

  return true;
};

export const filterTemplatesForDiscovery = (input: {
  packageData?: UserAppTemplatePackage | null;
  state?: UserTemplateDiscoveryState;
}): UserTemplateDiscoveryResult[] => {
  if (!input.packageData) {
    return [];
  }

  const state = input.state ?? createInitialTemplateDiscoveryState();

  return input.packageData.templates
    .map((template) =>
      createTemplateDiscoveryResult({
        template,
        preferredStyleTags: state.preferredStyleTags,
      }),
    )
    .filter((result) => matchesFilter(result, state.filter));
};

export const sortTemplatesForDiscovery = (
  results: readonly UserTemplateDiscoveryResult[],
  sortMode: UserTemplateDiscoverySortMode,
): UserTemplateDiscoveryResult[] => {
  const sorted = [...results];

  sorted.sort((left, right) => {
    if (sortMode === 'shortest_duration') {
      return left.estimatedDurationMinutes === right.estimatedDurationMinutes
        ? left.title.localeCompare(right.title)
        : left.estimatedDurationMinutes - right.estimatedDurationMinutes;
    }

    if (sortMode === 'easiest') {
      return difficultyRank[left.difficulty] === difficultyRank[right.difficulty]
        ? left.estimatedDurationMinutes - right.estimatedDurationMinutes
        : difficultyRank[left.difficulty] - difficultyRank[right.difficulty];
    }

    if (sortMode === 'most_steps') {
      return left.stepCount === right.stepCount
        ? left.title.localeCompare(right.title)
        : right.stepCount - left.stepCount;
    }

    if (sortMode === 'style_match') {
      return left.styleMatchCount === right.styleMatchCount
        ? right.sortPriority - left.sortPriority
        : right.styleMatchCount - left.styleMatchCount;
    }

    return left.sortPriority === right.sortPriority
      ? left.title.localeCompare(right.title)
      : right.sortPriority - left.sortPriority;
  });

  return sorted;
};

export const summarizeTemplateDiscoveryResults = (input: {
  packageData?: UserAppTemplatePackage | null;
  results: readonly UserTemplateDiscoveryResult[];
  state: UserTemplateDiscoveryState;
}): UserTemplateDiscoverySummary => {
  const allResults =
    input.packageData?.templates.map((template) =>
      createTemplateDiscoveryResult({
        template,
        preferredStyleTags: input.state.preferredStyleTags,
      }),
    ) ?? [];
  const filter = input.state.filter;
  const activeFilters = [
    ...(filter.difficulties.length > 0 ? ['difficulty'] : []),
    ...(typeof filter.maxEstimatedDurationMinutes === 'number' ? ['duration'] : []),
    ...(filter.styleTags.length > 0 ? ['styleTags'] : []),
    ...(filter.suitableOccasions.length > 0 ? ['occasions'] : []),
    ...(filter.requiredTools.length > 0 ? ['requiredTools'] : []),
    ...(typeof filter.minStepCount === 'number' || typeof filter.maxStepCount === 'number'
      ? ['stepCount']
      : []),
    ...(filter.statuses.length > 0 ? ['status'] : []),
    ...(filter.compatibilityTargets.length > 0 ? ['compatibilityTarget'] : []),
    ...(filter.includeBlocked ? ['includeBlocked'] : []),
  ];

  return {
    totalTemplates: allResults.length,
    visibleTemplates: input.results.length,
    recommendedEligibleTemplates: allResults.filter((result) => result.status !== 'blocked').length,
    blockedTemplates: allResults.filter((result) => result.status === 'blocked').length,
    warningTemplates: allResults.filter((result) => result.status === 'warning').length,
    empty: input.results.length === 0,
    activeFilters,
    sortMode: input.state.sortMode,
    localOnly: true,
    modifiesTemplatePackage: false,
    writesTrainingInput: false,
  };
};

export const validateTemplateDiscoveryState = (
  state: UserTemplateDiscoveryState,
): UserTemplateDiscoveryIssue[] => {
  const issues: UserTemplateDiscoveryIssue[] = [];

  if (
    typeof state.filter.maxEstimatedDurationMinutes === 'number' &&
    state.filter.maxEstimatedDurationMinutes < 0
  ) {
    issues.push({
      code: 'invalid_duration_filter',
      message: 'Duration filter must not be negative.',
      blocking: true,
    });
  }

  if (
    (typeof state.filter.minStepCount === 'number' && state.filter.minStepCount < 0) ||
    (typeof state.filter.maxStepCount === 'number' && state.filter.maxStepCount < 0) ||
    (typeof state.filter.minStepCount === 'number' &&
      typeof state.filter.maxStepCount === 'number' &&
      state.filter.minStepCount > state.filter.maxStepCount)
  ) {
    issues.push({
      code: 'invalid_step_count_filter',
      message: 'Step count filters must be non-negative and ordered.',
      blocking: true,
    });
  }

  if (
    state.localOnly !== true ||
    state.modifiesTemplatePackage !== false ||
    state.writesTrainingInput !== false ||
    state.writesProjectState !== false
  ) {
    issues.push({
      code: 'unsafe_boundary_flags',
      message:
        'Discovery state must remain local-only and must not modify templates, training data, or project-state.',
      blocking: true,
    });
  }

  return issues;
};
