import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FounderTrialFeedbackPanel } from '../src/components/template-studio/FounderTrialFeedbackPanel';
import { FaceMeshMakeupIntelligencePanel } from '../src/components/template-studio/FaceMeshMakeupIntelligencePanel';
import { UserAppShell } from '../src/components/user-app';
import {
  faceMeshRegionQaReadyExample,
  founderTrialFeedbackReportReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  ruleBasedStepSequenceReadyExample,
  userAppMvpShellExamplePackage,
} from '../src/templates/examples';

describe('FounderTrialFeedbackPanel', () => {
  it('renders internal-only, no analytics, no personal data, no photo storage notices', () => {
    const html = renderToStaticMarkup(
      <FounderTrialFeedbackPanel report={founderTrialFeedbackReportReadyExample} />,
    );

    expect(html).toContain('Founder Trial Feedback Capture');
    expect(html).toContain('Founder/internal feedback，不是真实用户调研');
    expect(html).toContain('不采集真实用户个人信息');
    expect(html).toContain('不保存真实照片');
    expect(html).toContain('不是 analytics');
    expect(html).toContain('不能写 registry / 不能 publish');
    expect(html).toContain('category：first_impression');
    expect(html).toContain('source：founder_manual_review');
    expect(html).toContain('linked gap：gap-trial-content-realism');
  });

  it('is wired into Template Studio workbench and hidden from ordinary user path', () => {
    const workbenchHtml = renderToStaticMarkup(
      <FaceMeshMakeupIntelligencePanel
        attributeCandidates={makeupAttributeCandidatesReadyExample}
        regionQa={faceMeshRegionQaReadyExample}
        stepSequence={ruleBasedStepSequenceReadyExample}
        templateDraft={makeupTemplateDraftReadyExample}
      />,
    );
    const userHtml = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );
    const ordinaryUserPath = userHtml.split('打开管理员检查')[0] ?? userHtml;

    expect(workbenchHtml).toContain('Founder Trial Feedback Capture');
    expect(workbenchHtml).toContain('Founder/internal feedback，不是真实用户调研');
    expect(ordinaryUserPath).not.toContain('Founder Trial Feedback');
    expect(ordinaryUserPath).not.toContain('MVP gap');
    expect(ordinaryUserPath).not.toContain('prioritization');
  });
});
