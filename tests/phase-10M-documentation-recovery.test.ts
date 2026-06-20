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
  controlledRegistryWriteExecutionDesignDecision: {
    designBoundary: string;
    validationBoundary: string;
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
  controlledRegistryWriteExecutionDesignDecision: {
    nextPhase: string;
    boundary: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10M documentation recovery', () => {
  it('documents controlled registry write execution design without executing writes, publish, or shell replacement', () => {
    expect(
      readText('docs/product/controlled-registry-write-execution-design.md'),
    ).toContain('Controlled Registry Write Execution Design');
    expect(
      readText('docs/product/controlled-registry-write-execution-validation.md'),
    ).toContain('Controlled Registry Write Execution Validation');
    expect(
      readText('docs/product/controlled-registry-write-execution-handoff.md'),
    ).toContain('Controlled Registry Write Execution Handoff');
    expect(readText('docs/phases/phase-10M.md')).toContain(
      'Controlled Registry Write Execution Design',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10N');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10M completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10M',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10N',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10M');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10M');
    expect(snapshot.currentPhaseId).toBe('10M');
    expect(snapshot.nextRecommendedPhase).toBe('10N');
    expect(snapshot.nextRecommendedPhaseName).toContain('Real Registry Write Implementation Gate');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'ControlledRegistryWriteExecutionDesign',
        'ControlledRegistryWriteExecutionValidationResult',
        'ControlledRegistryWriteExecutionHandoff',
        'ControlledRegistryWriteExecutionDesignPanel',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10M');
    expect(snapshot.knownLimitations.join('\n')).toContain('design/dry-run');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10M');
    expect(snapshot.forbiddenActions.join('\n')).toContain('actual write authorization');
    expect(
      snapshot.controlledRegistryWriteExecutionDesignDecision.designBoundary,
    ).toContain('does not write registry');
    expect(
      snapshot.controlledRegistryWriteExecutionDesignDecision.validationBoundary,
    ).toContain('dryRunOnly');
    expect(
      snapshot.controlledRegistryWriteExecutionDesignDecision.handoffBoundary,
    ).toContain('does not authorize execution');
    expect(
      snapshot.controlledRegistryWriteExecutionDesignDecision.nextPhase,
    ).toContain('Phase 10N');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10M');
    expect(providerHandoff.lastCompletedPhase).toBe('10M');
    expect(providerHandoff.nextRecommendedPhase).toBe('10N');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('Real Registry Write Implementation Gate');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10M.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('controlled registry write execution design');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('does not execute registry writes');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10M');
    expect(latestHandoff.toPhase).toBe('10N');
    expect(latestHandoff.nextAction).toContain('Phase 10N');
    expect(
      latestHandoff.controlledRegistryWriteExecutionDesignDecision.nextPhase,
    ).toContain('Phase 10N');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10M');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10m_design_only',
        'phase_10m_no_actual_registry_write',
        'phase_10m_no_publish',
        'phase_10m_no_shell_package_replacement',
        'phase_10m_no_production_package',
        'phase_10m_future_owner_authorization_required',
      ]),
    );
  });
});
