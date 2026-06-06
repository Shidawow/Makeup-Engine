import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('UserAppShell template content QA flow', () => {
  it('adds 8D admin content QA entries without exposing them in the ordinary user path', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );
    const userPathStart = html.indexOf('用户路径');
    const adminStart = html.indexOf('管理员检查');
    const userPathHtml = html.slice(userPathStart, adminStart);

    expect(html).toContain('模板内容 QA');
    expect(html).toContain('试用模板选择');
    expect(html).toContain('试用内容就绪度');
    expect(html).toContain('MVP 试用管理');
    expect(userPathHtml).not.toContain('模板内容 QA');
    expect(userPathHtml).not.toContain('试用模板选择');
    expect(userPathHtml).not.toContain('试用内容就绪度');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('OpenAI');
  });
});
