import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplateStudio } from '../src/components/template-studio/TemplateStudio';

describe('Studio browser smoke fallback', () => {
  it('renders the browser-level operator path entry points without remote resources', () => {
    const html = renderToStaticMarkup(<TemplateStudio />);

    expect(html).toContain('Template');
    expect(html).toContain('上传照片');
    expect(html).toContain('SourceImagePackage');
    expect(html).toContain('蒙版编辑画布');
    expect(html).toContain('蒙版编辑工具');
    expect(html).toContain('Dataset Review Queue');
    expect(html).toContain('Dataset Review Queue');
    expect(html).toContain('training');
    expect(html).toContain('offline');
    expect(html).not.toContain('开发�?JSON');
  });
});
