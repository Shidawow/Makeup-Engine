import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplateStudio } from '../src/components/template-studio/TemplateStudio';

describe('TemplateStudio user app contract flow', () => {
  it('keeps template library/package flow and adds user app contract preview surface', () => {
    const html = renderToStaticMarkup(<TemplateStudio />);

    expect(html).toContain('Template Library');
    expect(html).toContain('Template Package Preview');
    expect(html).toContain('User App Template Preview');
    expect(html).toContain('生成 User App Template Package');
    expect(html).toContain('暂无 User App Template Package');
  });
});

