import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTrialEvidenceSummaryPanel } from '../src/components/user-app';
import { userAppTrialEvidenceSummaryInsufficientExample } from '../src/templates/examples';

describe('UserAppTrialEvidenceSummaryPanel', () => {
  it('renders evidence themes and gaps', () => {
    const html = renderToStaticMarkup(
      <UserAppTrialEvidenceSummaryPanel
        evidenceSummary={userAppTrialEvidenceSummaryInsufficientExample}
      />,
    );

    expect(html).toContain('试用证据摘要');
    expect(html).toContain('证据缺口');
    expect(html).toContain('不能直接进入 MVP validation planning');
    expect(html).toContain('不接后端');
  });
});
