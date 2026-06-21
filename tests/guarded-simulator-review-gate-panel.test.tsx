import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GuardedSimulatorReviewGatePanel } from '../src/components/template-studio/GuardedSimulatorReviewGatePanel';
import {
  guardedSimulatorReviewChecklistBlockedExample,
  guardedSimulatorReviewChecklistReadyExample,
  guardedSimulatorReviewGateMissingSimulationValidationExample,
  guardedSimulatorReviewGateReadyExample,
  guardedSimulatorReviewHandoffBlockedExample,
  guardedSimulatorReviewHandoffReadyExample,
} from '../src/templates/examples';

describe('Guarded simulator review gate panel', () => {
  it('renders the guarded simulator review gate without real write wording', () => {
    const html = renderToStaticMarkup(
      <GuardedSimulatorReviewGatePanel
        gate={guardedSimulatorReviewGateReadyExample}
        checklist={guardedSimulatorReviewChecklistReadyExample}
        handoff={guardedSimulatorReviewHandoffReadyExample}
      />,
    );

    expect(html).toContain('受保护模拟器复核闸门');
    expect(html).toContain('复核闸门，不是实际写入');
    expect(html).toContain('不授权真实写入 registry');
    expect(html).toContain('不 mutation registry');
    expect(html).toContain('不发布');
    expect(html).toContain('不替换当前用户 App 包');
    expect(html).toContain('不创建 production writer');
    expect(html).toContain('dry-run only');
    expect(html).toContain('simulated preflight review');
    expect(html).toContain('simulated write lock review');
    expect(html).toContain('simulated write operation review');
    expect(html).toContain('simulated audit events review');
    expect(html).toContain('simulated rollback review');
    expect(html).toContain('simulated failure handling review');
    expect(html).toContain('ready_for_future_real_write_approval_boundary');
    expect(html).not.toContain('已授权真实写入');
    expect(html).not.toContain('已写入 registry');
    expect(html).not.toContain('已发布');
    expect(html).not.toContain('已替换当前用户 App 包');
    expect(html).not.toContain('已创建 production writer');
    expect(html).not.toContain('已 mutation registry');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('shows blocked reasons when source simulation validation is missing', () => {
    const html = renderToStaticMarkup(
      <GuardedSimulatorReviewGatePanel
        gate={guardedSimulatorReviewGateMissingSimulationValidationExample}
        checklist={guardedSimulatorReviewChecklistBlockedExample}
        handoff={guardedSimulatorReviewHandoffBlockedExample}
      />,
    );

    expect(html).toContain('simulator_review_gate_blocked');
    expect(html).toContain('Guarded simulator review gate requires Phase 10S');
    expect(html).toContain('blocked_do_not_execute_real_write');
  });
});
