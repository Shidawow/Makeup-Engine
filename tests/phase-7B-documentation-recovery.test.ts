import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readText = (path: string): string => readFileSync(path, 'utf8');
const readJson = <T>(path: string): T => JSON.parse(readText(path)) as T;

interface ProjectSnapshot {
  lastCompletedPhase: string;
  nextRecommendedPhase: string;
  mainDataFlow: string[];
  recoveryEntryFiles: string[];
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

describe('Phase 7B documentation recovery', () => {
  it('documents guidance UX hardening and advances recovery state to 7C', () => {
    expect(readText('START_HERE.md')).toContain('Phase 7B');
    expect(readText('docs/user-app/step-guidance-ux-hardening.md')).toContain(
      'Step Guidance UX Hardening',
    );
    expect(readText('docs/phases/phase-7B.md')).toContain(
      'Step-by-step Guidance UX Hardening',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 7H');
    expect(readText('docs/architecture/CURRENT_ARCHITECTURE.md')).toContain(
      'Phase 7B Additions',
    );
    expect(readText('docs/architecture/DATA_FLOW.md')).toContain(
      'Step Guidance UX Hardening',
    );
    expect(readText('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md')).toContain(
      'friendly warning',
    );
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 8A completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 8A',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('8A');
    expect(snapshot.nextRecommendedPhase).toBe('8B');
    expect(snapshot.mainDataFlow).toContain('StepGuidanceUxHardening');
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-7B.md');
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/user-app/step-guidance-ux-hardening.md',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.lastCompletedPhase).toBe('8A');
    expect(providerHandoff.nextRecommendedPhase).toBe('8B');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-7B.md');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('8A');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase-7b-no-production-app-scope',
        'friendly-guidance-does-not-repair-contracts',
        'phase-7c-placeholder-only',
      ]),
    );
  });
});
