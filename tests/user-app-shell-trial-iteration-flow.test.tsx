import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('UserAppShell internal trial iteration flow', () => {
  it('adds 9C admin entries without exposing iteration admin terms in the ordinary user path', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );
    const userPathStart = html.indexOf('用户路径');
    const adminStart = html.indexOf('管理员检查');
    const userPathHtml = html.slice(userPathStart, adminStart);

    expect(html).toContain('试用迭代计划');
    expect(html).toContain('迭代 backlog');
    expect(html).toContain('优先级建议');
    expect(html).toContain('跟练');
    expect(html).toContain('发现妆容');
    expect(html).toContain('隐私说明');
    expect(userPathHtml).not.toContain('试用迭代计划');
    expect(userPathHtml).not.toContain('迭代 backlog');
    expect(userPathHtml).not.toContain('优先级建议');
    expect(userPathHtml).not.toContain('iteration plan');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('OpenAI');
  });
});
