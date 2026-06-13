import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppAnonymousTrialLaunchReadinessPanel } from '../src/components/user-app';
import { userAppAnonymousTrialLaunchReadinessReadyExample } from '../src/templates/examples';

describe('UserAppAnonymousTrialLaunchReadinessPanel', () => {
  it('renders launch readiness decision and safety checks', () => {
    const html = renderToStaticMarkup(
      <UserAppAnonymousTrialLaunchReadinessPanel
        readiness={userAppAnonymousTrialLaunchReadinessReadyExample}
      />,
    );

    expect(html).toContain('启动就绪度');
    expect(html).toContain('可以启动匿名内部试用');
    expect(html).toContain('检查项');
    expect(html).toContain('风险和处理');
    expect(html).toContain('不会接后端、上传、训练或保存真实用户记录');
  });
});
