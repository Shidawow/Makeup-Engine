import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplateStudio } from '../src/components/template-studio/TemplateStudio';

describe('TemplateStudio production batch flow', () => {
  it('keeps manual upload flow while adding the local production batch workbench', () => {
    const html = renderToStaticMarkup(<TemplateStudio />);

    expect(html).toContain('模板生产批次');
    expect(html).toContain('源图导入');
    expect(html).toContain('上传照片');
    expect(html).toContain('创建批次任务');
    expect(html).toContain('Production Batch JSON');
  });
});
