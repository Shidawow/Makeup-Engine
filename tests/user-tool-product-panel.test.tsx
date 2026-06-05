import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserToolProductPanel } from '../src/components/user-app';
import { createUserAppToolProductViewModel } from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';

describe('UserToolProductPanel', () => {
  it('renders required tools, products, and per-step links', () => {
    const toolsAndProducts = createUserAppToolProductViewModel(
      userAppMvpShellExamplePackage.templates[0],
    );
    const html = renderToStaticMarkup(
      <UserToolProductPanel toolsAndProducts={toolsAndProducts} />,
    );

    expect(html).toContain('brush');
    expect(html).toContain('必备工具');
    expect(html).toContain('产品建议');
    expect(html).not.toContain('购买');
  });
});
