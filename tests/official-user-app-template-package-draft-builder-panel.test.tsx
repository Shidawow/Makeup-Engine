import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { OfficialUserAppTemplatePackageDraftBuilderPanel } from '../src/components/template-studio/OfficialUserAppTemplatePackageDraftBuilderPanel';
import {
  officialUserAppTemplatePackageDraftBuilderMissingGateExample,
  officialUserAppTemplatePackageDraftBuilderReadyExample,
  officialUserAppTemplatePackageDraftHandoffPrivacyRevisionExample,
  officialUserAppTemplatePackageDraftHandoffReadyExample,
  officialUserAppTemplatePackageDraftValidationMissingGateExample,
  officialUserAppTemplatePackageDraftValidationReadyExample,
} from '../src/templates/examples';

describe('OfficialUserAppTemplatePackageDraftBuilderPanel', () => {
  it('renders draft builder, validation, handoff, and strict non-publish boundaries', () => {
    const html = renderToStaticMarkup(
      <OfficialUserAppTemplatePackageDraftBuilderPanel
        builderResult={officialUserAppTemplatePackageDraftBuilderReadyExample}
        handoff={officialUserAppTemplatePackageDraftHandoffReadyExample}
        validation={officialUserAppTemplatePackageDraftValidationReadyExample}
      />,
    );

    expect(html).toContain('正式用户 App 模板包草稿构建器');
    expect(html).toContain('草稿，不是正式包');
    expect(html).toContain('不会写入 registry');
    expect(html).toContain('不会发布');
    expect(html).toContain('可进入草稿发布闸门');
    expect(html).toContain('Draft Builder');
    expect(html).toContain('Draft Validation');
    expect(html).toContain('Draft Handoff');
    expect(html).not.toContain('已生成正式生产包');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已上线');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('shows blocked source gate reasons', () => {
    const html = renderToStaticMarkup(
      <OfficialUserAppTemplatePackageDraftBuilderPanel
        builderResult={officialUserAppTemplatePackageDraftBuilderMissingGateExample}
        handoff={officialUserAppTemplatePackageDraftHandoffPrivacyRevisionExample}
        validation={officialUserAppTemplatePackageDraftValidationMissingGateExample}
      />,
    );

    expect(html).toContain('official_package_draft_blocked');
    expect(html).toContain('Blocked reasons');
    expect(html).toContain('Official UserAppTemplatePackage draft builder requires a 10F gate ready handoff');
    expect(html).toContain('不能进入草稿发布闸门');
  });
});
