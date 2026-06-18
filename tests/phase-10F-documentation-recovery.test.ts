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
  officialUserAppPackageDraftGateDecision: {
    gateBoundary: string;
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
  officialUserAppPackageDraftGateDecision: {
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10F documentation recovery', () => {
  it('documents official draft gate without formal package scope creep', () => {
    expect(readText('docs/product/official-user-app-package-draft-gate.md')).toContain(
      'Official User App Package Draft Gate',
    );
    expect(readText('docs/product/official-user-app-package-draft-gate-handoff.md')).toContain(
      'Official User App Package Draft Gate Handoff',
    );
    expect(readText('docs/phases/phase-10F.md')).toContain(
      'Official User App Package Draft Gate',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10G');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10F completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10F',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10G',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10F');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10F');
    expect(snapshot.currentPhaseId).toBe('10F');
    expect(snapshot.nextRecommendedPhase).toBe('10G');
    expect(snapshot.nextRecommendedPhaseName).toContain('Official UserAppTemplatePackage Draft Builder');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'OfficialUserAppPackageDraftGateResult',
        'OfficialUserAppPackageDraftGateHandoff',
        'OfficialUserAppPackageDraftGatePanel',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/official-user-app-package-draft-gate.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-10F.md');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10F');
    expect(snapshot.knownLimitations.join('\n')).toContain('not formal UserAppTemplatePackage generation');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10F');
    expect(snapshot.officialUserAppPackageDraftGateDecision.gateBoundary).toContain(
      'eligible for a future builder',
    );
    expect(snapshot.officialUserAppPackageDraftGateDecision.validationBoundary).toContain(
      'missing source preview validation',
    );
    expect(snapshot.officialUserAppPackageDraftGateDecision.handoffBoundary).toContain(
      'does not publish',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10F');
    expect(providerHandoff.lastCompletedPhase).toBe('10F');
    expect(providerHandoff.nextRecommendedPhase).toBe('10G');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('Official UserAppTemplatePackage Draft Builder');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10F.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('Official User App Package Draft Gate');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10F');
    expect(latestHandoff.toPhase).toBe('10G');
    expect(latestHandoff.nextAction).toContain('Phase 10G');
    expect(latestHandoff.officialUserAppPackageDraftGateDecision.nextPhase).toContain(
      'Phase 10G',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10F');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10f_gate_only',
        'phase_10f_no_registry_write',
        'phase_10f_no_publish',
        'phase_10f_block_unsafe_payloads',
      ]),
    );
  });
});
