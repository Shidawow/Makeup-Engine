import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppCompatibilityBanner } from '../src/components/user-app';
import { createUserAppCompatibilityViewModel } from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';

describe('UserAppCompatibilityBanner', () => {
  it('renders local-only compatibility state and durable export checks', () => {
    const compatibility = createUserAppCompatibilityViewModel(userAppMvpShellExamplePackage);
    const html = renderToStaticMarkup(
      <UserAppCompatibilityBanner compatibility={compatibility} />,
    );

    expect(html).toContain('web-app-v0');
    expect(html).toContain('本地');
    expect(html).toContain('object URL');
    expect(html).toContain('web-app-v0');
  });
});
