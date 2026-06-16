import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { VisionAnalysisReadinessSummary } from '../src/components/demo/vision-analysis-demo/VisionAnalysisReadinessSummary';
import { FaceMeshMakeupIntelligencePanel } from '../src/components/template-studio/FaceMeshMakeupIntelligencePanel';
import { UserAppShell } from '../src/components/user-app';
import {
  faceMeshRegionQaBlockedExample,
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  ruleBasedStepSequenceReadyExample,
} from '../src/templates/examples';

describe('Template Studio tab boundary', () => {
  it('keeps Vision Analysis focused on FaceMesh, Region QA, and readiness', () => {
    const html = renderToStaticMarkup(
      <VisionAnalysisReadinessSummary regionQa={faceMeshRegionQaReadyExample} />,
    );

    expect(html).toContain('视觉分析 readiness');
    expect(html).toContain('FaceMesh');
    expect(html).toContain('Region QA');
    expect(html).toContain('可以进入模板工作台生成/审核模板草稿。');
    expect(html).not.toContain('人工审核 checklist');
    expect(html).not.toContain('已作为模板库候选');
  });

  it('tells the template workbench to return to Vision Analysis when Region QA is blocked', () => {
    const html = renderToStaticMarkup(
      <FaceMeshMakeupIntelligencePanel
        attributeCandidates={makeupAttributeCandidatesReadyExample}
        regionQa={faceMeshRegionQaBlockedExample}
        stepSequence={ruleBasedStepSequenceReadyExample}
        templateDraft={makeupTemplateDraftReadyExample}
      />,
    );

    expect(html).toContain('视觉分析质量不足，需回到视觉分析 Tab');
  });

  it('renders candidates, steps, draft QA, and human review in the template workbench', () => {
    const html = renderToStaticMarkup(
      <FaceMeshMakeupIntelligencePanel
        attributeCandidates={makeupAttributeCandidatesReadyExample}
        regionQa={faceMeshRegionQaReadyExample}
        stepSequence={ruleBasedStepSequenceReadyExample}
        templateDraft={makeupTemplateDraftReadyExample}
      />,
    );

    expect(html).toContain('妆容属性候选');
    expect(html).toContain('规则步骤草稿');
    expect(html).toContain('模板草稿摘要');
    expect(html).toContain('草稿 QA');
    expect(html).toContain('人工审核 checklist');
    expect(html).not.toContain('AI 已确认');
    expect(html).not.toContain('已生成正式用户模板包');
  });

  it('does not expose backend review terminology in the ordinary user path', () => {
    const html = renderToStaticMarkup(<UserAppShell packageData={null} />);
    const userPath = html.split('管理员检查')[0] ?? html;

    expect(userPath).not.toContain('视觉分析');
    expect(userPath).not.toContain('模板工作台');
    expect(userPath).not.toContain('草稿 QA');
    expect(userPath).not.toContain('人工审核');
  });
});
