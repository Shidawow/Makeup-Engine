import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppSessionPanel } from '../src/components/user-app';
import { partiallyCompletedTemplateSessionExample } from '../src/templates/examples';

describe('UserAppSessionPanel', () => {
  it('renders local session controls without unsafe durable data', () => {
    const html = renderToStaticMarkup(
      <UserAppSessionPanel session={partiallyCompletedTemplateSessionExample} />,
    );

    expect(html).toContain('Local session');
    expect(html).toContain('local-persistence');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
    expect(html).not.toContain('C:\\');
  });
});
