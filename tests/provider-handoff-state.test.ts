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
    expect(handoff.currentTask).toContain('8D');
    expect(handoff.taskStatus).toBeTruthy();
    expect(handoff.lastCompletedPhase).toBe('8D');
    expect(handoff.nextRecommendedPhase).toBe('8E');
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
    expect(notes).toContain('SourceImagePackage');
    expect(notes).toContain('training dataset');
    expect(notes).toContain('legacy');
    expect(notes).toContain('SourceImagePackage');
    expect(notes).toContain('UserAppTemplatePackage is local/export consumption contract data');
    expect(notes).toContain('Phase 8C added ordered trial tasks');
    expect(notes).toContain('Phase 8D added template content QA');
    expect(notes).toContain('App Store/TestFlight');
    expect(notes).toContain('Phase 8E should decide MVP release readiness');
    expect(handoff.forbiddenDirectories).toEqual(
      expect.arrayContaining(['src/engine', 'src/runtime', 'src/intelligence/runtime']),
    );
  });
});
