import { describe, expect, it } from 'vitest';
import { createFounderTrialFeedbackReport } from '../src/template-engine';
import {
  founderTrialFeedbackEntriesReadyExample,
  founderTrialFeedbackReportReadyExample,
  founderTrialFeedbackReportUnsafeExample,
} from '../src/templates/examples';

describe('Founder Trial Feedback Capture', () => {
  it('captures structured founder/internal feedback entries', () => {
    const report = founderTrialFeedbackReportReadyExample;

    expect(report.internalFounderFeedbackOnly).toBe(true);
    expect(report.notRealUserResearch).toBe(true);
    expect(report.entries.length).toBeGreaterThanOrEqual(7);
    expect(report.entries[0]).toEqual(
      expect.objectContaining({
        category: expect.any(String),
        sentiment: expect.any(String),
        severity: expect.any(String),
        source: expect.any(String),
        internalOnly: true,
        notRealUserResearch: true,
      }),
    );
    expect(report.entries.map((entry) => entry.category)).toEqual(
      expect.arrayContaining([
        'first_impression',
        'trial_content_quality',
        'step_guidance',
        'mobile_usability',
        'photo_to_template_workflow',
        'trust_and_boundaries',
      ]),
    );
  });

  it('keeps feedback local, privacy-safe, non-analytics, and non-training', () => {
    const entryText = founderTrialFeedbackReportReadyExample.entries
      .map((entry) => `${entry.summary} ${entry.detail}`)
      .join('\n');

    expect(founderTrialFeedbackReportReadyExample.noPersonalData).toBe(true);
    expect(founderTrialFeedbackReportReadyExample.noRealUserPhotos).toBe(true);
    expect(founderTrialFeedbackReportReadyExample.noBase64OrLocalPhotoPath).toBe(true);
    expect(founderTrialFeedbackReportReadyExample.noAnalytics).toBe(true);
    expect(founderTrialFeedbackReportReadyExample.noBackend).toBe(true);
    expect(founderTrialFeedbackReportReadyExample.noTrainingData).toBe(true);
    expect(entryText).not.toMatch(/data:image\/|base64|\/Users\/|@|faceEmbedding|biometric|analyticsId/i);
  });

  it('flags forbidden contact and local photo path markers', () => {
    expect(founderTrialFeedbackReportUnsafeExample.noPersonalData).toBe(false);
    expect(founderTrialFeedbackReportUnsafeExample.noRealUserPhotos).toBe(false);
    expect(founderTrialFeedbackReportUnsafeExample.noBase64OrLocalPhotoPath).toBe(false);
    expect(founderTrialFeedbackReportUnsafeExample.privacyIssues.length).toBeGreaterThan(0);
    expect(founderTrialFeedbackReportUnsafeExample.entries[0].severity).toBe('blocker');
  });

  it('round-trips through JSON without mutation', () => {
    const report = createFounderTrialFeedbackReport({
      entries: founderTrialFeedbackEntriesReadyExample,
    });

    expect(report.jsonRoundTripStable).toBe(true);
    expect(JSON.parse(JSON.stringify(report))).toEqual(report);
    expect(report.nextRecommendedPhase).toBe(
      'Phase 13C - MVP Gap Resolution Sprint Planning',
    );
  });
});
