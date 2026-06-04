import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppInteractionChecklist } from '../src/components/user-app';
import {
  userAppReadinessExampleMobileQa,
  userAppReadinessExampleReport,
} from '../src/templates/examples';

describe('UserAppInteractionChecklist', () => {
  it('renders required and supplemental interaction QA items', () => {
    const html = renderToStaticMarkup(
      <UserAppInteractionChecklist
        mobileChecks={userAppReadinessExampleMobileQa.checks}
        readinessReport={userAppReadinessExampleReport}
      />,
    );

    expect(html).toContain('交互检查清单');
    expect(html).toContain('必测项');
    expect(html).toContain('补充项');
    expect(html).toContain('选择模板');
    expect(html).not.toContain('C:\\');
  });
});
