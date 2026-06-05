import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('user app session flow shell wiring', () => {
  it('renders the Phase 7F local session entry without breaking guidance shell output', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );

    expect(html).toContain('\u7528\u6237 App MVP Shell');
    expect(html).toContain('Soft Rose Daily Look');
    expect(html).toContain('Warm Bronze Evening Look');
    expect(html).toContain('UserAppTemplatePackage');
    expect(html).toContain('0%');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
    expect(html).not.toContain('C:\\');
  });
});
