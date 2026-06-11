import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppInternalTrialLearningSummaryPanel } from '../src/components/user-app';
import { userAppInternalTrialLearningSummaryStrongValueExample } from '../src/templates/examples';

describe('UserAppInternalTrialLearningSummaryPanel', () => {
  it('renders learning themes, insights, and privacy boundaries', () => {
    const html = renderToStaticMarkup(
      <UserAppInternalTrialLearningSummaryPanel
        summary={userAppInternalTrialLearningSummaryStrongValueExample}
      />,
    );

    expect(html).toContain('试用学习总结');
    expect(html).toContain('匿名/示例/本地');
    expect(html).toContain('不是正式用户数据分析系统');
    expect(html).toContain('不保存真实个人身份');
    expect(html).toContain('不上传');
    expect(html).toContain('不训练');
    expect(html).toContain('用户价值信号');
  });
});
