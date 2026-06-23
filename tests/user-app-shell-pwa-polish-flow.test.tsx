import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('User App Shell Phase 8B PWA polish flow', () => {
  it('renders mobile-first user path and separated admin QA entries', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} showAdminTools />,
    );

    expect(html).toContain('User App MVP');
    expect(html).toContain('今日妆容练习');
    expect(html).toContain('今天从哪套妆容开始？');
    expect(html).toContain('开始跟练');
    expect(html).toContain('浏览妆容');
    expect(html).toContain('查看隐私说明');
    expect(html).toContain('我的本地设置');
    expect(html).toContain('管理员检查');
    expect(html).toContain('PWA 检查');
    expect(html).toContain('MVP 打磨');
    expect(html).toContain('App 就绪度');
    expect(html).toContain('移动端 QA');
    expect(html).toContain('交互检查');
    expect(html).toContain('首页');
    expect(html).toContain('选择妆容');
    expect(html).toContain('准备工具');
    expect(html).toContain('分步跟练');
    expect(html).toContain('不上传');
    expect(html).toContain('不会用于训练');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
    expect(html).not.toContain('C:\\');
  });
});
