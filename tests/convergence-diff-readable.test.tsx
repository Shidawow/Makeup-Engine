import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ConvergenceDiffPanel } from '../src/components/template-studio/ConvergenceDiffPanel';
import type { TemplateConvergenceDiffResult } from '../src/template-engine';

describe('readable convergence diff', () => {
  it('truncates long semantic strings into short human-readable summaries', () => {
    const longSemantic =
      'semantic:lip_style_defined_satin_with_extra_long_unreadable_classifier_tail|semantic:blush_style_soft_diffused_with_extra_long_unreadable_classifier_tail|semantic:eye_style_clean_defined_with_extra_long_unreadable_classifier_tail|semantic:another_tail';
    const diff: TemplateConvergenceDiffResult = {
      source: {
        aiTemplateId: 'ai',
        humanTemplateId: 'human',
      },
      changedCount: 1,
      items: [
        {
          id: 'semantic',
          kind: 'semantic-label-changed',
          label: 'Semantic label changed',
          before: longSemantic,
          after: 'semantic:lip_style_soft_gradient_satin',
          changed: true,
        },
      ],
    };
    const html = renderToStaticMarkup(<ConvergenceDiffPanel diff={diff} />);

    expect(html).toContain('语义标签');
    expect(html).toContain('lip style defined satin');
    expect(html).toContain('...');
    expect(html).not.toContain('another_tail');
  });
});
