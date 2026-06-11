import { describe, expect, it } from 'vitest';
import { createUserAppInternalTrialLearningSummary } from '../src/user-app';
import {
  userAppInternalTrialLearningSummaryContentIssueExample,
  userAppInternalTrialLearningSummaryInsufficientSignalsExample,
  userAppInternalTrialLearningSummaryPrivacyBlockerExample,
  userAppInternalTrialLearningSummaryStrongValueExample,
} from '../src/templates/examples';

describe('User App internal trial learning summary', () => {
  it('creates ready, warning, and blocked learning states', () => {
    expect(userAppInternalTrialLearningSummaryStrongValueExample.status).toBe(
      'learning_summary_ready',
    );
    expect(userAppInternalTrialLearningSummaryInsufficientSignalsExample.status).toBe(
      'learning_summary_ready_with_warnings',
    );
    expect(userAppInternalTrialLearningSummaryPrivacyBlockerExample.status).toBe(
      'learning_summary_blocked',
    );
  });

  it('aggregates required learning themes from review and iteration inputs', () => {
    expect(userAppInternalTrialLearningSummaryStrongValueExample.themes).toEqual(
      expect.arrayContaining([
        'user_value_signal',
        'template_content_signal',
        'shell_usability_signal',
        'guidance_clarity_signal',
        'recommendation_signal',
        'privacy_trust_signal',
        'trial_ops_signal',
        'iteration_readiness_signal',
      ]),
    );
  });

  it('turns content-heavy learnings into content risks without storing real user data', () => {
    expect(userAppInternalTrialLearningSummaryContentIssueExample.risks.length).toBeGreaterThan(0);
    expect(
      userAppInternalTrialLearningSummaryContentIssueExample.risks.map((risk) => risk.theme),
    ).toEqual(expect.arrayContaining(['template_content_signal']));
    expect(userAppInternalTrialLearningSummaryContentIssueExample.localOnly).toBe(true);
    expect(userAppInternalTrialLearningSummaryContentIssueExample.mockOnly).toBe(true);
    expect(userAppInternalTrialLearningSummaryContentIssueExample.anonymousOrExampleOnly).toBe(
      true,
    );
    expect(userAppInternalTrialLearningSummaryContentIssueExample.collectsRealName).toBe(false);
    expect(userAppInternalTrialLearningSummaryContentIssueExample.collectsContact).toBe(false);
    expect(userAppInternalTrialLearningSummaryContentIssueExample.collectsPhotos).toBe(false);
    expect(userAppInternalTrialLearningSummaryContentIssueExample.writesTrainingInput).toBe(false);
    expect(userAppInternalTrialLearningSummaryContentIssueExample.writesProjectStateUserRecords).toBe(
      false,
    );
  });

  it('can be created deterministically with default mock/example inputs', () => {
    const summary = createUserAppInternalTrialLearningSummary();

    expect(summary.deterministic).toBe(true);
    expect(summary.usesAiAnalysis).toBe(false);
    expect(summary.backendRecordSystem).toBe(false);
    expect(summary.productionRelease).toBe(false);
  });
});
