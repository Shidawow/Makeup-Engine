import { describe, expect, it } from 'vitest';
import {
  userAppAnonymousTrialFollowUpReadinessDoNotAdvanceExample,
  userAppAnonymousTrialFollowUpReadinessMissingNoticeExample,
  userAppAnonymousTrialFollowUpReadinessMissingStopConditionsExample,
  userAppAnonymousTrialFollowUpReadinessPausePrivacyExample,
  userAppAnonymousTrialFollowUpReadinessReadyForMvpPreconditionsExample,
  userAppAnonymousTrialFollowUpReadinessRepeatDryRunExample,
  userAppAnonymousTrialFollowUpReadinessReviseLaunchPackExample,
  userAppAnonymousTrialFollowUpReadinessReviseProtocolExample,
} from '../src/templates/examples';

describe('User App anonymous internal trial follow-up readiness', () => {
  it('pauses when privacy or sensitive boundary blockers remain', () => {
    expect(userAppAnonymousTrialFollowUpReadinessPausePrivacyExample.decision).toBe(
      'pause_for_privacy_or_scope_fix',
    );
  });

  it('blocks readiness for missing notice, stop condition, and handoff', () => {
    expect(userAppAnonymousTrialFollowUpReadinessMissingNoticeExample.decision).toBe(
      'revise_protocol_before_trial',
    );
    expect(userAppAnonymousTrialFollowUpReadinessMissingStopConditionsExample.decision).toBe(
      'revise_protocol_before_trial',
    );
    expect(userAppAnonymousTrialFollowUpReadinessReviseLaunchPackExample.decision).toBe(
      'revise_launch_pack_before_trial',
    );
  });

  it('does not treat insufficient evidence as MVP validation readiness', () => {
    expect(userAppAnonymousTrialFollowUpReadinessRepeatDryRunExample.decision).toBe(
      'repeat_dry_run_before_trial',
    );
    expect(userAppAnonymousTrialFollowUpReadinessReviseProtocolExample.decision).not.toBe(
      'ready_for_mvp_validation_preconditions',
    );
  });

  it('allows MVP validation preconditions only when safe evidence and follow-up actions are complete', () => {
    expect(userAppAnonymousTrialFollowUpReadinessReadyForMvpPreconditionsExample.decision).toBe(
      'ready_for_mvp_validation_preconditions',
    );
    expect(
      userAppAnonymousTrialFollowUpReadinessReadyForMvpPreconditionsExample.productionBuildApproved,
    ).toBe(false);
    expect(
      userAppAnonymousTrialFollowUpReadinessReadyForMvpPreconditionsExample.backendRecordSystem,
    ).toBe(false);
  });

  it('can explicitly refuse to advance', () => {
    expect(userAppAnonymousTrialFollowUpReadinessDoNotAdvanceExample.decision).toBe(
      'do_not_advance',
    );
  });
});
