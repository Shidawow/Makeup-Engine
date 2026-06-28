import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PhotoToTemplateDraftPreviewQaPanel } from '../src/components/template-studio/PhotoToTemplateDraftPreviewQaPanel';
import { FaceMeshMakeupIntelligencePanel } from '../src/components/template-studio/FaceMeshMakeupIntelligencePanel';
import { UserAppShell } from '../src/components/user-app';
import {
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  photoToTemplateDraftPreviewQaReadyExample,
  ruleBasedStepSequenceReadyExample,
  userAppMvpShellExamplePackage,
} from '../src/templates/examples';

describe('PhotoToTemplateDraftPreviewQaPanel', () => {
  it('renders draft preview QA, user-visible fields, and no-publish boundaries', () => {
    const html = renderToStaticMarkup(
      <PhotoToTemplateDraftPreviewQaPanel
        report={photoToTemplateDraftPreviewQaReadyExample}
      />,
    );

    expect(html).toContain('Photo-to-Template Draft Preview QA');
    expect(html).toContain('User-visible draft fields QA');
    expect(html).toContain('Preview QA checks');
    expect(html).toContain('当前是 draft preview，不是 publish');
    expect(html).toContain('不能写 registry');
    expect(html).toContain('不能替换 User App Shell package');
    expect(html).toContain('不会生成真实 UserAppTemplatePackage');
    expect(html).toContain('registry write：blocked');
    expect(html).toContain('production writer：blocked');
  });

  it('is wired into the template workbench and remains hidden from the ordinary user path', () => {
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

    expect(workbenchHtml).toContain('Photo-to-Template Draft Preview QA');
    expect(workbenchHtml).toContain('User-visible draft fields QA');
    expect(workbenchHtml).toContain('source type / confidence band / evidence / reviewer note');
    expect(ordinaryUserPath).not.toContain('Photo-to-Template Draft Preview QA');
    expect(ordinaryUserPath).not.toContain('source type');
    expect(ordinaryUserPath).not.toContain('confidence band');
    expect(ordinaryUserPath).not.toContain('reviewer note');
    expect(ordinaryUserPath).not.toContain('Draft Preview QA');
  });
});
