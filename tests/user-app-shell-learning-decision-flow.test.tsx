import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('UserAppShell learning decision flow', () => {
  it('adds 9D admin entries without exposing learning decision terms in the ordinary user path', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );
    const userPathStart = html.indexOf('用户路径');
    const adminStart = html.indexOf('管理员检查');
    const userPathHtml = html.slice(userPathStart, adminStart);

    expect(html).toContain('试用学习总结');
    expect(html).toContain('产品决策门');
    expect(html).toContain('下一阶段建议');
    expect(html).toContain('跟练');
    expect(html).toContain('发现妆容');
    expect(html).toContain('隐私说明');
    expect(userPathHtml).not.toContain('试用学习总结');
    expect(userPathHtml).not.toContain('产品决策门');
    expect(userPathHtml).not.toContain('下一阶段建议');
    expect(userPathHtml).not.toContain('learning summary');
    expect(userPathHtml).not.toContain('decision gate');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('OpenAI');
  });
});
