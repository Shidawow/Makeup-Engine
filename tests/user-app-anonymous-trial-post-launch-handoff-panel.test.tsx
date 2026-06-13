import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppAnonymousTrialPostLaunchHandoffPanel } from '../src/components/user-app';
import { userAppAnonymousTrialPostLaunchHandoffWithEvidenceGapsExample } from '../src/templates/examples';

describe('UserAppAnonymousTrialPostLaunchHandoffPanel', () => {
  it('renders anonymous evidence handoff and evidence gaps', () => {
    const html = renderToStaticMarkup(
      <UserAppAnonymousTrialPostLaunchHandoffPanel
        handoff={userAppAnonymousTrialPostLaunchHandoffWithEvidenceGapsExample}
      />,
    );

    expect(html).toContain('试用后 handoff');
    expect(html).toContain('匿名证据交接');
    expect(html).toContain('缺少推荐有用性聚合摘要');
    expect(html).toContain('不保存真实身份、不上传、不训练');
  });
});
