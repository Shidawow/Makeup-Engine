import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { RealWriteExecutionAuthorizationPanel } from '../src/components/template-studio/RealWriteExecutionAuthorizationPanel';
import {
  realWriteExecutionAuthorizationChecklistReadyExample,
  realWriteExecutionAuthorizationHandoffReadyExample,
  realWriteExecutionAuthorizationMissingFinalReviewGateReadyExample,
  realWriteExecutionAuthorizationReadyExample,
} from '../src/templates/examples';

describe('Real write execution authorization panel', () => {
  it('shows owner scope and authorization-model-only boundaries', () => {
    const html = renderToStaticMarkup(
      <RealWriteExecutionAuthorizationPanel
        authorization={realWriteExecutionAuthorizationReadyExample}
        checklist={realWriteExecutionAuthorizationChecklistReadyExample}
        handoff={realWriteExecutionAuthorizationHandoffReadyExample}
      />,
    );

    expect(html).toContain('真实写入执行授权');
    expect(html).toContain('老板授权范围：只授权进入 10Q 授权阶段');
    expect(html).toContain('不授权真实写入 registry');
    expect(html).toContain('不授权发布');
    expect(html).toContain('不授权替换当前用户 App 包');
    expect(html).toContain('不授权创建 production writer');
    expect(html).toContain('不是实际写入');
    expect(html).toContain('dry-run only');
    expect(html).toContain('Authorization Checklist');
    expect(html).toContain('Authorization Handoff');
    expect(html).not.toContain('已授权真实写入');
    expect(html).not.toContain('已可真实写入');
    expect(html).not.toContain('已实现真实写入');
    expect(html).not.toContain('已创建 production writer');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已替换当前用户 App 包');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('shows blocked source final review gate reasons', () => {
    const html = renderToStaticMarkup(
      <RealWriteExecutionAuthorizationPanel
        authorization={realWriteExecutionAuthorizationMissingFinalReviewGateReadyExample}
        checklist={realWriteExecutionAuthorizationChecklistReadyExample}
        handoff={realWriteExecutionAuthorizationHandoffReadyExample}
      />,
    );

    expect(html).toContain('real_write_execution_authorization_blocked');
    expect(html).toContain(
      'Real write execution authorization requires a ready Phase 10P final review gate.',
    );
  });
});
