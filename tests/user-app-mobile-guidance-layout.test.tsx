import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  UserAppPreparation,
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

describe('User App mobile guided layout', () => {
  it('keeps template cards and preparation content stacked with touch-sized actions', () => {
    const selectionHtml = renderToStaticMarkup(
      <UserAppTemplateSelection
        onSelectTemplate={() => undefined}
        selectedTemplateId={viewModel.selection.selectedTemplateId}
        templates={viewModel.templates}
      />,
    );
    const preparationHtml = renderToStaticMarkup(
      <UserAppPreparation
        canEnterStepGuide
        onStartGuidance={() => undefined}
        template={viewModel.selectedTemplate}
      />,
    );

    expect(selectionHtml).toContain('grid gap-3 md:grid-cols-3');
    expect(selectionHtml).toContain('min-h-[180px]');
    expect(preparationHtml).toContain('grid gap-2 sm:grid-cols-3');
    expect(preparationHtml).toContain('min-h-12 w-full');
    expect(preparationHtml).toContain('可选工具和产品建议');
  });

  it('keeps step actions large, visible, and mobile-friendly', () => {
    const html = renderToStaticMarkup(
      <UserAppStepGuide
        canEnterStepGuide
        onCompleteStep={() => undefined}
        onNextStep={() => undefined}
        onPreviousStep={() => undefined}
        template={viewModel.selectedTemplate!}
      />,
    );

    expect(html).toContain('sticky bottom-3');
    expect(html).toContain('min-h-12');
    expect(html).toContain('grid gap-2');
    expect(html).toContain('步骤 1');
    expect(html).toContain('完成本步骤');
    expect(html).not.toContain('hover:');
  });
});
