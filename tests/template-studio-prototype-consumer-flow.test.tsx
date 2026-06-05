import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplateStudio } from '../src/components/template-studio/TemplateStudio';

describe('TemplateStudio prototype consumer flow', () => {
  it('keeps app contract preview and adds the read-only prototype consumer surface', () => {
    const html = renderToStaticMarkup(<TemplateStudio />);

    expect(html).toContain('User App Template Preview');
    expect(html).toContain('User App Prototype Consumer');
    expect(html).toContain('Step-by-step guidance');
    expect(html).toContain('示例 package smoke preview');
    expect(html).toContain('不是正式用户 App');
    expect(html).toContain('Contract validation');
    expect(html).not.toContain('blob:');
  });
});
