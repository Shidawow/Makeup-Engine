import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const read = (file: string) => readFile(file, 'utf8');

describe('Phase 12D documentation recovery', () => {
  it('documents operator workflow and draft preview QA boundaries', async () => {
    const [workflow, previewQa, phase] = await Promise.all([
      read('docs/product/photo-to-template-operator-workflow.md'),
      read('docs/product/photo-to-template-draft-preview-qa.md'),
      read('docs/phases/phase-12D.md'),
    ]);
    const combined = `${workflow}\n${previewQa}\n${phase}`;

    expect(combined).toContain('Photo-to-Template Operator Workflow');
    expect(combined).toContain('Photo-to-Template Draft Preview QA');
    expect(combined).toContain('PhotoToTemplateOperatorWorkflowReport');
    expect(combined).toContain('PhotoToTemplateDraftPreviewQaReport');
    expect(combined).toContain('Vision / FaceMesh');
    expect(combined).toContain('Makeup Semantic Extraction');
    expect(combined).toContain('Human Review Editing');
    expect(combined).toContain('Draft QA');
    expect(combined).toContain('User App Draft Preview QA');
    expect(combined).toContain('sourceType');
    expect(combined).toContain('confidenceBand');
    expect(combined).toContain('evidence');
    expect(combined).toContain('limitations');
    expect(combined).toContain('reviewerDecision');
    expect(combined).toContain('humanReviewRequired');
    expect(combined).toContain('notFinal');
    expect(combined).toContain('not a formal `UserAppTemplatePackage`');
    expect(combined).toContain('not a registry write');
    expect(combined).toMatch(/not\s+a publish step/);
  });

  it('updates status, architecture, and prompts to Phase 12D and Phase 12E', async () => {
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

    expect(combined).toContain('Phase 12D');
    expect(combined).toContain('Photo-to-Template Operator Workflow & Draft Preview QA');
    expect(combined).toContain('Phase 12E');
    expect(combined).toContain('Photo-to-Template End-to-End Demo Script & Acceptance Trial');
    expect(combined).toContain('PhotoToTemplateOperatorWorkflowReport');
    expect(combined).toContain('PhotoToTemplateDraftPreviewQaReport');
    expect(combined).toContain('ordinary user path');
    expect(combined).toContain('registry chain paused after Phase 10U');
    expect(combined).toContain('Phase 10V is intentionally not the active next phase');
    expect(combined).toContain('fully automatic high-quality');
  });

  it('keeps 12D history while project-state advances to 12E without resuming registry writes', async () => {
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
    expect(combined).toContain('Photo-to-Template Operator Workflow & Draft Preview QA');
    expect(combined).toContain('Photo-to-Template End-to-End Demo Script & Acceptance Trial');
    expect(combined).toContain('PhotoToTemplateOperatorWorkflowReport');
    expect(combined).toContain('PhotoToTemplateDraftPreviewQaReport');
    expect(combined).toContain('PhotoToTemplateOperatorWorkflowPanel');
    expect(combined).toContain('PhotoToTemplateDraftPreviewQaPanel');
    expect(combined).toContain('PhotoToTemplateAcceptanceTrialReport');
    expect(combined).toContain('PhotoToTemplateAcceptanceTrialPanel');
    expect(combined).toContain('draft-preview-only');
    expect(combined).toContain('registry chain paused after Phase 10U');
    expect(combined).not.toContain('Phase 10V actual write authorization is active');
  });
});
