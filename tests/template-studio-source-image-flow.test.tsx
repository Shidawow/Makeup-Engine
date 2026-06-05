import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplateStudio } from '../src/components/template-studio/TemplateStudio';

describe('TemplateStudio source image flow', () => {
  it('exposes source image intake before mask editing and training review flows', () => {
    const html = renderToStaticMarkup(<TemplateStudio />);

    expect(html).toContain('源图导入');
    expect(html).toContain('SourceImagePackage');
    expect(html).toContain('TemplateAnalysisSeed');
    expect(html).toContain('import-source-images');
    expect(html).toContain('蒙版');
  });
});
