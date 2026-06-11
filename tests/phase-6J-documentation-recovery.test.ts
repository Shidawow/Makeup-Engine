import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('Phase 6J documentation recovery', () => {
  it('keeps 6J library docs while current recovery state has advanced to 7A', async () => {
    const [
      startHere,
      masterContext,
      providerPrompt,
      phaseHistory,
      architecture,
      dataFlow,
      guardrails,
      snapshotRaw,
    ] = await Promise.all([
      readFile('START_HERE.md', 'utf8'),
      readFile('docs/prompts/MASTER_CODEX_CONTEXT.md', 'utf8'),
      readFile('docs/prompts/PROVIDER_SWITCH_PROMPT.md', 'utf8'),
      readFile('docs/phases/PHASE_HISTORY.md', 'utf8'),
      readFile('docs/architecture/CURRENT_ARCHITECTURE.md', 'utf8'),
      readFile('docs/architecture/DATA_FLOW.md', 'utf8'),
      readFile('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md', 'utf8'),
      readFile('project-state/project-state.snapshot.json', 'utf8'),
    ]);
    const snapshot = JSON.parse(snapshotRaw) as {
      lastCompletedPhase: string;
      nextRecommendedPhase: string;
      nextAction: string;
    };

    expect(startHere).toContain('Phase 6L');
    expect(masterContext).toContain('Phase 8A completed');
    expect(providerPrompt).toContain('lastCompletedPhase: 8A');
    expect(providerPrompt).toContain('nextRecommendedPhase: 8B');
    expect(phaseHistory).toContain('## Phase 6J');
    expect(architecture).toContain('Template Library');
    expect(dataFlow).toContain('Template Library Entry');
    expect(guardrails).toContain('local-only');
    expect(snapshot.lastCompletedPhase).toBe('9E');
    expect(snapshot.nextRecommendedPhase).toBe('9F');
    expect(snapshot.nextAction).toContain('Phase 9F');
  });
});
