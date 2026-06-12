import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppAnonymousTrialDryRunPackPanel } from '../src/components/user-app';
import { userAppAnonymousTrialDryRunPackReadyExample } from '../src/templates/examples';

describe('UserAppAnonymousTrialDryRunPackPanel', () => {
  it('renders dry run scenarios and privacy boundaries', () => {
    const html = renderToStaticMarkup(
      <UserAppAnonymousTrialDryRunPackPanel
        pack={userAppAnonymousTrialDryRunPackReadyExample}
      />,
    );

    expect(html).toContain('匿名内部试用 dry run');
    expect(html).toContain('新手首次跟练流程');
    expect(html).toContain('管理员匿名证据记录演练');
    expect(html).toContain('不保存真实个人身份');
    expect(html).toContain('不收集照片');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
  });
});
