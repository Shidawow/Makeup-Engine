import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';

describe('UserAppShell', () => {
  it('renders the mobile web MVP shell from local template guidance data', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );
    expect(html).toContain('今日妆容练习');
    expect(html).toContain('今天从哪套妆容开始？');
    expect(html).toContain('Soft Rose Daily Look');
    expect(html).toContain('Warm Bronze Evening Look');
    expect(html).toContain('模板选择');
    expect(html).toContain('准备工具');
    expect(html).toContain('分步跟练');
    expect(html).toContain('打开管理员检查');
    expect(html).toContain('不上传');
    expect(html).toContain('不会用于训练');
    expect(html).toContain('本地进度');
    expect(html).not.toContain('PWA 检查');
    expect(html).not.toContain('registry');
    expect(html).not.toContain('production writer');
    expect(html).not.toContain('已发布');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
    expect(html).not.toContain('C:\\');
  });
});
