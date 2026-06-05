import { describe, expect, it } from 'vitest';
import {
  createDefaultUserLocalPreferences,
  createGuidanceHintsFromPreferences,
  createPreferenceReadiness,
  mergeOnboardingPreferences,
  resetUserLocalPreferences,
  summarizeUserLocalPreferences,
  updateUserLocalPreference,
  validateUserLocalPreferences,
  type UserLocalPreferences,
} from '../src/user-app';

describe('user local preferences model', () => {
  it('creates local-only non-sensitive defaults', () => {
    const preferences = createDefaultUserLocalPreferences();

    expect(preferences.localOnly).toBe(true);
    expect(preferences.containsUserPhoto).toBe(false);
    expect(preferences.containsSensitiveProfile).toBe(false);
    expect(preferences.writesTrainingInput).toBe(false);
    expect(preferences.modifiesTemplatePackage).toBe(false);
    expect(validateUserLocalPreferences(preferences)).toEqual([]);
    expect(summarizeUserLocalPreferences(preferences).localOnly).toBe(true);
  });

  it('updates, resets, and merges onboarding completion', () => {
    const preferences = createDefaultUserLocalPreferences();
    const updated = updateUserLocalPreference(preferences, 'skillLevel', 'advanced');
    const merged = mergeOnboardingPreferences({
      preferences: updated,
      onboardingCompleted: true,
    });

    expect(updated.skillLevel).toBe('advanced');
    expect(merged.onboardingCompleted).toBe(true);
    expect(resetUserLocalPreferences().skillLevel).toBe('beginner');
    expect(createPreferenceReadiness(merged).ready).toBe(true);
  });

  it('blocks unsafe preference boundary flags', () => {
    const unsafe = {
      ...createDefaultUserLocalPreferences(),
      containsUserPhoto: true,
      writesTrainingInput: true,
      modifiesTemplatePackage: true,
    };

    expect(
      validateUserLocalPreferences(unsafe as unknown as UserLocalPreferences).map(
        (issue) => issue.code,
      ),
    ).toContain('sensitive_or_durable_preference');
  });

  it('creates guidance hints without modifying templates or training input', () => {
    const hints = createGuidanceHintsFromPreferences(
      createDefaultUserLocalPreferences({
        skillLevel: 'beginner',
        guidanceVerbosity: 'detailed',
        availableTime: 'under_5_minutes',
        availableTools: [],
      }),
    );

    expect(hints.skillLevelHint).toContain('Beginner');
    expect(hints.timeHint).toContain('key steps');
    expect(hints.toolAvailabilityHint).toContain('no tools');
    expect(hints.modifiesTemplatePackage).toBe(false);
    expect(hints.writesTrainingInput).toBe(false);
    expect(hints.writesProjectState).toBe(false);
  });
});
