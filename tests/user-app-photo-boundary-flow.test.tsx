import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import {
  createDefaultUserPersonalizationPlaceholder,
  createPersonalizedGuidancePreview,
  createUserAppShellViewModel,
} from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';

describe('user app photo boundary flow', () => {
  it('keeps guidance usable without user photo intake', () => {
    const viewModel = createUserAppShellViewModel({
      packageData: userAppMvpShellExamplePackage,
    });
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );

    expect(viewModel.compatibility.canEnterStepGuide).toBe(true);
    expect(viewModel.selectedTemplate?.steps.length).toBeGreaterThan(0);
    expect(html).toContain('UserAppTemplatePackage');
    expect(html).toContain('照片与个性化');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
  });

  it('does not modify templates when creating personalized preview hints', () => {
    const viewModel = createUserAppShellViewModel({
      packageData: userAppMvpShellExamplePackage,
    });
    const templateBefore = JSON.stringify(viewModel.selectedTemplate);
    const preview = createPersonalizedGuidancePreview({
      template: viewModel.selectedTemplate,
      personalization: createDefaultUserPersonalizationPlaceholder(),
    });

    expect(preview).toContain('"writesTrainingData":false');
    expect(JSON.stringify(viewModel.selectedTemplate)).toBe(templateBefore);
  });
});
