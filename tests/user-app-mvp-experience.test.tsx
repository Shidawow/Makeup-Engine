import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  UserAppCompletion,
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

const firstTemplate = userAppMvpShellExamplePackage.templates[0];
const firstStep = firstTemplate.steps[0];

const viewModel = createUserAppShellViewModel({
  packageData: userAppMvpShellExamplePackage,
  selectedTemplateId: firstTemplate.appTemplateId,
  currentStepId: firstStep.stepId,
  progress: createInitialTemplateProgress({ template: firstTemplate }),
});

describe('User App MVP experience reset', () => {
  it('renders MVP home, template selection, and guide entry from the shell', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );

    expect(html).toContain('User App MVP');
    expect(html).toContain('今日妆容练习');
    expect(html).toContain('选择妆容');
    expect(html).toContain('选择今天要练的妆容');
    expect(html).toContain('开始跟练');
    expect(html).toContain('浏览妆容');
    expect(html).toContain('不上传');
    expect(html).toContain('不会用于训练');
  });

  it('renders template selection cards with local demo looks', () => {
    const html = renderToStaticMarkup(
      <UserAppTemplateSelection
        onSelectTemplate={() => undefined}
        selectedTemplateId={viewModel.selection.selectedTemplateId}
        templates={viewModel.templates}
      />,
    );

    expect(html).toContain('Soft Rose Daily Look');
    expect(html).toContain('Warm Bronze Evening Look');
    expect(html).toContain('新手友好');
    expect(html).toContain('分钟');
    expect(html).toContain('步');
  });

  it('renders template detail with tools, step count, difficulty, and estimated time', () => {
    const html = renderToStaticMarkup(
      <UserAppTemplateDetail
        canEnterStepGuide
        onShowPreparation={() => undefined}
        onStartGuidance={() => undefined}
        template={viewModel.selectedTemplate}
      />,
    );

    expect(html).toContain('妆容详情');
    expect(html).toContain('准备工具');
    expect(html).toContain('步骤数量');
    expect(html).toContain('预计时间');
    expect(html).toContain('新手友好');
    expect(html).toContain('开始分步骤跟练');
  });

  it('renders step guide progress and previous/next actions', () => {
    const html = renderToStaticMarkup(
      <UserAppStepGuide
        canEnterStepGuide
        onCompleteStep={() => undefined}
        onNextStep={() => undefined}
        onPreviousStep={() => undefined}
        template={viewModel.selectedTemplate!}
      />,
    );

    expect(html).toContain('分步骤跟练');
    expect(html).toContain('跟练进度');
    expect(html).toContain('区域和目的');
    expect(html).toContain('操作提示');
    expect(html).toContain('注意事项');
    expect(html).toContain('上一步');
    expect(html).toContain('下一步');
    expect(html).toContain('标记完成');
  });

  it('renders completion state with restart and template selection exits', () => {
    const html = renderToStaticMarkup(
      <UserAppCompletion
        completedSteps={6}
        onChooseAnother={() => undefined}
        onRestart={() => undefined}
        totalSteps={6}
      />,
    );

    expect(html).toContain('已完成本次妆容练习');
    expect(html).toContain('6 / 6 个步骤');
    expect(html).toContain('重新开始这套妆容');
    expect(html).toContain('返回模板选择');
    expect(html).toContain('不上传照片');
    expect(html).toContain('不会用于训练');
  });
});
