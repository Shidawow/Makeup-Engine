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
  realWriteExecutionPlanDecision: {
    nextPhase: string;
    boundary: string;
    planBoundary: string;
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
  realWriteExecutionPlanDecision: {
    nextPhase: string;
    boundary: string;
    planBoundary: string;
    handoffBoundary: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10R documentation recovery', () => {
  it('documents real write execution plan without actual write, publish, production writer, or shell replacement', () => {
    expect(readText('docs/product/real-write-execution-plan.md')).toContain(
      'Real Write Execution Plan',
    );
    expect(readText('docs/product/real-write-execution-plan.md')).toContain(
      'execution sequence',
    );
    expect(readText('docs/product/real-write-execution-plan.md')).toContain(
      'preflight',
    );
    expect(readText('docs/product/real-write-execution-plan.md')).toContain(
      'write lock',
    );
    expect(readText('docs/product/real-write-execution-plan.md')).toContain('audit');
    expect(readText('docs/product/real-write-execution-plan.md')).toContain(
      'rollback',
    );
    expect(readText('docs/product/real-write-execution-plan.md')).toContain(
      'failure handling',
    );
    expect(readText('docs/product/real-write-execution-plan.md')).toContain(
      'dry-run verification',
    );
    expect(
      readText('docs/product/real-write-execution-plan-validation.md'),
    ).toContain('Real Write Execution Plan Validation');
    expect(readText('docs/product/real-write-execution-plan-handoff.md')).toContain(
      'Real Write Execution Plan Handoff',
    );
    expect(readText('docs/phases/phase-10R.md')).toContain(
      'Real Write Execution Plan',
    );
    expect(readText('docs/phases/phase-10R.md')).toContain(
      'not actual registry write',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10S');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10R completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10R',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10S',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10Q',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10R',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10R');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10R');
    expect(snapshot.currentPhaseId).toBe('10R');
    expect(snapshot.nextRecommendedPhase).toBe('10S');
    expect(snapshot.nextRecommendedPhaseName).toContain(
      'Guarded Real Write Execution Simulator',
    );
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'RealWriteExecutionPlan',
        'RealWriteExecutionStepPlan',
        'RealWriteExecutionPreflightPlan',
        'RealWriteExecutionLockPlan',
        'RealWriteExecutionAuditPlan',
        'RealWriteExecutionRollbackPlan',
        'RealWriteExecutionFailureHandlingPlan',
        'RealWriteExecutionDryRunVerificationPlan',
        'RealWriteExecutionPlanValidationResult',
        'RealWriteExecutionPlanHandoff',
        'RealWriteExecutionPlanPanel',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10R');
    expect(snapshot.knownLimitations.join('\n')).toContain('execution-plan-only');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10R');
    expect(snapshot.forbiddenActions.join('\n')).toContain('registry write execution');
    expect(snapshot.realWriteExecutionPlanDecision.nextPhase).toContain('Phase 10S');
    expect(snapshot.realWriteExecutionPlanDecision.boundary).toContain(
      'future guarded execution simulator only',
    );
    expect(snapshot.realWriteExecutionPlanDecision.planBoundary).toContain(
      'do not execute writes',
    );
    expect(snapshot.realWriteExecutionPlanDecision.validationBoundary).toContain(
      'not actual registry write readiness',
    );
    expect(snapshot.realWriteExecutionPlanDecision.handoffBoundary).toContain(
      'cannot execute registry writes',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10R');
    expect(providerHandoff.lastCompletedPhase).toBe('10R');
    expect(providerHandoff.nextRecommendedPhase).toBe('10S');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Guarded Real Write Execution Simulator',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10R.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'real write execution plan',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'execution-plan-only',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10R');
    expect(latestHandoff.toPhase).toBe('10S');
    expect(latestHandoff.nextAction).toContain('Phase 10S');
    expect(latestHandoff.realWriteExecutionPlanDecision.nextPhase).toContain(
      'Phase 10S',
    );
    expect(latestHandoff.realWriteExecutionPlanDecision.boundary).toContain(
      'no actual write',
    );
    expect(latestHandoff.realWriteExecutionPlanDecision.planBoundary).toContain(
      'do not execute writes',
    );
    expect(latestHandoff.realWriteExecutionPlanDecision.handoffBoundary).toContain(
      'cannot execute registry writes',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10R');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10r_execution_plan_only',
        'phase_10r_no_actual_registry_write',
        'phase_10r_no_publish',
        'phase_10r_no_shell_package_replacement',
        'phase_10r_no_production_writer',
        'phase_10r_dry_run_only',
        'phase_10r_future_owner_authorization_required',
      ]),
    );
  });
});
