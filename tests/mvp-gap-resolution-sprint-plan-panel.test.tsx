import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MvpGapResolutionSprintPlanPanel } from '../src/components/template-studio/MvpGapResolutionSprintPlanPanel';
import { FaceMeshMakeupIntelligencePanel } from '../src/components/template-studio/FaceMeshMakeupIntelligencePanel';
import { UserAppShell } from '../src/components/user-app';
import {
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  mvpGapResolutionSprintPlanReadyExample,
  mvpGapResolutionSprintValidationReadyExample,
  ruleBasedStepSequenceReadyExample,
  userAppMvpShellExamplePackage,
} from '../src/templates/examples';

describe('MVP Gap Resolution Sprint Plan Panel', () => {
  it('renders 13D, 13E, deferred, founder decision, priority, owner, and acceptance criteria sections', () => {
    const html = renderToStaticMarkup(
      <MvpGapResolutionSprintPlanPanel
        plan={mvpGapResolutionSprintPlanReadyExample}
        validation={mvpGapResolutionSprintValidationReadyExample}
      />,
    );

    expect(html).toContain('MVP Gap Resolution Sprint Plan');
    expect(html).toContain('Sprint plan，不是正式 roadmap');
    expect(html).toContain('不是 production readiness');
    expect(html).toContain('不接 analytics / backend / registry');
    expect(html).toContain('不能 publish / registry write');
    expect(html).toContain('13D items');
    expect(html).toContain('13E / later items');
    expect(html).toContain('Deferred production gaps');
    expect(html).toContain('Founder decision required');
    expect(html).toContain('priority：');
    expect(html).toContain('impact：');
    expect(html).toContain('effort：');
    expect(html).toContain('owner：');
    expect(html).toContain('Acceptance criteria');
    expect(html).toContain('Phase 13D - MVP Demo Gap Resolution Sprint 1');
  });

  it('is wired into the Template Studio workbench', () => {
    const html = renderToStaticMarkup(
      <FaceMeshMakeupIntelligencePanel
        attributeCandidates={makeupAttributeCandidatesReadyExample}
        regionQa={faceMeshRegionQaReadyExample}
        stepSequence={ruleBasedStepSequenceReadyExample}
        templateDraft={makeupTemplateDraftReadyExample}
      />,
    );

    expect(html).toContain('Founder Trial Feedback Capture');
    expect(html).toContain('MVP Gap Prioritization');
    expect(html).toContain('MVP Gap Resolution Sprint Plan');
    expect(html).toContain('User App first-run clarity polish');
    expect(html).toContain('Trial template content consistency polish');
  });

  it('does not appear in the ordinary User App path', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );

    expect(html).not.toContain('MVP Gap Resolution Sprint Plan');
    expect(html).not.toContain('Sprint Planning');
    expect(html).not.toContain('Gap Resolution');
    expect(html).not.toContain('roadmap');
    expect(html).toContain('今日妆容练习');
  });
});
