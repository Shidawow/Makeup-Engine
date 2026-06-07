import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTrialIssueSummaryPanel } from '../src/components/user-app';
import { userAppTrialIssueTaxonomyContentSummary } from '../src/templates/examples';

describe('UserAppTrialIssueSummaryPanel', () => {
  it('renders issue taxonomy summary as an admin-only local review surface', () => {
    const html = renderToStaticMarkup(
      <UserAppTrialIssueSummaryPanel summary={userAppTrialIssueTaxonomyContentSummary} />,
    );

    expect(html).toContain('问题分类汇总');
    expect(html).toContain('内容问题');
    expect(html).toContain('Shell 体验问题');
    expect(html).toContain('隐私边界问题');
    expect(html).toContain('试用流程问题');
    expect(html).toContain('不保存真实试用记录');
    expect(html).toContain('不写入训练数据');
  });
});
