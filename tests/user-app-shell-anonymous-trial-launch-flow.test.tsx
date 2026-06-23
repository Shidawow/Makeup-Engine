import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('UserAppShell anonymous internal trial launch flow', () => {
  it('adds 9H admin entries without exposing launch admin terms in the ordinary user path', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} showAdminTools />,
    );
    const userPathStart = html.indexOf('用户路径');
    const adminStart = html.indexOf('管理员检查');
    const userPathHtml = html.slice(userPathStart, adminStart);

    expect(html).toContain('匿名内部试用启动包');
    expect(html).toContain('启动就绪度');
    expect(html).toContain('试用后 handoff');
    expect(userPathHtml).not.toContain('匿名内部试用启动包');
    expect(userPathHtml).not.toContain('启动就绪度');
    expect(userPathHtml).not.toContain('试用后 handoff');
    expect(userPathHtml).not.toContain('launch');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('OpenAI');
  });
});
