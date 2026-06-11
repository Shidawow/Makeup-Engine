import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppEvidenceSufficiencyGatePanel } from '../src/components/user-app';
import { userAppEvidenceSufficiencyGateMvpPlanningExample } from '../src/templates/examples';

describe('UserAppEvidenceSufficiencyGatePanel', () => {
  it('renders sufficiency decision and boundary copy', () => {
    const html = renderToStaticMarkup(
      <UserAppEvidenceSufficiencyGatePanel
        gate={userAppEvidenceSufficiencyGateMvpPlanningExample}
      />,
    );

    expect(html).toContain('证据充分性判断');
    expect(html).toContain('足够规划 MVP validation');
    expect(html).toContain('没有真实证据时不会过度推进');
    expect(html).toContain('不创建生产 App');
  });
});
