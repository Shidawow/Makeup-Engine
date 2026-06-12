import { describe, expect, it } from 'vitest';
import {
  userAppAnonymousTrialDryRunReviewForbiddenContactExample,
  userAppAnonymousTrialDryRunReviewForbiddenPhotoExample,
  userAppAnonymousTrialDryRunReviewMissingNoticeExample,
  userAppAnonymousTrialDryRunReviewReadyExample,
  userAppAnonymousTrialDryRunReviewRepeatExample,
  userAppAnonymousTrialDryRunReviewReviseChecklistExample,
  userAppAnonymousTrialDryRunReviewReviseProtocolExample,
  userAppAnonymousTrialDryRunReviewUploadTrainingViolationExample,
  userAppAnonymousTrialDryRunReviewWarningExample,
} from '../src/templates/examples';

describe('User App anonymous internal trial dry run review', () => {
  it('marks clean dry run review ready for anonymous internal trial launch preparation', () => {
    expect(userAppAnonymousTrialDryRunReviewReadyExample.decision).toBe(
      'ready_for_anonymous_internal_trial',
    );
    expect(userAppAnonymousTrialDryRunReviewReadyExample.productionBuildApproved).toBe(false);
    expect(userAppAnonymousTrialDryRunReviewReadyExample.writesTrainingInput).toBe(false);
  });

  it('distinguishes warning, repeat, revise protocol, and revise checklist decisions', () => {
    expect(userAppAnonymousTrialDryRunReviewWarningExample.decision).toBe(
      'ready_with_warnings',
    );
    expect(userAppAnonymousTrialDryRunReviewRepeatExample.decision).toBe('repeat_dry_run');
    expect(userAppAnonymousTrialDryRunReviewReviseProtocolExample.decision).toBe(
      'revise_protocol_before_trial',
    );
    expect(userAppAnonymousTrialDryRunReviewReviseChecklistExample.decision).toBe(
      'revise_checklist_before_trial',
    );
  });

  it('blocks missing participant notice', () => {
    expect(userAppAnonymousTrialDryRunReviewMissingNoticeExample.decision).toBe(
      'blocked_by_missing_notice',
    );
  });

  it('forces privacy scope block for photo, contact, upload, and training requests', () => {
    expect(userAppAnonymousTrialDryRunReviewForbiddenPhotoExample.decision).toBe(
      'blocked_by_privacy_scope_issue',
    );
    expect(userAppAnonymousTrialDryRunReviewForbiddenContactExample.decision).toBe(
      'blocked_by_privacy_scope_issue',
    );
    expect(userAppAnonymousTrialDryRunReviewUploadTrainingViolationExample.decision).toBe(
      'blocked_by_privacy_scope_issue',
    );
  });
});
