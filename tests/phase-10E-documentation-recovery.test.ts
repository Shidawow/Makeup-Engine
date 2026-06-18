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
  userAppPackageDraftPreviewDecision: {
    previewBoundary: string;
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
  userAppPackageDraftPreviewDecision: {
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10E documentation recovery', () => {
  it('documents user app package draft preview without formal package scope creep', () => {
    expect(readText('docs/product/user-app-package-draft-preview.md')).toContain(
      'User App Package Draft Preview',
    );
    expect(readText('docs/product/user-app-package-draft-preview-validation.md')).toContain(
      'User App Package Draft Preview Validation',
    );
    expect(readText('docs/product/user-app-package-draft-preview-handoff.md')).toContain(
      'User App Package Draft Preview Handoff',
    );
    expect(readText('docs/phases/phase-10E.md')).toContain(
      'User App Package Draft Preview',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10F');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10E completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10E',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10F',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10E');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10E');
    expect(snapshot.currentPhaseId).toBe('10E');
    expect(snapshot.nextRecommendedPhase).toBe('10F');
    expect(snapshot.nextRecommendedPhaseName).toContain('Official User App Package Draft Gate');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppPackageDraftPreview',
        'UserAppPackageDraftPreviewValidationResult',
        'UserAppPackageDraftPreviewHandoff',
        'UserAppPackageDraftPreviewPanel',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/user-app-package-draft-preview.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-10E.md');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10E');
    expect(snapshot.knownLimitations.join('\n')).toContain('not formal UserAppTemplatePackage generation');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10E');
    expect(snapshot.userAppPackageDraftPreviewDecision.previewBoundary).toContain(
      'draft preview only',
    );
    expect(snapshot.userAppPackageDraftPreviewDecision.validationBoundary).toContain(
      'missing step',
    );
    expect(snapshot.userAppPackageDraftPreviewDecision.handoffBoundary).toContain(
      'does not publish',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10E');
    expect(providerHandoff.lastCompletedPhase).toBe('10E');
    expect(providerHandoff.nextRecommendedPhase).toBe('10F');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('Official User App Package Draft Gate');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10E.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('Draft Preview');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10E');
    expect(latestHandoff.toPhase).toBe('10F');
    expect(latestHandoff.nextAction).toContain('Phase 10F');
    expect(latestHandoff.userAppPackageDraftPreviewDecision.nextPhase).toContain(
      'Phase 10F',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10E');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10e_preview_only',
        'phase_10e_no_registry_write',
        'phase_10e_no_publish',
        'phase_10e_block_unsafe_payloads',
      ]),
    );
  });
});
