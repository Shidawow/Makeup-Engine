export type UserAppScreen =
  | 'home'
  | 'template-list'
  | 'template-detail'
  | 'step-guide'
  | 'tools'
  | 'compatibility';

export interface UserAppNavigationState {
  currentScreen: UserAppScreen;
  selectedTemplateId?: string;
  selectedStepId?: string;
  history: UserAppScreen[];
}

export const createInitialUserAppNavigation = (): UserAppNavigationState => ({
  currentScreen: 'home',
  history: [],
});

const pushNavigation = (
  state: UserAppNavigationState,
  currentScreen: UserAppScreen,
  updates: Partial<Omit<UserAppNavigationState, 'currentScreen' | 'history'>> = {},
): UserAppNavigationState => ({
  ...state,
  ...updates,
  currentScreen,
  history:
    state.currentScreen === currentScreen
      ? [...state.history]
      : [...state.history, state.currentScreen],
});

export const navigateToTemplateList = (
  state: UserAppNavigationState,
): UserAppNavigationState => pushNavigation(state, 'template-list');

export const navigateToTemplateDetail = (
  state: UserAppNavigationState,
  templateId: string,
): UserAppNavigationState =>
  pushNavigation(state, 'template-detail', {
    selectedTemplateId: templateId,
    selectedStepId: undefined,
  });

export const navigateToStepGuide = (
  state: UserAppNavigationState,
  input: {
    templateId: string;
    stepId?: string;
    canEnterStepGuide: boolean;
  },
): UserAppNavigationState =>
  input.canEnterStepGuide
    ? pushNavigation(state, 'step-guide', {
        selectedTemplateId: input.templateId,
        selectedStepId: input.stepId,
      })
    : pushNavigation(state, 'compatibility', {
        selectedTemplateId: input.templateId,
        selectedStepId: input.stepId,
      });

export const navigateToTools = (
  state: UserAppNavigationState,
  templateId?: string,
): UserAppNavigationState =>
  pushNavigation(state, 'tools', {
    selectedTemplateId: templateId ?? state.selectedTemplateId,
  });

export const navigateToCompatibility = (
  state: UserAppNavigationState,
): UserAppNavigationState => pushNavigation(state, 'compatibility');

export const navigateBack = (
  state: UserAppNavigationState,
): UserAppNavigationState => {
  const previousScreen = state.history[state.history.length - 1];

  if (!previousScreen) {
    return state;
  }

  return {
    ...state,
    currentScreen: previousScreen,
    history: state.history.slice(0, -1),
  };
};

export const summarizeNavigationState = (
  state: UserAppNavigationState,
): string =>
  JSON.stringify({
    currentScreen: state.currentScreen,
    selectedTemplateId: state.selectedTemplateId,
    selectedStepId: state.selectedStepId,
    historyDepth: state.history.length,
  });
