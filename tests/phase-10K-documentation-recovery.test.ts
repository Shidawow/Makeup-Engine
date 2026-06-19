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
  controlledRegistryWriterDraftDecision: {
    draftBoundary: string;
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
  controlledRegistryWriterDraftDecision: {
    nextPhase: string;
    boundary: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10K documentation recovery', () => {
  it('documents controlled registry writer draft without executing writes, publish, or shell replacement', () => {
    expect(
      readText('docs/product/controlled-user-app-template-package-registry-writer-draft.md'),
    ).toContain('Controlled UserAppTemplatePackage Registry Writer Draft');
    expect(
      readText('docs/product/controlled-user-app-template-package-registry-writer-validation.md'),
    ).toContain('Controlled UserAppTemplatePackage Registry Writer Validation');
    expect(
      readText('docs/product/controlled-user-app-template-package-registry-writer-handoff.md'),
    ).toContain('Controlled UserAppTemplatePackage Registry Writer Handoff');
    expect(readText('docs/phases/phase-10K.md')).toContain(
      'Controlled UserAppTemplatePackage Registry Writer Draft',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10L');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10K completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10K',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10L',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10K');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10K');
    expect(snapshot.currentPhaseId).toBe('10K');
    expect(snapshot.nextRecommendedPhase).toBe('10L');
    expect(snapshot.nextRecommendedPhaseName).toContain('Explicit');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'ControlledRegistryWriterDraft',
        'ControlledRegistryWriterValidationResult',
        'ControlledRegistryWriterHandoff',
        'ControlledRegistryWriterDraftPanel',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10K');
    expect(snapshot.knownLimitations.join('\n')).toContain('dry-run');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10K');
    expect(snapshot.forbiddenActions.join('\n')).toContain('actual registry write');
    expect(snapshot.controlledRegistryWriterDraftDecision.draftBoundary).toContain(
      'dry-run',
    );
    expect(snapshot.controlledRegistryWriterDraftDecision.validationBoundary).toContain(
      'does not write registry',
    );
    expect(snapshot.controlledRegistryWriterDraftDecision.handoffBoundary).toContain(
      'does not authorize registry write',
    );
    expect(snapshot.controlledRegistryWriterDraftDecision.nextPhase).toContain(
      'Phase 10L',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10K');
    expect(providerHandoff.lastCompletedPhase).toBe('10K');
    expect(providerHandoff.nextRecommendedPhase).toBe('10L');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('Explicit');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10K.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('dry-run writer draft');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10K');
    expect(latestHandoff.toPhase).toBe('10L');
    expect(latestHandoff.nextAction).toContain('Phase 10L');
    expect(latestHandoff.controlledRegistryWriterDraftDecision.nextPhase).toContain(
      'Phase 10L',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10K');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10k_dry_run_only',
        'phase_10k_no_actual_registry_write',
        'phase_10k_no_publish',
        'phase_10k_no_shell_package_replacement',
        'phase_10k_no_production_package',
      ]),
    );
  });
});
