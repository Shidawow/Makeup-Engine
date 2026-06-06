import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('UserAppShell release readiness flow', () => {
  it('adds 8E admin release gate entries without exposing them in ordinary user tabs', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );
    const userPathStart = html.indexOf('用户路径');
    const adminStart = html.indexOf('管理员检查');
    const userPathHtml = html.slice(userPathStart, adminStart);

    expect(html).toContain('MVP 发布就绪度');
    expect(html).toContain('试用 Go/No-Go');
    expect(html).toContain('跟练');
    expect(html).toContain('发现妆容');
    expect(html).toContain('本地进度');
    expect(html).toContain('隐私说明');
    expect(userPathHtml).not.toContain('MVP 发布就绪度');
    expect(userPathHtml).not.toContain('Go/No-Go');
    expect(userPathHtml).not.toContain('release gate');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('OpenAI');
  });
});
