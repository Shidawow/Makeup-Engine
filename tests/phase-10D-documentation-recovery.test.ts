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
  candidateToAppPackageContractDecision: {
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
  candidateToAppPackageContractDecision: {
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10D documentation recovery', () => {
  it('documents candidate-to-app contract preparation without app package generation scope creep', () => {
    expect(readText('docs/product/candidate-to-app-package-contract-preparation.md')).toContain(
      'Candidate-to-App Package Contract Preparation',
    );
    expect(readText('docs/product/candidate-to-app-package-validation.md')).toContain(
      'Candidate-to-App Package Validation',
    );
    expect(readText('docs/product/candidate-to-app-package-handoff.md')).toContain(
      'Candidate-to-App Package Handoff',
    );
    expect(readText('docs/phases/phase-10D.md')).toContain(
      'Candidate-to-App Package Contract Preparation',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10E');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10D completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10D',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10E',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10D');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10D');
    expect(snapshot.currentPhaseId).toBe('10D');
    expect(snapshot.nextRecommendedPhase).toBe('10E');
    expect(snapshot.nextRecommendedPhaseName).toContain('User App Package Draft Preview');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'CandidateToAppPackageContractPreparation',
        'CandidateToAppPackageValidationResult',
        'CandidateToAppPackageHandoff',
        'CandidateToAppPackageContractPanel',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/candidate-to-app-package-contract-preparation.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-10D.md');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10D');
    expect(snapshot.knownLimitations.join('\n')).toContain('not formal UserAppTemplatePackage generation');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10D');
    expect(snapshot.candidateToAppPackageContractDecision.preparationBoundary).toContain(
      'mapping preview only',
    );
    expect(snapshot.candidateToAppPackageContractDecision.validationBoundary).toContain(
      'raw image references',
    );
    expect(snapshot.candidateToAppPackageContractDecision.handoffBoundary).toContain(
      'does not publish',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10D');
    expect(providerHandoff.lastCompletedPhase).toBe('10D');
    expect(providerHandoff.nextRecommendedPhase).toBe('10E');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('User App Package Draft Preview');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10D.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('mapping preview only');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10D');
    expect(latestHandoff.toPhase).toBe('10E');
    expect(latestHandoff.nextAction).toContain('Phase 10E');
    expect(latestHandoff.candidateToAppPackageContractDecision.nextPhase).toContain(
      'Phase 10E',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10D');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10d_preview_only',
        'phase_10d_no_registry_write',
        'phase_10d_preserve_trace',
        'phase_10d_block_unsafe_payloads',
      ]),
    );
  });
});
