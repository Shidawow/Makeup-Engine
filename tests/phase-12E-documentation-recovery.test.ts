import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const read = (file: string) => readFile(file, 'utf8');

describe('Phase 12E documentation recovery', () => {
  it('documents the end-to-end demo script and acceptance trial boundaries', async () => {
    const [demoScript, acceptanceTrial, phase] = await Promise.all([
      read('docs/product/photo-to-template-e2e-demo-script.md'),
      read('docs/product/photo-to-template-acceptance-trial.md'),
      read('docs/phases/phase-12E.md'),
    ]);
    const combined = `${demoScript}\n${acceptanceTrial}\n${phase}`;

    expect(combined).toContain('Photo-to-Template End-to-End Demo Script');
    expect(combined).toContain('Photo-to-Template Acceptance Trial');
    expect(combined).toContain('Demo Route A');
    expect(combined).toContain('Demo Route B');
    expect(combined).toContain('Demo Route C');
    expect(combined).toContain('User App MVP');
    expect(combined).toContain('Vision Analysis');
    expect(combined).toContain('Template Studio');
    expect(combined).toContain('Readiness Score');
    expect(combined).toContain('rule-based detection usability');
    expect(combined).toContain('not production readiness');
    expect(combined).toContain('not registry readiness');
    expect(combined).toContain('fully automatic high-quality makeup extraction');
    expect(combined).toContain('AI confirmed recognition');
    expect(combined).toContain('medical');
    expect(combined).toContain('product shade');
    expect(combined).toContain('registry chain paused after Phase 10U');
    expect(combined).toContain('Phase 13A');
  });

  it('updates status, architecture, and prompts to Phase 12E and Phase 13A', async () => {
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

    expect(combined).toContain('Phase 12E');
    expect(combined).toContain('Photo-to-Template End-to-End Demo Script & Acceptance Trial');
    expect(combined).toContain('PhotoToTemplateAcceptanceTrialReport');
    expect(combined).toContain('PhotoToTemplateAcceptanceTrialPanel');
    expect(combined).toContain('Phase 13A');
    expect(combined).toContain('MVP Trial Content Pack & Founder Demo Review');
    expect(combined).toContain('acceptance trial is not production readiness');
    expect(combined).toContain('registry chain paused after Phase 10U');
    expect(combined).toContain('Phase 10V is intentionally not the active next phase');
  });

  it('updates project-state to 12E without resuming registry writes or publish scope', async () => {
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

    expect(combined).toContain('"lastCompletedPhase": "12E"');
    expect(combined).toContain('"currentPhaseId": "12E"');
    expect(combined).toContain('"nextRecommendedPhase": "13A"');
    expect(combined).toContain('Photo-to-Template End-to-End Demo Script & Acceptance Trial');
    expect(combined).toContain('MVP Trial Content Pack & Founder Demo Review');
    expect(combined).toContain('PhotoToTemplateAcceptanceTrialReport');
    expect(combined).toContain('PhotoToTemplateAcceptanceTrialCheck');
    expect(combined).toContain('PhotoToTemplateAcceptanceTrialPanel');
    expect(combined).toContain('PhotoToTemplateAcceptanceTrialRouteAUserAppMvp');
    expect(combined).toContain('PhotoToTemplateAcceptanceTrialRouteBVisionAnalysis');
    expect(combined).toContain('PhotoToTemplateAcceptanceTrialRouteCTemplateStudioOperatorWorkflow');
    expect(combined).toContain('acceptance trial is not production readiness');
    expect(combined).toContain('registry chain paused after Phase 10U');
    expect(combined).toContain('UserAppTemplatePackage mutation');
    expect(combined).not.toContain('Phase 10V actual write authorization is active');
  });
});
