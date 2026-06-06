import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTrialReadinessPanel } from '../src/components/user-app';
import { userAppTrialReadinessReadyExample } from '../src/templates/examples';

describe('UserAppTrialReadinessPanel', () => {
  it('renders trial readiness checks and safety boundary evidence', () => {
    const html = renderToStaticMarkup(
      <UserAppTrialReadinessPanel report={userAppTrialReadinessReadyExample} />,
    );

    expect(html).toContain('试用就绪度');
    expect(html).toContain('可进入内部试用');
    expect(html).toContain('试用任务包');
    expect(html).toContain('反馈表结构');
    expect(html).toContain('PWA 基础能力沿用');
    expect(html).toContain('无后端、无上传、无相机、无 AR、无训练');
    expect(html).toContain('不是正式发布');
    expect(html).not.toContain('data:image/');
  });
});
