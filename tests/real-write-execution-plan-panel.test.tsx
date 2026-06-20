import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { RealWriteExecutionPlanPanel } from '../src/components/template-studio/RealWriteExecutionPlanPanel';
import {
  realWriteExecutionPlanHandoffReadyExample,
  realWriteExecutionPlanMissingExecutionAuthorizationExample,
  realWriteExecutionPlanReadyExample,
  realWriteExecutionPlanValidationReadyExample,
} from '../src/templates/examples';

describe('Real write execution plan panel', () => {
  it('shows execution-plan-only boundaries and required plan sections', () => {
    const html = renderToStaticMarkup(
      <RealWriteExecutionPlanPanel
        plan={realWriteExecutionPlanReadyExample}
        validation={realWriteExecutionPlanValidationReadyExample}
        handoff={realWriteExecutionPlanHandoffReadyExample}
      />,
    );

    expect(html).toContain('真实写入执行计划');
    expect(html).toContain('执行计划，不是实际写入');
    expect(html).toContain('不授权真实写入 registry');
    expect(html).toContain('不授权发布');
    expect(html).toContain('不授权替换当前用户 App 包');
    expect(html).toContain('不创建 production writer');
    expect(html).toContain('dry-run only');
    expect(html).toContain('Execution sequence');
    expect(html).toContain('Preflight');
    expect(html).toContain('Write Lock');
    expect(html).toContain('Audit');
    expect(html).toContain('Rollback');
    expect(html).toContain('Failure Handling');
    expect(html).toContain('Dry-run Verification');
    expect(html).toContain('Execution Plan Validation');
    expect(html).toContain('Execution Plan Handoff');
    expect(html).toContain('可进入未来受保护执行模拟器');
    expect(html).not.toContain('已授权真实写入');
    expect(html).not.toContain('已可真实写入');
    expect(html).not.toContain('已实现真实写入');
    expect(html).not.toContain('已创建 production writer');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已替换当前用户 App 包');
    expect(html).not.toContain('已上线');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('shows blocked source execution authorization reasons', () => {
    const html = renderToStaticMarkup(
      <RealWriteExecutionPlanPanel
        plan={realWriteExecutionPlanMissingExecutionAuthorizationExample}
        validation={realWriteExecutionPlanValidationReadyExample}
        handoff={realWriteExecutionPlanHandoffReadyExample}
      />,
    );

    expect(html).toContain('execution_plan_blocked');
    expect(html).toContain(
      'Real write execution plan requires a ready Phase 10Q execution authorization.',
    );
  });
});
