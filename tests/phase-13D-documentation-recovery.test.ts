import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (filePath: string) =>
  fs.readFileSync(path.join(root, filePath), 'utf8');

describe('Phase 13D documentation and recovery state', () => {
  it('documents the demo gap resolution sprint scope', () => {
    const docs = [
      'docs/product/mvp-demo-gap-resolution-sprint-1.md',
      'docs/product/mvp-demo-gap-resolution-evidence.md',
      'docs/phases/phase-13D.md',
    ].map(read).join('\n');

    expect(docs).toContain('Phase 13D');
    expect(docs).toContain('MVP Demo Gap Resolution Sprint 1');
    expect(docs).toContain('first-run clarity');
    expect(docs).toContain('Trial template content consistency polish');
    expect(docs).toContain('Step guidance trust wording polish');
    expect(docs).toContain('Mobile demo touch target / spacing polish');
    expect(docs).toContain('Operator workflow explanation tightening');
    expect(docs).toContain('MvpDemoGapResolutionSprint1Report');
    expect(docs).toContain('MvpDemoGapResolutionSprint1Panel');
    expect(docs).toContain('not production readiness');
    expect(docs).toContain('not real user research');
    expect(docs).toContain('no registry write');
    expect(docs).toContain('no publish');
    expect(docs).toContain('Phase 14A - Internal Founder Demo Run');
  });

  it('updates status and project-state to Phase 13D with Phase 14A next', () => {
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

    expect(status).toContain('13D');
    expect(status).toContain('MVP Demo Gap Resolution Sprint 1');
    expect(status).toContain('14A');
    expect(status).toContain('Internal Founder Demo Run');
    expect(status).toContain('MvpDemoGapResolutionSprint1Report');
    expect(status).toContain('MvpDemoGapResolutionSprint1Panel');
    expect(status).toContain('registry chain paused after Phase 10U');
    expect(status).toContain('not production readiness');
    expect(status).toContain('not real user research');
    expect(status).toContain('first-run clarity');
    expect(status).toContain('trial template consistency');
    expect(status).toContain('operator workflow explanation');
  });
});
