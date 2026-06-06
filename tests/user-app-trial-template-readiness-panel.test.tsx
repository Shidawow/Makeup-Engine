import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTrialTemplateReadinessPanel } from '../src/components/user-app';
import {
  userAppTrialContentReadinessWarningExample,
  userAppTrialTemplateSelectionWarningExample,
} from '../src/templates/examples';

describe('UserAppTrialTemplateReadinessPanel', () => {
  it('renders trial-ready, backup, blocked, and readiness sections', () => {
    const html = renderToStaticMarkup(
      <UserAppTrialTemplateReadinessPanel
        readinessReport={userAppTrialContentReadinessWarningExample}
        selectionReport={userAppTrialTemplateSelectionWarningExample}
      />,
    );

    expect(html).toContain('试用模板选择与内容就绪度');
    expect(html).toContain('Trial-ready');
    expect(html).toContain('备用 warning');
    expect(html).toContain('试用内容就绪度');
    expect(html).toContain('warning');
    expect(html).not.toContain('getUserMedia');
  });
});
