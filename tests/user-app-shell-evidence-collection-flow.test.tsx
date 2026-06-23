import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('UserAppShell evidence collection flow', () => {
  it('adds 9F admin entries without exposing evidence collection admin terms in the ordinary user path', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} showAdminTools />,
    );
    const userPathStart = html.indexOf('用户路径');
    const adminStart = html.indexOf('管理员检查');
    const userPathHtml = html.slice(userPathStart, adminStart);

    expect(html).toContain('证据收集协议');
    expect(html).toContain('证据收集 checklist');
    expect(html).toContain('证据收集质量门');
    expect(userPathHtml).not.toContain('证据收集协议');
    expect(userPathHtml).not.toContain('证据收集 checklist');
    expect(userPathHtml).not.toContain('证据收集质量门');
    expect(userPathHtml).not.toContain('evidence collection');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('OpenAI');
  });
});
