import { describe, expect, it } from 'vitest';
import {
  createMvpGapResolutionSprintPlan,
  validateMvpGapResolutionSprintPlan,
} from '../src/template-engine';
import {
  mvpGapResolutionSprintPlanBlockedAnalyticsExample,
  mvpGapResolutionSprintPlanBlockedExtractionClaimExample,
  mvpGapResolutionSprintPlanBlockedRegistryExample,
  mvpGapResolutionSprintPlanReadyExample,
  mvpGapResolutionSprintSourceGapReportExample,
} from '../src/templates/examples';

describe('MVP Gap Resolution Sprint Validation', () => {
  it('returns ready for a valid sprint plan', () => {
    const validation = validateMvpGapResolutionSprintPlan(
      mvpGapResolutionSprintPlanReadyExample,
    );

    expect(validation.status).toBe('sprint_plan_ready');
    expect(validation.checks.p0_p1_mvp_gaps_have_resolution_items).toBe(true);
    expect(validation.checks.production_gaps_not_forced_into_mvp_sprint).toBe(true);
    expect(validation.checks.each_13d_item_has_acceptance_criteria).toBe(true);
    expect(validation.checks.each_13d_item_has_owner_role).toBe(true);
    expect(validation.checks.founder_decision_items_marked).toBe(true);
  });

  it('blocks a 13D item without acceptance criteria', () => {
    const plan = createMvpGapResolutionSprintPlan({
      gapReport: mvpGapResolutionSprintSourceGapReportExample,
    });
    const unsafe = {
      ...plan,
      phase13DItems: [
        {
          ...plan.phase13DItems[0],
          acceptanceCriteria: [],
        },
        ...plan.phase13DItems.slice(1),
      ],
      items: plan.items.map((item) =>
        item.id === plan.phase13DItems[0].id
          ? { ...item, acceptanceCriteria: [] }
          : item,
      ),
    };

    const validation = validateMvpGapResolutionSprintPlan(unsafe);

    expect(validation.status).toBe('sprint_plan_blocked');
    expect(validation.checks.each_13d_item_has_acceptance_criteria).toBe(false);
  });

  it('blocks registry write, publish, production writer, and shell replacement scope', () => {
    const validation = validateMvpGapResolutionSprintPlan(
      mvpGapResolutionSprintPlanBlockedRegistryExample,
    );

    expect(validation.status).toBe('sprint_plan_blocked');
    expect(validation.checks.no_registry_write).toBe(false);
  });

  it('blocks backend, analytics, and real user data collection scope', () => {
    const validation = validateMvpGapResolutionSprintPlan(
      mvpGapResolutionSprintPlanBlockedAnalyticsExample,
    );

    expect(validation.status).toBe('sprint_plan_blocked');
    expect(validation.checks.no_backend_or_analytics_scope).toBe(false);
  });

  it('blocks fully automatic extraction claims', () => {
    const validation = validateMvpGapResolutionSprintPlan(
      mvpGapResolutionSprintPlanBlockedExtractionClaimExample,
    );

    expect(validation.status).toBe('sprint_plan_blocked');
    expect(validation.checks.no_fully_automatic_extraction_claim).toBe(false);
  });

  it('round-trips through JSON without mutation', () => {
    const validation = validateMvpGapResolutionSprintPlan(
      mvpGapResolutionSprintPlanReadyExample,
    );

    expect(validation.jsonRoundTripStable).toBe(true);
    expect(JSON.parse(JSON.stringify(validation))).toEqual(validation);
  });
});
