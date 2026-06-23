import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('UserAppShell evidence pack flow', () => {
  it('adds 9E admin entries without exposing evidence admin terms in the ordinary user path', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} showAdminTools />,
    );
    const userPathStart = html.indexOf('用户路径');
    const adminStart = html.indexOf('管理员检查');
    const userPathHtml = html.slice(userPathStart, adminStart);

    expect(html).toContain('内部试用证据包');
    expect(html).toContain('试用证据摘要');
    expect(html).toContain('证据充分性判断');
    expect(userPathHtml).not.toContain('内部试用证据包');
    expect(userPathHtml).not.toContain('试用证据摘要');
    expect(userPathHtml).not.toContain('证据充分性判断');
    expect(userPathHtml).not.toContain('evidence pack');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('OpenAI');
  });
});
