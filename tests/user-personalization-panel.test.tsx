import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserPersonalizationPanel } from '../src/components/user-app';
import { createDefaultUserPersonalizationPlaceholder } from '../src/user-app';

describe('UserPersonalizationPanel', () => {
  it('renders local placeholder preferences without persistence controls', () => {
    const html = renderToStaticMarkup(
      <UserPersonalizationPanel
        personalization={createDefaultUserPersonalizationPlaceholder()}
      />,
    );

    expect(html).toContain('Placeholder profile');
    expect(html).toContain('Skill level');
    expect(html).toContain('Guidance verbosity');
    expect(html).not.toContain('upload');
    expect(html).not.toContain('database');
    expect(html).not.toContain('training dataset');
  });
});
