import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { RealWriteApprovalBoundaryPanel } from '../src/components/template-studio/RealWriteApprovalBoundaryPanel';
import {
  realWriteApprovalBoundaryMissingSimulatorReviewGateExample,
  realWriteApprovalBoundaryReadyExample,
  realWriteApprovalChecklistBlockedExample,
  realWriteApprovalChecklistReadyExample,
  realWriteApprovalHandoffBlockedExample,
  realWriteApprovalHandoffReadyExample,
} from '../src/templates/examples';

describe('Real write approval boundary panel', () => {
  it('renders the approval boundary without actual write wording', () => {
    const html = renderToStaticMarkup(
      <RealWriteApprovalBoundaryPanel
        boundary={realWriteApprovalBoundaryReadyExample}
        checklist={realWriteApprovalChecklistReadyExample}
        handoff={realWriteApprovalHandoffReadyExample}
      />,
    );

    expect(html).toContain('真实写入批准边界');
    expect(html).toContain('批准边界，不是实际写入');
    expect(html).toContain('不授权真实写入 registry');
    expect(html).toContain('不 mutation registry');
    expect(html).toContain('不发布');
    expect(html).toContain('不替换当前用户 App 包');
    expect(html).toContain('不创建 production writer');
    expect(html).toContain('未来真实写入仍需老板单独明确授权');
    expect(html).toContain('Approval Checklist');
    expect(html).toContain('audit requirements');
    expect(html).toContain('rollback approval requirements');
    expect(html).toContain('ready_for_future_actual_write_authorization_request');
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

  it('shows blocked reasons when source simulator review gate is missing', () => {
    const html = renderToStaticMarkup(
      <RealWriteApprovalBoundaryPanel
        boundary={realWriteApprovalBoundaryMissingSimulatorReviewGateExample}
        checklist={realWriteApprovalChecklistBlockedExample}
        handoff={realWriteApprovalHandoffBlockedExample}
      />,
    );

    expect(html).toContain('real_write_approval_boundary_blocked');
    expect(html).toContain('Real write approval boundary requires Phase 10T');
    expect(html).toContain('blocked_do_not_execute_real_write');
  });
});
