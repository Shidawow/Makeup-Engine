import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (filePath: string) =>
  fs.readFileSync(path.join(root, filePath), 'utf8');

describe('Phase 14B documentation and recovery state', () => {
  it('documents internal trial prep scope, feedback prompts, and safety boundaries', () => {
    const docs = [
      'docs/product/internal-trial-prep.md',
      'docs/product/internal-trial-feedback-prompts.md',
      'docs/product/internal-trial-safety-boundaries.md',
      'docs/phases/phase-14B.md',
    ].map(read).join('\n');

    expect(docs).toContain('Phase 14B');
    expect(docs).toContain('Internal Trial Prep');
    expect(docs).toContain('role-only');
    expect(docs).toContain('founder');
    expect(docs).toContain('friend_or_family');
    expect(docs).toContain('makeup_beginner');
    expect(docs).toContain('makeup_interested_user');
    expect(docs).toContain('operator_reviewer');
    expect(docs).toContain('product_reviewer');
    expect(docs).toContain('User App MVP trial');
    expect(docs).toContain('Mobile demo trial');
    expect(docs).toContain('Template content review');
    expect(docs).toContain('Photo-to-template operator demo');
    expect(docs).toContain('Boundary understanding check');
    expect(docs).toContain('not a public beta');
    expect(docs).toContain('not a real user research system');
    expect(docs).toContain('not analytics');
    expect(docs).toContain('No real photos');
    expect(docs).toContain('no registry write');
    expect(docs).toContain('no publish');
    expect(docs).toContain('no production writer');
    expect(docs).toContain('fully automatic');
    expect(docs).toContain('AI-confirmed');
    expect(docs).toContain('Phase 14C - Internal Trial Dry Run');
  });

  it('updates status and project-state to Phase 14B with Phase 14C next', () => {
    const status = [
      'START_HERE.md',
      'docs/status/CURRENT_PROJECT_STATUS.md',
      'docs/status/CURRENT_PHASE.md',
      'docs/status/NEXT_ACTION.md',
      'docs/status/KNOWN_LIMITATIONS.md',
      'docs/architecture/CURRENT_ARCHITECTURE.md',
      'docs/architecture/DATA_FLOW.md',
      'docs/architecture/BOUNDARIES_AND_GUARDRAILS.md',
      'docs/prompts/MASTER_CODEX_CONTEXT.md',
      'docs/prompts/PROVIDER_SWITCH_PROMPT.md',
      'project-state/project-state.snapshot.json',
      'project-state/latest-handoff.json',
      'project-state/provider-handoff.json',
      'project-state/active-task.json',
      'project-state/guardrails.json',
    ].map(read).join('\n');

    expect(status).toContain('14B');
    expect(status).toContain('Internal Trial Prep');
    expect(status).toContain('14C');
    expect(status).toContain('Internal Trial Dry Run');
    expect(status).toContain('InternalTrialPrepReport');
    expect(status).toContain('InternalTrialPrepValidationResult');
    expect(status).toContain('InternalTrialPrepPanel');
    expect(status).toContain('role-only participant profiles');
    expect(status).toContain('safe feedback prompts');
    expect(status).toContain('registry chain paused after Phase 10U');
    expect(status).toContain('not public beta');
    expect(status).toContain('not a real user research system');
    expect(status).toContain('no registry write');
    expect(status).toContain('no publish');
  });
});
