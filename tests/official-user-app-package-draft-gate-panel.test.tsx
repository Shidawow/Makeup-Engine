import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { OfficialUserAppPackageDraftGatePanel } from '../src/components/template-studio/OfficialUserAppPackageDraftGatePanel';
import {
  officialUserAppPackageDraftGateHandoffPrivacyReviewExample,
  officialUserAppPackageDraftGateHandoffReadyExample,
  officialUserAppPackageDraftGatePersonalDataBlockedExample,
  officialUserAppPackageDraftGateReadyExample,
} from '../src/templates/examples';

describe('OfficialUserAppPackageDraftGatePanel', () => {
  it('renders official draft gate, handoff, and strict non-package boundaries', () => {
    const html = renderToStaticMarkup(
      <OfficialUserAppPackageDraftGatePanel
        gate={officialUserAppPackageDraftGateReadyExample}
        handoff={officialUserAppPackageDraftGateHandoffReadyExample}
      />,
    );

    expect(html).toContain('正式用户 App 包草稿闸门');
    expect(html).toContain('Draft Gate');
    expect(html).toContain('Gate Checks');
    expect(html).toContain('Gate Handoff');
    expect(html).toContain('不是正式 UserAppTemplatePackage');
    expect(html).toContain('不会写入 registry');
    expect(html).toContain('不会发布');
    expect(html).toContain('可进入正式包草稿构建器');
    expect(html).toContain('ready_for_official_user_app_package_draft_builder');
    expect(html).not.toContain('已生成正式 UserAppTemplatePackage');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已上线');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('shows blocked reasons for privacy or scope failures', () => {
    const html = renderToStaticMarkup(
      <OfficialUserAppPackageDraftGatePanel
        gate={officialUserAppPackageDraftGatePersonalDataBlockedExample}
        handoff={officialUserAppPackageDraftGateHandoffPrivacyReviewExample}
      />,
    );

    expect(html).toContain('official_draft_gate_blocked');
    expect(html).toContain('Blocked reasons');
    expect(html).toContain('request_privacy_review');
    expect(html).toContain('Official draft gate must not include names');
  });
});
