import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTemplateContentQaPanel } from '../src/components/user-app';
import {
  userAppTemplateContentQaBlockedReport,
  userAppTemplateContentQaReadyReport,
  userAppTemplateContentQaWarningReport,
} from '../src/templates/examples';

describe('UserAppTemplateContentQaPanel', () => {
  it('renders administrator template content QA states', () => {
    const html = renderToStaticMarkup(
      <UserAppTemplateContentQaPanel
        reports={[
          userAppTemplateContentQaReadyReport,
          userAppTemplateContentQaWarningReport,
          userAppTemplateContentQaBlockedReport,
        ]}
      />,
    );

    expect(html).toContain('模板内容 QA');
    expect(html).toContain('标题清晰度');
    expect(html).toContain('步骤文案');
    expect(html).toContain('区域说明');
    expect(html).toContain('可试用');
    expect(html).toContain('阻断');
    expect(html).not.toContain('data:image/');
  });
});
