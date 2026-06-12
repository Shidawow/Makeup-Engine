import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppEvidenceCollectionProtocolPanel } from '../src/components/user-app';
import { userAppEvidenceCollectionProtocolReadyExample } from '../src/templates/examples';

describe('UserAppEvidenceCollectionProtocolPanel', () => {
  it('renders allowed, forbidden, anonymization, and stop condition copy', () => {
    const html = renderToStaticMarkup(
      <UserAppEvidenceCollectionProtocolPanel
        protocol={userAppEvidenceCollectionProtocolReadyExample}
      />,
    );

    expect(html).toContain('证据收集协议');
    expect(html).toContain('允许记录');
    expect(html).toContain('禁止记录');
    expect(html).toContain('匿名化规则');
    expect(html).toContain('停止条件');
    expect(html).toContain('不保存真实个人身份');
  });
});
