import { describe, expect, it } from 'vitest';
import {
  createMvpGapResolutionSprintPlan,
} from '../src/template-engine';
import { mvpGapResolutionSprintSourceGapReportExample } from '../src/templates/examples';

describe('MVP Gap Resolution Sprint Plan', () => {
  it('turns p0/p1 MVP demo gaps into sprint resolution items', () => {
    const plan = createMvpGapResolutionSprintPlan({
      gapReport: mvpGapResolutionSprintSourceGapReportExample,
    });

    const p0p1MvpItems = plan.items.filter(
      (item) => ['p0', 'p1'].includes(item.priority) && item.sprintDecision === 'do_in_13d',
    );

    expect(p0p1MvpItems.length).toBeGreaterThan(0);
    expect(plan.phase13DItems.map((item) => item.title)).toEqual(
      expect.arrayContaining([
        'User App first-run clarity polish',
        'Trial template content consistency polish',
        'Step guidance trust wording polish',
        'Mobile demo touch target / spacing polish',
        'Operator workflow explanation tightening',
      ]),
    );
  });

  it('does not force production gaps into the immediate MVP sprint', () => {
    const plan = createMvpGapResolutionSprintPlan({
      gapReport: mvpGapResolutionSprintSourceGapReportExample,
    });

    expect(plan.deferredProductionGaps.length).toBeGreaterThan(0);
    expect(plan.deferredProductionGaps.every((item) => item.sprintDecision)).toBe(true);
    expect(plan.deferredProductionGaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sprintDecision: 'defer_to_later',
          title: 'Deferred production readiness scope',
        }),
      ]),
    );
  });

  it('gives every 13D item an owner role and acceptance criteria', () => {
    const plan = createMvpGapResolutionSprintPlan({
      gapReport: mvpGapResolutionSprintSourceGapReportExample,
    });

    expect(plan.phase13DItems.length).toBeGreaterThan(0);
    expect(
      plan.phase13DItems.every(
        (item) => item.ownerRole && item.acceptanceCriteria.length > 0,
      ),
    ).toBe(true);
  });

  it('marks founder decision required items', () => {
    const plan = createMvpGapResolutionSprintPlan({
      gapReport: mvpGapResolutionSprintSourceGapReportExample,
    });

    expect(plan.founderDecisionItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          founderDecisionRequired: true,
          sprintDecision: 'needs_founder_decision',
        }),
      ]),
    );
  });

  it('keeps registry, analytics, backend, training, photos, and extraction claims blocked', () => {
    const plan = createMvpGapResolutionSprintPlan({
      gapReport: mvpGapResolutionSprintSourceGapReportExample,
    });

    expect(plan.sprintPlanningNotFinalRoadmap).toBe(true);
    expect(plan.notRealUserResearch).toBe(true);
    expect(plan.noAnalytics).toBe(true);
    expect(plan.noBackend).toBe(true);
    expect(plan.noRealUserDataCollection).toBe(true);
    expect(plan.noRealUserPhotos).toBe(true);
    expect(plan.noBase64OrLocalPhotoPath).toBe(true);
    expect(plan.noTrainingData).toBe(true);
    expect(plan.registryChainPausedAfter10U).toBe(true);
    expect(plan.registryWriteBlocked).toBe(true);
    expect(plan.registryMutationBlocked).toBe(true);
    expect(plan.publishBlocked).toBe(true);
    expect(plan.productionWriterBlocked).toBe(true);
    expect(plan.userAppShellReplacementBlocked).toBe(true);
    expect(plan.fullyAutomaticExtractionClaimBlocked).toBe(true);
    expect(plan.nextRecommendedPhase).toBe(
      'Phase 13D - MVP Demo Gap Resolution Sprint 1',
    );
  });

  it('round-trips through JSON without mutation', () => {
    const plan = createMvpGapResolutionSprintPlan({
      gapReport: mvpGapResolutionSprintSourceGapReportExample,
    });

    expect(plan.jsonRoundTripStable).toBe(true);
    expect(JSON.parse(JSON.stringify(plan))).toEqual(plan);
  });
});
