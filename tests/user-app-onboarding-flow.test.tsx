import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';

describe('UserAppShell onboarding and preferences flow', () => {
  it('wires local onboarding, preferences, and discovery tabs into the shell', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );

    expect(html).toContain('\u7528\u6237 App MVP Shell');
    expect(html).toContain('\u6211\u7684\u51c6\u5907');
    expect(html).toContain('\u6211\u7684\u504f\u597d');
    expect(html).toContain('\u7167\u7247\u4e0e\u4e2a\u6027\u5316');
    expect(html).toContain('\u9690\u79c1\u8bf4\u660e');
    expect(html).toContain('UserAppTemplatePackage');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
    expect(html).not.toContain('C:\\');
  });
});
