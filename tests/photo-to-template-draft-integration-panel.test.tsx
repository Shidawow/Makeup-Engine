import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PhotoToTemplateDraftIntegrationPanel } from '../src/components/template-studio/PhotoToTemplateDraftIntegrationPanel';
import { FaceMeshMakeupIntelligencePanel } from '../src/components/template-studio/FaceMeshMakeupIntelligencePanel';
import { UserAppShell } from '../src/components/user-app';
import {
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  photoToTemplateDraftIntegrationReadyExample,
  ruleBasedStepSequenceReadyExample,
  userAppMvpShellExamplePackage,
} from '../src/templates/examples';

describe('PhotoToTemplateDraftIntegrationPanel', () => {
  it('shows the semantic candidate to draft field binding matrix and draft-only boundary', () => {
    const html = renderToStaticMarkup(
      <PhotoToTemplateDraftIntegrationPanel
        report={photoToTemplateDraftIntegrationReadyExample}
      />,
    );

    expect(html).toContain('Photo-to-Template Draft Integration');
    expect(html).toContain('语义候选接入草稿，不是最终模板');
    expect(html).toContain('需要人工审核');
    expect(html).toContain('不能发布 / 不能写 registry');
    expect(html).toContain('semantic candidate → draft field binding matrix');
    expect(html).toContain('draft field');
    expect(html).toContain('semantic candidate');
    expect(html).toContain('source type');
    expect(html).toContain('confidence band');
    expect(html).toContain('original candidate');
    expect(html).toContain('editable draft');
    expect(html).toContain('reviewer decision');
    expect(html).toContain('evidence / limitations / reviewer notes');
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

    expect(workbenchHtml).toContain('Photo-to-Template Draft Integration');
    expect(workbenchHtml).toContain('semantic candidate → draft field binding matrix');
    expect(ordinaryUserPath).not.toContain('Photo-to-Template Draft Integration');
    expect(ordinaryUserPath).not.toContain('semantic candidate');
    expect(ordinaryUserPath).not.toContain('source type');
    expect(ordinaryUserPath).not.toContain('confidence band');
    expect(ordinaryUserPath).not.toContain('reviewer decision');
  });
});
