import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { RealRegistryWriteImplementationGatePanel } from '../src/components/template-studio/RealRegistryWriteImplementationGatePanel';
import {
  realRegistryWriteImplementationChecklistBlockedExample,
  realRegistryWriteImplementationChecklistReadyExample,
  realRegistryWriteImplementationGateBlockedByActualRegistryWriteExample,
  realRegistryWriteImplementationGateReadyExample,
  realRegistryWriteImplementationHandoffBlockedExample,
  realRegistryWriteImplementationHandoffReadyExample,
} from '../src/templates/examples';

describe('RealRegistryWriteImplementationGatePanel', () => {
  it('renders implementation gate, checklist, handoff, and no-write boundary copy', () => {
    const html = renderToStaticMarkup(
      <RealRegistryWriteImplementationGatePanel
        gate={realRegistryWriteImplementationGateReadyExample}
        checklist={realRegistryWriteImplementationChecklistReadyExample}
        handoff={realRegistryWriteImplementationHandoffReadyExample}
      />,
    );

    expect(html).toContain('真实 Registry 写入实现闸门');
    expect(html).toContain('不是实际写入');
    expect(html).toContain('不是 production writer');
    expect(html).toContain('dry-run only');
    expect(html).toContain('不会发布');
    expect(html).toContain('不会替换当前用户 App 包');
    expect(html).toContain('未来真实实现仍需老板单独授权');
    expect(html).toContain('Gate checks');
    expect(html).toContain('Checklist');
    expect(html).toContain('Handoff notes');
    expect(html).toContain('可进入未来真实写入实现草稿');
    expect(html).not.toContain('已可真实写入');
    expect(html).not.toContain('已实现真实写入');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已替换当前用户 App 包');
    expect(html).not.toContain('已上线');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('renders blocked reasons for unsafe implementation markers', () => {
    const html = renderToStaticMarkup(
      <RealRegistryWriteImplementationGatePanel
        gate={realRegistryWriteImplementationGateBlockedByActualRegistryWriteExample}
        checklist={realRegistryWriteImplementationChecklistBlockedExample}
        handoff={realRegistryWriteImplementationHandoffBlockedExample}
      />,
    );

    expect(html).toContain('real_write_implementation_gate_blocked');
    expect(html).toContain('Blocked reasons');
    expect(html).toContain(
      'Implementation gate requires a ready Phase 10M execution validation result',
    );
    expect(html).toContain(
      'Implementation gate must not execute, persist, or mark actual registry writes',
    );
    expect(html).toContain('不可进入');
  });
});
