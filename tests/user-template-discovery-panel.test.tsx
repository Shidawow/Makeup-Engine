import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserTemplateDiscoveryPanel } from '../src/components/user-app';
import {
  beginnerRecommendationContextExample,
  userAppTemplateDiscoveryExamplePackage,
} from '../src/templates/examples';

describe('UserTemplateDiscoveryPanel', () => {
  it('renders local discovery, recommendations, filters, and blocked area', () => {
    const html = renderToStaticMarkup(
      <UserTemplateDiscoveryPanel
        packageData={userAppTemplateDiscoveryExamplePackage}
        preferences={beginnerRecommendationContextExample}
      />,
    );

    expect(html).toContain('Phase 7E discovery');
    expect(html).toContain('local-only / rule-based');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
  });
});
