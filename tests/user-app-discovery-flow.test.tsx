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

    expect(html).toContain('今日妆容练习');
    expect(html).toContain('\u53d1\u73b0\u5986\u5bb9');
    expect(html).toContain('\u6211\u7684\u504f\u597d');
    expect(html).toContain('照片占位');
    expect(html).toContain('打开管理员检查');
    expect(html).toContain('管理员区域只用于项目验收和后台链路复核');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
    expect(html).not.toContain('OpenAI');
  });
});
