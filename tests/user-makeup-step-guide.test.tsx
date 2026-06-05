import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserMakeupStepGuide } from '../src/components/user-app';
import { createUserAppTemplateDetailViewModel } from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';

describe('UserMakeupStepGuide', () => {
  it('renders current step details and blocks guidance when compatibility fails', () => {
    const detail = createUserAppTemplateDetailViewModel({
      template: userAppMvpShellExamplePackage.templates[0],
    });
    const html = renderToStaticMarkup(
      <UserMakeupStepGuide
        canEnterStepGuide={true}
        onCompleteStep={() => undefined}
        onNextStep={() => undefined}
        onPreviousStep={() => undefined}
        onSkipStep={() => undefined}
        template={detail}
      />,
    );
    const blockedHtml = renderToStaticMarkup(
      <UserMakeupStepGuide
        canEnterStepGuide={false}
        onCompleteStep={() => undefined}
        onNextStep={() => undefined}
        onPreviousStep={() => undefined}
        onSkipStep={() => undefined}
        template={detail}
      />,
    );

    expect(html).toContain('分步化妆指导');
    expect(html).toContain('Step-by-step guidance');
    expect(html).toContain('brush');
    expect(html).toContain('常见错误');
    expect(html).toContain('修正建议');
    expect(blockedHtml).toContain('暂时不能继续指导');
  });
});
