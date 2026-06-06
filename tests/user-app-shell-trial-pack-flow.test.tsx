import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('UserAppShell trial pack flow', () => {
  it('adds trial admin entries while keeping ordinary user path separate', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );
    const userPathStart = html.indexOf('用户路径');
    const adminStart = html.indexOf('管理员检查');
    const userPathHtml = html.slice(userPathStart, adminStart);

    expect(html).toContain('MVP 试用包');
    expect(html).toContain('反馈表预览');
    expect(html).toContain('试用就绪度');
    expect(html).toContain('MVP 试用管理');
    expect(html).toContain('跟练');
    expect(html).toContain('发现妆容');
    expect(html).toContain('本地进度');
    expect(html).toContain('隐私说明');
    expect(userPathHtml).not.toContain('试用包');
    expect(userPathHtml).not.toContain('反馈表');
    expect(userPathHtml).not.toContain('试用就绪度');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('data:image/');
  });
});
