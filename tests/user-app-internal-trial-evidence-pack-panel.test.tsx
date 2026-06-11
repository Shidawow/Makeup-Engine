import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppInternalTrialEvidencePackPanel } from '../src/components/user-app';
import { userAppInternalTrialEvidencePackMvpPlanningExample } from '../src/templates/examples';

describe('UserAppInternalTrialEvidencePackPanel', () => {
  it('renders evidence pack status and privacy boundary copy', () => {
    const html = renderToStaticMarkup(
      <UserAppInternalTrialEvidencePackPanel
        evidencePack={userAppInternalTrialEvidencePackMvpPlanningExample}
      />,
    );

    expect(html).toContain('内部试用证据包');
    expect(html).toContain('证据包可用');
    expect(html).toContain('不保存真实个人身份');
    expect(html).toContain('不上传');
    expect(html).toContain('不训练');
  });
});
