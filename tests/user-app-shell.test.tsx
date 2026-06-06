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
    expect(html).toContain('移动 Web');
    expect(html).toContain('PWA 检查');
    expect(html).toContain('rose');
    expect(html).toContain('brush');
    expect(html).toContain('0%');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
    expect(html).not.toContain('C:\\');
  });
});
