import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppEvidenceCollectionQualityGatePanel } from '../src/components/user-app';
import { userAppEvidenceCollectionQualityGateReadyExample } from '../src/templates/examples';

describe('UserAppEvidenceCollectionQualityGatePanel', () => {
  it('renders quality decision and privacy boundary copy', () => {
    const html = renderToStaticMarkup(
      <UserAppEvidenceCollectionQualityGatePanel
        gate={userAppEvidenceCollectionQualityGateReadyExample}
      />,
    );

    expect(html).toContain('证据收集质量门');
    expect(html).toContain('可以准备匿名内部 dry run');
    expect(html).toContain('不接后端');
    expect(html).toContain('不上传');
    expect(html).toContain('不训练');
  });
});
