import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  UserAppCompletion,
  UserAppPreparation,
  UserAppShell,
  UserAppStepGuide,
} from '../src/components/user-app';
import {
  completeCurrentUserAppStep,
  createInitialTemplateProgress,
  createInitialUserAppState,
  createUserAppShellViewModel,
  startUserAppStepGuide,
} from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

const template = userAppMvpShellExamplePackage.templates[0];
const firstStep = template.steps[0];
const secondStep = template.steps[1];
const initialProgress = createInitialTemplateProgress({ template });
const firstStepViewModel = createUserAppShellViewModel({
  packageData: userAppMvpShellExamplePackage,
  selectedTemplateId: template.appTemplateId,
  currentStepId: firstStep.stepId,
  progress: initialProgress,
}).selectedTemplate!;

describe('User App guided step experience polish', () => {
  it('renders preparation with tools, duration, step count, privacy reminder, and start button', () => {
    const html = renderToStaticMarkup(
      <UserAppPreparation
        canEnterStepGuide
        onStartGuidance={() => undefined}
        template={firstStepViewModel}
      />,
    );

    expect(html).toContain('开始前准备');
    expect(html).toContain(template.title);
    expect(html).toContain('预计耗时');
    expect(html).toContain(`${template.estimatedDurationMinutes} 分钟`);
    expect(html).toContain(`${template.steps.length} 步`);
    expect(html).toContain('工具 checklist');
    expect(html).toContain('开始前注意');
    expect(html).toContain('开始跟练');
    expect(html).toContain('不上传');
    expect(html).toContain('不保存真实用户资料');
    expect(html).toContain('不会把跟练状态用于训练');
  });

  it('renders current step number, region, tool, instruction, tip, and progress controls', () => {
    const html = renderToStaticMarkup(
      <UserAppStepGuide
        canEnterStepGuide
        onCompleteStep={() => undefined}
        onNextStep={() => undefined}
        onPreviousStep={() => undefined}
        template={firstStepViewModel}
      />,
    );

    expect(html).toContain(`当前步骤 1 / ${template.steps.length}`);
    expect(html).toContain('跟练进度');
    expect(html).toContain('区域和目标');
    expect(html).toContain(firstStepViewModel.currentStep!.guidance.stepCategory);
    expect(html).toContain('具体操作');
    expect(html).toContain('本步骤需要');
    expect(html).toContain('注意事项');
    expect(html).toContain('修正建议');
    expect(html).toContain('上一步');
    expect(html).toContain('下一步');
    expect(html).toContain('完成本步骤');
  });

  it('keeps previous, next, and complete state coherent across step progress', () => {
    const started = startUserAppStepGuide(
      createInitialUserAppState(),
      userAppMvpShellExamplePackage,
      template.appTemplateId,
    );
    const completedFirst = completeCurrentUserAppStep(
      started,
      template.appTemplateId,
      firstStep.stepId,
    );
    const secondStepProgress = completedFirst.progressByTemplateId[template.appTemplateId]!;
    const secondStepViewModel = createUserAppShellViewModel({
      packageData: userAppMvpShellExamplePackage,
      selectedTemplateId: template.appTemplateId,
      currentStepId: secondStep.stepId,
      progress: secondStepProgress,
    }).selectedTemplate!;
    const html = renderToStaticMarkup(
      <UserAppStepGuide
        canEnterStepGuide
        onCompleteStep={() => undefined}
        onNextStep={() => undefined}
        onPreviousStep={() => undefined}
        template={secondStepViewModel}
      />,
    );

    expect(secondStepProgress.completedStepIds).toContain(firstStep.stepId);
    expect(secondStepProgress.currentStepId).toBe(secondStep.stepId);
    expect(html).toContain(`当前步骤 2 / ${template.steps.length}`);
    expect(html).toContain('步骤 1');
    expect(html).toContain('已完成');
    expect(html).toContain('上一步');
    expect(html).toContain('下一步');
    expect(html).toContain('完成本步骤');
  });

  it('lets the final step enter completion without publish or upload wording', () => {
    const finalProgress = template.steps.reduce((state, step) => {
      return completeCurrentUserAppStep(state, template.appTemplateId, step.stepId);
    }, startUserAppStepGuide(createInitialUserAppState(), userAppMvpShellExamplePackage, template.appTemplateId));
    const progress = finalProgress.progressByTemplateId[template.appTemplateId]!;
    const html = renderToStaticMarkup(
      <UserAppCompletion
        completedSteps={progress.completedStepIds.length}
        onChooseAnother={() => undefined}
        onRestart={() => undefined}
        steps={firstStepViewModel.steps}
        templateTitle={firstStepViewModel.title}
        totalSteps={progress.orderedStepIds.length}
      />,
    );

    expect(progress.completedStepIds).toHaveLength(template.steps.length);
    expect(html).toContain('已完成本次妆容练习');
    expect(html).toContain(`${template.steps.length} / ${template.steps.length} 个步骤`);
    expect(html).toContain('步骤回顾');
    expect(html).toContain('重新开始这套妆容');
    expect(html).toContain('返回模板选择');
    expect(html).not.toContain('上传结果照片');
    expect(html).not.toContain('分享社区');
    expect(html).not.toContain('已发布');
  });

  it('keeps ordinary user path free of registry and backend write terms', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );

    for (const forbiddenTerm of [
      'registry',
      'write gate',
      'simulator',
      'approval boundary',
      'production writer',
      'Pipeline Trace',
      'debug JSON',
      '已发布',
      '已写入 registry',
      'production ready',
    ]) {
      expect(html).not.toContain(forbiddenTerm);
    }

    expect(html).toContain('今日妆容练习');
    expect(html).toContain('选择今天要练的妆容');
    expect(html).toContain('准备工具');
  });
});
