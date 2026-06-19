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
  userAppTemplatePackageRegistryPreparationDecision: {
    preparationBoundary: string;
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
  userAppTemplatePackageRegistryPreparationDecision: {
    nextPhase: string;
    boundary: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10I documentation recovery', () => {
  it('documents registry preparation without write, publish, or shell replacement scope creep', () => {
    expect(
      readText('docs/product/user-app-template-package-registry-preparation.md'),
    ).toContain('UserAppTemplatePackage Registry Preparation');
    expect(
      readText('docs/product/user-app-template-package-registry-preparation-validation.md'),
    ).toContain('UserAppTemplatePackage Registry Preparation Validation');
    expect(
      readText('docs/product/user-app-template-package-registry-preparation-handoff.md'),
    ).toContain('UserAppTemplatePackage Registry Preparation Handoff');
    expect(readText('docs/phases/phase-10I.md')).toContain(
      'UserAppTemplatePackage Registry Preparation',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10J');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10I completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10I',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10J',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10I');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10I');
    expect(snapshot.currentPhaseId).toBe('10I');
    expect(snapshot.nextRecommendedPhase).toBe('10J');
    expect(snapshot.nextRecommendedPhaseName).toContain('Registry Write Gate');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppTemplatePackageRegistryPreparation',
        'UserAppTemplatePackageRegistryPreparationValidationResult',
        'UserAppTemplatePackageRegistryPreparationHandoff',
        'UserAppTemplatePackageRegistryPreparationPanel',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10I');
    expect(snapshot.knownLimitations.join('\n')).toContain('future registry write gate');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10I');
    expect(
      snapshot.userAppTemplatePackageRegistryPreparationDecision.preparationBoundary,
    ).toContain('future registry write gate');
    expect(
      snapshot.userAppTemplatePackageRegistryPreparationDecision.validationBoundary,
    ).toContain('actual registry write');
    expect(
      snapshot.userAppTemplatePackageRegistryPreparationDecision.handoffBoundary,
    ).toContain('does not write registry');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10I');
    expect(providerHandoff.lastCompletedPhase).toBe('10I');
    expect(providerHandoff.nextRecommendedPhase).toBe('10J');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('Registry Write Gate');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10I.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('registry preparation');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10I');
    expect(latestHandoff.toPhase).toBe('10J');
    expect(latestHandoff.nextAction).toContain('Phase 10J');
    expect(
      latestHandoff.userAppTemplatePackageRegistryPreparationDecision.nextPhase,
    ).toContain('Phase 10J');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10I');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10i_preparation_only',
        'phase_10i_no_actual_registry_write',
        'phase_10i_no_publish',
        'phase_10i_no_shell_package_replacement',
        'phase_10i_no_production_readiness',
      ]),
    );
  });
});
