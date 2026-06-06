import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTrialFeedbackPanel } from '../src/components/user-app';
import {
  userAppTrialFeedbackMockSummary,
  userAppTrialFeedbackReadyExample,
} from '../src/templates/examples';

describe('UserAppTrialFeedbackPanel', () => {
  it('renders feedback questions and marks mock/example summary', () => {
    const html = renderToStaticMarkup(
      <UserAppTrialFeedbackPanel
        form={userAppTrialFeedbackReadyExample}
        summary={userAppTrialFeedbackMockSummary}
      />,
    );

    expect(html).toContain('试用反馈表预览');
    expect(html).toContain('你能看懂这个妆容练习流程吗？');
    expect(html).toContain('你是否愿意付费或推荐给朋友？');
    expect(html).toContain('Mock 摘要');
    expect(html).toContain('不是真实提交表单');
    expect(html).toContain('不收集姓名');
    expect(html).not.toContain('后端提交：是');
    expect(html).not.toContain('data:image/');
  });
});
