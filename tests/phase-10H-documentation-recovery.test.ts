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
  recoveryEntryFiles?: string[];
  knownLimitations: string[];
  forbiddenActions: string[];
  userAppTemplatePackageDraftPublishGateDecision: {
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
  userAppTemplatePackageDraftPublishGateDecision: {
    nextPhase: string;
    boundary: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10H documentation recovery', () => {
  it('documents draft publish gate without publication or registry scope creep', () => {
    expect(readText('docs/product/user-app-template-package-draft-publish-gate.md')).toContain(
      'UserAppTemplatePackage Draft Publish Gate',
    );
    expect(readText('docs/product/user-app-template-package-draft-publish-gate-handoff.md')).toContain(
      'UserAppTemplatePackage Draft Publish Gate Handoff',
    );
    expect(readText('docs/phases/phase-10H.md')).toContain(
      'UserAppTemplatePackage Draft Publish Gate',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10I');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10H completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10H',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10I',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10H');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10H');
    expect(snapshot.currentPhaseId).toBe('10H');
    expect(snapshot.nextRecommendedPhase).toBe('10I');
    expect(snapshot.nextRecommendedPhaseName).toContain('Registry Preparation');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppTemplatePackageDraftPublishGateResult',
        'UserAppTemplatePackageDraftPublishGateHandoff',
        'UserAppTemplatePackageDraftPublishGatePanel',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10H');
    expect(snapshot.knownLimitations.join('\n')).toContain('future registry preparation');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10H');
    expect(snapshot.userAppTemplatePackageDraftPublishGateDecision.gateBoundary).toContain(
      'future registry preparation',
    );
    expect(snapshot.userAppTemplatePackageDraftPublishGateDecision.validationBoundary).toContain(
      'registry write',
    );
    expect(snapshot.userAppTemplatePackageDraftPublishGateDecision.handoffBoundary).toContain(
      'does not publish',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10H');
    expect(providerHandoff.lastCompletedPhase).toBe('10H');
    expect(providerHandoff.nextRecommendedPhase).toBe('10I');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('Registry Preparation');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10H.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('draft publish gate');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10H');
    expect(latestHandoff.toPhase).toBe('10I');
    expect(latestHandoff.nextAction).toContain('Phase 10I');
    expect(latestHandoff.userAppTemplatePackageDraftPublishGateDecision.nextPhase).toContain(
      'Phase 10I',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10H');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10h_gate_only',
        'phase_10h_no_registry_write',
        'phase_10h_no_publish',
        'phase_10h_no_shell_package_replacement',
        'phase_10h_no_production_readiness',
      ]),
    );
  });
});
