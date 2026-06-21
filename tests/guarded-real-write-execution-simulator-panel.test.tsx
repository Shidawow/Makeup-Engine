import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GuardedRealWriteExecutionSimulatorPanel } from '../src/components/template-studio/GuardedRealWriteExecutionSimulatorPanel';
import {
  guardedRealWriteExecutionSimulatorHandoffReadyExample,
  guardedRealWriteExecutionSimulatorMissingExecutionPlanReadyExample,
  guardedRealWriteExecutionSimulatorReadyExample,
  guardedRealWriteExecutionSimulatorValidationReadyExample,
} from '../src/templates/examples';

describe('Guarded real write execution simulator panel', () => {
  it('shows simulator-only boundaries and required simulation sections', () => {
    const html = renderToStaticMarkup(
      <GuardedRealWriteExecutionSimulatorPanel
        simulator={guardedRealWriteExecutionSimulatorReadyExample}
        validation={guardedRealWriteExecutionSimulatorValidationReadyExample}
        handoff={guardedRealWriteExecutionSimulatorHandoffReadyExample}
      />,
    );

    expect(html).toContain('受保护真实写入执行模拟器');
    expect(html).toContain('模拟器，不是实际写入');
    expect(html).toContain('不授权真实写入 registry');
    expect(html).toContain('不授权发布');
    expect(html).toContain('不授权替换当前用户 App 包');
    expect(html).toContain('不创建 production writer');
    expect(html).toContain('不 mutation registry');
    expect(html).toContain('dry-run only');
    expect(html).toContain('Simulated Preflight');
    expect(html).toContain('Simulated Write Lock');
    expect(html).toContain('Simulated Write Operation');
    expect(html).toContain('Simulated Audit Events');
    expect(html).toContain('Simulated Rollback');
    expect(html).toContain('Simulated Failure Handling');
    expect(html).toContain('Simulation Validation');
    expect(html).toContain('Simulation Handoff');
    expect(html).toContain('可进入未来模拟器复核闸门');
    expect(html).not.toContain('已授权真实写入');
    expect(html).not.toContain('已可真实写入');
    expect(html).not.toContain('已执行真实写入');
    expect(html).not.toContain('已创建 production writer');
    expect(html).not.toContain('已 mutation registry');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已替换当前用户 App 包');
    expect(html).not.toContain('已上线');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('shows blocked source execution plan validation reasons', () => {
    const html = renderToStaticMarkup(
      <GuardedRealWriteExecutionSimulatorPanel
        simulator={guardedRealWriteExecutionSimulatorMissingExecutionPlanReadyExample}
        validation={guardedRealWriteExecutionSimulatorValidationReadyExample}
        handoff={guardedRealWriteExecutionSimulatorHandoffReadyExample}
      />,
    );

    expect(html).toContain('simulation_blocked');
    expect(html).toContain(
      'Guarded real write execution simulator requires a ready Phase 10R execution plan validation.',
    );
  });
});
