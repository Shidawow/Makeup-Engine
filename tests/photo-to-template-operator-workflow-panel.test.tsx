import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PhotoToTemplateOperatorWorkflowPanel } from '../src/components/template-studio/PhotoToTemplateOperatorWorkflowPanel';
import { FaceMeshMakeupIntelligencePanel } from '../src/components/template-studio/FaceMeshMakeupIntelligencePanel';
import { UserAppShell } from '../src/components/user-app';
import {
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  photoToTemplateOperatorWorkflowReadyExample,
  ruleBasedStepSequenceReadyExample,
  userAppMvpShellExamplePackage,
} from '../src/templates/examples';

describe('PhotoToTemplateOperatorWorkflowPanel', () => {
  it('renders the operator-only workflow stepper and handoff boundaries', () => {
    const html = renderToStaticMarkup(
      <PhotoToTemplateOperatorWorkflowPanel
        report={photoToTemplateOperatorWorkflowReadyExample}
      />,
    );

    expect(html).toContain('Photo-to-Template Operator Workflow');
    expect(html).toContain('当前是 operator workflow，不是用户 App 页面');
    expect(html).toContain('12A Reality Check');
    expect(html).toContain('12B Semantic Extraction');
    expect(html).toContain('12C Draft Integration / Human Review Editing');
    expect(html).toContain('12D Draft Preview QA');
    expect(html).toContain('Workflow stepper / checklist');
    expect(html).toContain('Vision / FaceMesh readiness');
    expect(html).toContain('Photo-to-Template Reality Check');
    expect(html).toContain('Makeup Semantic Extraction candidates');
    expect(html).toContain('Semantic candidate → Draft field integration');
    expect(html).toContain('Human Review Editing');
    expect(html).toContain('Draft QA');
    expect(html).toContain('User App Draft Preview QA');
    expect(html).toContain('Next action / blocked reason / handoff');
    expect(html).toContain('Forbidden destinations');
    expect(html).toContain('registry_write');
    expect(html).toContain('production_writer');
    expect(html).toContain('user_app_shell_replacement');
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

    expect(workbenchHtml).toContain('Photo-to-Template Operator Workflow');
    expect(workbenchHtml).toContain('Workflow stepper / checklist');
    expect(workbenchHtml).toContain('当前是 draft preview QA，不是发布');
    expect(workbenchHtml).toContain('不能写 registry / 不能 publish / 不能创建 production writer');
    expect(ordinaryUserPath).not.toContain('Photo-to-Template Operator Workflow');
    expect(ordinaryUserPath).not.toContain('Operator Workflow');
    expect(ordinaryUserPath).not.toContain('Workflow stepper');
    expect(ordinaryUserPath).not.toContain('Draft Preview QA');
  });
});
