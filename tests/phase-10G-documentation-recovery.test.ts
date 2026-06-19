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
  recoveryEntryFiles: string[];
  knownLimitations: string[];
  forbiddenActions: string[];
  officialUserAppTemplatePackageDraftBuilderDecision: {
    builderBoundary: string;
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
  officialUserAppTemplatePackageDraftBuilderDecision: {
    nextPhase: string;
    boundary: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10G documentation recovery', () => {
  it('documents official draft builder without publish or registry scope creep', () => {
    expect(readText('docs/product/official-user-app-template-package-draft-builder.md')).toContain(
      'Official UserAppTemplatePackage Draft Builder',
    );
    expect(readText('docs/product/official-user-app-template-package-draft-validation.md')).toContain(
      'Official UserAppTemplatePackage Draft Validation',
    );
    expect(readText('docs/product/official-user-app-template-package-draft-handoff.md')).toContain(
      'Official UserAppTemplatePackage Draft Handoff',
    );
    expect(readText('docs/phases/phase-10G.md')).toContain(
      'Official UserAppTemplatePackage Draft Builder',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10H');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10G completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10G',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10H',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10G');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10G');
    expect(snapshot.currentPhaseId).toBe('10G');
    expect(snapshot.nextRecommendedPhase).toBe('10H');
    expect(snapshot.nextRecommendedPhaseName).toContain('Draft Publish Gate');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'OfficialUserAppTemplatePackageDraft',
        'OfficialUserAppTemplatePackageDraftBuilderResult',
        'OfficialUserAppTemplatePackageDraftValidationResult',
        'OfficialUserAppTemplatePackageDraftHandoff',
        'OfficialUserAppTemplatePackageDraftBuilderPanel',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/official-user-app-template-package-draft-builder.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-10G.md');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10G');
    expect(snapshot.knownLimitations.join('\n')).toContain('draft-only');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10G');
    expect(snapshot.officialUserAppTemplatePackageDraftBuilderDecision.builderBoundary).toContain(
      'draft',
    );
    expect(snapshot.officialUserAppTemplatePackageDraftBuilderDecision.validationBoundary).toContain(
      'not publication readiness',
    );
    expect(snapshot.officialUserAppTemplatePackageDraftBuilderDecision.handoffBoundary).toContain(
      'does not publish',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10G');
    expect(providerHandoff.lastCompletedPhase).toBe('10G');
    expect(providerHandoff.nextRecommendedPhase).toBe('10H');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('Draft Publish Gate');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10G.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('official UserAppTemplatePackage draft builder');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10G');
    expect(latestHandoff.toPhase).toBe('10H');
    expect(latestHandoff.nextAction).toContain('Phase 10H');
    expect(latestHandoff.officialUserAppTemplatePackageDraftBuilderDecision.nextPhase).toContain(
      'Phase 10H',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10G');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10g_draft_only',
        'phase_10g_no_registry_write',
        'phase_10g_no_publish',
        'phase_10g_no_shell_package_replacement',
      ]),
    );
  });
});
