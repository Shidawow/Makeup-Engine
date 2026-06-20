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
  realRegistryWriteImplementationDraftDecision: {
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
  realRegistryWriteImplementationDraftDecision: {
    nextPhase: string;
    boundary: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10O documentation recovery', () => {
  it('documents real registry write implementation draft without writing, publishing, production writer, or shell replacement', () => {
    expect(
      readText('docs/product/real-registry-write-implementation-draft.md'),
    ).toContain('Real Registry Write Implementation Draft');
    expect(
      readText('docs/product/real-registry-write-implementation-draft-validation.md'),
    ).toContain('Real Registry Write Implementation Draft Validation');
    expect(
      readText('docs/product/real-registry-write-implementation-draft-handoff.md'),
    ).toContain('Real Registry Write Implementation Draft Handoff');
    expect(readText('docs/phases/phase-10O.md')).toContain(
      'Real Registry Write Implementation Draft',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10P');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10O completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10O',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10P',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10O');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10O');
    expect(snapshot.currentPhaseId).toBe('10O');
    expect(snapshot.nextRecommendedPhase).toBe('10P');
    expect(snapshot.nextRecommendedPhaseName).toContain('Final Real Write Review Gate');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'RealRegistryWriteImplementationDraft',
        'RealRegistryWriteWriterInterfaceDraft',
        'RealRegistryWriteTransactionDraft',
        'RealRegistryWriteLockDraft',
        'RealRegistryWriteAuditEventDraft',
        'RealRegistryWriteRollbackCommandDraft',
        'RealRegistryWriteImplementationDraftValidationResult',
        'RealRegistryWriteImplementationDraftHandoff',
        'RealRegistryWriteImplementationDraftPanel',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10O');
    expect(snapshot.knownLimitations.join('\n')).toContain('draft-only');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10O');
    expect(snapshot.forbiddenActions.join('\n')).toContain('production writer readiness');
    expect(
      snapshot.realRegistryWriteImplementationDraftDecision.draftBoundary,
    ).toContain('does not execute a writer');
    expect(
      snapshot.realRegistryWriteImplementationDraftDecision.validationBoundary,
    ).toContain('no actual write');
    expect(
      snapshot.realRegistryWriteImplementationDraftDecision.handoffBoundary,
    ).toContain('does not authorize execution');
    expect(snapshot.realRegistryWriteImplementationDraftDecision.nextPhase).toContain(
      'Phase 10P',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10O');
    expect(providerHandoff.lastCompletedPhase).toBe('10O');
    expect(providerHandoff.nextRecommendedPhase).toBe('10P');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('Final Real Write Review Gate');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10O.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('real registry write implementation draft');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('does not execute registry writes');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10O');
    expect(latestHandoff.toPhase).toBe('10P');
    expect(latestHandoff.nextAction).toContain('Phase 10P');
    expect(
      latestHandoff.realRegistryWriteImplementationDraftDecision.nextPhase,
    ).toContain('Phase 10P');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10O');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10o_draft_only',
        'phase_10o_no_actual_registry_write',
        'phase_10o_no_publish',
        'phase_10o_no_shell_package_replacement',
        'phase_10o_no_production_writer',
        'phase_10o_future_owner_authorization_required',
      ]),
    );
  });
});
