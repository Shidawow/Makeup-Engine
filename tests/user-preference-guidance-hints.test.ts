import { describe, expect, it } from 'vitest';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';
import {
  advancedUserLocalPreferencesExample,
  beginnerUserLocalPreferencesExample,
  minimalToolsUserLocalPreferencesExample,
} from '../src/templates/examples/user-app-local-preferences.example';
import {
  applyPreferencesToGuidanceViewModel,
  createGuidanceHintsFromPreferences,
  createPreferenceBasedStepTips,
  createTimeAwareGuidanceHint,
  createToolAvailabilityGuidanceHint,
  createUserAppTemplateDetailViewModel,
  summarizePreferencesForStepGuidance,
} from '../src/user-app';

describe('user preference guidance hints', () => {
  it('maps preferences to display hints only', () => {
    const template = createUserAppTemplateDetailViewModel({
      template: userAppMvpShellExamplePackage.templates[0],
    });
    const before = JSON.stringify(template);
    const withHints = applyPreferencesToGuidanceViewModel({
      template,
      preferences: beginnerUserLocalPreferencesExample,
    });

    expect(withHints.preferenceHints.skillLevelHint).toContain('Beginner');
    expect(withHints.preferenceHints.modifiesTemplatePackage).toBe(false);
    expect(withHints.preferenceHints.writesTrainingInput).toBe(false);
    expect(JSON.stringify(template)).toBe(before);
  });

  it('creates time and tool aware guidance hints', () => {
    expect(createTimeAwareGuidanceHint(advancedUserLocalPreferencesExample)).toContain(
      'key steps',
    );
    expect(createToolAvailabilityGuidanceHint(minimalToolsUserLocalPreferencesExample)).toContain(
      'no tools',
    );
    expect(createPreferenceBasedStepTips(beginnerUserLocalPreferencesExample)).toHaveLength(5);
    expect(summarizePreferencesForStepGuidance(beginnerUserLocalPreferencesExample)).toContain(
      '"writesProjectState":false',
    );
    expect(createGuidanceHintsFromPreferences(beginnerUserLocalPreferencesExample).summary).toContain(
      'beginner',
    );
  });
});
