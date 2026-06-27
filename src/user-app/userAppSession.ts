import type { UserAppTemplatePackage } from '../templates/schema';
import { validateUserAppTemplatePackage } from '../template-engine/app-contract';
import type { UserAppNavigationState } from './userAppNavigation';
import { createInitialUserAppNavigation } from './userAppNavigation';
import type { UserAppShellState } from './userAppState';
import { createInitialUserAppState } from './userAppState';
import type { UserAppTemplateProgress } from './userAppProgress';
import type { UserLocalPreferences } from './userLocalPreferences';
import {
  createDefaultUserLocalPreferences,
  validateUserLocalPreferences,
} from './userLocalPreferences';
import type { UserOnboardingState } from './userOnboarding';
import {
  createInitialUserOnboardingState,
  validateOnboardingState,
} from './userOnboarding';
import type {
  UserTemplateDiscoveryFilter,
  UserTemplateDiscoverySortMode,
  UserTemplateDiscoveryState,
} from './userTemplateDiscovery';
import {
  createInitialTemplateDiscoveryState,
  validateTemplateDiscoveryState,
} from './userTemplateDiscovery';
import { createSessionBoundaryWarnings } from './userAppSessionPrivacy';

export const USER_APP_SESSION_VERSION = 'user-app-session-v0.1' as const;

export type UserAppSessionVersion = typeof USER_APP_SESSION_VERSION;
export type UserAppSessionScope = 'memory-only' | 'local-persistence';
export type UserAppSessionStatus = 'empty' | 'active' | 'restored' | 'reset' | 'blocked';
export type UserAppShellSection =
  | 'guidance'
  | 'discovery'
  | 'preparation'
  | 'photo'
  | 'preferences'
  | 'privacy'
  | 'session'
  | 'demoReadiness'
  | 'readiness'
  | 'pwa'
  | 'mvpPolish'
  | 'trialPack'
  | 'trialFeedback'
  | 'trialReadiness'
  | 'templateContentQa'
  | 'trialTemplateSelection'
  | 'trialContentReadiness'
  | 'mvpReleaseReadiness'
  | 'trialGoNoGo'
  | 'internalTrialOps'
  | 'trialObservation'
  | 'trialOutcome'
  | 'trialResultReview'
  | 'trialIssueSummary'
  | 'trialDecisionFramework'
  | 'trialIterationPlan'
  | 'trialIterationBacklog'
  | 'trialIterationPriority'
  | 'trialLearningSummary'
  | 'productDecisionGate'
  | 'nextPhaseRecommendation'
  | 'internalTrialEvidencePack'
  | 'trialEvidenceSummary'
  | 'evidenceSufficiencyGate'
  | 'evidenceCollectionProtocol'
  | 'evidenceCollectionChecklist'
  | 'evidenceCollectionQualityGate'
  | 'anonymousTrialDryRunPack'
  | 'anonymousTrialDryRunChecklist'
  | 'anonymousTrialDryRunReview'
  | 'anonymousTrialLaunchPack'
  | 'anonymousTrialLaunchReadiness'
  | 'anonymousTrialPostLaunchHandoff'
  | 'anonymousTrialEvidenceReview'
  | 'anonymousTrialEvidenceGapReview'
  | 'anonymousTrialDecisionInput'
  | 'anonymousTrialFollowUpIteration'
  | 'anonymousTrialGapActionPlan'
  | 'anonymousTrialFollowUpReadiness'
  | 'mobileQa'
  | 'interaction';

export interface UserAppSessionTemplateProgressSnapshot {
  templateId: string;
  activeStepId?: string;
  orderedStepIds: string[];
  completedStepIds: string[];
  skippedStepIds: string[];
  progressPercent: number;
}

export interface UserAppSessionOnboardingSnapshot {
  status: UserOnboardingState['status'];
  currentStep: UserOnboardingState['currentStep'];
  completedStepIds: UserOnboardingState['progress']['completedStepIds'];
  skippedStepIds: UserOnboardingState['progress']['skippedStepIds'];
  progressPercent: number;
}

export interface UserAppSessionDiscoverySnapshot {
  filter: UserTemplateDiscoveryFilter;
  sortMode: UserTemplateDiscoverySortMode;
  preferredStyleTags: string[];
}

