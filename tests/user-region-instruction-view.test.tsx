import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserRegionInstructionView } from '../src/components/user-app';
import { createUserAppRegionInstructionViewModels } from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';

describe('UserRegionInstructionView', () => {
  it('renders region instruction contract data without AR claims', () => {
    const regions = createUserAppRegionInstructionViewModels(
      userAppMvpShellExamplePackage.templates[0],
    );
    const html = renderToStaticMarkup(<UserRegionInstructionView regions={regions} />);
    const emptyHtml = renderToStaticMarkup(<UserRegionInstructionView regions={[]} />);

    expect(html).toContain('上妆区域说明');
    expect(html).toContain('画在哪里');
    expect(html).toContain('晕染方向');
    expect(emptyHtml).toContain('不能假装有相机或 AR');
  });
});
