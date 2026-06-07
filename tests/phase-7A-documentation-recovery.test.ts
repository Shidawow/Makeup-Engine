import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('Phase 7A documentation recovery', () => {
  it('documents User App MVP Shell completion and 7B handoff', async () => {
    const [
      startHere,
      currentStatus,
      currentPhase,
      nextAction,
      phaseDoc,
      phaseHistory,
      architecture,
      dataFlow,
      guardrails,
      masterContext,
      providerPrompt,
      snapshotRaw,
      latestHandoffRaw,
    ] = await Promise.all([
      readFile('START_HERE.md', 'utf8'),
      readFile('docs/status/CURRENT_PROJECT_STATUS.md', 'utf8'),
      readFile('docs/status/CURRENT_PHASE.md', 'utf8'),
      readFile('docs/status/NEXT_ACTION.md', 'utf8'),
      readFile('docs/phases/phase-7A.md', 'utf8'),
      readFile('docs/phases/PHASE_HISTORY.md', 'utf8'),
      readFile('docs/architecture/CURRENT_ARCHITECTURE.md', 'utf8'),
      readFile('docs/architecture/DATA_FLOW.md', 'utf8'),
      readFile('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md', 'utf8'),
      readFile('docs/prompts/MASTER_CODEX_CONTEXT.md', 'utf8'),
      readFile('docs/prompts/PROVIDER_SWITCH_PROMPT.md', 'utf8'),
      readFile('project-state/project-state.snapshot.json', 'utf8'),
      readFile('project-state/latest-handoff.json', 'utf8'),
    ]);
    const snapshot = JSON.parse(snapshotRaw) as {
      lastCompletedPhase: string;
      nextRecommendedPhase: string;
    };
    const latestHandoff = JSON.parse(latestHandoffRaw) as {
      fromPhase: string;
      toPhase: string;
    };

    expect(startHere).toContain('Phase 7A');
    expect(currentStatus).toContain('User App MVP Shell');
    expect(currentPhase).toContain('9C');
    expect(nextAction).toContain('Phase 9D');
    expect(phaseDoc).toContain('not a production app');
    expect(phaseHistory).toContain('## Phase 7A');
    expect(architecture).toContain('src/user-app');
    expect(dataFlow).toContain('User App Shell');
    expect(guardrails).toContain('UserAppTemplatePackage');
    expect(masterContext).toContain('Phase 8A completed');
    expect(providerPrompt).toContain('lastCompletedPhase: 8A');
    expect(snapshot.lastCompletedPhase).toBe('9C');
    expect(snapshot.nextRecommendedPhase).toBe('9D');
    expect(latestHandoff.fromPhase).toBe('9C');
    expect(latestHandoff.toPhase).toBe('9D');
  });
});
