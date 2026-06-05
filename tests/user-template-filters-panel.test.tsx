import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserTemplateFiltersPanel } from '../src/components/user-app';
import { createInitialTemplateDiscoveryState } from '../src/user-app';

describe('UserTemplateFiltersPanel', () => {
  it('renders sort and filter controls without remote dependencies', () => {
    const html = renderToStaticMarkup(
      <UserTemplateFiltersPanel
        availableOccasions={['daily', 'work']}
        availableStyleTags={['natural', 'soft']}
        state={createInitialTemplateDiscoveryState()}
      />,
    );

    expect(html).toContain('Filters');
    expect(html).toContain('natural');
    expect(html).not.toContain('http');
  });
});
