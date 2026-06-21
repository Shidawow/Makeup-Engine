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
  knownLimitations: string[];
  forbiddenActions: string[];
  guardedSimulatorReviewGateDecision: {
    nextPhase: string;
    boundary: string;
    checklistBoundary: string;
    handoffBoundary: string;
    approvalBoundary: string;
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
  guardedSimulatorReviewGateDecision: {
    nextPhase: string;
    boundary: string;
    handoffBoundary: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10T documentation recovery', () => {
  it('documents guarded simulator review gate without real write, mutation, publish, production writer, or shell replacement', () => {
    expect(readText('docs/product/guarded-simulator-review-gate.md')).toContain(
      'Guarded Simulator Review Gate',
    );
    expect(readText('docs/product/guarded-simulator-review-gate.md')).toContain(
      'simulated preflight reviewed',
    );
    expect(readText('docs/product/guarded-simulator-review-gate.md')).toContain(
      'future actual write requires separate owner approval',
    );
    expect(
      readText('docs/product/guarded-simulator-review-checklist.md'),
    ).toContain('Guarded Simulator Review Checklist');
    expect(readText('docs/product/guarded-simulator-review-handoff.md')).toContain(
      'Guarded Simulator Review Handoff',
    );
    expect(readText('docs/phases/phase-10T.md')).toContain(
      'Guarded Simulator Review Gate',
    );
    expect(readText('docs/phases/phase-10T.md')).toContain(
      'not actual registry write',
    );
    expect(readText('docs/phases/phase-10T.md')).toContain('not registry mutation');
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10U');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10T completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10T',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10U',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10S',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10T',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10T');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10T');
    expect(snapshot.currentPhaseId).toBe('10T');
    expect(snapshot.nextRecommendedPhase).toBe('10U');
    expect(snapshot.nextRecommendedPhaseName).toContain('Real Write Approval Boundary');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'GuardedSimulatorReviewGateResult',
        'GuardedSimulatorReviewGateCheck',
        'GuardedSimulatorReviewGateIssue',
        'GuardedSimulatorReviewGateTrace',
        'GuardedSimulatorReviewChecklist',
        'GuardedSimulatorReviewChecklistItem',
        'GuardedSimulatorReviewRequirement',
        'GuardedSimulatorReviewHandoff',
        'GuardedSimulatorReviewHandoffItem',
        'GuardedSimulatorReviewGatePanel',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10T');
    expect(snapshot.knownLimitations.join('\n')).toContain('review-gate-only');
    expect(snapshot.knownLimitations.join('\n')).toContain('registry mutation');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10T');
    expect(snapshot.forbiddenActions.join('\n')).toContain('registry mutation');
    expect(snapshot.guardedSimulatorReviewGateDecision.nextPhase).toContain(
      'Phase 10U',
    );
    expect(snapshot.guardedSimulatorReviewGateDecision.boundary).toContain(
      'review-gate-only',
    );
    expect(snapshot.guardedSimulatorReviewGateDecision.checklistBoundary).toContain(
      'does not trigger writes',
    );
    expect(snapshot.guardedSimulatorReviewGateDecision.handoffBoundary).toContain(
      'cannot execute registry writes',
    );
    expect(snapshot.guardedSimulatorReviewGateDecision.approvalBoundary).toContain(
      'separate explicit owner authorization',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10T');
    expect(providerHandoff.lastCompletedPhase).toBe('10T');
    expect(providerHandoff.nextRecommendedPhase).toBe('10U');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Real Write Approval Boundary',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/phases/phase-10T.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'guarded simulator review gate',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain('dry-run-only');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10T');
    expect(latestHandoff.toPhase).toBe('10U');
    expect(latestHandoff.nextAction).toContain('Phase 10U');
    expect(latestHandoff.guardedSimulatorReviewGateDecision.nextPhase).toContain(
      'Phase 10U',
    );
    expect(latestHandoff.guardedSimulatorReviewGateDecision.boundary).toContain(
      'no actual write',
    );
    expect(latestHandoff.guardedSimulatorReviewGateDecision.handoffBoundary).toContain(
      'cannot execute registry writes',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10T');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10t_review_gate_only',
        'phase_10t_no_actual_registry_write',
        'phase_10t_no_registry_mutation',
        'phase_10t_no_publish',
        'phase_10t_no_shell_package_replacement',
        'phase_10t_no_production_writer',
        'phase_10t_dry_run_only',
        'phase_10t_future_owner_authorization_required',
      ]),
    );
  });
});
