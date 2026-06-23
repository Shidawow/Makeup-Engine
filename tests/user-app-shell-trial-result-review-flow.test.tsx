import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('UserAppShell internal trial result review flow', () => {
  it('adds 9B admin entries without exposing review framework terms in the ordinary user path', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} showAdminTools />,
    );
    const userPathStart = html.indexOf('用户路径');
    const adminStart = html.indexOf('管理员检查');
    const userPathHtml = html.slice(userPathStart, adminStart);

    expect(html).toContain('试用结果复盘框架');
    expect(html).toContain('问题分类汇总');
    expect(html).toContain('下一步决策框架');
    expect(html).toContain('跟练');
    expect(html).toContain('发现妆容');
    expect(html).toContain('隐私说明');
    expect(userPathHtml).not.toContain('试用结果复盘框架');
    expect(userPathHtml).not.toContain('问题分类汇总');
    expect(userPathHtml).not.toContain('下一步决策框架');
    expect(userPathHtml).not.toContain('trial result review');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('OpenAI');
  });
});
