import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTrialResultReviewPanel } from '../src/components/user-app';
import { userAppTrialResultReviewCleanExample } from '../src/templates/examples';

describe('UserAppTrialResultReviewPanel', () => {
  it('renders anonymous local result review copy without production collection scope', () => {
    const html = renderToStaticMarkup(
      <UserAppTrialResultReviewPanel review={userAppTrialResultReviewCleanExample} />,
    );

    expect(html).toContain('试用结果复盘框架');
    expect(html).toContain('匿名 / 示例 / 本地复盘框架');
    expect(html).toContain('不收集真实个人身份');
    expect(html).toContain('不上传');
    expect(html).toContain('不训练');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('OpenAI');
  });
});
