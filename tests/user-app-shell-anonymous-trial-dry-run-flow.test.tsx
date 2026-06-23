import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('UserAppShell anonymous internal trial dry run flow', () => {
  it('adds 9G admin entries without exposing dry run admin terms in the ordinary user path', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} showAdminTools />,
    );
    const userPathStart = html.indexOf('用户路径');
    const adminStart = html.indexOf('管理员检查');
    const userPathHtml = html.slice(userPathStart, adminStart);

    expect(html).toContain('匿名内部试用 dry run');
    expect(html).toContain('dry run checklist');
    expect(html).toContain('dry run 复盘');
    expect(userPathHtml).not.toContain('匿名内部试用 dry run');
    expect(userPathHtml).not.toContain('dry run checklist');
    expect(userPathHtml).not.toContain('dry run 复盘');
    expect(userPathHtml).not.toContain('dry run');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('OpenAI');
  });
});
