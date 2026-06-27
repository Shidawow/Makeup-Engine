import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const read = (file: string) => readFile(file, 'utf8');

describe('Phase 12A documentation recovery', () => {
  it('documents photo-to-template reality check and field source matrix', async () => {
    const [reality, matrix, phase] = await Promise.all([
      read('docs/product/photo-to-template-draft-reality-check.md'),
      read('docs/product/photo-to-template-field-source-matrix.md'),
      read('docs/phases/phase-12A.md'),
    ]);
    const combined = `${reality}\n${matrix}\n${phase}`;

    expect(combined).toContain('Photo-to-Template Draft Reality Check');
    expect(combined).toContain('semi-automatic template draft generation');
    expect(combined).toContain('human review');
    expect(combined).toContain('fully automatic high-quality makeup extraction');
    expect(combined).toContain('real_from_photo');
    expect(combined).toContain('facemesh_derived');
    expect(combined).toContain('region_qa_derived');
    expect(combined).toContain('pixel_rule_derived');
    expect(combined).toContain('semantic_rule_derived');
    expect(combined).toContain('template_rule_derived');
    expect(combined).toContain('demo_fixture');
    expect(combined).toContain('placeholder');
    expect(combined).toContain('human_required');
    expect(combined).toContain('unsupported');
    expect(combined).toContain('Readiness Score');
    expect(combined).toContain('not model raw confidence');
  });

  it('updates status and architecture docs to Phase 12A and Phase 12B', async () => {
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

    expect(combined).toContain('Phase 12A');
    expect(combined).toContain('Photo-to-Template Draft Reality Check');
    expect(combined).toContain('Phase 12B');
    expect(combined).toContain('Makeup Semantic Extraction Baseline');
    expect(combined).toContain('registry chain paused after Phase 10U');
    expect(combined).toContain('Phase 10V is intentionally not the active next phase');
    expect(combined).toContain('no real registry write');
    expect(combined).toContain('not fully automatic');
  });

  it('updates project-state to 12A without resuming registry writes', async () => {
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

    expect(combined).toContain('"lastCompletedPhase": "12A"');
    expect(combined).toContain('"currentPhaseId": "12A"');
    expect(combined).toContain('"nextRecommendedPhase": "12B"');
    expect(combined).toContain('Photo-to-Template Draft Reality Check');
    expect(combined).toContain('Makeup Semantic Extraction Baseline');
    expect(combined).toContain('PhotoToTemplateRealityCheckReport');
    expect(combined).toContain('PhotoToTemplateRealityValidationResult');
    expect(combined).toContain('PhotoToTemplateRealityHandoff');
    expect(combined).toContain('not fully automatic high-quality makeup extraction');
    expect(combined).toContain('registry chain paused after Phase 10U');
    expect(combined).not.toContain('Phase 10V actual write authorization is active');
  });
});
