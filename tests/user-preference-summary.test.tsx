import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserPreferenceSummary } from '../src/components/user-app';
import { beginnerUserLocalPreferencesExample } from '../src/templates/examples/user-app-local-preferences.example';

describe('UserPreferenceSummary', () => {
  it('renders preference hints and local-only boundary', () => {
    const html = renderToStaticMarkup(
      <UserPreferenceSummary
        onResetPreferences={() => undefined}
        preferences={beginnerUserLocalPreferencesExample}
      />,
    );

    expect(html).toContain('Preference summary');
    expect(html).toContain('Beginner hint');
    expect(html).toContain('UserAppTemplatePackage');
    expect(html).not.toContain('trainingInput');
    expect(html).not.toContain('blob:');
  });
});
