import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const requiredFiles = [
  'docs/product/founder-trial-feedback-capture.md',
  'docs/product/mvp-gap-prioritization.md',
  'docs/phases/phase-13B.md',
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
];

describe('Phase 13B documentation recovery', () => {
  it('adds founder feedback and MVP gap documents', async () => {
    const docs = await Promise.all(
      requiredFiles.map((filePath) => readFile(filePath, 'utf8')),
    );
    const combined = docs.join('\n');

    expect(combined).toContain('Phase 13B');
    expect(combined).toContain('Founder Trial Feedback Capture');
    expect(combined).toContain('MVP Gap Prioritization');
    expect(combined).toContain('Phase 13C');
  });

  it('states feedback is internal-only and not real user research or analytics', async () => {
    const combined = (
      await Promise.all(
        [
          'docs/product/founder-trial-feedback-capture.md',
          'docs/product/mvp-gap-prioritization.md',
          'docs/phases/phase-13B.md',
        ].map((filePath) => readFile(filePath, 'utf8')),
      )
    ).join('\n');

    expect(combined).toContain('not real user research');
    expect(combined).toContain('no analytics');
    expect(combined).toContain('no personal data');
    expect(combined).toContain('no real user photos');
  });

  it('keeps registry, publish, production, and fully automatic claims blocked', async () => {
    const combined = (
      await Promise.all(requiredFiles.map((filePath) => readFile(filePath, 'utf8')))
    ).join('\n');

    expect(combined).toContain('registry chain paused after Phase 10U');
    expect(combined).toContain('no registry write');
    expect(combined).toContain('no publish');
    expect(combined).toContain('not production readiness');
    expect(combined).toContain('not fully automatic high-quality makeup extraction');
  });
});
