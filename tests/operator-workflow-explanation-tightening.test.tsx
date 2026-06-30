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

describe('operator workflow explanation tightening', () => {
  it('explains the operator panels in plain demo-review language', () => {
    const html = renderToStaticMarkup(
      <FaceMeshMakeupIntelligencePanel
        attributeCandidates={makeupAttributeCandidatesReadyExample}
        regionQa={faceMeshRegionQaReadyExample}
        stepSequence={ruleBasedStepSequenceReadyExample}
        templateDraft={makeupTemplateDraftReadyExample}
      />,
    );

    expect(html).toContain('这个面板用于给老板演示前检查三套本地试用模板');
    expect(html).toContain('所有内容仍需人工审核');
    expect(html).toContain('这个面板只把 founder/internal feedback 分成可演示修复');
    expect(html).toContain('优先级用于本地 demo 排期');
    expect(html).toContain('这个面板只把 founder/internal gap 拆成 13D');
    expect(html).toContain('执行前仍需人工确认范围');
    expect(html).toContain('读法很简单：照片理解只产出候选和草稿');
    expect(html).toContain('这里不会生成正式 UserAppTemplatePackage');

    expect(html).toContain('不能写 registry / 不能 publish');
    expect(html).toContain('不写 registry、不发布、不创建 production writer');
    expect(html).toContain('MVP Demo Gap Resolution Sprint 1');
    expect(html).toContain('13D resolution report');
    expect(html).toContain('Phase 14A - Internal Founder Demo Run');
  });

  it('does not leak the 13D resolution report into Vision Analysis-only components', () => {
    const html = renderToStaticMarkup(
      <FaceMeshMakeupIntelligencePanel
        attributeCandidates={null}
        regionQa={null}
        stepSequence={null}
        templateDraft={null}
      />,
    );

    expect(html).toContain('MVP Demo Gap Resolution Sprint 1');
    expect(html).toContain('当前仍是本地演示 polish');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已创建 production writer');
  });
});
