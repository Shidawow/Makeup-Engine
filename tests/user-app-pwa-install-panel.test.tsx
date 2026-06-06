import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppPwaInstallPanel } from '../src/components/user-app';
import { userAppPwaReadyExampleReport } from '../src/templates/examples';

describe('UserAppPwaInstallPanel', () => {
  it('renders PWA install readiness without implying production runtime capabilities', () => {
    const html = renderToStaticMarkup(
      <UserAppPwaInstallPanel report={userAppPwaReadyExampleReport} />,
    );

    expect(html).toContain('PWA 安装骨架检查');
    expect(html).toContain('manifest');
    expect(html).toContain('service worker');
    expect(html).toContain('离线缓存');
    expect(html).toContain('analytics');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
    expect(html).not.toContain('C:\\');
  });
});
