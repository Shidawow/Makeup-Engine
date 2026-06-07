import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTrialDecisionFrameworkPanel } from '../src/components/user-app';
import { userAppTrialDecisionReadyFor9CExample } from '../src/templates/examples';

describe('UserAppTrialDecisionFrameworkPanel', () => {
  it('renders the next-step decision framework without backend or training claims', () => {
    const html = renderToStaticMarkup(
      <UserAppTrialDecisionFrameworkPanel
        framework={userAppTrialDecisionReadyFor9CExample}
      />,
    );

    expect(html).toContain('下一步决策框架');
    expect(html).toContain('可进入 Phase 9C');
    expect(html).toContain('不上传');
    expect(html).toContain('不训练');
    expect(html).toContain('不做真实用户数据分析');
    expect(html).not.toContain('App Store');
    expect(html).not.toContain('getUserMedia');
  });
});
