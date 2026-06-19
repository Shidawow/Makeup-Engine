import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTemplatePackageRegistryWriteGatePanel } from '../src/components/template-studio/UserAppTemplatePackageRegistryWriteGatePanel';
import {
  userAppTemplatePackageRegistryWriteGateActualRegistryWriteBlockedExample,
  userAppTemplatePackageRegistryWriteGateHandoffBlockedExample,
  userAppTemplatePackageRegistryWriteGateHandoffReadyExample,
  userAppTemplatePackageRegistryWriteGateReadyExample,
} from '../src/templates/examples';

describe('UserAppTemplatePackageRegistryWriteGatePanel', () => {
  it('renders registry write gate, handoff, and boundary copy', () => {
    const html = renderToStaticMarkup(
      <UserAppTemplatePackageRegistryWriteGatePanel
        gate={userAppTemplatePackageRegistryWriteGateReadyExample}
        handoff={userAppTemplatePackageRegistryWriteGateHandoffReadyExample}
      />,
    );

    expect(html).toContain('用户 App 模板包 Registry 写入闸门');
    expect(html).toContain('Write Gate Status');
    expect(html).toContain('Gate Checks');
    expect(html).toContain('Registry Writer Handoff');
    expect(html).toContain('只是写入前闸门，不是实际写入');
    expect(html).toContain('不会发布');
    expect(html).toContain('不会替换当前用户 App 包');
    expect(html).toContain('可进入');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已替换当前用户 App 包');
    expect(html).not.toContain('已上线');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('renders blocked reasons for actual registry write markers', () => {
    const html = renderToStaticMarkup(
      <UserAppTemplatePackageRegistryWriteGatePanel
        gate={userAppTemplatePackageRegistryWriteGateActualRegistryWriteBlockedExample}
        handoff={userAppTemplatePackageRegistryWriteGateHandoffBlockedExample}
      />,
    );

    expect(html).toContain('registry_write_gate_blocked');
    expect(html).toContain('Blocked reasons');
    expect(html).toContain(
      'Registry write gate must not execute, persist, or mark actual registry writes',
    );
    expect(html).toContain('不可进入');
  });
});
