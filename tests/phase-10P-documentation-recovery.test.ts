import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readText = (path: string): string => readFileSync(path, 'utf8');
const readJson = <T>(path: string): T => JSON.parse(readText(path)) as T;

const ownerAuthorizationText =
  '授权范围：A。只授权进入 Phase 10P 最终真实写入复核闸门，不授权真实写入 registry，不授权发布，不授权替换当前 User App Shell package。';

interface ProjectSnapshot {
  lastCompletedPhase: string;
  lastCompletedBusinessPhase: string;
  currentPhaseId: string;
  nextRecommendedPhase: string;
  nextRecommendedPhaseName: string;
  mainDataFlow: string[];
  knownLimitations: string[];
  forbiddenActions: string[];
  finalRealWriteReviewGateDecision: {
    ownerAuthorizationBoundary: string;
    gateBoundary: string;
    checklistBoundary: string;
    handoffBoundary: string;
    nextPhase: string;
  };
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
  finalRealWriteReviewGateDecision: {
    nextPhase: string;
    boundary: string;
    ownerAuthorizationBoundary: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10P documentation recovery', () => {
  it('documents final real write review gate without actual write authorization, publish, production writer, or shell replacement', () => {
    expect(readText('docs/product/final-real-write-review-gate.md')).toContain(
      'Final Real Write Review Gate',
    );
    expect(readText('docs/product/final-real-write-review-checklist.md')).toContain(
      'Final Real Write Review Checklist',
    );
    expect(readText('docs/product/final-real-write-review-handoff.md')).toContain(
      'Final Real Write Review Handoff',
    );
    expect(readText('docs/phases/phase-10P.md')).toContain('Final Real Write Review Gate');
    expect(readText('docs/product/final-real-write-review-gate.md')).toContain(
      ownerAuthorizationText,
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10Q');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10P completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10P',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10Q',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10O',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10P',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10P');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10P');
    expect(snapshot.currentPhaseId).toBe('10P');
    expect(snapshot.nextRecommendedPhase).toBe('10Q');
    expect(snapshot.nextRecommendedPhaseName).toContain('Real Write Execution Authorization');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'FinalRealWriteReviewChecklist',
        'FinalRealWriteReviewGateResult',
        'FinalRealWriteReviewHandoff',
        'FinalRealWriteReviewGatePanel',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10P');
    expect(snapshot.knownLimitations.join('\n')).toContain('review-gate-only');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10P');
    expect(snapshot.forbiddenActions.join('\n')).toContain('actual registry write authorization');
    expect(snapshot.finalRealWriteReviewGateDecision.ownerAuthorizationBoundary).toContain(
      ownerAuthorizationText,
    );
    expect(snapshot.finalRealWriteReviewGateDecision.gateBoundary).toContain(
      'no actual write',
    );
    expect(snapshot.finalRealWriteReviewGateDecision.checklistBoundary).toContain(
      'owner authorization scope A',
    );
    expect(snapshot.finalRealWriteReviewGateDecision.handoffBoundary).toContain(
      'cannot execute registry writes',
    );
    expect(snapshot.finalRealWriteReviewGateDecision.nextPhase).toContain('Phase 10Q');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10P');
    expect(providerHandoff.lastCompletedPhase).toBe('10P');
    expect(providerHandoff.nextRecommendedPhase).toBe('10Q');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('Real Write Execution Authorization');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10P.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('final real write review gate');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('review-gate-only');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10P');
    expect(latestHandoff.toPhase).toBe('10Q');
    expect(latestHandoff.nextAction).toContain('Phase 10Q');
    expect(latestHandoff.finalRealWriteReviewGateDecision.nextPhase).toContain('Phase 10Q');
    expect(latestHandoff.finalRealWriteReviewGateDecision.ownerAuthorizationBoundary).toContain(
      ownerAuthorizationText,
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10P');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10p_review_gate_only',
        'phase_10p_owner_scope_a_only',
        'phase_10p_no_actual_registry_write',
        'phase_10p_no_publish',
        'phase_10p_no_shell_package_replacement',
        'phase_10p_no_production_writer',
        'phase_10p_future_owner_authorization_required',
      ]),
    );
  });
});
