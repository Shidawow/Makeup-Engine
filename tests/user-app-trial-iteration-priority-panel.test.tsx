import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTrialIterationPriorityPanel } from '../src/components/user-app';
import {
  userAppTrialIterationPriorityP0Example,
  userAppTrialIterationPriorityP1ShellExample,
} from '../src/templates/examples';

describe('UserAppTrialIterationPriorityPanel', () => {
  it('renders anonymous local priority recommendations without training or upload scope', () => {
    const html = renderToStaticMarkup(
      <UserAppTrialIterationPriorityPanel
        recommendations={[
          userAppTrialIterationPriorityP0Example,
          userAppTrialIterationPriorityP1ShellExample,
        ]}
      />,
    );

    expect(html).toContain('优先级建议');
    expect(html).toContain('匿名/示例/本地');
    expect(html).toContain('不保存真实个人身份');
    expect(html).toContain('不上传');
    expect(html).toContain('不训练');
    expect(html).toContain('P0 阻断');
    expect(html).toContain('P1 高优先级');
  });
});
