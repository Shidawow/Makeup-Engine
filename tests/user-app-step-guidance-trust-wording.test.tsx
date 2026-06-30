import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppStepGuide } from '../src/components/user-app';
import { createInitialTemplateProgress, createUserAppShellViewModel } from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

const template = userAppMvpShellExamplePackage.templates[0];
const progress = createInitialTemplateProgress({ template });
const viewModel = createUserAppShellViewModel({
  packageData: userAppMvpShellExamplePackage,
  selectedTemplateId: template.appTemplateId,
  currentStepId: template.steps[0].stepId,
  progress,
});

describe('User App step guidance trust wording', () => {
  it('frames guidance as template practice instead of user photo recognition', () => {
    const html = renderToStaticMarkup(
      <UserAppStepGuide
        canEnterStepGuide
        onCompleteStep={() => undefined}
        onNextStep={() => undefined}
        onPreviousStep={() => undefined}
        template={viewModel.selectedTemplate!}
      />,
    );

    expect(html).toContain('当前步骤来自演示模板');
    expect(html).toContain('可作为新手练习参考');
    expect(html).toContain('不会识别你的照片或判断你的真实妆容');
    expect(html).toContain('按模板建议上妆');

    for (const forbidden of [
      'AI confirmed',
      'AI 已确认',
      '自动识别你的妆容',
      '你的照片显示',
      '模型判断',
      'final result',
      'sourceType',
      'confidenceBand',
      'reviewerNote',
      'reviewer note',
      'humanReviewRequired',
    ]) {
      expect(html).not.toContain(forbidden);
    }
  });
});