export interface UserAppSessionState {
  schemaVersion: UserAppSessionVersion;
  sessionId: string;
  status: UserAppSessionStatus;
  scope: UserAppSessionScope;
  selectedTemplateId?: string;
  activeStepId?: string;
  templateProgress?: UserAppSessionTemplateProgressSnapshot;
  onboarding: UserAppSessionOnboardingSnapshot;
  localPreferences: UserLocalPreferences;
  discovery: UserAppSessionDiscoverySnapshot;
  lastVisitedSection: UserAppShellSection;
  dismissedLocalWarnings: string[];
  localOnly: true;
  writesTrainingInput: false;
  modifiesTemplatePackage: false;
  storesRecommendationResults: false;
  containsSensitiveProfile: false;
  containsUserPhoto: false;
}

export interface UserAppSessionIssue {
  code:
    | 'version_mismatch'
    | 'unsafe_boundary'
    | 'unsafe_preferences'
    | 'unsafe_onboarding'
    | 'unsafe_discovery'
    | 'invalid_progress'
    | 'template_package_mutation_not_allowed'
    | 'recommendation_records_not_allowed';
  message: string;
  blocking: boolean;
}

export interface UserAppSessionSummary {
  schemaVersion: UserAppSessionVersion;
  sessionId: string;
  status: UserAppSessionStatus;
  scope: UserAppSessionScope;
  selectedTemplateId?: string;
  activeStepId?: string;
  completedSteps: number;
  skippedSteps: number;
  onboardingStatus: UserOnboardingState['status'];
  preferenceId: string;
  discoverySortMode: UserTemplateDiscoverySortMode;
  lastVisitedSection: UserAppShellSection;
  localOnly: true;
  writesTrainingInput: false;
  modifiesTemplatePackage: false;
}

const uniqueStrings = (items: readonly string[]): string[] => Array.from(new Set(items));

const createSessionId = (input?: { sessionId?: string; selectedTemplateId?: string }): string =>
  input?.sessionId ?? `user-app-local-session-${input?.selectedTemplateId ?? 'empty'}`;

const cloneJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const snapshotOnboarding = (
  onboarding: UserOnboardingState,
): UserAppSessionOnboardingSnapshot => ({
  status: onboarding.status,
  currentStep: onboarding.currentStep,
  completedStepIds: [...onboarding.progress.completedStepIds],
  skippedStepIds: [...onboarding.progress.skippedStepIds],
  progressPercent: onboarding.progress.progressPercent,
});

const snapshotDiscovery = (
  discovery: UserTemplateDiscoveryState,
): UserAppSessionDiscoverySnapshot => ({
  filter: cloneJson(discovery.filter),
  sortMode: discovery.sortMode,
  preferredStyleTags: [...discovery.preferredStyleTags],
});

const snapshotProgress = (
  progress?: UserAppTemplateProgress,
): UserAppSessionTemplateProgressSnapshot | undefined =>
  progress
    ? {
        templateId: progress.templateId,
        activeStepId: progress.currentStepId,
        orderedStepIds: [...progress.orderedStepIds],
        completedStepIds: [...progress.completedStepIds],
        skippedStepIds: [...progress.skippedStepIds],
        progressPercent: progress.progressPercent,
      }
    : undefined;

const progressFromSession = (
  progress: UserAppSessionTemplateProgressSnapshot,
): UserAppTemplateProgress => ({
  templateId: progress.templateId,
  currentStepId: progress.activeStepId,
  orderedStepIds: [...progress.orderedStepIds],
  completedStepIds: [...progress.completedStepIds],
  skippedStepIds: [...progress.skippedStepIds],
  progressPercent: progress.progressPercent,
  localOnly: true,
});

export const createInitialUserAppSession = (
  input?: Partial<
    Pick<
      UserAppSessionState,
      | 'sessionId'
      | 'status'
      | 'scope'
      | 'selectedTemplateId'
      | 'activeStepId'
      | 'templateProgress'
      | 'onboarding'
      | 'localPreferences'
      | 'discovery'
      | 'lastVisitedSection'
      | 'dismissedLocalWarnings'
    >
  >,
): UserAppSessionState => {
  const defaultOnboarding = createInitialUserOnboardingState();
  const defaultDiscovery = createInitialTemplateDiscoveryState();

  return {
    schemaVersion: USER_APP_SESSION_VERSION,
    sessionId: createSessionId({
      sessionId: input?.sessionId,
      selectedTemplateId: input?.selectedTemplateId,
    }),
    status: input?.status ?? 'empty',
    scope: input?.scope ?? 'local-persistence',
    selectedTemplateId: input?.selectedTemplateId,
    activeStepId: input?.activeStepId,
    templateProgress: input?.templateProgress,
    onboarding: input?.onboarding ?? snapshotOnboarding(defaultOnboarding),
    localPreferences: input?.localPreferences ?? createDefaultUserLocalPreferences(),
    discovery: input?.discovery ?? snapshotDiscovery(defaultDiscovery),
    lastVisitedSection: input?.lastVisitedSection ?? 'guidance',
    dismissedLocalWarnings: uniqueStrings(input?.dismissedLocalWarnings ?? []),
    localOnly: true,
    writesTrainingInput: false,
    modifiesTemplatePackage: false,
    storesRecommendationResults: false,
    containsSensitiveProfile: false,
    containsUserPhoto: false,
  };
};

