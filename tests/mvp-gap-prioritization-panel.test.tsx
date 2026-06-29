import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MvpGapPrioritizationPanel } from '../src/components/template-studio/MvpGapPrioritizationPanel';
import { createMvpGapPrioritizationReport } from '../src/template-engine';
import { founderTrialFeedbackReportReadyExample } from '../src/templates/examples';

describe('MvpGapPrioritizationPanel', () => {
  it('renders priority, impact, effort, decision, and boundary notices', () => {
    const report = createMvpGapPrioritizationReport({
      feedback: founderTrialFeedbackReportReadyExample,
    });
    const html = renderToStaticMarkup(
      <MvpGapPrioritizationPanel report={report} />,
    );

    expect(html).toContain('MVP Gap Prioritization');
    expect(html).toContain('这是 MVP gap prioritization，不是 product roadmap final');
    expect(html).toContain('不是 production readiness');
    expect(html).toContain('不能 publish / registry write');
    expect(html).toContain('priority');
    expect(html).toContain('impact');
    expect(html).toContain('effort');
    expect(html).toContain('decision');
    expect(html).toContain('production gap：yes');
    expect(html).toContain('Phase 13C - MVP Gap Resolution Sprint Planning');
  });
});
