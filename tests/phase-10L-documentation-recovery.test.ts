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
  explicitRegistryWriteAuthorizationGateDecision: {
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
  explicitRegistryWriteAuthorizationGateDecision: {
    nextPhase: string;
    boundary: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10L documentation recovery', () => {
  it('documents explicit registry write authorization gate without executing writes, publish, or shell replacement', () => {
    expect(
      readText('docs/product/explicit-registry-write-authorization-gate.md'),
    ).toContain('Explicit Registry Write Authorization Gate');
    expect(
      readText('docs/product/explicit-registry-write-authorization-checklist.md'),
    ).toContain('Explicit Registry Write Authorization Checklist');
    expect(
      readText('docs/product/explicit-registry-write-authorization-handoff.md'),
    ).toContain('Explicit Registry Write Authorization Handoff');
    expect(readText('docs/phases/phase-10L.md')).toContain(
      'Explicit Registry Write Authorization Gate',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10M');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10L completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10L',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10M',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10L');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10L');
    expect(snapshot.currentPhaseId).toBe('10L');
    expect(snapshot.nextRecommendedPhase).toBe('10M');
    expect(snapshot.nextRecommendedPhaseName).toContain('Controlled Registry Write Execution Design');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'ExplicitRegistryWriteAuthorizationChecklist',
        'ExplicitRegistryWriteAuthorizationGateResult',
        'ExplicitRegistryWriteAuthorizationHandoff',
        'ExplicitRegistryWriteAuthorizationGatePanel',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10L');
    expect(snapshot.knownLimitations.join('\n')).toContain('dry-run');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10L');
    expect(snapshot.forbiddenActions.join('\n')).toContain('actual registry write');
    expect(
      snapshot.explicitRegistryWriteAuthorizationGateDecision.gateBoundary,
    ).toContain('not actual write authorization');
    expect(
      snapshot.explicitRegistryWriteAuthorizationGateDecision.checklistBoundary,
    ).toContain('future owner approval');
    expect(
      snapshot.explicitRegistryWriteAuthorizationGateDecision.handoffBoundary,
    ).toContain('does not execute registry write');
    expect(
      snapshot.explicitRegistryWriteAuthorizationGateDecision.nextPhase,
    ).toContain('Phase 10M');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10L');
    expect(providerHandoff.lastCompletedPhase).toBe('10L');
    expect(providerHandoff.nextRecommendedPhase).toBe('10M');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('Controlled Registry Write Execution Design');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10L.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('explicit authorization gate');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10L');
    expect(latestHandoff.toPhase).toBe('10M');
    expect(latestHandoff.nextAction).toContain('Phase 10M');
    expect(
      latestHandoff.explicitRegistryWriteAuthorizationGateDecision.nextPhase,
    ).toContain('Phase 10M');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10L');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10l_gate_only',
        'phase_10l_no_actual_registry_write',
        'phase_10l_no_publish',
        'phase_10l_no_shell_package_replacement',
        'phase_10l_no_production_package',
        'phase_10l_future_owner_authorization_required',
      ]),
    );
  });
});
