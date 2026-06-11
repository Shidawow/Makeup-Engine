import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppNextPhaseRecommendationPanel } from '../src/components/user-app';
import { userAppNextPhaseRecommendationPhase9EExample } from '../src/templates/examples';

describe('UserAppNextPhaseRecommendationPanel', () => {
  it('renders next phase recommendation and local-only boundaries', () => {
    const html = renderToStaticMarkup(
      <UserAppNextPhaseRecommendationPanel
        recommendation={userAppNextPhaseRecommendationPhase9EExample}
      />,
    );

    expect(html).toContain('下一阶段建议');
    expect(html).toContain('Phase 9E');
    expect(html).toContain('匿名/示例/本地');
    expect(html).toContain('不保存真实个人身份');
    expect(html).toContain('不上传');
    expect(html).toContain('不训练');
    expect(html).toContain('不默认进入 production app');
  });
});
