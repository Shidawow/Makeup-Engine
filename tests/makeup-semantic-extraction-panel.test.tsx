import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MakeupSemanticExtractionPanel } from '../src/components/template-studio/MakeupSemanticExtractionPanel';
import { FaceMeshMakeupIntelligencePanel } from '../src/components/template-studio/FaceMeshMakeupIntelligencePanel';
import { UserAppShell } from '../src/components/user-app';
import {
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupSemanticExtractionReadyExample,
  makeupTemplateDraftReadyExample,
  phase10aExampleAnalysis,
  ruleBasedStepSequenceReadyExample,
  userAppMvpShellExamplePackage,
} from '../src/templates/examples';

const forbiddenOrdinaryUserTerms = [
  'Makeup Semantic Extraction Baseline',
  '语义候选',
  'registry chain',
  'FaceMesh 区域推导',
  '颜色规则推导',
  'brightness_rule_derived',
];

describe('MakeupSemanticExtractionPanel', () => {
  it('renders semantic candidates, evidence, confidence, and human-review boundaries', () => {
    const html = renderToStaticMarkup(
      <MakeupSemanticExtractionPanel report={makeupSemanticExtractionReadyExample} />,
    );

    expect(html).toContain('Makeup Semantic Extraction Baseline');
    expect(html).toContain('唇色候选');
    expect(html).toContain('腮红位置候选');
    expect(html).toContain('眼影色调候选');
    expect(html).toContain('颜色规则推导');
    expect(html).toContain('亮度规则推导');
    expect(html).toContain('必须人工审核');
    expect(html).toContain('不是定稿结论');
    expect(html).toContain('不是自动确认结果');
    expect(html).toContain('不识别品牌色号');
    expect(html).toContain('不做医学或肤质判断');
  });

  it('is wired into the Template Studio workbench and kept out of the ordinary user path', () => {
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

    expect(workbenchHtml).toContain('Makeup Semantic Extraction Baseline');
    expect(workbenchHtml).toContain('所有输出：候选');
    forbiddenOrdinaryUserTerms.forEach((term) => {
      expect(userHtml).not.toContain(term);
    });
  });
});
