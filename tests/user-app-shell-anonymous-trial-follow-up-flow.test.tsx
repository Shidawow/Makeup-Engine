import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('UserAppShell anonymous trial follow-up flow', () => {
  it('adds 9J admin entries without exposing follow-up admin terms in the ordinary user path', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} showAdminTools />,
    );
    const userPathStart = html.indexOf('用户路径');
    const adminStart = html.indexOf('管理员检查');
    const userPathHtml = html.slice(userPathStart, adminStart);

    expect(html).toContain('匿名试用后续迭代');
    expect(html).toContain('证据缺口行动计划');
    expect(html).toContain('后续试用就绪度');
    expect(userPathHtml).not.toContain('匿名试用后续迭代');
    expect(userPathHtml).not.toContain('证据缺口行动计划');
    expect(userPathHtml).not.toContain('后续试用就绪度');
    expect(userPathHtml).not.toContain('follow-up');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('OpenAI');
  });
});
