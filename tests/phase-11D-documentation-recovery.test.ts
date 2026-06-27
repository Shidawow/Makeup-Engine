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
  'docs/product/user-app-demo-readiness.md',
  'docs/product/operator-qa-checklist.md',
  'docs/phases/phase-11D.md',
];

describe('Phase 11D documentation recovery', () => {
  it('records Phase 11D completion and Phase 12A next recommendation', async () => {
    const combined = (await Promise.all(docsToCheck.map((file) => readFile(file, 'utf8')))).join('\n');

    expect(combined).toContain('Phase 11D');
    expect(combined).toContain('User App Demo Readiness & Operator QA');
    expect(combined).toContain('Phase 12A');
    expect(combined).toContain('Photo-to-Template Draft Reality Check');
    expect(combined).toContain('registry chain paused after Phase 10U');
  });

  it('documents demo readiness, operator QA, limitations, and forbidden terms', async () => {
    const [demoDoc, qaDoc, limitationsDoc] = await Promise.all([
      readFile('docs/product/user-app-demo-readiness.md', 'utf8'),
      readFile('docs/product/operator-qa-checklist.md', 'utf8'),
      readFile('docs/status/KNOWN_LIMITATIONS.md', 'utf8'),
    ]);
    const combined = [demoDoc, qaDoc, limitationsDoc].join('\n');

    expect(combined).toContain('Recommended Demo Path');
    expect(combined).toContain('Operator QA Checklist');
    expect(combined).toContain('QA-USER-01');
    expect(combined).toContain('QA-TERMS-01');
    expect(combined).toContain('local MVP shell');
    expect(combined).toContain('no backend');
    expect(combined).toContain('no camera');
    expect(combined).toContain('no AR');
    expect(combined).toContain('no OpenAI');
    expect(combined).toContain('no model training');
    expect(combined).toContain('no real registry write');
    expect(combined).toContain('Readiness Score');
    expect(combined).toContain('not MediaPipe model raw confidence');
  });

  it('updates project-state handoff files to Phase 11D without resuming registry writes', async () => {
    const files = [
      'project-state/project-state.snapshot.json',
      'project-state/latest-handoff.json',
      'project-state/provider-handoff.json',
      'project-state/active-task.json',
      'project-state/guardrails.json',
    ];
    const combined = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n');

    expect(combined).toContain('"lastCompletedPhase": "11D"');
    expect(combined).toContain('"nextRecommendedPhase": "12A"');
    expect(combined).toContain('User App Demo Readiness & Operator QA');
    expect(combined).toContain('Photo-to-Template Draft Reality Check');
    expect(combined).toContain('Do not resume Phase 10V');
    expect(combined).toContain('Do not execute registry writes');
    expect(combined).not.toContain('"lastCompletedPhase": "10V"');
  });
});
