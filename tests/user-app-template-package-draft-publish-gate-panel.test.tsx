import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTemplatePackageDraftPublishGatePanel } from '../src/components/template-studio/UserAppTemplatePackageDraftPublishGatePanel';
import {
  userAppTemplatePackageDraftPublishGateHandoffBlockedExample,
  userAppTemplatePackageDraftPublishGateHandoffReadyExample,
  userAppTemplatePackageDraftPublishGateMissingValidationExample,
  userAppTemplatePackageDraftPublishGateReadyExample,
} from '../src/templates/examples';

describe('UserAppTemplatePackageDraftPublishGatePanel', () => {
  it('renders the gate, handoff, and strict non-publish boundaries', () => {
    const html = renderToStaticMarkup(
      <UserAppTemplatePackageDraftPublishGatePanel
        gate={userAppTemplatePackageDraftPublishGateReadyExample}
        handoff={userAppTemplatePackageDraftPublishGateHandoffReadyExample}
      />,
    );

    expect(html).toContain('用户 App 模板包草稿发布闸门');
    expect(html).toContain('不是发布');
    expect(html).toContain('不会写入 registry');
    expect(html).toContain('不会替换当前用户 App 包');
    expect(html).toContain('可进入未来 registry 准备');
    expect(html).toContain('Publish Gate');
    expect(html).toContain('Gate Checks');
    expect(html).toContain('Gate Handoff');
    expect(html).not.toContain('已生成生产包');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已上线');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('shows blocked source validation reasons', () => {
    const html = renderToStaticMarkup(
      <UserAppTemplatePackageDraftPublishGatePanel
        gate={userAppTemplatePackageDraftPublishGateMissingValidationExample}
        handoff={userAppTemplatePackageDraftPublishGateHandoffBlockedExample}
      />,
    );

    expect(html).toContain('draft_publish_gate_blocked');
    expect(html).toContain('Blocked reasons');
    expect(html).toContain(
      'Draft publish gate requires Phase 10G official draft validation ready or ready with warnings',
    );
    expect(html).toContain('不能进入未来 registry 准备');
  });
});
