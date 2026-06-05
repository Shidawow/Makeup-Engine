import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserTemplateDetail } from '../src/components/user-app';
import { createUserAppTemplateDetailViewModel } from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';

describe('UserTemplateDetail', () => {
  it('renders user-facing template details and start action', () => {
    const detail = createUserAppTemplateDetailViewModel({
      template: userAppMvpShellExamplePackage.templates[0],
    });
    const html = renderToStaticMarkup(
      <UserTemplateDetail
        canEnterStepGuide={true}
        onShowTools={() => undefined}
        onStartGuidance={() => undefined}
        template={detail}
      />,
    );

    expect(html).toContain('Soft Rose Daily Look');
    expect(html).toContain('步骤概览');
    expect(html).toContain('安全提示');
    expect(detail.steps.length).toBeGreaterThan(0);
  });
});
