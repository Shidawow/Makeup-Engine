import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTrialPackPanel } from '../src/components/user-app';
import { userAppTrialPackReadyExample } from '../src/templates/examples';

describe('UserAppTrialPackPanel', () => {
  it('renders trial tasks with local-only boundary copy', () => {
    const html = renderToStaticMarkup(
      <UserAppTrialPackPanel pack={userAppTrialPackReadyExample} />,
    );

    expect(html).toContain('MVP 试用包');
    expect(html).toContain('打开移动 Web MVP 壳');
    expect(html).toContain('完成至少 3 个步骤');
    expect(html).toContain('退出后恢复本地进度');
    expect(html).toContain('不上传数据');
    expect(html).toContain('不会用于训练');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('data:image/');
  });
});
