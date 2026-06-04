export type UserOnboardingStep =
  | 'welcome'
  | 'skill_level'
  | 'guidance_style'
  | 'available_time'
  | 'available_tools'
  | 'preferred_styles'
  | 'privacy_reminder'
  | 'completed';

export type UserOnboardingStatus =
  | 'not_started'
  | 'in_progress'
  | 'skipped'
  | 'completed';

export interface UserOnboardingIssue {
  code:
    | 'invalid_current_step'
    | 'completed_step_not_allowed'
    | 'skipped_step_not_allowed'
    | 'sensitive_or_durable_state';
  message: string;
  blocking: boolean;
}

export interface UserOnboardingProgress {
  completedStepIds: UserOnboardingStep[];
  skippedStepIds: UserOnboardingStep[];
  progressPercent: number;
}

export interface UserOnboardingState {
  status: UserOnboardingStatus;
  currentStep: UserOnboardingStep;
  progress: UserOnboardingProgress;
  localOnly: true;
  containsUserPhoto: false;
  containsSensitiveProfile: false;
  writesTrainingInput: false;
}

export interface UserOnboardingSummary {
  status: UserOnboardingStatus;
  currentStep: UserOnboardingStep;
  completedSteps: number;
  skippedSteps: number;
  progressPercent: number;
  nextAction: string;
  localOnly: true;
}

const onboardingSteps: UserOnboardingStep[] = [
  'welcome',
  'skill_level',
  'guidance_style',
  'available_time',
  'available_tools',
  'preferred_styles',
  'privacy_reminder',
  'completed',
];

const activeSteps = onboardingSteps.filter((step) => step !== 'completed');

const uniqueSteps = (steps: readonly UserOnboardingStep[]): UserOnboardingStep[] =>
  Array.from(new Set(steps)).filter((step) => onboardingSteps.includes(step));

const progressFromSteps = (input: {
  completedStepIds: readonly UserOnboardingStep[];
  skippedStepIds: readonly UserOnboardingStep[];
}): UserOnboardingProgress => {
  const completedStepIds = uniqueSteps(input.completedStepIds).filter(
    (step) => step !== 'completed',
  );
  const skippedStepIds = uniqueSteps(input.skippedStepIds).filter(
    (step) => step !== 'completed' && !completedStepIds.includes(step),
  );
  const finishedCount = new Set([...completedStepIds, ...skippedStepIds]).size;

  return {
    completedStepIds,
    skippedStepIds,
    progressPercent: Math.round((finishedCount / activeSteps.length) * 100),
  };
};

export const createInitialUserOnboardingState = (): UserOnboardingState => ({
  status: 'not_started',
  currentStep: 'welcome',
  progress: progressFromSteps({ completedStepIds: [], skippedStepIds: [] }),
  localOnly: true,
  containsUserPhoto: false,
  containsSensitiveProfile: false,
  writesTrainingInput: false,
});

export const getNextOnboardingStep = (
  state: UserOnboardingState,
): UserOnboardingStep => {
  if (state.status === 'completed') {
    return 'completed';
  }

  const finished = new Set([
    ...state.progress.completedStepIds,
    ...state.progress.skippedStepIds,
  ]);
  return activeSteps.find((step) => !finished.has(step)) ?? 'completed';
};

export const completeOnboardingStep = (
  state: UserOnboardingState,
  step: UserOnboardingStep = state.currentStep,
): UserOnboardingState => {
  if (step === 'completed') {
    return markOnboardingCompleted(state);
  }

  const progress = progressFromSteps({
    completedStepIds: [...state.progress.completedStepIds, step],
    skippedStepIds: state.progress.skippedStepIds,
  });
  const draft: UserOnboardingState = {
    ...state,
    status: 'in_progress',
    progress,
  };
  const nextStep = getNextOnboardingStep(draft);

  return nextStep === 'completed'
    ? markOnboardingCompleted({ ...draft, currentStep: nextStep })
    : { ...draft, currentStep: nextStep };
};

export const skipOnboardingStep = (
  state: UserOnboardingState,
  step: UserOnboardingStep = state.currentStep,
): UserOnboardingState => {
  if (step === 'completed') {
    return markOnboardingCompleted(state);
  }

  const progress = progressFromSteps({
    completedStepIds: state.progress.completedStepIds,
    skippedStepIds: [...state.progress.skippedStepIds, step],
  });
  const draft: UserOnboardingState = {
    ...state,
    status: 'in_progress',
    progress,
  };
  const nextStep = getNextOnboardingStep(draft);

  return nextStep === 'completed'
    ? markOnboardingCompleted({ ...draft, currentStep: nextStep })
    : { ...draft, currentStep: nextStep };
};

export const markOnboardingCompleted = (
  state: UserOnboardingState,
): UserOnboardingState => ({
  ...state,
  status: 'completed',
  currentStep: 'completed',
  progress: progressFromSteps({
    completedStepIds: activeSteps,
    skippedStepIds: state.progress.skippedStepIds,
  }),
  containsUserPhoto: false,
  containsSensitiveProfile: false,
  writesTrainingInput: false,
});

export const skipOnboarding = (state: UserOnboardingState): UserOnboardingState => ({
  ...state,
  status: 'skipped',
  currentStep: 'completed',
  progress: progressFromSteps({
    completedStepIds: state.progress.completedStepIds,
    skippedStepIds: activeSteps,
  }),
  containsUserPhoto: false,
  containsSensitiveProfile: false,
  writesTrainingInput: false,
});

export const resetOnboarding = (): UserOnboardingState =>
  createInitialUserOnboardingState();

export const validateOnboardingState = (
  state: UserOnboardingState,
): UserOnboardingIssue[] => {
  const issues: UserOnboardingIssue[] = [];

  if (!onboardingSteps.includes(state.currentStep)) {
    issues.push({
      code: 'invalid_current_step',
      message: 'Onboarding current step must be one of the fixed local steps.',
      blocking: true,
    });
  }

  if (state.progress.completedStepIds.some((step) => step === 'completed')) {
    issues.push({
      code: 'completed_step_not_allowed',
      message: 'The terminal completed step cannot be stored as a completed step id.',
      blocking: true,
    });
  }

  if (state.progress.skippedStepIds.some((step) => step === 'completed')) {
    issues.push({
      code: 'skipped_step_not_allowed',
      message: 'The terminal completed step cannot be stored as a skipped step id.',
      blocking: true,
    });
  }

  if (
    state.localOnly !== true ||
    state.containsUserPhoto !== false ||
    state.containsSensitiveProfile !== false ||
    state.writesTrainingInput !== false
  ) {
    issues.push({
      code: 'sensitive_or_durable_state',
      message:
        'Phase 7D onboarding must remain local-only and cannot contain photos, sensitive profile data, or training input.',
      blocking: true,
    });
  }

  return issues;
};

export const summarizeOnboardingState = (
  state: UserOnboardingState,
): UserOnboardingSummary => ({
  status: state.status,
  currentStep: state.currentStep,
  completedSteps: state.progress.completedStepIds.length,
  skippedSteps: state.progress.skippedStepIds.length,
  progressPercent: state.progress.progressPercent,
  nextAction:
    state.status === 'completed'
      ? 'Onboarding is complete; local preferences can provide guidance hints.'
      : state.status === 'skipped'
        ? 'Onboarding was skipped; default local preferences remain available.'
        : 'Continue the local onboarding steps or skip them.',
  localOnly: true,
});

export const USER_ONBOARDING_STEPS: readonly UserOnboardingStep[] = onboardingSteps;
