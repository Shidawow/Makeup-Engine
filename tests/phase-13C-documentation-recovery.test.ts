import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (filePath: string) =>
  fs.readFileSync(path.join(root, filePath), 'utf8');

describe('Phase 13C documentation and recovery state', () => {
  it('documents the sprint planning product scope', () => {
    const docs = [
      'docs/product/mvp-gap-resolution-sprint-plan.md',
      'docs/product/mvp-gap-resolution-13d-candidate-scope.md',
      'docs/phases/phase-13C.md',
    ].map(read).join('\n');

    expect(docs).toContain('Phase 13C');
    expect(docs).toContain('MVP Gap Resolution Sprint Planning');
    expect(docs).toContain('not a final roadmap');
    expect(docs).toContain('not real user research');
    expect(docs).toContain('no analytics');
    expect(docs).toContain('no backend');
    expect(docs).toContain('no registry write');
    expect(docs).toContain('Phase 13D');
    expect(docs).toContain('Phase 13E');
    expect(docs).toContain('deferred production gaps');
  });

  it('updates status and project-state to Phase 13C with Phase 13D next', () => {
    const status = [
      'START_HERE.md',
      'docs/status/CURRENT_PROJECT_STATUS.md',
      'docs/status/CURRENT_PHASE.md',
      'docs/status/NEXT_ACTION.md',
      'docs/status/KNOWN_LIMITATIONS.md',
      'docs/prompts/MASTER_CODEX_CONTEXT.md',
      'docs/prompts/PROVIDER_SWITCH_PROMPT.md',
      'project-state/project-state.snapshot.json',
      'project-state/latest-handoff.json',
      'project-state/provider-handoff.json',
      'project-state/active-task.json',
      'project-state/guardrails.json',
    ].map(read).join('\n');

    expect(status).toContain('13C');
    expect(status).toContain('MVP Gap Resolution Sprint Planning');
    expect(status).toContain('13D');
    expect(status).toContain('MVP Demo Gap Resolution Sprint 1');
    expect(status).toContain('registry chain paused after Phase 10U');
    expect(status).toContain('sprint planning is not final roadmap');
    expect(status).toContain('founder/internal feedback');
  });
});