export const createSessionFromAppState = (input: {
  appState: UserAppShellState;
  onboarding?: UserOnboardingState;
  localPreferences?: UserLocalPreferences;
  discoveryState?: UserTemplateDiscoveryState;
  lastVisitedSection?: UserAppShellSection;
  dismissedLocalWarnings?: readonly string[];
  sessionId?: string;
}): UserAppSessionState => {
  const selectedTemplateId = input.appState.navigation.selectedTemplateId;
  const progress = selectedTemplateId
    ? input.appState.progressByTemplateId[selectedTemplateId]
    : undefined;
  const activeStepId = input.appState.navigation.selectedStepId ?? progress?.currentStepId;

  return createInitialUserAppSession({
    sessionId: input.sessionId,
    status: selectedTemplateId || progress ? 'active' : 'empty',
    selectedTemplateId,
    activeStepId,
    templateProgress: snapshotProgress(progress),
    onboarding: snapshotOnboarding(input.onboarding ?? createInitialUserOnboardingState()),
    localPreferences: input.localPreferences ?? createDefaultUserLocalPreferences(),
    discovery: snapshotDiscovery(input.discoveryState ?? createInitialTemplateDiscoveryState()),
    lastVisitedSection: input.lastVisitedSection ?? 'guidance',
    dismissedLocalWarnings: uniqueStrings(input.dismissedLocalWarnings ?? []),
  });
};

export const applySessionToAppState = (input: {
  session: UserAppSessionState;
  currentState?: UserAppShellState;
}): UserAppShellState => {
  const navigation: UserAppNavigationState = {
    ...createInitialUserAppNavigation(),
    currentScreen: input.session.activeStepId ? 'step-guide' : 'template-detail',
    selectedTemplateId: input.session.selectedTemplateId,
    selectedStepId: input.session.activeStepId,
    history: [],
  };
  const progressByTemplateId =
    input.session.templateProgress && input.session.selectedTemplateId
      ? {
          ...input.currentState?.progressByTemplateId,
          [input.session.templateProgress.templateId]: progressFromSession(
            input.session.templateProgress,
          ),
        }
      : input.currentState?.progressByTemplateId ?? {};

  return {
    ...(input.currentState ?? createInitialUserAppState()),
    navigation,
    progressByTemplateId,
    localOnly: true,
  };
};

export const resetUserAppSession = (): UserAppSessionState =>
  createInitialUserAppSession({ status: 'reset' });

export const clearTemplateProgressFromSession = (
  session: UserAppSessionState,
): UserAppSessionState => ({
  ...session,
  activeStepId: undefined,
  templateProgress: undefined,
  status: session.selectedTemplateId ? 'active' : 'empty',
  dismissedLocalWarnings: [...session.dismissedLocalWarnings],
});

export const clearPreferencesFromSession = (
  session: UserAppSessionState,
): UserAppSessionState => ({
  ...session,
  localPreferences: createDefaultUserLocalPreferences(),
  dismissedLocalWarnings: [...session.dismissedLocalWarnings],
});

export const summarizeUserAppSession = (
  session: UserAppSessionState,
): UserAppSessionSummary => ({
  schemaVersion: session.schemaVersion,
  sessionId: session.sessionId,
  status: session.status,
  scope: session.scope,
  selectedTemplateId: session.selectedTemplateId,
  activeStepId: session.activeStepId,
  completedSteps: session.templateProgress?.completedStepIds.length ?? 0,
  skippedSteps: session.templateProgress?.skippedStepIds.length ?? 0,
  onboardingStatus: session.onboarding.status,
  preferenceId: session.localPreferences.preferenceId,
  discoverySortMode: session.discovery.sortMode,
  lastVisitedSection: session.lastVisitedSection,
  localOnly: true,
  writesTrainingInput: false,
  modifiesTemplatePackage: false,
});

