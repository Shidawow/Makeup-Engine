import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { VisionAnalysisReadinessSummary } from '../src/components/demo/vision-analysis-demo/VisionAnalysisReadinessSummary';
import { FaceMeshMakeupIntelligencePanel } from '../src/components/template-studio/FaceMeshMakeupIntelligencePanel';
import {
  faceMeshRegionQaBlockedExample,
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  ruleBasedStepSequenceReadyExample,
} from '../src/templates/examples';

describe('vision readiness score label', () => {
  it('shows a readiness score instead of a model confidence label in Vision Analysis', () => {
    const html = renderToStaticMarkup(
      <VisionAnalysisReadinessSummary regionQa={faceMeshRegionQaReadyExample} />,
    );

    expect(html).toContain('Readiness Score（检测可用性评分）');
    expect(html).toContain('不是 MediaPipe 模型原始置信度');
    expect(html).toContain('Landmarks');
    expect(html).toContain('Region QA');
    expect(html).not.toContain('Confidence：');
    expect(html).not.toContain('Confidence 95%');
  });

  it('keeps blocked Region QA from looking highly ready', () => {
    const html = renderToStaticMarkup(
      <VisionAnalysisReadinessSummary regionQa={faceMeshRegionQaBlockedExample} />,
    );

    expect(faceMeshRegionQaBlockedExample.readinessScore).toBeLessThanOrEqual(0.45);
    expect(html).toContain('Readiness Score（检测可用性评分）');
    expect(html).toContain(`${Math.round(faceMeshRegionQaBlockedExample.readinessScore * 100)}%`);
    expect(html).toContain('区域 QA 阻断');
    expect(html).not.toContain('Confidence：');
  });

  it('shows the same rule-score explanation in the Template Studio workbench', () => {
    const html = renderToStaticMarkup(
      <FaceMeshMakeupIntelligencePanel
        attributeCandidates={makeupAttributeCandidatesReadyExample}
        regionQa={faceMeshRegionQaReadyExample}
        stepSequence={ruleBasedStepSequenceReadyExample}
        templateDraft={makeupTemplateDraftReadyExample}
      />,
    );

    expect(html).toContain('检测可用性评分');
    expect(html).toContain('规则评分，不是 MediaPipe 模型原始置信度');
    expect(html).toContain('Landmarks');
    expect(html).not.toContain('置信度：');
  });
});
