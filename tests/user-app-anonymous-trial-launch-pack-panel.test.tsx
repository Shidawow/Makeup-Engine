import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppAnonymousTrialLaunchPackPanel } from '../src/components/user-app';
import { userAppAnonymousTrialLaunchPackReadyExample } from '../src/templates/examples';

describe('UserAppAnonymousTrialLaunchPackPanel', () => {
  it('renders launch scope, admin script, capture sheet, and stop conditions', () => {
    const html = renderToStaticMarkup(
      <UserAppAnonymousTrialLaunchPackPanel
        pack={userAppAnonymousTrialLaunchPackReadyExample}
      />,
    );

    expect(html).toContain('匿名内部试用启动包');
    expect(html).toContain('内部 / 本地 / 非公开');
    expect(html).toContain('管理员执行脚本');
    expect(html).toContain('匿名证据记录模板');
    expect(html).toContain('停止 / 暂停条件');
    expect(html).toContain('不保存真实个人身份');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
  });
});
