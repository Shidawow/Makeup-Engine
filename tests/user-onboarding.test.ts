import { describe, expect, it } from 'vitest';
import {
  completeOnboardingStep,
  createInitialUserOnboardingState,
  getNextOnboardingStep,
  markOnboardingCompleted,
  resetOnboarding,
  skipOnboarding,
  skipOnboardingStep,
  summarizeOnboardingState,
  validateOnboardingState,
  type UserOnboardingState,
} from '../src/user-app';

describe('user onboarding model', () => {
  it('creates deterministic local-only initial state', () => {
    const state = createInitialUserOnboardingState();

    expect(state.status).toBe('not_started');
    expect(state.currentStep).toBe('welcome');
    expect(state.localOnly).toBe(true);
    expect(state.containsUserPhoto).toBe(false);
    expect(state.containsSensitiveProfile).toBe(false);
    expect(state.writesTrainingInput).toBe(false);
    expect(validateOnboardingState(state)).toEqual([]);
  });

  it('completes, skips, resets, and summarizes onboarding', () => {
    const initial = createInitialUserOnboardingState();
    const afterWelcome = completeOnboardingStep(initial);
    const afterSkip = skipOnboardingStep(afterWelcome);
    const completed = markOnboardingCompleted(afterSkip);
    const skipped = skipOnboarding(initial);

    expect(afterWelcome.status).toBe('in_progress');
    expect(afterWelcome.currentStep).toBe('skill_level');
    expect(getNextOnboardingStep(afterSkip)).toBe('guidance_style');
    expect(completed.status).toBe('completed');
    expect(completed.progress.progressPercent).toBe(100);
    expect(skipped.status).toBe('skipped');
    expect(summarizeOnboardingState(skipped).nextAction).toContain('default');
    expect(resetOnboarding().currentStep).toBe('welcome');
  });

  it('blocks sensitive or durable onboarding state', () => {
    const unsafe = {
      ...createInitialUserOnboardingState(),
      containsUserPhoto: true,
    };

    expect(
      validateOnboardingState(unsafe as unknown as UserOnboardingState).map(
        (issue) => issue.code,
      ),
    ).toContain(
      'sensitive_or_durable_state',
    );
  });
});
