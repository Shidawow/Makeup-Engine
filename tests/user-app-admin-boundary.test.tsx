import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

const forbiddenUserPathTerms = [
  'registry',
  'write gate',
  'publish gate',
  'simulator',
  'approval boundary',
  'production writer',
  'Pipeline Trace',
  'FaceMesh debug JSON',
  '已发布',
  '已写入 registry',
  'production ready',
  '真实写入批准边界',
  '受保护真实写入执行模拟器',
  '用户 App 模板包 Registry 写入闸门',
];

describe('User App MVP admin boundary', () => {
  it('does not expose registry or backend review terms in the ordinary user shell', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );

    for (const term of forbiddenUserPathTerms) {
      expect(html).not.toContain(term);
    }

    expect(html).toContain('今日妆容练习');
    expect(html).toContain('模板选择');
    expect(html).toContain('分步跟练');
    expect(html).toContain('打开管理员检查');
  });

  it('keeps administrator tooling available only when explicitly enabled', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} showAdminTools />,
    );

    expect(html).toContain('PWA 检查');
    expect(html).toContain('MVP 试用包');
    expect(html).toContain('移动端 QA');
    expect(html).toContain('隐藏管理员检查');
  });
});
