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
  faceMeshMakeupIntelligenceDecision: {
    phase10AResult: string[];
    draftBoundary: string;
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
  faceMeshMakeupIntelligenceDecision: {
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10A documentation recovery', () => {
  it('documents FaceMesh intelligence baseline and 10B handoff without production scope creep', () => {
    expect(readText('docs/product/facemesh-region-qa-baseline.md')).toContain(
      'FaceMesh Region QA Baseline',
    );
    expect(readText('docs/product/makeup-attribute-candidate-baseline.md')).toContain(
      'Makeup Attribute Candidate Baseline',
    );
    expect(readText('docs/product/rule-based-template-draft-baseline.md')).toContain(
      'Rule-based Template Draft Baseline',
    );
    expect(readText('docs/phases/phase-10A.md')).toContain(
      'FaceMesh-driven Makeup Intelligence Baseline',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10C');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain('Phase 10B completed');
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain('lastCompletedPhase: 10B');
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain('nextRecommendedPhase: 10C');

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10B');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10B');
    expect(snapshot.currentPhaseId).toBe('10B');
    expect(snapshot.nextRecommendedPhase).toBe('10C');
    expect(snapshot.nextRecommendedPhaseName).toContain('Template Library Candidate Packaging');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'FaceMeshRegionQaReport',
        'MakeupAttributeCandidateReport',
        'RuleBasedStepSequence',
        'MakeupTemplateDraftReport',
        'FaceMeshMakeupIntelligenceAdminPanel',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/product/facemesh-region-qa-baseline.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-10A.md');
    expect(snapshot.knownLimitations.join('\n')).toContain('candidate/draft-only');
    expect(snapshot.forbiddenActions.join('\n')).toContain('public/mediapipe');
    expect(snapshot.faceMeshMakeupIntelligenceDecision.phase10AResult).toContain(
      'FaceMesh region QA report with coverage, confidence, crop risk, and blocking checks',
    );
    expect(snapshot.faceMeshMakeupIntelligenceDecision.draftBoundary).toContain(
      'candidate/draft-only',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10B');
    expect(providerHandoff.lastCompletedPhase).toBe('10B');
    expect(providerHandoff.nextRecommendedPhase).toBe('10C');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('Template Library Candidate Packaging');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10A.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'Phase 10B completed draft QA',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10B');
    expect(latestHandoff.toPhase).toBe('10C');
    expect(latestHandoff.nextAction).toContain('Phase 10C');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10B');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10a_candidate_draft_only',
        'phase_10a_no_auto_publish',
        'phase_10a_no_backend_camera_ar_ai_training',
        'phase_10a_no_mediapipe_asset_commit',
      ]),
    );
  });
});
