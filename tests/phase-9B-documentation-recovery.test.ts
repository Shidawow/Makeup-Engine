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
  internalTrialResultReviewDecision: {
    phase9BResult: string[];
    reviewBoundary: string;
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 9B documentation recovery', () => {
  it('documents internal trial result review and the 9C handoff without real data collection', () => {
    expect(readText('docs/product/internal-trial-result-review-framework.md')).toContain(
      'Internal Trial Result Review Framework',
    );
    expect(readText('docs/product/internal-trial-result-review-framework.md')).toContain(
      'not a production analytics system',
    );
    expect(readText('docs/product/internal-trial-issue-taxonomy.md')).toContain(
      'blocked_boundary_issue',
    );
    expect(readText('docs/product/internal-trial-decision-framework.md')).toContain(
      'ready_for_phase_9C',
    );
    expect(readText('docs/phases/phase-9B.md')).toContain(
      'Internal Trial Result Review Framework',
    );
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
    expect(snapshot.lastCompletedPhase).toBe('9D');
    expect(snapshot.lastCompletedBusinessPhase).toBe('9D');
    expect(snapshot.currentPhaseId).toBe('9D');
    expect(snapshot.nextRecommendedPhase).toBe('9E');
    expect(snapshot.nextRecommendedPhaseName).toContain('Internal Trial Evidence Pack');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppTrialResultReview',
        'UserAppTrialIssueTaxonomy',
        'UserAppTrialIssueSummary',
        'UserAppTrialDecisionFramework',
        'UserAppTrialResultReviewAdminPanels',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/internal-trial-result-review-framework.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/internal-trial-issue-taxonomy.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/internal-trial-decision-framework.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-9B.md');
    expect(snapshot.knownLimitations.join('\n')).toContain(
      'Phase 9B internal trial result review',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 9B internal trial');
    expect(snapshot.forbiddenActions.join('\n')).toContain('real user names');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 9D');
    expect(providerHandoff.lastCompletedPhase).toBe('9D');
    expect(providerHandoff.nextRecommendedPhase).toBe('9E');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Internal Trial Evidence Pack',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-9B.md');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/product/internal-trial-result-review-framework.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'Phase 9E should create an internal trial evidence pack',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('9D');
    expect(latestHandoff.toPhase).toBe('9E');
    expect(latestHandoff.nextAction).toContain('Phase 9E');
    expect(latestHandoff.internalTrialResultReviewDecision.phase9BResult).toContain(
      'internal trial result review framework',
    );
    expect(latestHandoff.internalTrialResultReviewDecision.phase9BResult).toContain(
      'issue taxonomy with severity and actionability',
    );
    expect(latestHandoff.internalTrialResultReviewDecision.reviewBoundary).toContain(
      'anonymous/mock/example summaries only',
    );
    expect(latestHandoff.internalTrialResultReviewDecision.nextPhase).toContain(
      'Phase 9C',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9D');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_9b_internal_trial_result_review_only',
        'phase_9b_no_sensitive_review_data',
        'phase_9b_no_backend_ai_or_runtime_collection',
        'phase_9b_no_training_or_project_state_user_records',
      ]),
    );
  });
});
