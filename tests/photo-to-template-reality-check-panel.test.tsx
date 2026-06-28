import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PhotoToTemplateRealityCheckPanel } from '../src/components/template-studio/PhotoToTemplateRealityCheckPanel';
import { FaceMeshMakeupIntelligencePanel } from '../src/components/template-studio/FaceMeshMakeupIntelligencePanel';
import { UserAppShell } from '../src/components/user-app';
import {
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  phase10aExampleAnalysis,
  photoToTemplateRealityHandoffReadyExample,
  photoToTemplateRealityHandoffSemanticIntegratedExample,
  photoToTemplateRealityReadyExample,
  photoToTemplateRealitySemanticIntegratedExample,
  photoToTemplateRealityValidationSemanticIntegratedExample,
  photoToTemplateRealityValidationReadyExample,
  ruleBasedStepSequenceReadyExample,
  userAppMvpShellExamplePackage,
} from '../src/templates/examples';

const forbiddenOrdinaryUserTerms = [
  'Photo-to-Template Reality Check',
  '字段来源矩阵',
  '全自动高质量拆妆',
  'Makeup Semantic Extraction Baseline',
  'Template Studio',
  'registry',
  'write gate',
  'publish gate',
  'simulator',
  'production writer',
];

describe('PhotoToTemplateRealityCheckPanel', () => {
  it('renders the field source matrix and reality boundaries', () => {
    const html = renderToStaticMarkup(
      <PhotoToTemplateRealityCheckPanel
        handoff={photoToTemplateRealityHandoffReadyExample}
        report={photoToTemplateRealityReadyExample}
        validation={photoToTemplateRealityValidationReadyExample}
      />,
    );

    expect(html).toContain('Photo-to-Template Reality Check');
    expect(html).toContain('字段来源矩阵');
    expect(html).toContain('真实照片 / runtime');
    expect(html).toContain('FaceMesh 派生');
    expect(html).toContain('Region QA 派生');
    expect(html).toContain('像素规则推导');
    expect(html).toContain('区域像素推导');
    expect(html).toContain('颜色规则推导');
    expect(html).toContain('亮度规则推导');
    expect(html).toContain('语义规则推导');
    expect(html).toContain('模板规则推导');
    expect(html).toContain('Demo fixture');
    expect(html).toContain('Placeholder');
    expect(html).toContain('必须人工审核');
    expect(html).toContain('当前不支持');
    expect(html).toContain('支持：半自动模板草稿 + 人工审核');
    expect(html).toContain('不支持：全自动高质量拆妆');
    expect(html).toContain('Readiness Score：规则型检测可用性评分，不是模型原始置信度');
    expect(html).toContain('Phase 10U 后继续暂停');
    expect(html).toContain('Phase 12B - Makeup Semantic Extraction Baseline');
  });

  it('renders semantic candidate integrated source separately from real photo evidence', () => {
    const html = renderToStaticMarkup(
      <PhotoToTemplateRealityCheckPanel
        handoff={photoToTemplateRealityHandoffSemanticIntegratedExample}
        report={photoToTemplateRealitySemanticIntegratedExample}
        validation={photoToTemplateRealityValidationSemanticIntegratedExample}
      />,
    );

    expect(html).toContain('语义候选接入草稿');
    expect(html).toContain('Phase 12D - Photo-to-Template Operator Workflow &amp; Draft Preview QA');
    expect(html).toContain('支持：半自动模板草稿 + 人工审核');
    expect(html).toContain('不支持：全自动高质量拆妆');
  });

  it('is wired into the template workbench rather than the Vision Analysis or ordinary user path', () => {
    const workbenchHtml = renderToStaticMarkup(
      <FaceMeshMakeupIntelligencePanel
        analysis={phase10aExampleAnalysis}
        attributeCandidates={makeupAttributeCandidatesReadyExample}
        regionQa={faceMeshRegionQaReadyExample}
        stepSequence={ruleBasedStepSequenceReadyExample}
        templateDraft={makeupTemplateDraftReadyExample}
      />,
    );
    const userHtml = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );

    expect(workbenchHtml).toContain('Photo-to-Template Reality Check');
    expect(workbenchHtml).toContain('字段来源矩阵');
    expect(workbenchHtml).toContain('当前支持半自动模板草稿');
    forbiddenOrdinaryUserTerms.forEach((term) => {
      expect(userHtml).not.toContain(term);
    });
  });
});
