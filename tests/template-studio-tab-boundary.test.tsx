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
    expect(html).not.toContain('模板库候选包');
    expect(html).not.toContain('Candidate Handoff');
    expect(html).not.toContain('候选 App 包契约准备');
    expect(html).not.toContain('App Contract Validation');
    expect(html).not.toContain('用户 App 包草稿预览');
    expect(html).not.toContain('Preview Validation');
    expect(html).not.toContain('正式用户 App 包草稿闸门');
    expect(html).not.toContain('Gate Handoff');
    expect(html).not.toContain('正式用户 App 模板包草稿构建器');
    expect(html).not.toContain('Draft Builder');
    expect(html).not.toContain('Draft Validation');
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

  it('renders candidates, steps, draft QA, human review, candidate packaging, and app contract preparation in the template workbench', () => {
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
    expect(html).toContain('模板库候选包');
    expect(html).toContain('Candidate Validation');
    expect(html).toContain('Candidate Handoff');
    expect(html).toContain('候选 App 包契约准备');
    expect(html).toContain('App Contract Validation');
    expect(html).toContain('App Package Handoff');
    expect(html).toContain('用户 App 包草稿预览');
    expect(html).toContain('Preview Validation');
    expect(html).toContain('Preview Handoff');
    expect(html).toContain('正式用户 App 包草稿闸门');
    expect(html).toContain('Gate Handoff');
    expect(html).toContain('可进入正式包草稿构建器');
    expect(html).toContain('正式用户 App 模板包草稿构建器');
    expect(html).toContain('Draft Builder');
    expect(html).toContain('Draft Validation');
    expect(html).toContain('Draft Handoff');
    expect(html).toContain('草稿，不是正式包');
    expect(html).toContain('不是正式 UserAppTemplatePackage');
    expect(html).toContain('不会写入用户 App 包 registry');
    expect(html).toContain('不会写入 registry');
    expect(html).toContain('不会发布');
    expect(html).not.toContain('AI 已确认');
    expect(html).not.toContain('已生成正式用户模板包');
    expect(html).not.toContain('已生成正式 UserAppTemplatePackage');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('发布成功');
  });

  it('does not expose backend review terminology in the ordinary user path', () => {
    const html = renderToStaticMarkup(<UserAppShell packageData={null} />);
    const userPath = html.split('管理员检查')[0] ?? html;

    expect(userPath).not.toContain('视觉分析');
    expect(userPath).not.toContain('模板工作台');
    expect(userPath).not.toContain('草稿 QA');
    expect(userPath).not.toContain('人工审核');
    expect(userPath).not.toContain('模板库候选包');
    expect(userPath).not.toContain('candidate packaging');
    expect(userPath).not.toContain('候选 App 包契约准备');
    expect(userPath).not.toContain('candidate-to-app');
    expect(userPath).not.toContain('App Contract Validation');
    expect(userPath).not.toContain('用户 App 包草稿预览');
    expect(userPath).not.toContain('Preview Validation');
    expect(userPath).not.toContain('draft preview');
    expect(userPath).not.toContain('正式用户 App 包草稿闸门');
    expect(userPath).not.toContain('Gate Handoff');
    expect(userPath).not.toContain('official draft gate');
    expect(userPath).not.toContain('正式用户 App 模板包草稿构建器');
    expect(userPath).not.toContain('Draft Builder');
    expect(userPath).not.toContain('official UserAppTemplatePackage draft builder');
  });
});
