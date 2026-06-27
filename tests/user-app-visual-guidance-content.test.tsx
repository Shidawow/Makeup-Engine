import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  UserAppCompletion,
  UserAppPreparation,
  UserAppStepGuide,
  UserAppTemplateDetail,
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
}).selectedTemplate!;

describe('User App visual guidance content', () => {
  it('shows visual guidance sections in template detail before step practice', () => {
    const html = renderToStaticMarkup(
      <UserAppTemplateDetail
        canEnterStepGuide
        onShowPreparation={() => undefined}
        onStartGuidance={() => undefined}
        template={viewModel}
      />,
    );

    expect(html).toContain('步骤预览');
    expect(html).toContain('上妆区域说明');
    expect(html).toContain('柔玫瑰日常妆');
    expect(html).toContain('不上传照片');
    expect(html).toContain('不生成正式发布内容');
  });

  it('shows what to practice before entering the guide', () => {
    const html = renderToStaticMarkup(
      <UserAppPreparation
        canEnterStepGuide
        onStartGuidance={() => undefined}
        template={viewModel}
      />,
    );

    expect(html).toContain('今天练什么');
    expect(html).toContain('先看“区域说明”');
    expect(html).toContain('每一步都可以返回重看');
  });

  it('adds region badge, intensity reminder, technique, and final check to each step', () => {
    const html = renderToStaticMarkup(
      <UserAppStepGuide
        canEnterStepGuide
        onCompleteStep={() => undefined}
        onNextStep={() => undefined}
        onPreviousStep={() => undefined}
        template={viewModel}
      />,
    );

    expect(html).toContain('当前步骤 1 / 4');
    expect(html).toContain('眉毛');
    expect(html).toContain('强度提醒');
    expect(html).toContain('轻薄：先少量上色，保持自然。');
    expect(html).toContain('手法拆解');
    expect(html).toContain('完成前检查');
  });

  it('summarizes completed regions without upload, publish, or training wording', () => {
    const html = renderToStaticMarkup(
      <UserAppCompletion
        completedSteps={viewModel.steps.length}
        onChooseAnother={() => undefined}
        onRestart={() => undefined}
        steps={viewModel.steps}
        templateTitle={viewModel.title}
        totalSteps={viewModel.steps.length}
      />,
    );

    expect(html).toContain('练习区域');
    expect(html).toContain('下一次建议');
    expect(html).toContain('步骤回顾');
    expect(html).toContain('不上传照片');
    expect(html).not.toContain('已发布');
    expect(html).not.toContain('上传结果照片');
  });
});
