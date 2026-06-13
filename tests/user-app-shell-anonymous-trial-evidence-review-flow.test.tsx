import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('UserAppShell anonymous trial evidence review flow', () => {
  it('adds 9I admin entries without exposing evidence review admin terms in the ordinary user path', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );
    const userPathStart = html.indexOf('用户路径');
    const adminStart = html.indexOf('管理员检查');
    const userPathHtml = html.slice(userPathStart, adminStart);

    expect(html).toContain('匿名试用证据复盘');
    expect(html).toContain('证据缺口复盘');
    expect(html).toContain('下一步决策输入');
    expect(userPathHtml).not.toContain('匿名试用证据复盘');
    expect(userPathHtml).not.toContain('证据缺口复盘');
    expect(userPathHtml).not.toContain('下一步决策输入');
    expect(userPathHtml).not.toContain('evidence review');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('OpenAI');
  });
});
