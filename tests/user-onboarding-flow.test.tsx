import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserOnboardingFlow } from '../src/components/user-app';
import {
  createDefaultUserLocalPreferences,
  createInitialUserOnboardingState,
  markOnboardingCompleted,
  skipOnboarding,
} from '../src/user-app';

describe('UserOnboardingFlow', () => {
  it('renders local onboarding without photo, login, or upload controls', () => {
    const html = renderToStaticMarkup(
      <UserOnboardingFlow
        onboarding={createInitialUserOnboardingState()}
        onOnboardingChange={() => undefined}
        onPreferencesChange={() => undefined}
        preferences={createDefaultUserLocalPreferences()}
      />,
    );

    expect(html).toContain('Local onboarding');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
  });

  it('renders skipped and completed states', () => {
    const preferences = createDefaultUserLocalPreferences();
    const skippedHtml = renderToStaticMarkup(
      <UserOnboardingFlow
        onboarding={skipOnboarding(createInitialUserOnboardingState())}
        onOnboardingChange={() => undefined}
        onPreferencesChange={() => undefined}
        preferences={preferences}
      />,
    );
    const completedHtml = renderToStaticMarkup(
      <UserOnboardingFlow
        onboarding={markOnboardingCompleted(createInitialUserOnboardingState())}
        onOnboardingChange={() => undefined}
        onPreferencesChange={() => undefined}
        preferences={preferences}
      />,
    );

    expect(skippedHtml).toContain('Local onboarding');
    expect(completedHtml).toContain('Local onboarding');
  });
});
