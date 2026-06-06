import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('User App Shell Phase 8B PWA polish flow', () => {
  it('renders mobile-first user path and separated admin QA entries', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );

    expect(html).toContain('Phase 8B PWA / Mobile Web MVP Polish');
    expect(html).toContain('今日妆容练习');
    expect(html).toContain('今天从哪套妆容开始？');
    expect(html).toContain('开始跟练');
    expect(html).toContain('浏览妆容');
    expect(html).toContain('查看隐私说明');
    expect(html).toContain('用户路径');
    expect(html).toContain('管理员检查');
    expect(html).toContain('PWA 检查');
    expect(html).toContain('MVP 打磨');
    expect(html).toContain('App 就绪度');
    expect(html).toContain('移动端 QA');
    expect(html).toContain('交互检查');
    expect(html).toContain('上一步');
    expect(html).toContain('下一步');
    expect(html).toContain('标记完成');
    expect(html).toContain('跳过');
    expect(html).toContain('不上传');
    expect(html).toContain('不会用于训练');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
    expect(html).not.toContain('C:\\');
  });
});
