import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppAnonymousTrialDryRunReviewPanel } from '../src/components/user-app';
import { userAppAnonymousTrialDryRunReviewReadyExample } from '../src/templates/examples';

describe('UserAppAnonymousTrialDryRunReviewPanel', () => {
  it('renders dry run review decision and keeps production approval out of scope', () => {
    const html = renderToStaticMarkup(
      <UserAppAnonymousTrialDryRunReviewPanel
        review={userAppAnonymousTrialDryRunReviewReadyExample}
      />,
    );

    expect(html).toContain('dry run 复盘');
    expect(html).toContain('可以准备匿名内部试用');
    expect(html).toContain('不上传');
    expect(html).toContain('不训练');
    expect(html).toContain('不用 AI 自动分析');
    expect(html).not.toContain('production approved');
  });
});
