import { describe, expect, it } from 'vitest';
import { createUserAppNextPhaseRecommendation } from '../src/user-app';
import {
  userAppNextPhaseRecommendationDocIllustratedExample,
  userAppNextPhaseRecommendationPhase10AExample,
  userAppNextPhaseRecommendationPhase10BExample,
  userAppNextPhaseRecommendationPhase9DFixExample,
  userAppNextPhaseRecommendationPhase9EExample,
} from '../src/templates/examples';

describe('User App next phase recommendation', () => {
  it('recommends Phase 9E when learning evidence is still insufficient', () => {
    expect(userAppNextPhaseRecommendationPhase9EExample.recommendedPhase).toBe(
      'Phase 9E — Internal Trial Evidence Pack',
    );
  });

  it('recommends Phase 10A when value is strong and no blocker remains', () => {
    expect(userAppNextPhaseRecommendationPhase10AExample.recommendedPhase).toBe(
      'Phase 10A — MVP Validation Plan',
    );
  });

  it('recommends Phase 10B for production app discovery planning only', () => {
    expect(userAppNextPhaseRecommendationPhase10BExample.recommendedPhase).toBe(
      'Phase 10B — Production App Discovery',
    );
    expect(userAppNextPhaseRecommendationPhase10BExample.productionBuildApproved).toBe(false);
  });

  it('recommends DOC-ILLUSTRATED when formal documentation is needed', () => {
    expect(userAppNextPhaseRecommendationDocIllustratedExample.recommendedPhase).toBe(
      'DOC-ILLUSTRATED — Illustrated Design Report & Operation Manual',
    );
  });

  it('recommends Phase 9D-Fix when blockers exist', () => {
    expect(userAppNextPhaseRecommendationPhase9DFixExample.recommendedPhase).toBe(
      'Phase 9D-Fix — Decision Gate Fixes',
    );
    expect(userAppNextPhaseRecommendationPhase9DFixExample.readiness).toBe('blocked');
  });

  it('stays local-only, deterministic, mock-only, and non-training', () => {
    const recommendation = createUserAppNextPhaseRecommendation();

    expect(recommendation.localOnly).toBe(true);
    expect(recommendation.deterministic).toBe(true);
    expect(recommendation.mockOnly).toBe(true);
    expect(recommendation.anonymousOrExampleOnly).toBe(true);
    expect(recommendation.productionBuildApproved).toBe(false);
    expect(recommendation.backendRecordSystem).toBe(false);
    expect(recommendation.usesAiAnalysis).toBe(false);
    expect(recommendation.writesTrainingInput).toBe(false);
    expect(recommendation.writesProjectStateUserRecords).toBe(false);
  });
});
