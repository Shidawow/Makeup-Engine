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
  internalTrialOpsDecision: {
    phase9AResult: string[];
    participantBoundary: string;
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 9A documentation recovery', () => {
  it('documents internal trial operations and the 9B handoff without real data collection', () => {
    expect(readText('docs/product/internal-trial-operations-pack.md')).toContain(
      'Internal Trial Operations Pack',
    );
    expect(readText('docs/product/internal-trial-operations-pack.md')).toContain(
      'not public recruitment',
    );
    expect(readText('docs/product/internal-trial-participant-guide.md')).toContain(
      'Please do not provide real name',
    );
    expect(readText('docs/product/internal-trial-observation-template.md')).toContain(
      'not a backend record system',
    );
    expect(readText('docs/product/internal-trial-outcome-review.md')).toContain(
      'ready_for_phase_9B',
    );
    expect(readText('docs/phases/phase-9A.md')).toContain('Internal Trial Operations Pack');
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 9C');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 9B completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 9B',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 9C',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('9G');
    expect(snapshot.lastCompletedBusinessPhase).toBe('9G');
    expect(snapshot.currentPhaseId).toBe('9G');
    expect(snapshot.nextRecommendedPhase).toBe('9H');
    expect(snapshot.nextRecommendedPhaseName).toContain(
      'Anonymous Internal Trial Launch Pack',
    );
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppInternalTrialOpsPack',
        'UserAppTrialObservationGuide',
        'UserAppTrialOutcomeReview',
        'UserAppInternalTrialOpsAdminPanels',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/internal-trial-operations-pack.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/internal-trial-observation-template.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/internal-trial-outcome-review.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-9A.md');
    expect(snapshot.knownLimitations.join('\n')).toContain(
      'Phase 9A internal trial operations',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 9A internal trial');
    expect(snapshot.forbiddenActions.join('\n')).toContain('real internal trial participant');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 9G');
    expect(providerHandoff.lastCompletedPhase).toBe('9G');
    expect(providerHandoff.nextRecommendedPhase).toBe('9H');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Anonymous Internal Trial Launch Pack',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-9A.md');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/product/internal-trial-operations-pack.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'Phase 9H should prepare an anonymous internal trial launch pack',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('9G');
    expect(latestHandoff.toPhase).toBe('9H');
    expect(latestHandoff.nextAction).toContain('Phase 9H');
    expect(latestHandoff.internalTrialOpsDecision.phase9AResult).toContain(
      'internal trial operations pack',
    );
    expect(latestHandoff.internalTrialOpsDecision.phase9AResult).toContain(
      'anonymous observation guide',
    );
    expect(latestHandoff.internalTrialOpsDecision.participantBoundary).toContain(
      'broad types only',
    );
    expect(latestHandoff.internalTrialOpsDecision.nextPhase).toContain('Phase 9B');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9G');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_9a_internal_trial_ops_only',
        'phase_9a_no_sensitive_participant_data',
        'phase_9a_no_backend_or_runtime_collection',
        'phase_9a_no_training_or_project_state_user_records',
      ]),
    );
  });
});
