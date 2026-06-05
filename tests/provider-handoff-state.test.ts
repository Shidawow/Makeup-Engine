import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

interface ProviderHandoff {
  schemaVersion: string;
  projectName: string;
  activeProvider: string;
  lastProvider: string;
  currentTask: string;
  taskStatus: string;
  lastCompletedPhase: string;
  nextRecommendedPhase: string;
  nextRequiredReadFiles: string[];
  handoffNotes: string[];
  forbiddenDirectories: string[];
}

describe('provider handoff state', () => {
  it('is valid JSON with required provider handoff fields', async () => {
    const raw = await readFile('project-state/provider-handoff.json', 'utf8');
    const handoff = JSON.parse(raw) as ProviderHandoff;

    expect(handoff.schemaVersion).toBe('provider-handoff.v1');
    expect(handoff.projectName).toBe('Makeup Engine');
    expect(handoff.activeProvider).toBeTruthy();
    expect(handoff.lastProvider).toBeTruthy();
    expect(handoff.currentTask).toContain('7H');
    expect(handoff.taskStatus).toBeTruthy();
    expect(handoff.lastCompletedPhase).toBe('7H');
    expect(handoff.nextRecommendedPhase).toBe('8A');
    expect(handoff.nextRequiredReadFiles).toEqual(
      expect.arrayContaining([
        'START_HERE.md',
        'docs/prompts/MASTER_CODEX_CONTEXT.md',
        'docs/prompts/PROVIDER_SWITCH_PROMPT.md',
        'docs/status/NEXT_ACTION.md',
        'project-state/project-state.snapshot.json',
        'project-state/provider-handoff.json',
      ]),
    );
  });

  it('records source-of-truth and guardrail notes', async () => {
    const raw = await readFile('project-state/provider-handoff.json', 'utf8');
    const handoff = JSON.parse(raw) as ProviderHandoff;
    const notes = handoff.handoffNotes.join('\n');

    expect(notes).toContain('source of truth');
    expect(notes).toContain('not chat memory');
    expect(notes).toContain('Do not create training dataset directly from SourceImagePackage');
    expect(notes).toContain('legacy');
    expect(notes).toContain('SourceImagePackage');
    expect(notes).toContain('UserAppTemplatePackage is local/export consumption contract data');
    expect(notes).toContain('Phase 7C added placeholder-only photo intake');
    expect(notes).toContain('Phase 7D added local-only onboarding');
    expect(notes).toContain('Phase 7E added local-only discovery');
    expect(notes).toContain('Phase 7B');
    expect(notes).toContain('Phase 7A added a narrow contract-driven User App MVP Shell');
    expect(notes).toContain('face embeddings');
    expect(handoff.forbiddenDirectories).toEqual(
      expect.arrayContaining(['src/engine', 'src/runtime', 'src/intelligence/runtime']),
    );
  });
});
