import { describe, expect, it } from 'vitest';
import { createMvpGapPrioritizationReport } from '../src/template-engine';
import { founderTrialFeedbackReportReadyExample } from '../src/templates/examples';

describe('MVP Gap Prioritization', () => {
  it('generates MVP gaps from founder feedback', () => {
    const report = createMvpGapPrioritizationReport({
      feedback: founderTrialFeedbackReportReadyExample,
    });

    expect(report.gaps.length).toBe(founderTrialFeedbackReportReadyExample.entries.length);
    expect(report.gaps.map((gap) => gap.category)).toEqual(
      expect.arrayContaining([
        'user_app_experience',
        'trial_content_quality',
        'photo_to_template_semantics',
        'mobile_polish',
        'trust_and_privacy',
      ]),
    );
    expect(report.topMvpGaps.length).toBeGreaterThan(0);
  });

  it('supports p0/p1/p2/p3 priorities and impact/effort/decision fields', () => {
    const report = createMvpGapPrioritizationReport({
      feedback: founderTrialFeedbackReportReadyExample,
    });
    const priorities = report.gaps.map((gap) => gap.priority);

    expect(priorities).toEqual(expect.arrayContaining(['p1', 'p2', 'p3']));
    expect(report.gaps[0]).toEqual(
      expect.objectContaining({
        impact: expect.any(String),
        effort: expect.any(String),
        decision: expect.any(String),
        recommendation: expect.any(String),
      }),
    );
  });

  it('separates MVP demo gaps from production gaps', () => {
    const report = createMvpGapPrioritizationReport({
      feedback: founderTrialFeedbackReportReadyExample,
    });
    const productionGap = report.gaps.find((gap) => gap.isProductionGap);

    expect(productionGap).toBeTruthy();
    expect(productionGap?.isMvpDemoGap).toBe(false);
    expect(productionGap?.decision).toBe('defer');
    expect(productionGap?.recommendation).toBe(
      'defer_until_production_planning',
    );
    expect(report.productionGapsNotCurrentMustDo).toBe(true);
    expect(report.deferredProductionGaps).toEqual(
      expect.arrayContaining([expect.objectContaining({ isProductionGap: true })]),
    );
  });

  it('keeps registry, publish, production writer, shell replacement, backend, camera, AR, AI, and training out of scope', () => {
    const report = createMvpGapPrioritizationReport({
      feedback: founderTrialFeedbackReportReadyExample,
    });

    expect(report.registryChainPausedAfter10U).toBe(true);
    expect(report.registryWriteBlocked).toBe(true);
    expect(report.publishBlocked).toBe(true);
    expect(report.productionWriterBlocked).toBe(true);
    expect(report.userAppShellReplacementBlocked).toBe(true);
    expect(report.noBackendCameraArAiTrainingScope).toBe(true);
    expect(report.nextRecommendedPhase).toBe(
      'Phase 13C - MVP Gap Resolution Sprint Planning',
    );
  });

  it('round-trips through JSON without mutation', () => {
    const report = createMvpGapPrioritizationReport({
      feedback: founderTrialFeedbackReportReadyExample,
    });

    expect(report.jsonRoundTripStable).toBe(true);
    expect(JSON.parse(JSON.stringify(report))).toEqual(report);
  });
});
