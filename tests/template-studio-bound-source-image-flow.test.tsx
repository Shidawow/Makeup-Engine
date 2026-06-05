import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplateStudio } from '../src/components/template-studio/TemplateStudio';

describe('TemplateStudio bound source image flow', () => {
  it('keeps the source image intake surface connected in the main studio', () => {
    const html = renderToStaticMarkup(<TemplateStudio />);

    expect(html).toContain('源图导入');
    expect(html).toContain('SourceImagePackage');
    expect(html).toContain('TemplateAnalysisSeed');
    expect(html).toContain('SourceImagePackage');
  });
});
