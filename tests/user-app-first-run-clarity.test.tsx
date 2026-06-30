import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('User App first-run clarity', () => {
  it('explains what the MVP does and how to start without admin terms', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );
    const userPath = html.split('管理员检查')[0] ?? html;

    expect(userPath).toContain('这是本地化妆指导 MVP');
    expect(userPath).toContain('化妆指导 MVP，从一套模板开始');
    expect(userPath).toContain('选择一个妆容模板');
    expect(userPath).toContain('查看工具准备');
    expect(userPath).toContain('跟着步骤完成妆容练习');
    expect(userPath).toContain('当前是本地 MVP 演示');
    expect(userPath).toContain('不上传');
    expect(userPath).toContain('不会用于训练');

    for (const forbidden of [
      'MVP Gap Resolution Sprint Plan',
      'Sprint Planning',
      'Gap Resolution',
      'roadmap',
      'registry',
      'production ready',
      'AI 已确认',
      '自动识别你的妆容',
      '正式模板库',
    ]) {
      expect(userPath).not.toContain(forbidden);
    }
  });
});
