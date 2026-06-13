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
  anonymousTrialLaunchDecision: {
    phase9HResult: string[];
    launchBoundary: string;
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 9H documentation recovery', () => {
  it('documents anonymous launch pack and 9I handoff without sensitive data collection', () => {
    expect(readText('docs/product/anonymous-internal-trial-launch-pack.md')).toContain(
      'Anonymous Internal Trial Launch Pack',
    );
    expect(readText('docs/product/anonymous-internal-trial-launch-readiness.md')).toContain(
      'Anonymous Internal Trial Launch Readiness',
    );
    expect(readText('docs/product/anonymous-internal-trial-post-launch-handoff.md')).toContain(
      'Anonymous Internal Trial Post-Launch Handoff',
    );
    expect(readText('docs/phases/phase-9H.md')).toContain(
      'Anonymous Internal Trial Evidence Review',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 9I');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 9H completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 9H',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 9I',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('9H');
    expect(snapshot.lastCompletedBusinessPhase).toBe('9H');
    expect(snapshot.currentPhaseId).toBe('9H');
    expect(snapshot.nextRecommendedPhase).toBe('9I');
    expect(snapshot.nextRecommendedPhaseName).toContain(
      'Anonymous Internal Trial Evidence Review',
    );
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppAnonymousTrialLaunchPack',
        'UserAppAnonymousTrialLaunchReadiness',
        'UserAppAnonymousTrialPostLaunchHandoff',
        'UserAppAnonymousTrialLaunchAdminPanels',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/anonymous-internal-trial-launch-pack.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/anonymous-internal-trial-launch-readiness.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/anonymous-internal-trial-post-launch-handoff.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-9H.md');
    expect(snapshot.knownLimitations.join('\n')).toContain(
      'Phase 9H anonymous internal trial launch pack',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 9H launch');
    expect(snapshot.forbiddenActions.join('\n')).toContain('real user names');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 9H');
    expect(providerHandoff.lastCompletedPhase).toBe('9H');
    expect(providerHandoff.nextRecommendedPhase).toBe('9I');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Anonymous Internal Trial Evidence Review',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-9H.md');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/product/anonymous-internal-trial-launch-pack.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'Phase 9I should review anonymous internal trial evidence only',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('9H');
    expect(latestHandoff.toPhase).toBe('9I');
    expect(latestHandoff.nextAction).toContain('Phase 9I');
    expect(latestHandoff.anonymousTrialLaunchDecision.phase9HResult).toContain(
      'anonymous internal trial launch pack with scope, participant notice, admin script, evidence capture sheet, forbidden data requests, and stop conditions',
    );
    expect(latestHandoff.anonymousTrialLaunchDecision.launchBoundary).toContain(
      'anonymous/internal/local/non-public launch preparation only',
    );
    expect(latestHandoff.anonymousTrialLaunchDecision.nextPhase).toContain('Phase 9I');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9H');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_9h_launch_preparation_only',
        'phase_9h_no_sensitive_collection',
        'phase_9h_no_backend_ai_training',
        'phase_9h_no_project_state_user_records',
      ]),
    );
  });
});
