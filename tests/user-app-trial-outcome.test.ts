import { describe, expect, it } from 'vitest';
import { createUserAppTrialOutcomeReview } from '../src/user-app';
import {
  userAppTrialOutcomeBlockExample,
  userAppTrialOutcomeContinueExample,
  userAppTrialOutcomeReadyFor9BExample,
  userAppTrialOutcomeReviseContentExample,
  userAppTrialOutcomeReviseShellExample,
} from '../src/templates/examples';

describe('User App trial outcome review', () => {
  it('recommends continuing more internal trials for healthy early signals', () => {
    expect(userAppTrialOutcomeContinueExample.schemaVersion).toBe(
      'user-app-trial-outcome-v0.1',
    );
    expect(userAppTrialOutcomeContinueExample.decision).toBe(
      'continue_to_more_internal_trials',
    );
    expect(userAppTrialOutcomeContinueExample.productionRelease).toBe(false);
    expect(userAppTrialOutcomeContinueExample.containsRealParticipantRecords).toBe(false);
  });

  it('recommends content, shell, and privacy/scope decisions', () => {
    expect(userAppTrialOutcomeReviseContentExample.decision).toBe(
      'revise_content_before_more_trials',
    );
    expect(userAppTrialOutcomeReviseShellExample.decision).toBe(
      'revise_shell_before_more_trials',
    );
    expect(userAppTrialOutcomeBlockExample.decision).toBe(
      'block_until_privacy_or_scope_fixed',
    );
  });

  it('can mark ready_for_phase_9B after enough strong internal signals', () => {
    expect(userAppTrialOutcomeReadyFor9BExample.decision).toBe('ready_for_phase_9B');

    const review = createUserAppTrialOutcomeReview({
      participantSessionsReviewed: 3,
      readyForPhase9B: true,
      understandingScore: 5,
      willingnessScore: 5,
      templateValueScore: 5,
    });
    expect(review.recommendations[0].priority).toBe('phase_9b');
  });
});
