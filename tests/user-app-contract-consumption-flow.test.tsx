import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplateStudio } from '../src/components/template-studio/TemplateStudio';

describe('TemplateStudio user app shell flow', () => {
  it('keeps admin app-contract preview and adds User App MVP Shell Preview', () => {
    const html = renderToStaticMarkup(<TemplateStudio />);

    expect(html).toContain('User App Template Preview');
    expect(html).toContain('User App Prototype Consumer');
    expect(html).toContain('User App MVP Shell');
    expect(html).toContain('UserAppTemplatePackage');
    expect(html).toContain('Step-by-step guidance');
    expect(html).not.toContain('blob:');
  });
});
