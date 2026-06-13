import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppAnonymousTrialDecisionInputPanel } from '../src/components/user-app';
import { userAppAnonymousTrialDecisionInputRepeatExample } from '../src/templates/examples';

describe('UserAppAnonymousTrialDecisionInputPanel', () => {
  it('renders recommendation, signal, risk, and no-backend copy', () => {
    const html = renderToStaticMarkup(
      <UserAppAnonymousTrialDecisionInputPanel
        decisionInput={userAppAnonymousTrialDecisionInputRepeatExample}
      />,
    );

    expect(html).toContain('下一步决策输入');
    expect(html).toContain('重复匿名内部试用');
    expect(html).toContain('学习信号');
    expect(html).toContain('不接后端');
    expect(html).toContain('不写训练数据');
  });
});
