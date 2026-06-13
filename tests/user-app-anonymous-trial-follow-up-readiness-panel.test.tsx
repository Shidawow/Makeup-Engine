import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppAnonymousTrialFollowUpReadinessPanel } from '../src/components/user-app';
import { userAppAnonymousTrialFollowUpReadinessPausePrivacyExample } from '../src/templates/examples';

describe('UserAppAnonymousTrialFollowUpReadinessPanel', () => {
  it('renders readiness decision and non-production boundary', () => {
    const html = renderToStaticMarkup(
      <UserAppAnonymousTrialFollowUpReadinessPanel
        readiness={userAppAnonymousTrialFollowUpReadinessPausePrivacyExample}
      />,
    );
    expect(html).toContain('后续试用就绪度');
    expect(html).toContain('因隐私或范围问题暂停');
    expect(html).toContain('不保存真实个人身份');
    expect(html).toContain('生产 App');
  });
});
