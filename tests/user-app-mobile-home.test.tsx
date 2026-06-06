import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppMobileHome } from '../src/components/user-app';
import { createInitialUserAppState, createUserAppShellModel } from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('UserAppMobileHome', () => {
  it('renders ordinary user mobile copy without internal technical terms', () => {
    const viewModel = createUserAppShellModel({
      packageData: userAppMvpShellExamplePackage,
      state: createInitialUserAppState(),
    });
    const html = renderToStaticMarkup(
      <UserAppMobileHome
        onBrowseTemplates={() => undefined}
        onOpenPrivacy={() => undefined}
        onStartGuidance={() => undefined}
        selectedTemplate={viewModel.selectedTemplate}
        summary={viewModel.packageSummary}
        templates={viewModel.templates}
      />,
    );

    expect(html).toContain('今天从哪套妆容开始？');
    expect(html).toContain('当前推荐');
    expect(html).toContain('开始跟练');
    expect(html).toContain('浏览妆容');
    expect(html).toContain('查看隐私说明');
    expect(html).toContain('暂未启用');
    expect(html).toContain('不上传');
    expect(html).not.toContain('UserAppTemplatePackage');
    expect(html).not.toContain('contract');
    expect(html).not.toContain('schema');
    expect(html).not.toContain('readiness gate');
  });
});
