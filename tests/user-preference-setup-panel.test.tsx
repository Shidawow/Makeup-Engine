import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserPreferenceSetupPanel } from '../src/components/user-app';
import { createDefaultUserLocalPreferences } from '../src/user-app';

describe('UserPreferenceSetupPanel', () => {
  it('renders non-sensitive local preference controls', () => {
    const html = renderToStaticMarkup(
      <UserPreferenceSetupPanel
        onPreferencesChange={() => undefined}
        preferences={createDefaultUserLocalPreferences()}
      />,
    );

    expect(html).toContain('Local preferences');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('camera');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
  });
});
