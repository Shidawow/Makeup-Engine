import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ExplicitRegistryWriteAuthorizationGatePanel } from '../src/components/template-studio/ExplicitRegistryWriteAuthorizationGatePanel';
import {
  explicitRegistryWriteAuthorizationChecklistReadyExample,
  explicitRegistryWriteAuthorizationGateActualRegistryWriteBlockedExample,
  explicitRegistryWriteAuthorizationGateReadyExample,
  explicitRegistryWriteAuthorizationHandoffBlockedExample,
  explicitRegistryWriteAuthorizationHandoffReadyExample,
} from '../src/templates/examples';

describe('ExplicitRegistryWriteAuthorizationGatePanel', () => {
  it('renders authorization gate, checklist, handoff, and no-write boundary copy', () => {
    const html = renderToStaticMarkup(
      <ExplicitRegistryWriteAuthorizationGatePanel
        checklist={explicitRegistryWriteAuthorizationChecklistReadyExample}
        gate={explicitRegistryWriteAuthorizationGateReadyExample}
        handoff={explicitRegistryWriteAuthorizationHandoffReadyExample}
      />,
    );

    expect(html).toContain('显式 Registry 写入授权闸门');
    expect(html).toContain('不是实际写入');
    expect(html).toContain('dry-run only');
    expect(html).toContain('不会发布');
    expect(html).toContain('不会替换当前用户 App 包');
    expect(html).toContain('未来真实写入仍需老板单独授权');
    expect(html).toContain('Authorization Checklist');
    expect(html).toContain('Authorization Handoff');
    expect(html).toContain('可进入未来受控写入执行设计');
    expect(html).not.toContain('已授权真实写入');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已替换当前用户 App 包');
    expect(html).not.toContain('已上线');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('renders blocked reasons for unsafe write markers', () => {
    const html = renderToStaticMarkup(
      <ExplicitRegistryWriteAuthorizationGatePanel
        checklist={explicitRegistryWriteAuthorizationChecklistReadyExample}
        gate={explicitRegistryWriteAuthorizationGateActualRegistryWriteBlockedExample}
        handoff={explicitRegistryWriteAuthorizationHandoffBlockedExample}
      />,
    );

    expect(html).toContain('explicit_authorization_gate_blocked');
    expect(html).toContain('Blocked reasons');
    expect(html).toContain(
      'Explicit authorization gate must not execute, persist, or mark actual registry writes',
    );
    expect(html).toContain('不可进入');
  });
});
