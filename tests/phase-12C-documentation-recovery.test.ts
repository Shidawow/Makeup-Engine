import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const read = (file: string) => readFile(file, 'utf8');

describe('Phase 12C documentation recovery', () => {
  it('documents draft integration and human review editing boundaries', async () => {
    const [integration, editing, phase] = await Promise.all([
      read('docs/product/photo-to-template-draft-integration.md'),
      read('docs/product/photo-to-template-human-review-editing.md'),
      read('docs/phases/phase-12C.md'),
    ]);
    const combined = `${integration}\n${editing}\n${phase}`;

    expect(combined).toContain('Photo-to-Template Draft Integration');
    expect(combined).toContain('Photo-to-Template Human Review Editing');
    expect(combined).toContain('PhotoToTemplateDraftIntegrationReport');
    expect(combined).toContain('PhotoToTemplateDraftSemanticBinding');
    expect(combined).toContain('PhotoToTemplateHumanReviewEditingSession');
    expect(combined).toContain('sourceType');
    expect(combined).toContain('confidenceBand');
    expect(combined).toContain('evidence');
    expect(combined).toContain('limitations');
    expect(combined).toContain('humanReviewRequired');
    expect(combined).toContain('notFinal');
    expect(combined).toContain('original candidate');
    expect(combined).toContain('editable draft');
    expect(combined).toContain('reviewer decision');
    expect(combined).toContain('reviewer note');
    expect(combined).toContain('not final');
    expect(combined).toContain('publish');
    expect(combined).toContain('registry');
  });

  it('updates status and architecture docs to Phase 12C and Phase 12D', async () => {
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

    expect(combined).toContain('Phase 12C');
    expect(combined).toContain('Photo-to-Template Draft Integration & Human Review Editing');
    expect(combined).toContain('Phase 12D');
    expect(combined).toContain('Photo-to-Template Operator Workflow & Draft Preview QA');
    expect(combined).toContain('semantic_candidate_integrated');
    expect(combined).toContain('registry chain paused after Phase 10U');
    expect(combined).toContain('Phase 10V is intentionally not the active next phase');
    expect(combined).toContain('candidate-only');
    expect(combined).toContain('draft-only');
    expect(combined).toContain('fully automatic high-quality');
  });

  it('updates project-state to 12C without resuming registry writes', async () => {
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

    expect(combined).toContain('"lastCompletedPhase": "12C"');
    expect(combined).toContain('"currentPhaseId": "12C"');
    expect(combined).toContain('"nextRecommendedPhase": "12D"');
    expect(combined).toContain('Photo-to-Template Draft Integration & Human Review Editing');
    expect(combined).toContain('PhotoToTemplateDraftIntegrationReport');
    expect(combined).toContain('PhotoToTemplateHumanReviewEditingSession');
    expect(combined).toContain('PhotoToTemplateDraftIntegrationPanel');
    expect(combined).toContain('PhotoToTemplateHumanReviewEditingPanel');
    expect(combined).toContain('candidate-only');
    expect(combined).toContain('registry chain paused after Phase 10U');
    expect(combined).not.toContain('Phase 10V actual write authorization is active');
  });
});
