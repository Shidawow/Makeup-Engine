import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readText = (path: string): string => readFileSync(path, 'utf8');
const readJson = <T>(path: string): T => JSON.parse(readText(path)) as T;

interface ProjectSnapshot {
  lastCompletedPhase: string;
  lastCompletedBusinessPhase: string;
  currentPhaseId: string;
  nextRecommendedPhase: string;
  nextRecommendedPhaseName: string;
  mainDataFlow: string[];
  recoveryEntryFiles: string[];
  forbiddenActions: string[];
  knownLimitations: string[];
  anonymousTrialEvidenceReviewDecision: {
    phase9IResult: string[];
    reviewBoundary: string;
    defaultDecision: string;
    nextPhase: string;
  };
}

interface ProviderHandoff {
  currentTask: string;
  lastCompletedPhase: string;
  nextRecommendedPhase: string;
  nextRecommendedPhaseName: string;
  nextRequiredReadFiles: string[];
  handoffNotes: string[];
}

interface LatestHandoff {
  fromPhase: string;
  toPhase: string;
  nextAction: string;
  anonymousTrialEvidenceReviewDecision: {
    phase9IResult: string[];
    reviewBoundary: string;
    defaultDecision: string;
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 9I documentation recovery', () => {
  it('documents anonymous evidence review and 9J handoff without sensitive data collection', () => {
    expect(readText('docs/product/anonymous-internal-trial-evidence-review.md')).toContain(
      'Anonymous Internal Trial Evidence Review',
    );
    expect(readText('docs/product/anonymous-internal-trial-evidence-gap-review.md')).toContain(
      'Anonymous Internal Trial Evidence Gap Review',
    );
    expect(readText('docs/product/anonymous-internal-trial-decision-input.md')).toContain(
      'Anonymous Internal Trial Decision Input',
    );
    expect(readText('docs/phases/phase-9I.md')).toContain(
      'Anonymous Internal Trial Follow-up Iteration',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 9K');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 9I completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 9I',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 9J',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('9J');
    expect(snapshot.lastCompletedBusinessPhase).toBe('9J');
    expect(snapshot.currentPhaseId).toBe('9J');
    expect(snapshot.nextRecommendedPhase).toBe('9K');
    expect(snapshot.nextRecommendedPhaseName).toContain(
      'Anonymous Internal Trial Evidence Round 2 Pack',
    );
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppAnonymousTrialEvidenceReview',
        'UserAppAnonymousTrialEvidenceGapReview',
        'UserAppAnonymousTrialDecisionInput',
        'UserAppAnonymousTrialEvidenceReviewAdminPanels',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/anonymous-internal-trial-evidence-review.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/anonymous-internal-trial-evidence-gap-review.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/anonymous-internal-trial-decision-input.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-9I.md');
    expect(snapshot.knownLimitations.join('\n')).toContain(
      'Phase 9I anonymous internal trial evidence review',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 9I evidence review');
    expect(snapshot.anonymousTrialEvidenceReviewDecision.phase9IResult).toContain(
      'anonymous internal trial evidence review with completeness, privacy, stopped/paused session, source, sample size, and risk checks',
    );
    expect(snapshot.anonymousTrialEvidenceReviewDecision.reviewBoundary).toContain(
      'anonymous/internal/local post-trial review only',
    );
    expect(snapshot.anonymousTrialEvidenceReviewDecision.defaultDecision).toContain(
      'repeat_anonymous_internal_trial',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 9J');
    expect(providerHandoff.lastCompletedPhase).toBe('9J');
    expect(providerHandoff.nextRecommendedPhase).toBe('9K');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Anonymous Internal Trial Evidence Round 2 Pack',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-9I.md');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/product/anonymous-internal-trial-evidence-review.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'Phase 9K should prepare a conservative second anonymous internal evidence round only',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('9J');
    expect(latestHandoff.toPhase).toBe('9K');
    expect(latestHandoff.nextAction).toContain('Phase 9K');
    expect(latestHandoff.anonymousTrialEvidenceReviewDecision.nextPhase).toContain(
      'Phase 9J',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9J');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_9i_review_only',
        'phase_9i_no_sensitive_collection',
        'phase_9i_no_backend_ai_training',
        'phase_9i_no_project_state_user_records',
      ]),
    );
  });
});
