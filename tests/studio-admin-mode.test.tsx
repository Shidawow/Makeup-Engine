import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplateStudio } from '../src/components/template-studio/TemplateStudio';

describe('Template Studio admin mode', () => {
  it('defaults to operator-first admin mode and hides raw developer JSON', () => {
    const html = renderToStaticMarkup(<TemplateStudio />);

    expect(html.length).toBeGreaterThan(0);
    expect(html).not.toContain('developer-json-expanded');
    expect(html).not.toContain('template-json-expanded');
    expect(html).not.toContain('pipeline-trace-expanded');
  });
});
