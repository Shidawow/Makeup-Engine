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
  internalTrialLearningDecision: {
    phase9DResult: string[];
    learningBoundary: string;
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 9D documentation recovery', () => {
  it('documents internal trial learning decision gate and 9E handoff without real data collection', () => {
    expect(readText('docs/product/internal-trial-learning-summary.md')).toContain(
      'Internal Trial Learning Summary',
    );
    expect(readText('docs/product/product-decision-gate.md')).toContain(
      'Product Decision Gate',
    );
    expect(readText('docs/product/next-phase-recommendation-framework.md')).toContain(
      'Phase 9E',
    );
    expect(readText('docs/phases/phase-9D.md')).toContain(
      'Internal Trial Evidence Pack',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 9E');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 9D completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 9D',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 9E',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('9E');
    expect(snapshot.lastCompletedBusinessPhase).toBe('9E');
    expect(snapshot.currentPhaseId).toBe('9E');
    expect(snapshot.nextRecommendedPhase).toBe('9F');
    expect(snapshot.nextRecommendedPhaseName).toContain('Internal Trial Evidence Collection Preparation');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppInternalTrialLearningSummary',
        'UserAppProductDecisionGate',
        'UserAppNextPhaseRecommendation',
        'UserAppLearningDecisionAdminPanels',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/internal-trial-learning-summary.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/product/product-decision-gate.md');
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/next-phase-recommendation-framework.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-9D.md');
    expect(snapshot.knownLimitations.join('\n')).toContain(
      'Phase 9D internal trial learning summary',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 9D internal trial');
    expect(snapshot.forbiddenActions.join('\n')).toContain('real user names');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 9E');
    expect(providerHandoff.lastCompletedPhase).toBe('9E');
    expect(providerHandoff.nextRecommendedPhase).toBe('9F');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('Internal Trial Evidence Collection Preparation');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-9D.md');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/product/internal-trial-learning-summary.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'Phase 9F should prepare privacy-safe internal trial evidence collection',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('9E');
    expect(latestHandoff.toPhase).toBe('9F');
    expect(latestHandoff.nextAction).toContain('Phase 9F');
    expect(latestHandoff.internalTrialLearningDecision.phase9DResult).toContain(
      'internal trial learning summary with themes, insights, risks, and status',
    );
    expect(latestHandoff.internalTrialLearningDecision.learningBoundary).toContain(
      'anonymous/mock/example summaries only',
    );
    expect(latestHandoff.internalTrialLearningDecision.nextPhase).toContain('Phase 9E');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9E');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_9d_learning_decision_only',
        'phase_9d_no_sensitive_learning_data',
        'phase_9d_no_backend_ai_or_runtime_collection',
        'phase_9d_no_training_or_project_state_user_records',
      ]),
    );
  });
});
