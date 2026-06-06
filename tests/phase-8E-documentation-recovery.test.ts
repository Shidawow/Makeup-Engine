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
  mvpReleaseReadinessDecision: {
    phase8EResult: string[];
    internalTrialBoundary: string;
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 8E documentation recovery', () => {
  it('documents release readiness, go/no-go, and the 9A handoff without production scope', () => {
    expect(readText('docs/user-app/mvp-release-readiness-gate.md')).toContain(
      'MVP Release Readiness Gate',
    );
    expect(readText('docs/user-app/mvp-release-readiness-gate.md')).toContain(
      'not a production release',
    );
    expect(readText('docs/user-app/trial-go-no-go-decision.md')).toContain(
      'go_for_internal_trial',
    );
    expect(readText('docs/user-app/trial-go-no-go-decision.md')).toContain('no_go');
    expect(readText('docs/product/internal-trial-launch-checklist.md')).toContain(
      'Do not collect real names',
    );
    expect(readText('docs/phases/phase-8E.md')).toContain('MVP Release Readiness Gate');
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 9A');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 8E completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 8E',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 9A',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('8E');
    expect(snapshot.lastCompletedBusinessPhase).toBe('8E');
    expect(snapshot.currentPhaseId).toBe('8E');
    expect(snapshot.nextRecommendedPhase).toBe('9A');
    expect(snapshot.nextRecommendedPhaseName).toContain('Internal Trial Operations Pack');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppMvpReleaseReadiness',
        'UserAppTrialGoNoGo',
        'UserAppMvpReleaseReadinessAdminPanels',
        'UserAppInternalTrialLaunchChecklist',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/user-app/mvp-release-readiness-gate.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/user-app/trial-go-no-go-decision.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/product/internal-trial-launch-checklist.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-8E.md');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 8E MVP release readiness');
    expect(snapshot.forbiddenActions.join('\n')).toContain('trial go/no-go');
    expect(snapshot.forbiddenActions.join('\n')).toContain('real user data collection');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 8E');
    expect(providerHandoff.lastCompletedPhase).toBe('8E');
    expect(providerHandoff.nextRecommendedPhase).toBe('9A');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('Internal Trial Operations Pack');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-8E.md');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/user-app/mvp-release-readiness-gate.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'Phase 9A should create internal trial operations materials',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('8E');
    expect(latestHandoff.toPhase).toBe('9A');
    expect(latestHandoff.nextAction).toContain('Phase 9A');
    expect(latestHandoff.mvpReleaseReadinessDecision.phase8EResult).toContain(
      'MVP release readiness report',
    );
    expect(latestHandoff.mvpReleaseReadinessDecision.phase8EResult).toContain(
      'trial go/no-go decision',
    );
    expect(latestHandoff.mvpReleaseReadinessDecision.internalTrialBoundary).toContain(
      'production release remains blocked',
    );
    expect(latestHandoff.mvpReleaseReadinessDecision.nextPhase).toContain('Phase 9A');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('8E');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_8e_release_readiness_gate_only',
        'phase_8e_go_not_production_release',
        'phase_8e_no_runtime_or_data_collection',
        'phase_8e_no_contract_mutation_or_user_records',
      ]),
    );
  });
});
