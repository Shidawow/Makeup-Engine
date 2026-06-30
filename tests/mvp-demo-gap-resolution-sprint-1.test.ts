import { describe, expect, it } from 'vitest';
import { createMvpDemoGapResolutionSprint1Report } from '../src/template-engine';
import {
  mvpDemoGapResolutionSprint1MissingItemExample,
  mvpDemoGapResolutionSprint1ReadyExample,
  mvpGapResolutionSprintPlanReadyExample,
} from '../src/templates/examples';

describe('MVP demo gap resolution sprint 1', () => {
  it('covers the five Phase 13D gap categories', () => {
    const report = mvpDemoGapResolutionSprint1ReadyExample;

    expect(report.status).toBe('resolved');
    expect(report.items.map((item) => item.category)).toEqual([
      'first_run_clarity',
      'trial_template_consistency',
      'trust_wording',
      'mobile_demo_usability',
      'operator_workflow_explanation',
    ]);
    expect(report.resolvedItems).toHaveLength(5);
    expect(report.nextRecommendedPhase).toBe('Phase 14A - Internal Founder Demo Run');
  });

  it('keeps every resolved item tied to evidence, changed areas, and acceptance criteria', () => {
    for (const item of mvpDemoGapResolutionSprint1ReadyExample.items) {
      expect(item.sourceSprintItemId).toContain('sprint-');
      expect(item.resolutionSummary.length).toBeGreaterThan(40);
      expect(item.changedAreas.length).toBeGreaterThan(0);
      expect(item.acceptanceCriteria.length).toBeGreaterThan(0);
      expect(item.evidence.length).toBeGreaterThan(0);
      expect(item.remainingIssues).toEqual([]);
      expect(item.status).toBe('resolved');
    }
  });

  it('preserves no-registry, no-production, and no-real-user-data boundaries', () => {
    const report = createMvpDemoGapResolutionSprint1Report({
      sprintPlan: mvpGapResolutionSprintPlanReadyExample,
    });

    expect(report.registryChainPausedAfter10U).toBe(true);
    expect(report.realWriteAuthorizationPaused).toBe(true);
    expect(report.noRegistryWrite).toBe(true);
    expect(report.noRegistryMutation).toBe(true);
    expect(report.noPublish).toBe(true);
    expect(report.noProductionWriter).toBe(true);
    expect(report.noUserAppShellReplacement).toBe(true);
    expect(report.noBackend).toBe(true);
    expect(report.noAnalytics).toBe(true);
    expect(report.noTraining).toBe(true);
    expect(report.noRealUserPhotos).toBe(true);
    expect(report.noBase64OrLocalPhotoPath).toBe(true);
    expect(report.noPersonalData).toBe(true);
    expect(report.notProductionReadiness).toBe(true);
    expect(report.notRealUserResearch).toBe(true);
    expect(report.jsonRoundTripStable).toBe(true);
  });

  it('does not overclaim when a required 13D item is missing', () => {
    expect(mvpDemoGapResolutionSprint1MissingItemExample.status).toBe('not_resolved');
    expect(mvpDemoGapResolutionSprint1MissingItemExample.nextRecommendedPhase).toBe(
      'Phase 13E - MVP Demo Gap Resolution Sprint 2',
    );
    expect(
      mvpDemoGapResolutionSprint1MissingItemExample.items.some(
        (item) =>
          item.category === 'mobile_demo_usability' &&
          item.remainingIssues.some((issue) => issue.severity === 'blocking'),
      ),
    ).toBe(true);
  });
});
