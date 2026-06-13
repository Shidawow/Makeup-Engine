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
  anonymousTrialFollowUpIterationDecision: {
    phase9JResult: string[];
    planningBoundary: string;
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
  anonymousTrialFollowUpIterationDecision: {
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 9J documentation recovery', () => {
  it('documents follow-up iteration and 9K handoff without sensitive data collection', () => {
    expect(readText('docs/product/anonymous-internal-trial-follow-up-iteration.md')).toContain(
      'Anonymous Internal Trial Follow-up Iteration',
    );
    expect(readText('docs/product/anonymous-internal-trial-gap-action-plan.md')).toContain(
      'Anonymous Internal Trial Gap Action Plan',
    );
    expect(readText('docs/product/anonymous-internal-trial-follow-up-readiness.md')).toContain(
      'Anonymous Internal Trial Follow-up Readiness',
    );
    expect(readText('docs/phases/phase-9J.md')).toContain(
      'Anonymous Internal Trial Evidence Round 2 Pack',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 9K');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 9J completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 9J',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 9K',
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
        'UserAppAnonymousTrialFollowUpIteration',
        'UserAppAnonymousTrialGapActionPlan',
        'UserAppAnonymousTrialFollowUpReadiness',
        'UserAppAnonymousTrialFollowUpAdminPanels',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/anonymous-internal-trial-follow-up-iteration.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/anonymous-internal-trial-gap-action-plan.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/anonymous-internal-trial-follow-up-readiness.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-9J.md');
    expect(snapshot.knownLimitations.join('\n')).toContain(
      'Phase 9J anonymous internal trial follow-up iteration',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 9J');
    expect(snapshot.anonymousTrialFollowUpIterationDecision.phase9JResult).toContain(
      'anonymous internal trial follow-up iteration with goals, actions, risks, status, and conservative recommendations',
    );
    expect(snapshot.anonymousTrialFollowUpIterationDecision.planningBoundary).toContain(
      'anonymous/internal/local follow-up planning only',
    );
    expect(snapshot.anonymousTrialFollowUpIterationDecision.defaultDecision).toContain(
      'repeat_dry_run_before_trial',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 9J');
    expect(providerHandoff.lastCompletedPhase).toBe('9J');
    expect(providerHandoff.nextRecommendedPhase).toBe('9K');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Anonymous Internal Trial Evidence Round 2 Pack',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-9J.md');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/product/anonymous-internal-trial-follow-up-iteration.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'Phase 9K should prepare a conservative second anonymous internal evidence round only',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('9J');
    expect(latestHandoff.toPhase).toBe('9K');
    expect(latestHandoff.nextAction).toContain('Phase 9K');
    expect(latestHandoff.anonymousTrialFollowUpIterationDecision.nextPhase).toContain(
      'Phase 9K',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9J');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_9j_planning_only',
        'phase_9j_no_sensitive_collection',
        'phase_9j_no_backend_ai_training',
        'phase_9j_no_project_state_user_records',
      ]),
    );
  });
});
