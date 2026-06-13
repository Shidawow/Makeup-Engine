import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppAnonymousTrialEvidenceReviewPanel } from '../src/components/user-app';
import { userAppAnonymousTrialEvidenceReviewWarningExample } from '../src/templates/examples';

describe('UserAppAnonymousTrialEvidenceReviewPanel', () => {
  it('renders evidence completeness, privacy checks, and local-only copy', () => {
    const html = renderToStaticMarkup(
      <UserAppAnonymousTrialEvidenceReviewPanel
        review={userAppAnonymousTrialEvidenceReviewWarningExample}
      />,
    );

    expect(html).toContain('匿名试用证据复盘');
    expect(html).toContain('Evidence completeness');
    expect(html).toContain('隐私边界检查');
    expect(html).toContain('不保存真实个人身份、不上传、不训练、不收集照片');
    expect(html).toContain('mock/example');
  });
});
