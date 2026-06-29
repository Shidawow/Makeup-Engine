import { describe, expect, it } from 'vitest';
import { createFounderDemoReviewReport } from '../src/template-engine';
import {
  mvpTrialContentPackBlockedExample,
  mvpTrialContentPackReadyExample,
  mvpTrialContentPackSingleTemplateWarningExample,
  photoToTemplateAcceptanceTrialReadyExample,
} from '../src/templates/examples';

describe('Founder Demo Review', () => {
  it('marks the MVP trial content pack ready without production or registry scope', () => {
    const report = createFounderDemoReviewReport({
      contentPack: mvpTrialContentPackReadyExample,
      acceptanceTrial: photoToTemplateAcceptanceTrialReadyExample,
    });

    expect(report.status).toBe('founder_review_ready');
    expect(report.decision).toBe('ready_for_founder_demo_review');
    expect(report.completeTrialTemplateCount).toBe(3);
    expect(report.recommendedTemplateTitles).toEqual([
      '新手通勤淡妆',
      '日系温柔约会妆',
      '韩系清透低饱和妆',
    ]);
    expect(report.founderReviewNotProductionReadiness).toBe(true);
    expect(report.trialContentNotOfficialTemplateLibrary).toBe(true);
    expect(report.registryChainPausedAfter10U).toBe(true);
    expect(report.registryWriteBlocked).toBe(true);
    expect(report.publishBlocked).toBe(true);
    expect(report.productionWriterBlocked).toBe(true);
    expect(report.userAppShellReplacementBlocked).toBe(true);
    expect(report.noBackendCameraArAiTrainingScope).toBe(true);
    expect(report.noRealUserPhotoOrPersonalData).toBe(true);
    expect(report.jsonRoundTripStable).toBe(true);
    expect(report.nextRecommendedPhase).toBe(
      'Phase 13B - Founder Trial Feedback Capture & MVP Gap Prioritization',
    );
  });

  it('warns when the trial content pack has fewer than two templates', () => {
    const report = createFounderDemoReviewReport({
      contentPack: mvpTrialContentPackSingleTemplateWarningExample,
      acceptanceTrial: photoToTemplateAcceptanceTrialReadyExample,
    });

    expect(report.status).toBe('founder_review_ready_with_warnings');
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          checkId: 'trial_content_quality',
          severity: 'warning',
        }),
      ]),
    );
  });

  it('blocks content packs that cross registry or official library boundaries', () => {
    const report = createFounderDemoReviewReport({
      contentPack: mvpTrialContentPackBlockedExample,
      acceptanceTrial: photoToTemplateAcceptanceTrialReadyExample,
    });

    expect(report.status).toBe('founder_review_blocked');
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          checkId: 'trial_content_quality',
          severity: 'blocking',
        }),
      ]),
    );
  });

  it('blocks fully automatic, publish, registry, and production claims', () => {
    const report = createFounderDemoReviewReport({
      contentPack: mvpTrialContentPackReadyExample,
      acceptanceTrial: photoToTemplateAcceptanceTrialReadyExample,
      founderClaimText:
        'AI 已确认 fully automatic extraction，已写入 registry，published production ready。',
    });

    expect(report.status).toBe('founder_review_blocked');
    expect(report.issues.map((issue) => issue.checkId)).toContain(
      'forbidden_claims_absent',
    );
  });

  it('blocks ordinary user path leakage of admin terms', () => {
    const report = createFounderDemoReviewReport({
      contentPack: mvpTrialContentPackReadyExample,
      acceptanceTrial: photoToTemplateAcceptanceTrialReadyExample,
      founderClaimText: '普通用户会看到 Founder Demo Review 和 Template Studio registry。',
    });

    expect(report.status).toBe('founder_review_blocked');
    expect(report.issues.map((issue) => issue.checkId)).toContain(
      'user_app_first_impression',
    );
  });

  it('blocks incomplete User App demo path before founder review', () => {
    const report = createFounderDemoReviewReport({
      contentPack: mvpTrialContentPackReadyExample,
      acceptanceTrial: photoToTemplateAcceptanceTrialReadyExample,
      stepGuidanceClear: false,
    });

    expect(report.status).toBe('founder_review_blocked');
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          checkId: 'step_guidance_clear',
          severity: 'blocking',
        }),
      ]),
    );
  });
});
