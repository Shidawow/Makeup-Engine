import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppTemplateDiscoveryExamplePackage } from '../src/templates/examples';

describe('UserAppShell discovery flow wiring', () => {
  it('wires Phase 7E discovery entry into the shell without breaking local boundaries', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppTemplateDiscoveryExamplePackage} />,
    );

    expect(html).toContain('\u7528\u6237 App MVP Shell');
    expect(html).toContain('\u53d1\u73b0\u5986\u5bb9');
    expect(html).toContain('\u6211\u7684\u504f\u597d');
    expect(html).toContain('\u7167\u7247\u4e0e\u4e2a\u6027\u5316');
    expect(html).toContain('UserAppTemplatePackage');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
    expect(html).not.toContain('OpenAI');
  });
});
