import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserMakeupStepGuide } from '../src/components/user-app';
import { createUserAppTemplateDetailViewModel } from '../src/user-app';
import { userAppGuidanceUxExamplePackage } from '../src/templates/examples/user-app-guidance-ux.example';

describe('UserMakeupStepGuide UX', () => {
  it('surfaces action hierarchy, tools, products, region, mistakes, and tips', () => {
    const template = userAppGuidanceUxExamplePackage.templates.find(
      (candidate) => candidate.appTemplateId === 'user-app-template-soft-rose-example',
    );
    if (!template) {
      throw new Error('missing guidance fixture template');
    }

    const detail = createUserAppTemplateDetailViewModel({ template });
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

    expect(html).toContain('Step-by-step guidance');
    expect(html).toContain('Step-by-step guidance');
    expect(html).toContain('brush');
    expect(html).toContain('上妆区域');
    expect(html).toContain('常见错误');
    expect(html).toContain('修正建议');
    expect(html).toContain('标记完成');
    expect(html).toContain('跳过');
  });
});
