import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppAnonymousTrialFollowUpIterationPanel } from '../src/components/user-app';
import { userAppAnonymousTrialFollowUpIterationRepeatDryRunExample } from '../src/templates/examples';

describe('UserAppAnonymousTrialFollowUpIterationPanel', () => {
  it('renders follow-up goals and next actions', () => {
    const html = renderToStaticMarkup(
      <UserAppAnonymousTrialFollowUpIterationPanel
        iteration={userAppAnonymousTrialFollowUpIterationRepeatDryRunExample}
      />,
    );
    expect(html).toContain('匿名试用后续迭代');
    expect(html).toContain('先重复 dry run');
    expect(html).toContain('后续目标');
    expect(html).toContain('不接后端');
  });
});
