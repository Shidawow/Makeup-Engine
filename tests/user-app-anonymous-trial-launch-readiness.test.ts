import { describe, expect, it } from 'vitest';
import {
  userAppAnonymousTrialLaunchReadinessForbiddenContactExample,
  userAppAnonymousTrialLaunchReadinessForbiddenPhotoExample,
  userAppAnonymousTrialLaunchReadinessMissingAdminScriptExample,
  userAppAnonymousTrialLaunchReadinessMissingNoticeExample,
  userAppAnonymousTrialLaunchReadinessMissingStopConditionsExample,
  userAppAnonymousTrialLaunchReadinessReadyExample,
  userAppAnonymousTrialLaunchReadinessUploadTrainingViolationExample,
  userAppAnonymousTrialLaunchReadinessWarningExample,
} from '../src/templates/examples';

describe('User App anonymous internal trial launch readiness', () => {
  it('allows launch only when notice, admin script, sheet, stop conditions, and boundaries are ready', () => {
    expect(userAppAnonymousTrialLaunchReadinessReadyExample.decision).toBe(
      'ready_to_launch_anonymous_internal_trial',
    );
    expect(
      userAppAnonymousTrialLaunchReadinessReadyExample.checks.every((check) => check.passed),
    ).toBe(true);
    expect(userAppAnonymousTrialLaunchReadinessReadyExample.backendRecordSystem).toBe(false);
    expect(userAppAnonymousTrialLaunchReadinessReadyExample.usesAiAnalysis).toBe(false);
  });

  it('supports warning launch readiness without overclaiming production approval', () => {
    expect(userAppAnonymousTrialLaunchReadinessWarningExample.decision).toBe(
      'ready_with_warnings',
    );
    expect(userAppAnonymousTrialLaunchReadinessWarningExample.productionBuildApproved).toBe(false);
  });

  it('blocks missing participant notice, admin script, and stop conditions', () => {
    expect(userAppAnonymousTrialLaunchReadinessMissingNoticeExample.decision).toBe(
      'blocked_by_missing_notice',
    );
    expect(userAppAnonymousTrialLaunchReadinessMissingAdminScriptExample.decision).toBe(
      'blocked_by_missing_admin_script',
    );
    expect(userAppAnonymousTrialLaunchReadinessMissingStopConditionsExample.decision).toBe(
      'blocked_by_missing_stop_conditions',
    );
  });

  it('blocks photo, contact, upload, and training requests as privacy scope issues', () => {
    expect(userAppAnonymousTrialLaunchReadinessForbiddenPhotoExample.decision).toBe(
      'blocked_by_privacy_scope_issue',
    );
    expect(userAppAnonymousTrialLaunchReadinessForbiddenContactExample.decision).toBe(
      'blocked_by_privacy_scope_issue',
    );
    expect(userAppAnonymousTrialLaunchReadinessUploadTrainingViolationExample.decision).toBe(
      'blocked_by_privacy_scope_issue',
    );
  });
});
