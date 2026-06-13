import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppAnonymousTrialEvidenceGapReviewPanel } from '../src/components/user-app';
import { userAppAnonymousTrialEvidenceGapReviewInsufficientSampleExample } from '../src/templates/examples';

describe('UserAppAnonymousTrialEvidenceGapReviewPanel', () => {
  it('renders evidence gaps and MVP validation planning blocker copy', () => {
    const html = renderToStaticMarkup(
      <UserAppAnonymousTrialEvidenceGapReviewPanel
        gapReview={userAppAnonymousTrialEvidenceGapReviewInsufficientSampleExample}
      />,
    );

    expect(html).toContain('证据缺口复盘');
    expect(html).toContain('匿名样本量不足');
    expect(html).toContain('MVP validation planning');
    expect(html).toContain('不保存真实身份、不上传、不训练、不收集照片');
  });
});
