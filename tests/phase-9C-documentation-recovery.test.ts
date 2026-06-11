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
  internalTrialIterationDecision: {
    phase9CResult: string[];
    iterationBoundary: string;
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 9C documentation recovery', () => {
  it('documents internal trial iteration planning and the 9D handoff without real data collection', () => {
    expect(readText('docs/product/internal-trial-iteration-plan.md')).toContain(
      'Internal Trial Iteration Plan',
    );
    expect(readText('docs/product/internal-trial-iteration-plan.md')).toContain(
      'not a formal product roadmap release',
    );
    expect(readText('docs/product/internal-trial-iteration-backlog.md')).toContain(
      'blocked reason',
    );
    expect(readText('docs/product/internal-trial-priority-framework.md')).toContain(
      'p0_blocker',
    );
    expect(readText('docs/phases/phase-9C.md')).toContain(
      'Internal Trial Iteration Plan',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 9D');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 9C completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 9D',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 9E',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('9D');
    expect(snapshot.lastCompletedBusinessPhase).toBe('9D');
    expect(snapshot.currentPhaseId).toBe('9D');
    expect(snapshot.nextRecommendedPhase).toBe('9E');
    expect(snapshot.nextRecommendedPhaseName).toContain(
      'Internal Trial Evidence Pack',
    );
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppTrialIterationPlan',
        'UserAppTrialIterationBacklog',
        'UserAppTrialIterationPriority',
        'UserAppTrialIterationAdminPanels',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/internal-trial-iteration-plan.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/internal-trial-iteration-backlog.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/internal-trial-priority-framework.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-9C.md');
    expect(snapshot.knownLimitations.join('\n')).toContain(
      'Phase 9C internal trial iteration plan',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 9C internal trial');
    expect(snapshot.forbiddenActions.join('\n')).toContain('real user names');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 9D');
    expect(providerHandoff.lastCompletedPhase).toBe('9D');
    expect(providerHandoff.nextRecommendedPhase).toBe('9E');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Internal Trial Evidence Pack',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-9C.md');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/product/internal-trial-iteration-plan.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'Phase 9E should create an internal trial evidence pack',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('9D');
    expect(latestHandoff.toPhase).toBe('9E');
    expect(latestHandoff.nextAction).toContain('Phase 9E');
    expect(latestHandoff.internalTrialIterationDecision.phase9CResult).toContain(
      'internal trial iteration plan with workstreams, goals, actions, and risks',
    );
    expect(latestHandoff.internalTrialIterationDecision.phase9CResult).toContain(
      'priority framework for p0/p1/p2/p3/observe-more recommendations',
    );
    expect(latestHandoff.internalTrialIterationDecision.iterationBoundary).toContain(
      'anonymous/mock/example summaries only',
    );
    expect(latestHandoff.internalTrialIterationDecision.nextPhase).toContain(
      'Phase 9D',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9D');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_9c_iteration_plan_only',
        'phase_9c_no_sensitive_iteration_data',
        'phase_9c_no_backend_ai_or_runtime_collection',
        'phase_9c_no_training_or_project_state_user_records',
      ]),
    );
  });
});
