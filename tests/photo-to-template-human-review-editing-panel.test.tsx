import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PhotoToTemplateHumanReviewEditingPanel } from '../src/components/template-studio/PhotoToTemplateHumanReviewEditingPanel';
import { FaceMeshMakeupIntelligencePanel } from '../src/components/template-studio/FaceMeshMakeupIntelligencePanel';
import { UserAppShell } from '../src/components/user-app';
import {
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  photoToTemplateHumanReviewEditingReadyExample,
  ruleBasedStepSequenceReadyExample,
  userAppMvpShellExamplePackage,
} from '../src/templates/examples';

describe('PhotoToTemplateHumanReviewEditingPanel', () => {
  it('shows local human review editing fields with original, editable, evidence, and limits', () => {
    const html = renderToStaticMarkup(
      <PhotoToTemplateHumanReviewEditingPanel
        session={photoToTemplateHumanReviewEditingReadyExample}
      />,
    );

    expect(html).toContain('Photo-to-Template Human Review Editing');
    expect(html).toContain('本地人工编辑草稿');
    expect(html).toContain('accept / edit / reject / insufficient / block');
    expect(html).toContain('不是 final / publish');
    expect(html).toContain('Draft QA readiness');
    expect(html).toContain('source type');
    expect(html).toContain('confidence band');
    expect(html).toContain('original candidate');
    expect(html).toContain('editable draft value');
    expect(html).toContain('reviewer note');
    expect(html).toContain('evidence / limitations');
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

    expect(workbenchHtml).toContain('Photo-to-Template Human Review Editing');
    expect(workbenchHtml).toContain('Draft QA readiness');
    expect(ordinaryUserPath).not.toContain('Photo-to-Template Human Review Editing');
    expect(ordinaryUserPath).not.toContain('editable draft value');
    expect(ordinaryUserPath).not.toContain('reviewer note');
    expect(ordinaryUserPath).not.toContain('Draft QA readiness');
  });
});
