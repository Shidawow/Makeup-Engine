import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  UserAppCompletion,
  UserAppDemoReadinessPanel,
  UserAppPreparation,
  UserAppShell,
  UserAppStepGuide,
  UserAppTemplateDetail,
  UserAppTemplateSelection,
} from '../src/components/user-app';
import {
  createInitialTemplateProgress,
  createUserAppShellViewModel,
} from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

const template = userAppMvpShellExamplePackage.templates[0];
const viewModel = createUserAppShellViewModel({
  packageData: userAppMvpShellExamplePackage,
  selectedTemplateId: template.appTemplateId,
  currentStepId: template.steps[0].stepId,
  progress: createInitialTemplateProgress({ template }),
});
const selectedTemplate = viewModel.selectedTemplate!;

describe('User App demo readiness', () => {
  it('renders the default User App MVP path', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );

    expect(html).toContain('User App MVP');
    expect(html).toContain('今日妆容练习');
    expect(html).toContain('选择今天要练的妆容');
    expect(html).toContain('开始跟练');
    expect(html).toContain('打开管理员检查');
    expect(html).not.toContain('Demo Readiness');
  });

  it('renders template selection, detail, preparation, step guide, and completion surfaces', () => {
    const selectionHtml = renderToStaticMarkup(
      <UserAppTemplateSelection
        onSelectTemplate={() => undefined}
        selectedTemplateId={viewModel.selection.selectedTemplateId}
        templates={viewModel.templates}
      />,
    );
    const detailHtml = renderToStaticMarkup(
      <UserAppTemplateDetail
        canEnterStepGuide
        onShowPreparation={() => undefined}
        onStartGuidance={() => undefined}
        template={selectedTemplate}
      />,
    );
    const preparationHtml = renderToStaticMarkup(
      <UserAppPreparation
        canEnterStepGuide
        onStartGuidance={() => undefined}
        template={selectedTemplate}
      />,
    );
    const stepHtml = renderToStaticMarkup(
      <UserAppStepGuide
        canEnterStepGuide
        onCompleteStep={() => undefined}
        onNextStep={() => undefined}
        onPreviousStep={() => undefined}
        template={selectedTemplate}
      />,
    );
    const completionHtml = renderToStaticMarkup(
      <UserAppCompletion
        completedSteps={selectedTemplate.steps.length}
        onChooseAnother={() => undefined}
        onRestart={() => undefined}
        steps={selectedTemplate.steps}
        templateTitle={selectedTemplate.title}
        totalSteps={selectedTemplate.steps.length}
      />,
    );

    expect(selectionHtml).toContain('模板选择');
    expect(detailHtml).toContain('妆容详情');
    expect(detailHtml).toContain('步骤预览');
    expect(preparationHtml).toContain('开始前准备');
    expect(preparationHtml).toContain('工具 checklist');
    expect(stepHtml).toContain('分步骤跟练');
    expect(stepHtml).toContain('区域和目标');
    expect(stepHtml).toContain('上一步');
    expect(stepHtml).toContain('下一步');
    expect(stepHtml).toContain('完成本步骤');
    expect(completionHtml).toContain('已完成本次妆容练习');
    expect(completionHtml).toContain('重新开始这套妆容');
    expect(completionHtml).toContain('返回模板选择');
  });

  it('keeps mobile-width core CTAs touch-sized in markup', () => {
    const preparationHtml = renderToStaticMarkup(
      <UserAppPreparation
        canEnterStepGuide
        onStartGuidance={() => undefined}
        template={selectedTemplate}
      />,
    );
    const stepHtml = renderToStaticMarkup(
      <UserAppStepGuide
        canEnterStepGuide
        onCompleteStep={() => undefined}
        onNextStep={() => undefined}
        onPreviousStep={() => undefined}
        template={selectedTemplate}
      />,
    );

    expect(preparationHtml).toContain('min-h-12 w-full');
    expect(stepHtml).toContain('sticky bottom-3');
    expect(stepHtml).toContain('min-h-12');
  });

  it('renders demo readiness only as an explicit operator panel', () => {
    const panelHtml = renderToStaticMarkup(<UserAppDemoReadinessPanel />);
    const adminShellHtml = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} showAdminTools />,
    );

    expect(panelHtml).toContain('User App Demo Readiness');
    expect(panelHtml).toContain('Operator QA checklist');
    expect(panelHtml).toContain('推荐演示路径');
    expect(panelHtml).toContain('当前限制');
    expect(panelHtml).toContain('Registry chain paused after Phase 10U');
    expect(adminShellHtml).toContain('Demo Readiness');
    expect(adminShellHtml).toContain('隐藏管理员检查');
  });
});
