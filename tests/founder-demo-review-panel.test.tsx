import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FounderDemoReviewPanel } from '../src/components/template-studio/FounderDemoReviewPanel';
import { FaceMeshMakeupIntelligencePanel } from '../src/components/template-studio/FaceMeshMakeupIntelligencePanel';
import { UserAppShell } from '../src/components/user-app';
import { createFounderDemoReviewReport } from '../src/template-engine';
import {
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  mvpTrialContentPackReadyExample,
  photoToTemplateAcceptanceTrialReadyExample,
  ruleBasedStepSequenceReadyExample,
  userAppMvpShellExamplePackage,
} from '../src/templates/examples';

describe('FounderDemoReviewPanel', () => {
  it('renders founder review summary, checklist, forbidden claim checks, and boundaries', () => {
    const report = createFounderDemoReviewReport({
      contentPack: mvpTrialContentPackReadyExample,
      acceptanceTrial: photoToTemplateAcceptanceTrialReadyExample,
    });
    const html = renderToStaticMarkup(
      <FounderDemoReviewPanel
        contentPack={mvpTrialContentPackReadyExample}
        report={report}
      />,
    );

    expect(html).toContain('Founder Demo Review');
    expect(html).toContain('Founder Demo Review，不是发布');
    expect(html).toContain('当前仍是 MVP trial content');
    expect(html).toContain('当前内容可用于演示，不是正式模板库');
    expect(html).toContain('不能写 registry / 不能 publish');
    expect(html).toContain('新手通勤淡妆');
    expect(html).toContain('日系温柔约会妆');
    expect(html).toContain('韩系清透低饱和妆');
    expect(html).toContain('Founder checklist');
    expect(html).toContain('Forbidden claim checks');
    expect(html).toContain('Privacy boundary');
    expect(html).toContain('Next iteration recommendation');
    expect(html).toContain('registry write：blocked');
    expect(html).toContain('publish：blocked');
  });

  it('is wired into Template Studio workbench and hidden from the ordinary user path', () => {
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

    expect(workbenchHtml).toContain('Founder Demo Review');
    expect(workbenchHtml).toContain('当前仍是 MVP trial content');
    expect(workbenchHtml).toContain('不能写 registry / 不能 publish');
    expect(ordinaryUserPath).not.toContain('Founder Demo Review');
    expect(ordinaryUserPath).not.toContain('MVP trial content');
    expect(ordinaryUserPath).not.toContain('trial content pack');
  });
});
