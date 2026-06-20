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
  realRegistryWriteImplementationGateDecision: {
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
  realRegistryWriteImplementationGateDecision: {
    nextPhase: string;
    boundary: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10N documentation recovery', () => {
  it('documents real registry write implementation gate without implementing writes, publish, or shell replacement', () => {
    expect(
      readText('docs/product/real-registry-write-implementation-gate.md'),
    ).toContain('Real Registry Write Implementation Gate');
    expect(
      readText('docs/product/real-registry-write-implementation-checklist.md'),
    ).toContain('Real Registry Write Implementation Checklist');
    expect(
      readText('docs/product/real-registry-write-implementation-handoff.md'),
    ).toContain('Real Registry Write Implementation Handoff');
    expect(readText('docs/phases/phase-10N.md')).toContain(
      'Real Registry Write Implementation Gate',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10O');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10N completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10N',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10O',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10N');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10N');
    expect(snapshot.currentPhaseId).toBe('10N');
    expect(snapshot.nextRecommendedPhase).toBe('10O');
    expect(snapshot.nextRecommendedPhaseName).toContain('Real Registry Write Implementation Draft');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'RealRegistryWriteImplementationGateResult',
        'RealRegistryWriteImplementationChecklist',
        'RealRegistryWriteImplementationHandoff',
        'RealRegistryWriteImplementationGatePanel',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10N');
    expect(snapshot.knownLimitations.join('\n')).toContain('gate-only');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10N');
    expect(snapshot.forbiddenActions.join('\n')).toContain('real writer implementation');
    expect(
      snapshot.realRegistryWriteImplementationGateDecision.gateBoundary,
    ).toContain('does not implement or execute');
    expect(
      snapshot.realRegistryWriteImplementationGateDecision.checklistBoundary,
    ).toContain('no actual write');
    expect(
      snapshot.realRegistryWriteImplementationGateDecision.handoffBoundary,
    ).toContain('does not authorize execution');
    expect(snapshot.realRegistryWriteImplementationGateDecision.nextPhase).toContain(
      'Phase 10O',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10N');
    expect(providerHandoff.lastCompletedPhase).toBe('10N');
    expect(providerHandoff.nextRecommendedPhase).toBe('10O');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('Real Registry Write Implementation Draft');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10N.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('real registry write implementation gate');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('does not implement or execute registry writes');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10N');
    expect(latestHandoff.toPhase).toBe('10O');
    expect(latestHandoff.nextAction).toContain('Phase 10O');
    expect(
      latestHandoff.realRegistryWriteImplementationGateDecision.nextPhase,
    ).toContain('Phase 10O');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10N');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10n_gate_only',
        'phase_10n_no_actual_registry_write',
        'phase_10n_no_publish',
        'phase_10n_no_shell_package_replacement',
        'phase_10n_no_production_writer',
        'phase_10n_future_owner_authorization_required',
      ]),
    );
  });
});
