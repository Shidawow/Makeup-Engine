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
  userAppTemplatePackageRegistryWriteGateDecision: {
    gateBoundary: string;
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
  userAppTemplatePackageRegistryWriteGateDecision: {
    nextPhase: string;
    boundary: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10J documentation recovery', () => {
  it('documents registry write gate without actual write, publish, or shell replacement scope creep', () => {
    expect(readText('docs/product/user-app-template-package-registry-write-gate.md')).toContain(
      'UserAppTemplatePackage Registry Write Gate',
    );
    expect(
      readText('docs/product/user-app-template-package-registry-write-gate-handoff.md'),
    ).toContain('UserAppTemplatePackage Registry Write Gate Handoff');
    expect(readText('docs/phases/phase-10J.md')).toContain(
      'UserAppTemplatePackage Registry Write Gate',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10K');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10J completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10J',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10K',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10J');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10J');
    expect(snapshot.currentPhaseId).toBe('10J');
    expect(snapshot.nextRecommendedPhase).toBe('10K');
    expect(snapshot.nextRecommendedPhaseName).toContain('Controlled');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppTemplatePackageRegistryWriteGateResult',
        'UserAppTemplatePackageRegistryWriteGateHandoff',
        'UserAppTemplatePackageRegistryWriteGatePanel',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10J');
    expect(snapshot.knownLimitations.join('\n')).toContain('future controlled registry writer');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10J');
    expect(snapshot.userAppTemplatePackageRegistryWriteGateDecision.gateBoundary).toContain(
      'does not write registry',
    );
    expect(snapshot.userAppTemplatePackageRegistryWriteGateDecision.handoffBoundary).toContain(
      'does not write registry',
    );
    expect(snapshot.userAppTemplatePackageRegistryWriteGateDecision.nextPhase).toContain(
      'Phase 10K',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10J');
    expect(providerHandoff.lastCompletedPhase).toBe('10J');
    expect(providerHandoff.nextRecommendedPhase).toBe('10K');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('Controlled');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10J.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('registry write gate');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10J');
    expect(latestHandoff.toPhase).toBe('10K');
    expect(latestHandoff.nextAction).toContain('Phase 10K');
    expect(latestHandoff.userAppTemplatePackageRegistryWriteGateDecision.nextPhase).toContain(
      'Phase 10K',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10J');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10j_gate_only',
        'phase_10j_no_actual_registry_write',
        'phase_10j_no_publish',
        'phase_10j_no_shell_package_replacement',
        'phase_10j_no_production_package',
      ]),
    );
  });
});
