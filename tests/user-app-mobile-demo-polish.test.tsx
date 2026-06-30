import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  UserAppMobileHome,
  UserAppStepGuide,
  UserAppTemplateSelection,
} from '../src/components/user-app';
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

describe('User App mobile demo polish', () => {
  it('uses clear mobile first-run cards and touch-sized CTAs', () => {
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

    expect(html).toContain('grid gap-2 text-sm leading-6');
    expect(html).toContain('选择妆容模板');
    expect(html).toContain('查看工具和准备事项');
    expect(html).toContain('跟着步骤完成练习');
    expect(html).toContain('min-h-12');
    expect(html).not.toContain('hover-only');
  });

  it('keeps template cards readable and step sticky controls from covering content', () => {
    const selectionHtml = renderToStaticMarkup(
      <UserAppTemplateSelection
        onSelectTemplate={() => undefined}
        selectedTemplateId={viewModel.selection.selectedTemplateId}
        templates={viewModel.templates}
      />,
    );
    const stepHtml = renderToStaticMarkup(
      <UserAppStepGuide
        canEnterStepGuide
        onCompleteStep={() => undefined}
        onNextStep={() => undefined}
        onPreviousStep={() => undefined}
        template={viewModel.selectedTemplate!}
      />,
    );

    expect(selectionHtml).toContain('min-h-[196px]');
    expect(selectionHtml).toContain('区域说明和分步骤跟练');
    expect(stepHtml).toContain('pb-24 sm:pb-0');
    expect(stepHtml).toContain('pb-[calc(0.5rem+env(safe-area-inset-bottom))]');
    expect(stepHtml).toContain('min-h-12');
    expect(stepHtml).toContain('sticky bottom-3');
  });
});
