import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTrialIterationBacklogPanel } from '../src/components/user-app';
import { userAppTrialIterationBacklogPrivacyBlockerExample } from '../src/templates/examples';

describe('UserAppTrialIterationBacklogPanel', () => {
  it('renders backlog owner, priority, next action, and blocked reason as admin-only local structure', () => {
    const html = renderToStaticMarkup(
      <UserAppTrialIterationBacklogPanel
        backlog={userAppTrialIterationBacklogPrivacyBlockerExample}
      />,
    );

    expect(html).toContain('迭代 backlog');
    expect(html).toContain('不是后端工单系统');
    expect(html).toContain('不保存真实试用者记录');
    expect(html).toContain('不写入训练数据');
    expect(html).toContain('privacy_boundary');
    expect(html).toContain('p0_blocker');
    expect(html).toContain('阻断原因');
  });
});
