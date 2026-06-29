import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

const forbiddenOrdinaryUserTerms = [
  'registry',
  'write gate',
  'publish gate',
  'simulator',
  'approval boundary',
  'production writer',
  'Pipeline Trace',
  'debug JSON',
  'Template Studio',
  '已发布',
  '已写入 registry',
  'production ready',
  'AI 自动确认',
  'Confidence 95%',
  '模型原始置信度',
  'Photo-to-Template Draft Integration',
  'Photo-to-Template Human Review Editing',
  'Photo-to-Template Operator Workflow',
  'Photo-to-Template Draft Preview QA',
  'Photo-to-Template Acceptance Trial',
  'Founder Demo Review',
  'MVP trial content',
  'trial content pack',
  'Operator Workflow',
  'Draft Preview QA',
  'Acceptance Trial',
  'sourceLabel',
  'demo_fixture',
  'notFromAutomaticExtraction',
  'humanReviewRecommended',
  'semantic candidate',
  'sourceType',
  'confidenceBand',
  'reviewerDecision',
  'humanReviewRequired',
  'notFinal',
  'evidence',
  'limitations',
  'confidence band',
  'reviewer note',
];

describe('User App demo forbidden terms QA', () => {
  it('keeps the ordinary user path free of backend, registry, and model-confidence terms', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );

    for (const term of forbiddenOrdinaryUserTerms) {
      expect(html).not.toContain(term);
    }

    expect(html).toContain('今日妆容练习');
    expect(html).toContain('模板选择');
    expect(html).toContain('分步跟练');
    expect(html).toContain('不上传');
    expect(html).toContain('不会用于训练');
  });

  it('does not expose the operator demo readiness panel by default', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );

    expect(html).toContain('打开管理员检查');
    expect(html).not.toContain('User App Demo Readiness');
    expect(html).not.toContain('Operator QA checklist');
    expect(html).not.toContain('Registry chain paused after Phase 10U');
  });
});
