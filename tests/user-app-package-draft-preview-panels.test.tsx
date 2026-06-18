import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppPackageDraftPreviewPanel } from '../src/components/template-studio/UserAppPackageDraftPreviewPanel';
import {
  userAppPackageDraftPreviewHandoffBlockedExample,
  userAppPackageDraftPreviewHandoffReadyExample,
  userAppPackageDraftPreviewMissingContractReadyExample,
  userAppPackageDraftPreviewReadyExample,
  userAppPackageDraftPreviewValidationMissingContractReadyExample,
  userAppPackageDraftPreviewValidationReadyExample,
} from '../src/templates/examples';

describe('UserAppPackageDraftPreviewPanel', () => {
  it('renders draft preview, validation, handoff, and strict preview boundaries', () => {
    const html = renderToStaticMarkup(
      <UserAppPackageDraftPreviewPanel
        handoff={userAppPackageDraftPreviewHandoffReadyExample}
        preview={userAppPackageDraftPreviewReadyExample}
        validation={userAppPackageDraftPreviewValidationReadyExample}
      />,
    );

    expect(html).toContain('用户 App 包草稿预览');
    expect(html).toContain('Draft Preview');
    expect(html).toContain('Preview Validation');
    expect(html).toContain('Preview Handoff');
    expect(html).toContain('不是正式 UserAppTemplatePackage');
    expect(html).toContain('不会写入用户 App 包 registry');
    expect(html).toContain('ready_for_official_user_app_package_draft');
    expect(html).toContain('查看用户侧预览字段');
    expect(html).not.toContain('已生成正式 UserAppTemplatePackage');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已上线');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('shows blocked source contract readiness reasons', () => {
    const html = renderToStaticMarkup(
      <UserAppPackageDraftPreviewPanel
        handoff={userAppPackageDraftPreviewHandoffBlockedExample}
        preview={userAppPackageDraftPreviewMissingContractReadyExample}
        validation={userAppPackageDraftPreviewValidationMissingContractReadyExample}
      />,
    );

    expect(html).toContain('draft_preview_blocked');
    expect(html).toContain('Validation blocked reasons');
    expect(html).toContain('需要 10D app contract validation ready');
    expect(html).toContain('draft_preview_validation_blocked');
    expect(html).toContain('draft_preview_handoff_blocked');
  });
});
