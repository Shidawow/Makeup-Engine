import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readText = (path: string): string => readFileSync(path, 'utf8');
const readJson = <T>(path: string): T => JSON.parse(readText(path)) as T;

interface ProjectSnapshot {
  lastCompletedPhase: string;
  nextRecommendedPhase: string;
  mainDataFlow: string[];
  recoveryEntryFiles: string[];
  forbiddenActions: string[];
}

interface ProviderHandoff {
  lastCompletedPhase: string;
  nextRecommendedPhase: string;
  nextRequiredReadFiles: string[];
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 7G documentation recovery', () => {
  it('documents app readiness and advances recovery state to 7H', () => {
    expect(readText('START_HERE.md')).toContain('Phase 7G');
    expect(readText('docs/user-app/user-app-mobile-interaction-qa.md')).toContain(
      'User App Mobile Interaction QA',
    );
    expect(readText('docs/user-app/user-app-readiness-gate.md')).toContain(
      'User App Readiness Gate',
    );
    expect(readText('docs/user-app/user-app-readiness-checklist.md')).toContain(
      'User App Readiness Checklist',
    );
    expect(readText('docs/phases/phase-7G.md')).toContain(
      'User App Mobile Interaction QA / App Readiness Gate',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 7H');
    expect(readText('docs/architecture/CURRENT_ARCHITECTURE.md')).toContain(
      'Phase 7G Additions',
    );
    expect(readText('docs/architecture/DATA_FLOW.md')).toContain(
      'User App Mobile QA / App Readiness Gate',
    );
    expect(readText('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md')).toContain(
      'app readiness gate is required',
    );
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 8A completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 8A',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('9H');
    expect(snapshot.nextRecommendedPhase).toBe('9I');
    expect(snapshot.mainDataFlow).toContain('UserAppMobileQa');
    expect(snapshot.mainDataFlow).toContain('UserAppReadinessGate');
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-7G.md');
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/user-app/user-app-readiness-gate.md',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('readiness');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.lastCompletedPhase).toBe('9H');
    expect(providerHandoff.nextRecommendedPhase).toBe('9I');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-7G.md');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9H');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'app_readiness_gate_required_before_production_app',
        'mobile_interaction_qa_required',
        'readiness_gate_not_production_app',
        'no_backend_in_readiness_gate',
        'no_camera_in_readiness_gate',
        'no_ar_in_readiness_gate',
        'no_training_in_readiness_gate',
        'no_new_runtime_dependency_without_approval',
      ]),
    );
  });
});
