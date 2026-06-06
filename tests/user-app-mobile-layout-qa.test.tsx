import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('User App mobile layout QA shell wiring', () => {
  it('renders Phase 7H entries without squeezing unsafe runtime data into the shell', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );

    expect(html).toContain('Phase 8B PWA / Mobile Web MVP Polish');
    expect(html).toContain('今日妆容练习');
    expect(html).toContain('PWA 检查');
    expect(html).toContain('MVP 打磨');
    expect(html).toContain('App 就绪度');
    expect(html).toContain('移动端 QA');
    expect(html).toContain('交互检查');
    expect(html).toContain('sm:');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
    expect(html).not.toContain('C:\\');
  });
});
