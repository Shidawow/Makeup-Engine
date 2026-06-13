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
  anonymousTrialDryRunDecision: {
    phase9GResult: string[];
    dryRunBoundary: string;
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 9G documentation recovery', () => {
  it('documents anonymous dry run pack and 9H handoff without real data collection', () => {
    expect(readText('docs/product/anonymous-internal-trial-dry-run-pack.md')).toContain(
      'Anonymous Internal Trial Dry Run Pack',
    );
    expect(readText('docs/product/anonymous-internal-trial-dry-run-checklist.md')).toContain(
      'Anonymous Internal Trial Dry Run Checklist',
    );
    expect(readText('docs/product/anonymous-internal-trial-dry-run-review.md')).toContain(
      'Anonymous Internal Trial Dry Run Review',
    );
    expect(readText('docs/phases/phase-9G.md')).toContain(
      'Anonymous Internal Trial Launch Pack',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 9J');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 9G completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 9G',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 9H',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('9J');
    expect(snapshot.lastCompletedBusinessPhase).toBe('9J');
    expect(snapshot.currentPhaseId).toBe('9J');
    expect(snapshot.nextRecommendedPhase).toBe('9K');
    expect(snapshot.nextRecommendedPhaseName).toContain('Anonymous Internal Trial Evidence Round 2 Pack');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppAnonymousTrialDryRunPack',
        'UserAppAnonymousTrialDryRunChecklist',
        'UserAppAnonymousTrialDryRunReview',
        'UserAppAnonymousTrialDryRunAdminPanels',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/anonymous-internal-trial-dry-run-pack.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/anonymous-internal-trial-dry-run-checklist.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/anonymous-internal-trial-dry-run-review.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-9G.md');
    expect(snapshot.knownLimitations.join('\n')).toContain(
      'Phase 9G anonymous internal trial dry run',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 9G dry run');
    expect(snapshot.forbiddenActions.join('\n')).toContain('real user names');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 9J');
    expect(providerHandoff.lastCompletedPhase).toBe('9J');
    expect(providerHandoff.nextRecommendedPhase).toBe('9K');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Anonymous Internal Trial Evidence Round 2 Pack',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-9G.md');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/product/anonymous-internal-trial-dry-run-pack.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'Phase 9K should prepare a conservative second anonymous internal evidence round only',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('9J');
    expect(latestHandoff.toPhase).toBe('9K');
    expect(latestHandoff.nextAction).toContain('Phase 9K');
    expect(latestHandoff.anonymousTrialDryRunDecision.phase9GResult).toContain(
      'anonymous internal trial dry run pack with required scenarios',
    );
    expect(latestHandoff.anonymousTrialDryRunDecision.dryRunBoundary).toContain(
      'anonymous/local/mock rehearsal only',
    );
    expect(latestHandoff.anonymousTrialDryRunDecision.nextPhase).toContain('Phase 9H');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9J');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_9g_dry_run_only',
        'phase_9g_no_sensitive_collection',
        'phase_9g_no_backend_ai_training',
        'phase_9g_no_project_state_user_records',
      ]),
    );
  });
});
