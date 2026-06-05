import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppPrototypeConsumerPanel } from '../src/components/template-studio/user-app-prototype-consumer-panel';
import { userAppTemplatePackageExample } from '../src/templates/examples/user-app-template-package.example';
import {
  userAppEmptyTemplatePackageExample,
  userAppMultiTemplatePackageExample,
} from '../src/templates/examples/user-app-template-package-qa-fixtures.example';

describe('UserAppPrototypeConsumerPanel', () => {
  it('renders read-only prototype list, detail, guidance, regions, and validation', () => {
    const html = renderToStaticMarkup(
      <UserAppPrototypeConsumerPanel packageData={userAppTemplatePackageExample} />,
    );

    expect(html).toContain('User App Prototype Consumer');
    expect(html).toContain('Contract validation');
    expect(html).toContain('Template list');
    expect(html).toContain('Step-by-step guidance');
    expect(html).toContain('Region instructions');
    expect(html).toContain('Tools / products');
    expect(html).toContain('Soft Rose Daily Look');
    expect(html).toContain('UserAppTemplatePackage');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
  });

  it('renders the example package as smoke preview when no package is active', () => {
    const html = renderToStaticMarkup(<UserAppPrototypeConsumerPanel />);

    expect(html).toContain('package smoke preview');
    expect(html).toContain('Soft Rose Daily Look');
    expect(html).toContain('prototype consumer');
  });

  it('renders no-package and empty-package diagnostics', () => {
    const noPackageHtml = renderToStaticMarkup(
      <UserAppPrototypeConsumerPanel packageData={null} showExampleWhenEmpty={false} />,
    );
    const emptyPackageHtml = renderToStaticMarkup(
      <UserAppPrototypeConsumerPanel packageData={userAppEmptyTemplatePackageExample} />,
    );

    expect(noPackageHtml).toContain('UserAppTemplatePackage');
    expect(emptyPackageHtml).toContain('UserAppTemplatePackage');
    expect(emptyPackageHtml).toContain('package contains no app templates');
    expect(emptyPackageHtml).toContain('Empty state diagnostics');
  });

  it('renders multi-template warning state and selected-template fallback', () => {
    const html = renderToStaticMarkup(
      <UserAppPrototypeConsumerPanel
        packageData={userAppMultiTemplatePackageExample}
        selectedTemplateId="missing-template"
      />,
    );

    expect(html).toContain('Soft Rose Daily Look');
    expect(html).toContain('Warm Bronze Evening Look');
    expect(html).toContain('Requested template was not found');
    expect(html).toContain('Validation issue detail');
    expect(html).toContain('operator should verify evening intensity');
  });
});
