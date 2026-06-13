import { describe, expect, it } from 'vitest';
import {
  userAppAnonymousTrialFollowUpIterationDoNotAdvanceExample,
  userAppAnonymousTrialFollowUpIterationMissingParticipantNoticeExample,
  userAppAnonymousTrialFollowUpIterationPrivacyBlockerExample,
  userAppAnonymousTrialFollowUpIterationReadyExample,
  userAppAnonymousTrialFollowUpIterationRepeatDryRunExample,
  userAppAnonymousTrialFollowUpIterationReviseProtocolExample,
  userAppAnonymousTrialFollowUpIterationWarningExample,
} from '../src/templates/examples';

describe('User App anonymous internal trial follow-up iteration', () => {
  it('reports ready, warning, and blocked statuses', () => {
    expect(userAppAnonymousTrialFollowUpIterationReadyExample.status).toBe('follow_up_ready');
    expect(userAppAnonymousTrialFollowUpIterationWarningExample.status).toBe(
      'follow_up_ready_with_warnings',
    );
    expect(userAppAnonymousTrialFollowUpIterationPrivacyBlockerExample.status).toBe(
      'follow_up_blocked',
    );
  });

  it('turns decision inputs into conservative follow-up recommendations', () => {
    expect(userAppAnonymousTrialFollowUpIterationRepeatDryRunExample.recommendation).toBe(
      'repeat_dry_run',
    );
    expect(userAppAnonymousTrialFollowUpIterationReviseProtocolExample.recommendation).toBe(
      'revise_evidence_collection_protocol',
    );
    expect(userAppAnonymousTrialFollowUpIterationMissingParticipantNoticeExample.recommendation).toBe(
      'revise_launch_pack',
    );
    expect(userAppAnonymousTrialFollowUpIterationDoNotAdvanceExample.recommendation).toBe(
      'do_not_advance',
    );
  });

  it('keeps the follow-up iteration anonymous and local only', () => {
    expect(userAppAnonymousTrialFollowUpIterationReadyExample.localOnly).toBe(true);
    expect(userAppAnonymousTrialFollowUpIterationReadyExample.anonymousOrExampleOnly).toBe(true);
    expect(userAppAnonymousTrialFollowUpIterationReadyExample.requestsUpload).toBe(false);
    expect(userAppAnonymousTrialFollowUpIterationReadyExample.writesTrainingInput).toBe(false);
    expect(userAppAnonymousTrialFollowUpIterationReadyExample.writesProjectStateUserRecords).toBe(false);
  });
});
