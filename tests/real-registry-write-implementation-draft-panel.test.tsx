import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { RealRegistryWriteImplementationDraftPanel } from '../src/components/template-studio/RealRegistryWriteImplementationDraftPanel';
import {
  realRegistryWriteImplementationDraftActualRegistryWriteExample,
  realRegistryWriteImplementationDraftHandoffBlockedExample,
  realRegistryWriteImplementationDraftHandoffReadyExample,
  realRegistryWriteImplementationDraftReadyExample,
  realRegistryWriteImplementationDraftValidationActualRegistryWriteExample,
  realRegistryWriteImplementationDraftValidationReadyExample,
} from '../src/templates/examples';

describe('RealRegistryWriteImplementationDraftPanel', () => {
  it('renders implementation draft, validation, handoff, and no-write boundary copy', () => {
    const html = renderToStaticMarkup(
      <RealRegistryWriteImplementationDraftPanel
        draft={realRegistryWriteImplementationDraftReadyExample}
        validation={realRegistryWriteImplementationDraftValidationReadyExample}
        handoff={realRegistryWriteImplementationDraftHandoffReadyExample}
      />,
    );

    expect(html).toContain('真实 Registry 写入实现草稿');
    expect(html).toContain('不是实际写入');
    expect(html).toContain('不是 production writer');
    expect(html).toContain('dry-run only');
    expect(html).toContain('不会发布');
    expect(html).toContain('不会替换当前用户 App 包');
    expect(html).toContain('未来真实 writer 仍需老板单独授权');
    expect(html).toContain('Writer Interface');
    expect(html).toContain('Transaction');
    expect(html).toContain('Write Lock');
    expect(html).toContain('Audit Event');
    expect(html).toContain('Rollback Command');
    expect(html).toContain('Draft Validation');
    expect(html).toContain('Draft Handoff');
    expect(html).toContain('可进入未来最终真实写入复核闸门');
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

  it('renders blocked reasons for unsafe implementation draft markers', () => {
    const html = renderToStaticMarkup(
      <RealRegistryWriteImplementationDraftPanel
        draft={realRegistryWriteImplementationDraftActualRegistryWriteExample}
        validation={realRegistryWriteImplementationDraftValidationActualRegistryWriteExample}
        handoff={realRegistryWriteImplementationDraftHandoffBlockedExample}
      />,
    );

    expect(html).toContain('implementation_draft_blocked');
    expect(html).toContain('Blocked reasons');
    expect(html).toContain(
      'Implementation draft must not include actual registry write markers',
    );
    expect(html).toContain('不可进入');
  });
});
