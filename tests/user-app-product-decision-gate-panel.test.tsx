import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppProductDecisionGatePanel } from '../src/components/user-app';
import { userAppProductDecisionGateMvpValidationExample } from '../src/templates/examples';

describe('UserAppProductDecisionGatePanel', () => {
  it('renders decision, risks, and production build boundary', () => {
    const html = renderToStaticMarkup(
      <UserAppProductDecisionGatePanel gate={userAppProductDecisionGateMvpValidationExample} />,
    );

    expect(html).toContain('产品决策门');
    expect(html).toContain('prepare_mvp_validation_plan');
    expect(html).toContain('production app discovery 只代表探索');
    expect(html).toContain('未批准');
    expect(html).toContain('不代表开始开发');
  });
});
