import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppAnonymousTrialDryRunChecklistPanel } from '../src/components/user-app';
import { userAppAnonymousTrialDryRunChecklistReadyExample } from '../src/templates/examples';

describe('UserAppAnonymousTrialDryRunChecklistPanel', () => {
  it('renders administrator dry run checklist without backend collection copy', () => {
    const html = renderToStaticMarkup(
      <UserAppAnonymousTrialDryRunChecklistPanel
        checklist={userAppAnonymousTrialDryRunChecklistReadyExample}
      />,
    );

    expect(html).toContain('dry run checklist');
    expect(html).toContain('已说明不收集照片');
    expect(html).toContain('已说明不上传');
    expect(html).toContain('已说明不训练');
    expect(html).toContain('不保存真实用户记录');
    expect(html).not.toContain('后端表单');
  });
});
