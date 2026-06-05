import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTemplatePreview } from '../src/components/template-studio/user-app-template-preview';
import { createUserAppTemplatePackageFromPublishPackage } from '../src/template-engine/app-contract';
import { createUserAppContractPublishPackageFixture } from './userAppContractTestUtils';

describe('UserAppTemplatePreview', () => {
  it('renders app-facing steps, region instructions, compatibility, and local disclaimer', async () => {
    const publishPackage = await createUserAppContractPublishPackageFixture();
    const appPackage = createUserAppTemplatePackageFromPublishPackage({
      packageData: publishPackage,
      target: 'web-app-v0',
    });
    const html = renderToStaticMarkup(
      <UserAppTemplatePreview
        appPackage={appPackage}
        compatibilityTarget="web-app-v0"
        publishPackage={publishPackage}
      />,
    );

    expect(html).toContain('User App Template Preview');
    expect(html).toContain('App-facing makeup steps');
    expect(html).toContain('Region instructions');
    expect(html).toContain('compatibility target');
    expect(html).toContain('不是用户 App');
    expect(html).not.toContain('blob:');
  });
});

