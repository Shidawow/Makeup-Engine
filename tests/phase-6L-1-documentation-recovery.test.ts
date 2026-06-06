import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readText = (path: string): string => readFileSync(path, 'utf8');
const readJson = <T>(path: string): T => JSON.parse(readText(path)) as T;

interface ProjectSnapshot {
  lastCompletedPhase: string;
  nextRecommendedPhase: string;
  nextAction: string;
  recoveryEntryFiles: string[];
}

interface LatestHandoff {
  fromPhase: string;
  toPhase: string;
  nextAction: string;
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

describe('Phase 6L-1 documentation recovery', () => {
  it('keeps 6L-1 docs while current recovery state has advanced to 7A', () => {
    expect(readText('START_HERE.md')).toContain('Phase 6L-1');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 8A completed',
    );
    expect(readText('docs/app-contract/user-app-prototype-contract-consumer.md')).toContain(
      'Round-Trip Readiness',
    );
    expect(readText('docs/phases/phase-6L-1.md')).toContain(
      'Prototype Consumer QA / Compatibility Hardening',
    );
    expect(readText('docs/phases/PHASE_HISTORY.md')).toContain('## Phase 6L-1');
    expect(readText('docs/architecture/CURRENT_ARCHITECTURE.md')).toContain(
      'Phase 6L-1 Additions',
    );
    expect(readText('docs/architecture/DATA_FLOW.md')).toContain(
      'JSON round-trip check',
    );
    expect(readText('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md')).toContain(
      'round-trip checks',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('9A');
    expect(snapshot.nextRecommendedPhase).toBe('9B');
    expect(snapshot.nextAction).toContain('Phase 9B');
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-6L-1.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-7A.md');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('9A');
    expect(latestHandoff.toPhase).toBe('9B');
    expect(latestHandoff.nextAction).toContain('Phase 9B');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.lastCompletedPhase).toBe('9A');
    expect(providerHandoff.nextRecommendedPhase).toBe('9B');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-7B.md');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9A');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'prototype-consumer-round-trip-required',
        'phase-7a-shell-only',
      ]),
    );
  });
});
