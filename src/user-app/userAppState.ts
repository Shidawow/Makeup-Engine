import type { UserAppTemplatePackage } from '../templates/schema';
import {
  createInitialUserAppNavigation,
  navigateToStepGuide,
  navigateToTemplateDetail,
  type UserAppNavigationState,
} from './userAppNavigation';
import {
  createInitialTemplateProgress,
  markStepComplete,
  markStepSkipped,
  resetTemplateProgress,
  type UserAppTemplateProgress,
} from './userAppProgress';
import { createUserAppCompatibilityViewModel } from './userAppViewModel';

export interface UserAppShellState {
  navigation: UserAppNavigationState;
  progressByTemplateId: Record<string, UserAppTemplateProgress>;
  localOnly: true;
}

export const createInitialUserAppState = (): UserAppShellState => ({
  navigation: createInitialUserAppNavigation(),
  progressByTemplateId: {},
  localOnly: true,
});

const ensureTemplateProgress = (
  state: UserAppShellState,
  packageData: UserAppTemplatePackage,
  templateId: string,
): UserAppTemplateProgress | undefined => {
  const existing = state.progressByTemplateId[templateId];
  if (existing) {
    return existing;
  }

  const template = packageData.templates.find(
    (candidate) => candidate.appTemplateId === templateId,
  );

  return template ? createInitialTemplateProgress({ template }) : undefined;
};

export const selectUserAppTemplate = (
  state: UserAppShellState,
  templateId: string,
): UserAppShellState => ({
  ...state,
  navigation: navigateToTemplateDetail(state.navigation, templateId),
});

export const startUserAppStepGuide = (
  state: UserAppShellState,
  packageData: UserAppTemplatePackage,
  templateId: string,
): UserAppShellState => {
  const progress = ensureTemplateProgress(state, packageData, templateId);
  const compatibility = createUserAppCompatibilityViewModel(packageData);

  return {
    ...state,
    navigation: navigateToStepGuide(state.navigation, {
      templateId,
      stepId: progress?.currentStepId,
      canEnterStepGuide: compatibility.canEnterStepGuide,
    }),
    progressByTemplateId: progress
      ? {
          ...state.progressByTemplateId,
          [templateId]: progress,
        }
      : state.progressByTemplateId,
  };
};

export const completeCurrentUserAppStep = (
  state: UserAppShellState,
  templateId: string,
  stepId: string,
): UserAppShellState => {
  const progress = state.progressByTemplateId[templateId];

  if (!progress) {
    return state;
  }

  const nextProgress = markStepComplete(progress, stepId);

  return {
    ...state,
    navigation: {
      ...state.navigation,
      selectedStepId: nextProgress.currentStepId,
    },
    progressByTemplateId: {
      ...state.progressByTemplateId,
      [templateId]: nextProgress,
    },
  };
};

export const skipCurrentUserAppStep = (
  state: UserAppShellState,
  templateId: string,
  stepId: string,
): UserAppShellState => {
  const progress = state.progressByTemplateId[templateId];

  if (!progress) {
    return state;
  }

  const nextProgress = markStepSkipped(progress, stepId);

  return {
    ...state,
    navigation: {
      ...state.navigation,
      selectedStepId: nextProgress.currentStepId,
    },
    progressByTemplateId: {
      ...state.progressByTemplateId,
      [templateId]: nextProgress,
    },
  };
};

export const resetUserAppTemplateProgress = (
  state: UserAppShellState,
  templateId: string,
): UserAppShellState => {
  const progress = state.progressByTemplateId[templateId];

  if (!progress) {
    return state;
  }

  const nextProgress = resetTemplateProgress(progress);

  return {
    ...state,
    navigation: {
      ...state.navigation,
      selectedStepId: nextProgress.currentStepId,
    },
    progressByTemplateId: {
      ...state.progressByTemplateId,
      [templateId]: nextProgress,
    },
  };
};
