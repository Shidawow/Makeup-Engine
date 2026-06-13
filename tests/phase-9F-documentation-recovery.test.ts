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
  internalTrialEvidenceCollectionDecision: {
    phase9FResult: string[];
    collectionBoundary: string;
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 9F documentation recovery', () => {
  it('documents evidence collection preparation and 9G handoff without real data collection', () => {
    expect(readText('docs/product/internal-trial-evidence-collection-protocol.md')).toContain(
      'Internal Trial Evidence Collection Protocol',
    );
    expect(readText('docs/product/internal-trial-evidence-collection-checklist.md')).toContain(
      'Internal Trial Evidence Collection Checklist',
    );
    expect(readText('docs/product/internal-trial-evidence-quality-gate.md')).toContain(
      'Internal Trial Evidence Quality Gate',
    );
    expect(readText('docs/phases/phase-9F.md')).toContain(
      'Anonymous Internal Trial Dry Run Pack',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 9I');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 9F completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 9F',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 9G',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('9H');
    expect(snapshot.lastCompletedBusinessPhase).toBe('9H');
    expect(snapshot.currentPhaseId).toBe('9H');
    expect(snapshot.nextRecommendedPhase).toBe('9I');
    expect(snapshot.nextRecommendedPhaseName).toContain('Anonymous Internal Trial Evidence Review');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppEvidenceCollectionProtocol',
        'UserAppEvidenceCollectionChecklist',
        'UserAppEvidenceCollectionQualityGate',
        'UserAppEvidenceCollectionAdminPanels',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/internal-trial-evidence-collection-protocol.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/internal-trial-evidence-collection-checklist.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/internal-trial-evidence-quality-gate.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-9F.md');
    expect(snapshot.knownLimitations.join('\n')).toContain(
      'Phase 9F internal trial evidence collection preparation',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 9F evidence collection');
    expect(snapshot.forbiddenActions.join('\n')).toContain('real user names');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 9H');
    expect(providerHandoff.lastCompletedPhase).toBe('9H');
    expect(providerHandoff.nextRecommendedPhase).toBe('9I');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Anonymous Internal Trial Evidence Review',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-9F.md');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/product/internal-trial-evidence-collection-protocol.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'Phase 9G should prepare an anonymous internal trial dry run pack',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('9H');
    expect(latestHandoff.toPhase).toBe('9I');
    expect(latestHandoff.nextAction).toContain('Phase 9I');
    expect(latestHandoff.internalTrialEvidenceCollectionDecision.phase9FResult).toContain(
      'evidence collection protocol with allowed anonymous evidence and forbidden data classifications',
    );
    expect(latestHandoff.internalTrialEvidenceCollectionDecision.collectionBoundary).toContain(
      'anonymous/local preparation only',
    );
    expect(latestHandoff.internalTrialEvidenceCollectionDecision.nextPhase).toContain('Phase 9G');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9H');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_9f_preparation_only',
        'phase_9f_no_sensitive_collection',
        'phase_9f_no_backend_ai_training',
        'phase_9f_no_project_state_user_records',
      ]),
    );
  });
});
