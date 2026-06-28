import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PhotoToTemplateAcceptanceTrialPanel } from '../src/components/template-studio/PhotoToTemplateAcceptanceTrialPanel';
import { FaceMeshMakeupIntelligencePanel } from '../src/components/template-studio/FaceMeshMakeupIntelligencePanel';
import { UserAppShell } from '../src/components/user-app';
import {
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  photoToTemplateAcceptanceTrialReadyExample,
  ruleBasedStepSequenceReadyExample,
  userAppMvpShellExamplePackage,
} from '../src/templates/examples';

describe('PhotoToTemplateAcceptanceTrialPanel', () => {
  it('renders checklist, demo routes, forbidden claims, and release boundaries', () => {
    const html = renderToStaticMarkup(
      <PhotoToTemplateAcceptanceTrialPanel report={photoToTemplateAcceptanceTrialReadyExample} />,
    );

    expect(html).toContain('Photo-to-Template Acceptance Trial');
    expect(html).toContain('Acceptance Trial，不是发布');
    expect(html).toContain('当前仍是 draft-preview-only，仍需人工审核');
    expect(html).toContain('不能写 registry / 不能 publish / 不能创建 production writer');
    expect(html).toContain('Demo Route A - User App MVP');
    expect(html).toContain('Demo Route B - Vision Analysis');
    expect(html).toContain('Demo Route C - Template Studio Operator Workflow');
    expect(html).toContain('Acceptance trial checklist');
    expect(html).toContain('Forbidden claim checks');
    expect(html).toContain('No fully automatic extraction claim');
    expect(html).toContain('No AI confirmed claim');
    expect(html).toContain('No medical claim');
    expect(html).toContain('No product shade hard claim');
    expect(html).toContain('registry write：blocked');
    expect(html).toContain('publish：blocked');
  });

  it('is wired into the Template Studio operator area and hidden from the ordinary user path', () => {
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

    expect(workbenchHtml).toContain('Photo-to-Template Acceptance Trial');
    expect(workbenchHtml).toContain('Acceptance Trial，不是发布');
    expect(workbenchHtml).toContain('Demo Route A - User App MVP');
    expect(workbenchHtml).toContain('Forbidden claim checks');
    expect(ordinaryUserPath).not.toContain('Photo-to-Template Acceptance Trial');
    expect(ordinaryUserPath).not.toContain('Acceptance Trial');
    expect(ordinaryUserPath).not.toContain('Demo Route C - Template Studio Operator Workflow');
  });
});
