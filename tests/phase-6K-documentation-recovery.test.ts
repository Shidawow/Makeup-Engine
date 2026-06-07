import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('Phase 6K documentation recovery', () => {
  it('documents user app consumption contract and project-state handoff', async () => {
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
    expect(masterContext).toContain('UserAppTemplatePackage');
    expect(providerPrompt).toContain('lastCompletedPhase: 8A');
    expect(providerPrompt).toContain('nextRecommendedPhase: 8B');
    expect(phaseHistory).toContain('## Phase 6K');
    expect(architecture).toContain('User App Template Consumption Contract');
    expect(dataFlow).toContain('UserAppTemplatePackage');
    expect(guardrails).toContain('object URL');
    expect(snapshot.lastCompletedPhase).toBe('9B');
    expect(snapshot.nextRecommendedPhase).toBe('9C');
    expect(snapshot.nextAction).toContain('Phase 9C');
  });
});
