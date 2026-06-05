import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplateStudio } from '../src/components/template-studio/TemplateStudio';

describe('TemplateStudio library flow', () => {
  it('keeps production batch flow while adding template library and package preview surfaces', () => {
    const html = renderToStaticMarkup(<TemplateStudio />);

    expect(html).toContain('模板生产批次');
    expect(html).toContain('Template Library 管理');
    expect(html).toContain('Template Package Preview');
    expect(html).toContain('上传照片');
  });
});
