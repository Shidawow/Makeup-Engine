import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (filePath: string) =>
  fs.readFileSync(path.join(root, filePath), 'utf8');

describe('Phase 14A documentation and recovery state', () => {
  it('documents the internal founder demo run scope and routes', () => {
    const docs = [
      'docs/product/internal-founder-demo-run.md',
      'docs/product/internal-founder-demo-run-checklist.md',
      'docs/product/founder-demo-review-script.md',
      'docs/product/photo-to-template-e2e-demo-script.md',
      'docs/product/mvp-demo-gap-resolution-sprint-1.md',
      'docs/phases/phase-14A.md',
    ].map(read).join('\n');

    expect(docs).toContain('Phase 14A');
    expect(docs).toContain('Internal Founder Demo Run');
    expect(docs).toContain('Route A');
    expect(docs).toContain('Route B');
    expect(docs).toContain('Route C');
    expect(docs).toContain('Route D');
    expect(docs).toContain('Route E');
    expect(docs).toContain('User App MVP');
    expect(docs).toContain('Vision Analysis');
    expect(docs).toContain('Template Studio operator workflow');
    expect(docs).toContain('Mobile demo');
    expect(docs).toContain('Boundary explanation');
    expect(docs).toContain('not real user research');
    expect(docs).toContain('not production readiness');
    expect(docs).toContain('no registry write');
    expect(docs).toContain('no publish');
    expect(docs).toContain('no production writer');
    expect(docs).toContain('AI-confirmed');
    expect(docs).toContain('fully automatic');
    expect(docs).toContain('Phase 14B - Internal Trial Prep');
  });

  it('updates status and project-state to Phase 14A with Phase 14B next', () => {
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

    expect(status).toContain('14A');
    expect(status).toContain('Internal Founder Demo Run');
    expect(status).toContain('14B');
    expect(status).toContain('Internal Trial Prep');
    expect(status).toContain('InternalFounderDemoRunReport');
    expect(status).toContain('InternalFounderDemoRunValidationResult');
    expect(status).toContain('InternalFounderDemoRunPanel');
    expect(status).toContain('registry chain paused after Phase 10U');
    expect(status).toContain('not real user research');
    expect(status).toContain('not production readiness');
    expect(status).toContain('no registry write');
    expect(status).toContain('no publish');
  });
});
