import { describe, expect, it } from 'vitest';
import {
  userAppAnonymousTrialDecisionInputDoNotAdvanceExample,
  userAppAnonymousTrialDecisionInputInsufficientSampleExample,
  userAppAnonymousTrialDecisionInputPauseForbiddenDataExample,
  userAppAnonymousTrialDecisionInputPausePrivacyExample,
  userAppAnonymousTrialDecisionInputPrepareMvpValidationExample,
  userAppAnonymousTrialDecisionInputRepeatExample,
  userAppAnonymousTrialDecisionInputReviseLaunchPackExample,
  userAppAnonymousTrialDecisionInputReviseProtocolExample,
} from '../src/templates/examples';

describe('User App anonymous internal trial decision input', () => {
  it('repeats anonymous internal trial for mock/example or insufficient sample evidence', () => {
    expect(userAppAnonymousTrialDecisionInputRepeatExample.recommendation).toBe(
      'repeat_anonymous_internal_trial',
    );
    expect(userAppAnonymousTrialDecisionInputInsufficientSampleExample.recommendation).toBe(
      'repeat_anonymous_internal_trial',
    );
  });

  it('revises launch pack or evidence collection protocol for structural gaps', () => {
    expect(userAppAnonymousTrialDecisionInputReviseLaunchPackExample.recommendation).toBe(
      'revise_launch_pack',
    );
    expect(userAppAnonymousTrialDecisionInputReviseProtocolExample.recommendation).toBe(
      'revise_evidence_collection_protocol',
    );
  });

  it('pauses when privacy incident or forbidden data appears', () => {
    expect(userAppAnonymousTrialDecisionInputPausePrivacyExample.recommendation).toBe(
      'pause_for_privacy_or_scope_fix',
    );
    expect(userAppAnonymousTrialDecisionInputPauseForbiddenDataExample.recommendation).toBe(
      'pause_for_privacy_or_scope_fix',
    );
  });

  it('can prepare MVP validation plan only with non-mock complete evidence and strong signals', () => {
    expect(userAppAnonymousTrialDecisionInputPrepareMvpValidationExample.recommendation).toBe(
      'prepare_mvp_validation_plan',
    );
    expect(userAppAnonymousTrialDecisionInputPrepareMvpValidationExample.productionBuildApproved).toBe(false);
    expect(userAppAnonymousTrialDecisionInputPrepareMvpValidationExample.backendRecordSystem).toBe(false);
  });

  it('does not advance when the evidence review is blocked without a privacy incident', () => {
    expect(userAppAnonymousTrialDecisionInputDoNotAdvanceExample.recommendation).toBe(
      'do_not_advance',
    );
  });
});
