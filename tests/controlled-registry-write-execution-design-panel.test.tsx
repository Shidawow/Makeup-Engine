import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ControlledRegistryWriteExecutionDesignPanel } from '../src/components/template-studio/ControlledRegistryWriteExecutionDesignPanel';
import {
  controlledRegistryWriteExecutionDesignActualRegistryWriteBlockedExample,
  controlledRegistryWriteExecutionDesignReadyExample,
  controlledRegistryWriteExecutionHandoffBlockedExample,
  controlledRegistryWriteExecutionHandoffReadyExample,
  controlledRegistryWriteExecutionValidationActualRegistryWriteExample,
  controlledRegistryWriteExecutionValidationReadyExample,
} from '../src/templates/examples';

describe('ControlledRegistryWriteExecutionDesignPanel', () => {
  it('renders execution design, validation, handoff, and dry-run boundary copy', () => {
    const html = renderToStaticMarkup(
      <ControlledRegistryWriteExecutionDesignPanel
        design={controlledRegistryWriteExecutionDesignReadyExample}
        handoff={controlledRegistryWriteExecutionHandoffReadyExample}
        validation={controlledRegistryWriteExecutionValidationReadyExample}
      />,
    );

    expect(html).toContain('受控 Registry 写入执行设计');
    expect(html).toContain('design / dry-run only');
    expect(html).toContain('不是实际写入');
    expect(html).toContain('不会发布');
    expect(html).toContain('不会替换当前用户 App 包');
    expect(html).toContain('未来真实执行仍需老板单独授权');
    expect(html).toContain('Preflight checks');
    expect(html).toContain('Execution steps');
    expect(html).toContain('Audit plan');
    expect(html).toContain('Rollback design');
    expect(html).toContain('可进入未来真实写入实现闸门');
    expect(html).not.toContain('已可执行真实写入');
    expect(html).not.toContain('已写入 registry');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已发布');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已替换当前用户 App 包');
    expect(html).not.toContain('已上线');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('renders blocked reasons for unsafe write markers', () => {
    const html = renderToStaticMarkup(
      <ControlledRegistryWriteExecutionDesignPanel
        design={controlledRegistryWriteExecutionDesignActualRegistryWriteBlockedExample}
        handoff={controlledRegistryWriteExecutionHandoffBlockedExample}
        validation={controlledRegistryWriteExecutionValidationActualRegistryWriteExample}
      />,
    );

    expect(html).toContain('execution_design_blocked');
    expect(html).toContain('Blocked reasons');
    expect(html).toContain(
      'Execution design must not execute, persist, or mark actual registry writes',
    );
    expect(html).toContain('不可进入');
  });
});
