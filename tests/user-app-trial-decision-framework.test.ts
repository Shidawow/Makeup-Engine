import { describe, expect, it } from 'vitest';
import { createUserAppTrialDecisionFramework, createUserAppTrialResultReview } from '../src/user-app';
import {
  userAppTrialDecisionContinueExample,
  userAppTrialDecisionInsufficientSignalsExample,
  userAppTrialDecisionPauseExample,
  userAppTrialDecisionReadyFor9CExample,
  userAppTrialDecisionReviseContentExample,
  userAppTrialDecisionReviseShellExample,
  userAppTrialDecisionReviseTrialPackExample,
} from '../src/templates/examples';

describe('User App trial decision framework', () => {
  it('continues internal trials for healthy but not phase-ready signals', () => {
    expect(userAppTrialDecisionContinueExample.schemaVersion).toBe(
      'user-app-trial-decision-framework-v0.1',
    );
    expect(userAppTrialDecisionContinueExample.decision).toBe('continue_internal_trials');
    expect(userAppTrialDecisionContinueExample.status).toBe('decision_ready');
    expect(userAppTrialDecisionContinueExample.backendRecordSystem).toBe(false);
    expect(userAppTrialDecisionContinueExample.usesAiAnalysis).toBe(false);
    expect(userAppTrialDecisionContinueExample.writesTrainingInput).toBe(false);
  });

  it('decides revise content, shell, and trial pack from issue-heavy summaries', () => {
    expect(userAppTrialDecisionReviseContentExample.decision).toBe(
      'revise_template_content',
    );
    expect(userAppTrialDecisionReviseShellExample.decision).toBe('revise_user_app_shell');
    expect(userAppTrialDecisionReviseTrialPackExample.decision).toBe('revise_trial_pack');
  });

  it('pauses when privacy, sensitive data, or boundary issues appear', () => {
    expect(userAppTrialDecisionPauseExample.status).toBe('decision_blocked');
    expect(userAppTrialDecisionPauseExample.decision).toBe(
      'pause_for_privacy_or_scope_fix',
    );

    const framework = createUserAppTrialDecisionFramework({
      review: createUserAppTrialResultReview({
        collectsRealName: true,
        collectsContact: true,
        collectsHealthInfo: true,
      }),
    });
    expect(framework.decision).toBe('pause_for_privacy_or_scope_fix');
  });

  it('does not overclaim when signals are insufficient', () => {
    expect(userAppTrialDecisionInsufficientSignalsExample.status).toBe(
      'decision_needs_more_trials',
    );
    expect(userAppTrialDecisionInsufficientSignalsExample.decision).toBe(
      'continue_internal_trials',
    );
  });

  it('can mark ready for Phase 9C when clean review is explicitly phase-ready', () => {
    expect(userAppTrialDecisionReadyFor9CExample.status).toBe('decision_ready');
    expect(userAppTrialDecisionReadyFor9CExample.decision).toBe('ready_for_phase_9C');
    expect(userAppTrialDecisionReadyFor9CExample.recommendations[0].message).toContain(
      'Phase 9C',
    );
  });
});
