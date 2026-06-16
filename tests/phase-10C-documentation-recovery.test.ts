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
  templateLibraryCandidatePackagingDecision: {
    packageBoundary: string;
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
  templateLibraryCandidatePackagingDecision: {
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10C documentation recovery', () => {
  it('documents candidate packaging without publish or app package scope creep', () => {
    expect(readText('docs/product/template-library-candidate-package.md')).toContain(
      'Template Library Candidate Package',
    );
    expect(readText('docs/product/template-library-candidate-validation.md')).toContain(
      'Template Library Candidate Validation',
    );
    expect(readText('docs/product/template-library-candidate-handoff.md')).toContain(
      'Template Library Candidate Handoff',
    );
    expect(readText('docs/phases/phase-10C.md')).toContain(
      'Template Library Candidate Packaging',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10D');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10C completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10C',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10D',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10C');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10C');
    expect(snapshot.currentPhaseId).toBe('10C');
    expect(snapshot.nextRecommendedPhase).toBe('10D');
    expect(snapshot.nextRecommendedPhaseName).toContain('Candidate-to-App Package Contract Preparation');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'TemplateLibraryCandidatePackage',
        'TemplateLibraryCandidateValidationResult',
        'TemplateLibraryCandidateHandoff',
        'TemplateLibraryCandidatePackagingPanel',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/template-library-candidate-package.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-10C.md');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10C');
    expect(snapshot.knownLimitations.join('\n')).toContain('not published templates');
    expect(snapshot.forbiddenActions.join('\n')).toContain('UserAppTemplatePackage');
    expect(snapshot.templateLibraryCandidatePackagingDecision.packageBoundary).toContain(
      'not a published template',
    );
    expect(snapshot.templateLibraryCandidatePackagingDecision.validationBoundary).toContain(
      'raw image references',
    );
    expect(snapshot.templateLibraryCandidatePackagingDecision.handoffBoundary).toContain(
      'does not write formal Template Library',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10C');
    expect(providerHandoff.lastCompletedPhase).toBe('10C');
    expect(providerHandoff.nextRecommendedPhase).toBe('10D');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Candidate-to-App Package Contract Preparation',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10C.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('Candidate Package');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10C');
    expect(latestHandoff.toPhase).toBe('10D');
    expect(latestHandoff.nextAction).toContain('Phase 10D');
    expect(latestHandoff.templateLibraryCandidatePackagingDecision.nextPhase).toContain(
      'Phase 10D',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10C');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10c_candidate_only',
        'phase_10c_no_formal_library_write',
        'phase_10c_no_user_app_package_auto_generation',
        'phase_10c_block_unsafe_payloads',
      ]),
    );
  });
});
