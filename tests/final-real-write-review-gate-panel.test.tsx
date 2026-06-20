import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FinalRealWriteReviewGatePanel } from '../src/components/template-studio/FinalRealWriteReviewGatePanel';
import {
  finalRealWriteReviewChecklistReadyExample,
  finalRealWriteReviewGateMissingImplementationDraftValidationExample,
  finalRealWriteReviewGateReadyExample,
  finalRealWriteReviewHandoffReadyExample,
} from '../src/templates/examples';

describe('Final real write review gate panel', () => {
  it('shows owner scope and final-review-only boundaries', () => {
    const html = renderToStaticMarkup(
      <FinalRealWriteReviewGatePanel
        gate={finalRealWriteReviewGateReadyExample}
        checklist={finalRealWriteReviewChecklistReadyExample}
        handoff={finalRealWriteReviewHandoffReadyExample}
      />,
    );

    expect(html).toContain('最终真实写入复核闸门');
    expect(html).toContain('老板授权范围：只授权进入复核闸门');
    expect(html).toContain('不授权真实写入 registry');
    expect(html).toContain('不授权发布');
    expect(html).toContain('不授权替换当前用户 App 包');
    expect(html).toContain('不是实际写入');
    expect(html).toContain('不是 production writer');
    expect(html).toContain('dry-run only');
    expect(html).toContain('Final Review Checklist');
    expect(html).toContain('Final Review Handoff');
    expect(html).not.toContain('已授权真实写入');
    expect(html).not.toContain('已写入 registry');
    expect(html).not.toContain('已发布');
    expect(html).not.toContain('已替换当前用户 App 包');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('shows blocked source implementation draft validation reasons', () => {
    const html = renderToStaticMarkup(
      <FinalRealWriteReviewGatePanel
        gate={finalRealWriteReviewGateMissingImplementationDraftValidationExample}
        checklist={finalRealWriteReviewChecklistReadyExample}
        handoff={finalRealWriteReviewHandoffReadyExample}
      />,
    );

    expect(html).toContain('final_real_write_review_gate_blocked');
    expect(html).toContain(
      'Final real write review gate requires a ready Phase 10O implementation draft validation result.',
    );
  });
});
