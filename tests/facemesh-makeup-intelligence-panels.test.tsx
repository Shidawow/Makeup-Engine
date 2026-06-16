import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FaceMeshMakeupIntelligencePanel } from '../src/components/template-studio/FaceMeshMakeupIntelligencePanel';
import {
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  ruleBasedStepSequenceReadyExample,
} from '../src/templates/examples';

describe('FaceMesh makeup intelligence panels', () => {
  it('renders candidate, draft, and human-review messaging', () => {
    const html = renderToStaticMarkup(
      <FaceMeshMakeupIntelligencePanel
        attributeCandidates={makeupAttributeCandidatesReadyExample}
        regionQa={faceMeshRegionQaReadyExample}
        stepSequence={ruleBasedStepSequenceReadyExample}
        templateDraft={makeupTemplateDraftReadyExample}
      />,
    );

    expect(html).toContain('FaceMesh 妆容智能基线');
    expect(html).toContain('妆容属性候选');
    expect(html).toContain('规则步骤草稿');
    expect(html).toContain('模板草稿审核工作流');
    expect(html).toContain('候选 / 草稿');
    expect(html).toContain('必须人工审核');
    expect(html).toContain('仅用于草稿审核');
    expect(html).toContain('Landmarks');
  });

  it('renders an empty-state admin hint before analysis', () => {
    const html = renderToStaticMarkup(
      <FaceMeshMakeupIntelligencePanel
        attributeCandidates={null}
        regionQa={null}
        stepSequence={null}
        templateDraft={null}
      />,
    );

    expect(html).toContain('运行真实 FaceMesh 分析后');
    expect(html).toContain('候选 / 草稿');
    expect(html).toContain('需要人工审核');
  });
});
