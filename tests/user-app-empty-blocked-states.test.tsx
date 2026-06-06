import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell, UserMakeupStepGuide } from '../src/components/user-app';
import { createUserAppShellViewModel } from '../src/user-app';
import { userAppGuidanceUxExamplePackage } from '../src/templates/examples/user-app-guidance-ux.example';
import { userAppEmptyTemplatePackageExample } from '../src/templates/examples/user-app-template-package-qa-fixtures.example';

describe('user app empty and blocked states', () => {
  it('renders no package and empty package states without crashing', () => {
    const noPackageHtml = renderToStaticMarkup(
      <UserAppShell packageData={null} showExampleWhenEmpty={false} />,
    );
    const emptyPackageHtml = renderToStaticMarkup(
      <UserAppShell packageData={userAppEmptyTemplatePackageExample} />,
    );

    expect(noPackageHtml).toContain('未加载妆容包');
    expect(noPackageHtml).toContain('没有可用模板详情');
    expect(emptyPackageHtml).toContain('暂无可展示妆容');
  });

  it('keeps blocked templates out of usable step guidance', () => {
    const viewModel = createUserAppShellViewModel({
      packageData: userAppGuidanceUxExamplePackage,
      selectedTemplateId: 'user-app-guidance-missing-region',
    });
    const detail = viewModel.selectedTemplate;

    expect(detail).not.toBeNull();
    expect(viewModel.compatibility.canEnterStepGuide).toBe(false);

    const html = detail
      ? renderToStaticMarkup(
          <UserMakeupStepGuide
            canEnterStepGuide={viewModel.compatibility.canEnterStepGuide}
            onCompleteStep={() => undefined}
            onNextStep={() => undefined}
            onPreviousStep={() => undefined}
            onSkipStep={() => undefined}
            template={detail}
          />,
        )
      : '';

    expect(html).toContain('disabled');
  });

  it('turns invalid step order into a blocking message', () => {
    const viewModel = createUserAppShellViewModel({
      packageData: userAppGuidanceUxExamplePackage,
      selectedTemplateId: 'user-app-guidance-invalid-order',
    });

    expect(viewModel.selectedTemplate?.blockingIssues.join('\n')).not.toHaveLength(0);
    expect(viewModel.compatibility.canEnterStepGuide).toBe(false);
  });
});
