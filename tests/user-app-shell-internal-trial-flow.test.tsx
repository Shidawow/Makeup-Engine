import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('UserAppShell internal trial operations flow', () => {
  it('adds 9A admin entries without exposing trial ops terms in the ordinary user path', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} showAdminTools />,
    );
    const userPathStart = html.indexOf('用户路径');
    const adminStart = html.indexOf('管理员检查');
    const userPathHtml = html.slice(userPathStart, adminStart);

    expect(html).toContain('内部试用运营');
    expect(html).toContain('观察记录模板');
    expect(html).toContain('试用结果复盘');
    expect(html).toContain('跟练');
    expect(html).toContain('发现妆容');
    expect(userPathHtml).not.toContain('内部试用运营');
    expect(userPathHtml).not.toContain('观察记录模板');
    expect(userPathHtml).not.toContain('试用结果复盘');
    expect(userPathHtml).not.toContain('trial operations');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('OpenAI');
  });
});
