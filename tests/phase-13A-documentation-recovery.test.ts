import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const read = (file: string) => readFile(file, 'utf8');

describe('Phase 13A documentation recovery', () => {
  it('documents the MVP trial content pack and founder demo review boundaries', async () => {
    const [pack, script, phase] = await Promise.all([
      read('docs/product/mvp-trial-content-pack.md'),
      read('docs/product/founder-demo-review-script.md'),
      read('docs/phases/phase-13A.md'),
    ]);
    const combined = `${pack}\n${script}\n${phase}`;

    expect(combined).toContain('MVP Trial Content Pack');
    expect(combined).toContain('Founder Demo Review');
    expect(combined).toContain('新手通勤淡妆');
    expect(combined).toContain('日系温柔约会妆');
    expect(combined).toContain('韩系清透低饱和妆');
    expect(combined).toContain('not official Template Library content');
    expect(combined).toContain('No registry write');
    expect(combined).toContain('No publish');
    expect(combined).toContain('fully automatic high-quality makeup extraction');
    expect(combined).toContain('AI confirmed final recognition');
    expect(combined).toContain('Phase 13B');
  });

  it('updates status, architecture, and prompts to Phase 13A and Phase 13B', async () => {
    const docs = await Promise.all([
      read('START_HERE.md'),
      read('docs/status/CURRENT_PROJECT_STATUS.md'),
      read('docs/status/CURRENT_PHASE.md'),
      read('docs/status/NEXT_ACTION.md'),
      read('docs/status/KNOWN_LIMITATIONS.md'),
      read('docs/phases/PHASE_HISTORY.md'),
      read('docs/architecture/CURRENT_ARCHITECTURE.md'),
      read('docs/architecture/DATA_FLOW.md'),
      read('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md'),
      read('docs/prompts/MASTER_CODEX_CONTEXT.md'),
      read('docs/prompts/PROVIDER_SWITCH_PROMPT.md'),
    ]);
    const combined = docs.join('\n');

    expect(combined).toContain('Phase 13A');
    expect(combined).toContain('MVP Trial Content Pack & Founder Demo Review');
    expect(combined).toContain('MvpTrialContentPack');
    expect(combined).toContain('FounderDemoReviewReport');
    expect(combined).toContain('FounderDemoReviewPanel');
    expect(combined).toContain('Phase 13B');
    expect(combined).toContain('Founder Trial Feedback Capture & MVP Gap Prioritization');
    expect(combined).toContain('registry chain paused after Phase 10U');
    expect(combined).toContain('Phase 10V');
  });

  it('updates project-state to 13A without resuming registry writes or publish scope', async () => {
    const stateFiles = await Promise.all([
      read('project-state/project-state.snapshot.json'),
      read('project-state/latest-handoff.json'),
      read('project-state/provider-handoff.json'),
      read('project-state/active-task.json'),
      read('project-state/test-status.json'),
      read('project-state/command-log.json'),
      read('project-state/artifact-index.json'),
      read('project-state/guardrails.json'),
    ]);
    const combined = stateFiles.join('\n');

    expect(combined).toContain('"lastCompletedPhase": "13A"');
    expect(combined).toContain('"currentPhaseId": "13A"');
    expect(combined).toContain('"nextRecommendedPhase": "13B"');
    expect(combined).toContain('MVP Trial Content Pack & Founder Demo Review');
    expect(combined).toContain('Founder Trial Feedback Capture & MVP Gap Prioritization');
    expect(combined).toContain('MvpTrialContentPack');
    expect(combined).toContain('FounderDemoReviewReport');
    expect(combined).toContain('FounderDemoReviewPanel');
    expect(combined).toContain('founder-demo-only');
    expect(combined).toContain('registry chain paused after Phase 10U');
    expect(combined).toContain('UserAppTemplatePackage mutation');
    expect(combined).not.toContain('Phase 10V actual write authorization is active');
  });
});
