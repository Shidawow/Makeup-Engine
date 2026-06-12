import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppEvidenceCollectionChecklistPanel } from '../src/components/user-app';
import { userAppEvidenceCollectionChecklistReadyExample } from '../src/templates/examples';

describe('UserAppEvidenceCollectionChecklistPanel', () => {
  it('renders required privacy and operations checklist items', () => {
    const html = renderToStaticMarkup(
      <UserAppEvidenceCollectionChecklistPanel
        checklist={userAppEvidenceCollectionChecklistReadyExample}
      />,
    );

    expect(html).toContain('证据收集 checklist');
    expect(html).toContain('已说明不收集照片');
    expect(html).toContain('已说明不上传');
    expect(html).toContain('已说明不训练');
    expect(html).toContain('已确认不使用 AI 自动分析');
  });
});
