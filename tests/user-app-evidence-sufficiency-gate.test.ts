import { describe, expect, it } from 'vitest';
import {
  userAppEvidenceSufficiencyGateInsufficientExample,
  userAppEvidenceSufficiencyGateMvpPlanningExample,
  userAppEvidenceSufficiencyGateNextInternalTrialExample,
  userAppEvidenceSufficiencyGateNoEvidenceExample,
  userAppEvidenceSufficiencyGatePrivacyBlockerExample,
  userAppEvidenceSufficiencyGateStrongContentInsufficientValueExample,
  userAppEvidenceSufficiencyGateStrongValueWeakShellExample,
} from '../src/templates/examples';

describe('User App evidence sufficiency gate', () => {
  it('blocks MVP validation planning when there is no evidence', () => {
    expect(userAppEvidenceSufficiencyGateNoEvidenceExample.decision).toBe(
      'blocked_by_missing_trial_evidence',
    );
  });

  it('forces blocker decision for privacy, upload, sensitive, or training risks', () => {
    expect(userAppEvidenceSufficiencyGatePrivacyBlockerExample.decision).toBe(
      'blocked_by_privacy_or_scope_issue',
    );
    expect(userAppEvidenceSufficiencyGatePrivacyBlockerExample.risks[0].severity).toBe(
      'critical',
    );
  });

  it('distinguishes insufficient, next-trial, and MVP planning decisions', () => {
    expect(userAppEvidenceSufficiencyGateInsufficientExample.decision).toBe(
      'insufficient_collect_more_internal_evidence',
    );
    expect(userAppEvidenceSufficiencyGateNextInternalTrialExample.decision).toBe(
      'sufficient_for_next_internal_trial',
    );
    expect(userAppEvidenceSufficiencyGateMvpPlanningExample.decision).toBe(
      'sufficient_for_mvp_validation_planning',
    );
  });

  it('does not overclaim when value or shell evidence is weak', () => {
    expect(userAppEvidenceSufficiencyGateStrongValueWeakShellExample.decision).toBe(
      'sufficient_for_next_internal_trial',
    );
    expect(userAppEvidenceSufficiencyGateStrongContentInsufficientValueExample.decision).toBe(
      'insufficient_collect_more_internal_evidence',
    );
  });
});
