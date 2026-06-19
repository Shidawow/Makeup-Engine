import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ControlledUserAppTemplatePackageRegistryWriterDraftPanel } from '../src/components/template-studio/ControlledUserAppTemplatePackageRegistryWriterDraftPanel';
import {
  controlledRegistryWriterDraftActualRegistryWriteBlockedExample,
  controlledRegistryWriterDraftReadyExample,
  controlledRegistryWriterHandoffBlockedExample,
  controlledRegistryWriterHandoffReadyExample,
  controlledRegistryWriterValidationActualRegistryWriteExample,
  controlledRegistryWriterValidationReadyExample,
} from '../src/templates/examples';

describe('ControlledUserAppTemplatePackageRegistryWriterDraftPanel', () => {
  it('renders controlled registry writer draft, validation, handoff, and boundary copy', () => {
    const html = renderToStaticMarkup(
      <ControlledUserAppTemplatePackageRegistryWriterDraftPanel
        draft={controlledRegistryWriterDraftReadyExample}
        handoff={controlledRegistryWriterHandoffReadyExample}
        validation={controlledRegistryWriterValidationReadyExample}
      />,
    );

    expect(html).toContain('受控 Registry 写入器草稿');
    expect(html).toContain('dry-run only');
    expect(html).toContain('不是实际写入');
    expect(html).toContain('Write Plan / Diff Preview');
    expect(html).toContain('Rollback plan');
    expect(html).toContain('Writer Handoff');
    expect(html).toContain('不会发布');
    expect(html).toContain('不会替换当前用户 App 包');
    expect(html).toContain('可进入未来显式写入授权闸门');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已替换当前用户 App 包');
    expect(html).not.toContain('已上线');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('renders blocked reasons for actual registry write markers', () => {
    const html = renderToStaticMarkup(
      <ControlledUserAppTemplatePackageRegistryWriterDraftPanel
        draft={controlledRegistryWriterDraftActualRegistryWriteBlockedExample}
        handoff={controlledRegistryWriterHandoffBlockedExample}
        validation={controlledRegistryWriterValidationActualRegistryWriteExample}
      />,
    );

    expect(html).toContain('writer_draft_blocked');
    expect(html).toContain('Blocked reasons');
    expect(html).toContain(
      'Controlled writer draft must not execute, persist, or mark actual registry writes',
    );
    expect(html).toContain('不可进入');
  });
});
