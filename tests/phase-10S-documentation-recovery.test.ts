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
  guardedRealWriteExecutionSimulatorDecision: {
    nextPhase: string;
    boundary: string;
    simulationBoundary: string;
    validationBoundary: string;
    handoffBoundary: string;
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
  guardedRealWriteExecutionSimulatorDecision: {
    nextPhase: string;
    boundary: string;
    simulationBoundary: string;
    handoffBoundary: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10S documentation recovery', () => {
  it('documents guarded real write execution simulator without real write, mutation, publish, production writer, or shell replacement', () => {
    expect(
      readText('docs/product/guarded-real-write-execution-simulator.md'),
    ).toContain('Guarded Real Write Execution Simulator');
    expect(
      readText('docs/product/guarded-real-write-execution-simulator.md'),
    ).toContain('simulated preflight');
    expect(
      readText('docs/product/guarded-real-write-execution-simulator.md'),
    ).toContain('simulated write lock');
    expect(
      readText('docs/product/guarded-real-write-execution-simulator.md'),
    ).toContain('simulated write operation');
    expect(
      readText('docs/product/guarded-real-write-execution-simulator.md'),
    ).toContain('simulated audit events');
    expect(
      readText('docs/product/guarded-real-write-execution-simulator.md'),
    ).toContain('simulated rollback');
    expect(
      readText('docs/product/guarded-real-write-execution-simulator.md'),
    ).toContain('simulated failure handling');
    expect(
      readText('docs/product/guarded-real-write-execution-simulator-validation.md'),
    ).toContain('Guarded Real Write Execution Simulator Validation');
    expect(
      readText('docs/product/guarded-real-write-execution-simulator-handoff.md'),
    ).toContain('Guarded Real Write Execution Simulator Handoff');
    expect(readText('docs/phases/phase-10S.md')).toContain(
      'Guarded Real Write Execution Simulator',
    );
    expect(readText('docs/phases/phase-10S.md')).toContain(
      'not actual registry write',
    );
    expect(readText('docs/phases/phase-10S.md')).toContain('not registry mutation');
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10T');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10S completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10S',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10T',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10R',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10S',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10S');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10S');
    expect(snapshot.currentPhaseId).toBe('10S');
    expect(snapshot.nextRecommendedPhase).toBe('10T');
    expect(snapshot.nextRecommendedPhaseName).toContain(
      'Guarded Simulator Review Gate',
    );
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'GuardedRealWriteExecutionSimulator',
        'GuardedRealWriteExecutionSimulationSource',
        'GuardedRealWriteSimulationRun',
        'GuardedRealWriteSimulationStep',
        'GuardedRealWriteSimulationPreflightResult',
        'GuardedRealWriteSimulationLockResult',
        'GuardedRealWriteSimulationAuditEvent',
        'GuardedRealWriteSimulationRollbackResult',
        'GuardedRealWriteSimulationFailureHandlingResult',
        'GuardedRealWriteExecutionSimulatorValidationResult',
        'GuardedRealWriteExecutionSimulatorHandoff',
        'GuardedRealWriteExecutionSimulatorPanel',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10S');
    expect(snapshot.knownLimitations.join('\n')).toContain('simulator-only');
    expect(snapshot.knownLimitations.join('\n')).toContain('registry mutation');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10S');
    expect(snapshot.forbiddenActions.join('\n')).toContain('registry mutation');
    expect(snapshot.guardedRealWriteExecutionSimulatorDecision.nextPhase).toContain(
      'Phase 10T',
    );
    expect(snapshot.guardedRealWriteExecutionSimulatorDecision.boundary).toContain(
      'simulator-only',
    );
    expect(
      snapshot.guardedRealWriteExecutionSimulatorDecision.simulationBoundary,
    ).toContain('do not execute writes');
    expect(
      snapshot.guardedRealWriteExecutionSimulatorDecision.validationBoundary,
    ).toContain('not actual registry write readiness');
    expect(
      snapshot.guardedRealWriteExecutionSimulatorDecision.handoffBoundary,
    ).toContain('cannot execute registry writes');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10S');
    expect(providerHandoff.lastCompletedPhase).toBe('10S');
    expect(providerHandoff.nextRecommendedPhase).toBe('10T');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Guarded Simulator Review Gate',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/phases/phase-10S.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'guarded real write execution simulator',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain('dry-run-only');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10S');
    expect(latestHandoff.toPhase).toBe('10T');
    expect(latestHandoff.nextAction).toContain('Phase 10T');
    expect(
      latestHandoff.guardedRealWriteExecutionSimulatorDecision.nextPhase,
    ).toContain('Phase 10T');
    expect(
      latestHandoff.guardedRealWriteExecutionSimulatorDecision.boundary,
    ).toContain('no actual write');
    expect(
      latestHandoff.guardedRealWriteExecutionSimulatorDecision.simulationBoundary,
    ).toContain('do not execute writes');
    expect(
      latestHandoff.guardedRealWriteExecutionSimulatorDecision.handoffBoundary,
    ).toContain('cannot execute registry writes');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10S');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10s_simulator_only',
        'phase_10s_no_actual_registry_write',
        'phase_10s_no_registry_mutation',
        'phase_10s_no_publish',
        'phase_10s_no_shell_package_replacement',
        'phase_10s_no_production_writer',
        'phase_10s_dry_run_only',
        'phase_10s_future_owner_authorization_required',
      ]),
    );
  });
});
