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
  nextRequiredReadFiles: string[];
  handoffNotes: string[];
}

interface LatestHandoff {
  fromPhase: string;
  toPhase: string;
  nextAction: string;
  trialPackDecision: {
    phase8CResult: string[];
    nextContentGate: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 8C documentation recovery', () => {
  it('documents the local trial pack and 8D handoff without production scope', () => {
    expect(readText('docs/user-app/user-app-mvp-trial-pack.md')).toContain(
      'internal / small-scope MVP trial pack',
    );
    expect(readText('docs/user-app/user-app-mvp-trial-pack.md')).toContain(
      'does not collect real photos',
    );
    expect(readText('docs/user-app/user-app-trial-feedback.md')).toContain(
      'not a backend form',
    );
    expect(readText('docs/user-app/user-app-trial-feedback.md')).toContain(
      'real name',
    );
    expect(readText('docs/user-app/user-app-trial-readiness.md')).toContain(
      'ready_for_internal_trial',
    );
    expect(readText('docs/product/user-app-trial-script.md')).toContain(
      'small-scope',
    );
    expect(readText('docs/product/user-app-feedback-questionnaire.md')).toContain(
      'Do not collect real names',
    );
    expect(readText('docs/phases/phase-8C.md')).toContain(
      'User App MVP Trial Pack',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 8E');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 8C completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 8C',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('9G');
    expect(snapshot.lastCompletedBusinessPhase).toBe('9G');
    expect(snapshot.currentPhaseId).toBe('9G');
    expect(snapshot.nextRecommendedPhase).toBe('9H');
    expect(snapshot.nextRecommendedPhaseName).toContain('Anonymous Internal Trial Launch Pack');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppTrialPack',
        'UserAppTrialFeedbackForm',
        'UserAppTrialFeedbackSummary',
        'UserAppTrialReadiness',
        'UserAppTrialAdminPanels',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-8C.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/user-app/user-app-mvp-trial-pack.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/user-app/user-app-trial-feedback.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/user-app/user-app-trial-readiness.md');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 8C trial pack');
    expect(snapshot.forbiddenActions.join('\n')).toContain('real user trial records');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 9G');
    expect(providerHandoff.lastCompletedPhase).toBe('9G');
    expect(providerHandoff.nextRecommendedPhase).toBe('9H');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-8C.md');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/user-app/user-app-mvp-trial-pack.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain('Phase 8D added template content QA');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('9G');
    expect(latestHandoff.toPhase).toBe('9H');
    expect(latestHandoff.nextAction).toContain('Phase 9H');
    expect(latestHandoff.trialPackDecision.phase8CResult).toContain('ordered local trial tasks');
    expect(latestHandoff.trialPackDecision.phase8CResult).toContain('trial readiness report');
    expect(latestHandoff.trialPackDecision.nextContentGate).toContain('Phase 8D');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9G');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_8c_trial_pack_local_only',
        'phase_8c_feedback_privacy_boundary',
        'phase_8c_no_project_state_user_records',
        'phase_8c_does_not_modify_user_app_template_package',
      ]),
    );
  });
});
