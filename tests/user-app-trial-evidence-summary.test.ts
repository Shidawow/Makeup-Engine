import { describe, expect, it } from 'vitest';
import {
  userAppTrialEvidenceSummaryInsufficientExample,
  userAppTrialEvidenceSummaryMvpPlanningExample,
  userAppTrialEvidenceSummaryNoEvidenceExample,
  userAppTrialEvidenceSummaryStrongContentInsufficientValueExample,
} from '../src/templates/examples';

describe('User App trial evidence summary', () => {
  it('summarizes required evidence themes and gaps', () => {
    expect(userAppTrialEvidenceSummaryMvpPlanningExample.gaps).toHaveLength(0);
    expect(userAppTrialEvidenceSummaryMvpPlanningExample.themes).toEqual(
      expect.arrayContaining([
        'user_value_evidence',
        'shell_usability_evidence',
        'privacy_trust_evidence',
        'decision_readiness_evidence',
      ]),
    );
  });

  it('keeps insufficient evidence from overclaiming readiness', () => {
    expect(userAppTrialEvidenceSummaryInsufficientExample.gaps.length).toBeGreaterThan(0);
    expect(userAppTrialEvidenceSummaryInsufficientExample.recommendations[0].message).toContain(
      '证据主题仍有缺口',
    );
  });

  it('shows no evidence and content-only evidence gaps', () => {
    expect(userAppTrialEvidenceSummaryNoEvidenceExample.gaps.length).toBeGreaterThan(5);
    expect(
      userAppTrialEvidenceSummaryStrongContentInsufficientValueExample.gaps.map(
        (gap) => gap.theme,
      ),
    ).toContain('user_value_evidence');
  });
});
