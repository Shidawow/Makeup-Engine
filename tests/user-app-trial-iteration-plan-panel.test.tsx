import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTrialIterationPlanPanel } from '../src/components/user-app';
import { userAppTrialIterationPlanContentHeavyExample } from '../src/templates/examples';

describe('UserAppTrialIterationPlanPanel', () => {
  it('renders workstreams, actions, risks, and local privacy boundaries', () => {
    const html = renderToStaticMarkup(
      <UserAppTrialIterationPlanPanel plan={userAppTrialIterationPlanContentHeavyExample} />,
    );

    expect(html).toContain('试用迭代计划');
    expect(html).toContain('匿名/示例/本地');
    expect(html).toContain('不是正式产品 roadmap');
    expect(html).toContain('不保存真实个人身份');
    expect(html).toContain('不上传');
    expect(html).toContain('不训练');
    expect(html).toContain('模板内容迭代');
    expect(html).toContain('template_content_iteration');
  });
});
