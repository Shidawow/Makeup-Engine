import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const docsToCheck = [
  'START_HERE.md',
  'docs/status/CURRENT_PROJECT_STATUS.md',
  'docs/status/CURRENT_PHASE.md',
  'docs/status/NEXT_ACTION.md',
  'docs/status/KNOWN_LIMITATIONS.md',
  'docs/phases/PHASE_HISTORY.md',
  'docs/architecture/CURRENT_ARCHITECTURE.md',
  'docs/architecture/DATA_FLOW.md',
  'docs/architecture/BOUNDARIES_AND_GUARDRAILS.md',
  'docs/prompts/MASTER_CODEX_CONTEXT.md',
  'docs/prompts/PROVIDER_SWITCH_PROMPT.md',
  'docs/product/user-app-visual-guidance-and-template-content.md',
  'docs/phases/phase-11C.md',
];

describe('Phase 11C documentation recovery', () => {
  it('records Phase 11C completion and Phase 11D next recommendation', async () => {
    const combined = (await Promise.all(docsToCheck.map((file) => readFile(file, 'utf8')))).join('\n');

    expect(combined).toContain('Phase 11C');
    expect(combined).toContain('User App Visual Guidance & Template Content Polish');
    expect(combined).toContain('Phase 11D');
    expect(combined).toContain('User App Demo Readiness & Operator QA');
    expect(combined).toContain('registry chain paused after Phase 10U');
  });

  it('documents visual guidance, Chinese template content, and local-only boundaries', async () => {
    const [productDoc, phaseDoc, boundaryDoc] = await Promise.all([
      readFile('docs/product/user-app-visual-guidance-and-template-content.md', 'utf8'),
      readFile('docs/phases/phase-11C.md', 'utf8'),
      readFile('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md', 'utf8'),
    ]);
    const combined = [productDoc, phaseDoc, boundaryDoc].join('\n');

    expect(combined).toContain('Chinese');
    expect(combined).toContain('step preview');
    expect(combined).toContain('region guidance');
    expect(combined).toContain('intensity reminder');
    expect(combined).toContain('technique breakdown');
    expect(combined).toContain('completed-region');
    expect(combined).toContain('does not resume Phase 10V');
    expect(combined).toContain('does not');
    expect(combined).toContain('train models');
  });

  it('updates project-state handoff files to Phase 11C without advancing registry writes', async () => {
    const files = [
      'project-state/project-state.snapshot.json',
      'project-state/latest-handoff.json',
      'project-state/provider-handoff.json',
      'project-state/active-task.json',
      'project-state/guardrails.json',
    ];
    const combined = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n');

    expect(combined).toContain('"lastCompletedPhase": "11C"');
    expect(combined).toContain('"nextRecommendedPhase": "11D"');
    expect(combined).toContain('User App Visual Guidance & Template Content Polish');
    expect(combined).toContain('User App Demo Readiness & Operator QA');
    expect(combined).toContain('Do not resume Phase 10V');
    expect(combined).toContain('Do not execute registry writes');
    expect(combined).not.toContain('"lastCompletedPhase": "10V"');
  });
});
