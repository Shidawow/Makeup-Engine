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
  internalTrialEvidenceDecision: {
    phase9EResult: string[];
    evidenceBoundary: string;
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 9E documentation recovery', () => {
  it('documents internal trial evidence pack and 9F handoff without real data collection', () => {
    expect(readText('docs/product/internal-trial-evidence-pack.md')).toContain(
      'Internal Trial Evidence Pack',
    );
    expect(readText('docs/product/trial-evidence-summary.md')).toContain(
      'Trial Evidence Summary',
    );
    expect(readText('docs/product/evidence-sufficiency-gate.md')).toContain(
      'Evidence Sufficiency Gate',
    );
    expect(readText('docs/phases/phase-9E.md')).toContain(
      'Internal Trial Evidence Collection Preparation',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 9J');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 9E completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 9E',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 9F',
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
        'UserAppInternalTrialEvidencePack',
        'UserAppTrialEvidenceSummary',
        'UserAppEvidenceSufficiencyGate',
        'UserAppEvidencePackAdminPanels',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/internal-trial-evidence-pack.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/product/trial-evidence-summary.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/product/evidence-sufficiency-gate.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-9E.md');
    expect(snapshot.knownLimitations.join('\n')).toContain(
      'Phase 9E internal trial evidence pack',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 9E internal trial');
    expect(snapshot.forbiddenActions.join('\n')).toContain('real user names');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 9J');
    expect(providerHandoff.lastCompletedPhase).toBe('9J');
    expect(providerHandoff.nextRecommendedPhase).toBe('9K');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Anonymous Internal Trial Evidence Round 2 Pack',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-9E.md');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/product/internal-trial-evidence-pack.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'Phase 9K should prepare a conservative second anonymous internal evidence round only',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('9J');
    expect(latestHandoff.toPhase).toBe('9K');
    expect(latestHandoff.nextAction).toContain('Phase 9K');
    expect(latestHandoff.internalTrialEvidenceDecision.phase9EResult).toContain(
      'internal trial evidence pack with anonymous/mock/example evidence items and risks',
    );
    expect(latestHandoff.internalTrialEvidenceDecision.evidenceBoundary).toContain(
      'anonymous/mock/example summaries only',
    );
    expect(latestHandoff.internalTrialEvidenceDecision.nextPhase).toContain('Phase 9F');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9J');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_9e_evidence_pack_only',
        'phase_9e_no_sensitive_evidence_data',
        'phase_9e_no_backend_ai_or_runtime_collection',
        'phase_9e_no_training_or_project_state_user_records',
      ]),
    );
  });
});
