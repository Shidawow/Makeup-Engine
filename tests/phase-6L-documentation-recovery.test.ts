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

interface ArtifactIndex {
  userAppPrototypeConsumerOutputs: string[];
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 6L documentation recovery', () => {
  it('keeps 6L prototype docs while current recovery state has advanced to 7A', () => {
    expect(readText('START_HERE.md')).toContain('Phase 6L');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain('Phase 8A completed');
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'prototype consumer is read-only validation',
    );
    expect(readText('docs/app-contract/user-app-prototype-contract-consumer.md')).toContain(
      'User App Prototype Contract Consumer',
    );
    expect(readText('docs/phases/phase-6L.md')).toContain('read-only prototype consumer');
    expect(readText('docs/phases/PHASE_HISTORY.md')).toContain('## Phase 6L');
    expect(readText('docs/architecture/CURRENT_ARCHITECTURE.md')).toContain(
      'userAppPrototypeConsumer',
    );
    expect(readText('docs/architecture/DATA_FLOW.md')).toContain(
      'User App Prototype Contract Consumer',
    );
    expect(readText('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md')).toContain(
      'read-only admin validation',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('9G');
    expect(snapshot.nextRecommendedPhase).toBe('9H');
    expect(snapshot.nextAction).toContain('Phase 9H');
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/app-contract/user-app-prototype-contract-consumer.md',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('9G');
    expect(latestHandoff.toPhase).toBe('9H');
    expect(latestHandoff.nextAction).toContain('Phase 9H');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.lastCompletedPhase).toBe('9G');
    expect(providerHandoff.nextRecommendedPhase).toBe('9H');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-7B.md');

    const artifactIndex = readJson<ArtifactIndex>('project-state/artifact-index.json');
    expect(artifactIndex.userAppPrototypeConsumerOutputs).toContain(
      'UserAppPrototypeValidationPanel metadata',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9G');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toContain(
      'user-app-prototype-consumer-boundary',
    );
  });
});