const validateSessionProgress = (
  session: UserAppSessionState,
): UserAppSessionIssue[] => {
  if (!session.templateProgress) {
    return [];
  }

  const orderedStepIds = new Set(session.templateProgress.orderedStepIds);
  const invalidCompleted = session.templateProgress.completedStepIds.filter(
    (stepId) => !orderedStepIds.has(stepId),
  );
  const invalidSkipped = session.templateProgress.skippedStepIds.filter(
    (stepId) => !orderedStepIds.has(stepId),
  );
  const activeInvalid =
    session.templateProgress.activeStepId &&
    !orderedStepIds.has(session.templateProgress.activeStepId);

  return invalidCompleted.length > 0 || invalidSkipped.length > 0 || activeInvalid
    ? [
        {
          code: 'invalid_progress',
          message: 'Session progress must reference only ordered step ids in the saved template progress snapshot.',
          blocking: true,
        },
      ]
    : [];
};

export const validateUserAppSession = (
  session: UserAppSessionState | unknown,
  packageData?: UserAppTemplatePackage | null,
): UserAppSessionIssue[] => {
  const boundaryIssues = createSessionBoundaryWarnings(session).map(
    (privacyIssue): UserAppSessionIssue => ({
      code: 'unsafe_boundary',
      message: privacyIssue.message,
      blocking: true,
    }),
  );

  if (!session || typeof session !== 'object') {
    return [
      ...boundaryIssues,
      {
        code: 'version_mismatch',
        message: 'Session payload must be a plain local session object.',
        blocking: true,
      },
    ];
  }

  const candidate = session as Partial<UserAppSessionState>;
  const issues: UserAppSessionIssue[] = [...boundaryIssues];

  if (candidate.schemaVersion !== USER_APP_SESSION_VERSION) {
    issues.push({
      code: 'version_mismatch',
      message: 'Session schema version does not match the current User App session version.',
      blocking: true,
    });
  }

  if (
    candidate.localOnly !== true ||
    candidate.writesTrainingInput !== false ||
    candidate.modifiesTemplatePackage !== false ||
    candidate.containsSensitiveProfile !== false ||
    candidate.containsUserPhoto !== false
  ) {
    issues.push({
      code: 'template_package_mutation_not_allowed',
      message:
        'User App session must remain local-only and cannot store photos, sensitive profile data, training input, or template mutations.',
      blocking: true,
    });
  }

  if (candidate.storesRecommendationResults !== false) {
    issues.push({
      code: 'recommendation_records_not_allowed',
      message: 'Recommendation result records cannot be stored as user session records.',
      blocking: true,
    });
  }

  if (candidate.localPreferences) {
    issues.push(
      ...validateUserLocalPreferences(candidate.localPreferences).map(
        (preferenceIssue): UserAppSessionIssue => ({
          code: 'unsafe_preferences',
          message: preferenceIssue.message,
          blocking: true,
        }),
      ),
    );
  }

  if (candidate.onboarding) {
    const onboardingState: UserOnboardingState = {
      status: candidate.onboarding.status,
      currentStep: candidate.onboarding.currentStep,
      progress: {
        completedStepIds: candidate.onboarding.completedStepIds,
        skippedStepIds: candidate.onboarding.skippedStepIds,
        progressPercent: candidate.onboarding.progressPercent,
      },
      localOnly: true,
      containsUserPhoto: false,
      containsSensitiveProfile: false,
      writesTrainingInput: false,
    };
    issues.push(
      ...validateOnboardingState(onboardingState).map(
        (onboardingIssue): UserAppSessionIssue => ({
          code: 'unsafe_onboarding',
          message: onboardingIssue.message,
          blocking: true,
        }),
      ),
    );
  }

  if (candidate.discovery) {
    const discoveryState: UserTemplateDiscoveryState = {
      filter: candidate.discovery.filter,
      sortMode: candidate.discovery.sortMode,
      preferredStyleTags: candidate.discovery.preferredStyleTags,
      localOnly: true,
      modifiesTemplatePackage: false,
      writesTrainingInput: false,
      writesProjectState: false,
    };
    issues.push(
      ...validateTemplateDiscoveryState(discoveryState).map(
        (discoveryIssue): UserAppSessionIssue => ({
          code: 'unsafe_discovery',
          message: discoveryIssue.message,
          blocking: true,
        }),
      ),
    );
  }

  issues.push(...validateSessionProgress(candidate as UserAppSessionState));

  if (packageData) {
    const before = JSON.stringify(packageData);
    validateUserAppTemplatePackage(packageData);
    const after = JSON.stringify(packageData);

    if (before !== after) {
      issues.push({
        code: 'template_package_mutation_not_allowed',
        message: 'Session validation must not mutate UserAppTemplatePackage.',
        blocking: true,
      });
    }
  }

  return issues;
};
