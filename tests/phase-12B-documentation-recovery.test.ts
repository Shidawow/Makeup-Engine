import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const read = (file: string) => readFile(file, 'utf8');

describe('Phase 12B documentation recovery', () => {
  it('documents makeup semantic extraction baseline and field evidence boundaries', async () => {
    const [baseline, fieldEvidence, phase] = await Promise.all([
      read('docs/product/makeup-semantic-extraction-baseline.md'),
      read('docs/product/makeup-semantic-field-evidence.md'),
      read('docs/phases/phase-12B.md'),
    ]);
    const combined = `${baseline}\n${fieldEvidence}\n${phase}`;

    expect(combined).toContain('Makeup Semantic Extraction Baseline');
    expect(combined).toContain('lipColorCandidate');
    expect(combined).toContain('blushPlacementCandidate');
    expect(combined).toContain('eyeMakeupIntensityCandidate');
    expect(combined).toContain('region_pixel_derived');
    expect(combined).toContain('color_rule_derived');
    expect(combined).toContain('brightness_rule_derived');
    expect(combined).toContain('saturation_rule_derived');
    expect(combined).toContain('human review');
    expect(combined).toContain('candidate-only');
    expect(combined).toContain('not final recognition');
    expect(combined).toContain('no product shade claim');
    expect(combined).toContain('no medical or skin diagnosis');
  });

  it('updates status and architecture docs to Phase 12B and Phase 12C', async () => {
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

    expect(combined).toContain('Phase 12B');
    expect(combined).toContain('Makeup Semantic Extraction Baseline');
    expect(combined).toContain('Phase 12C');
    expect(combined).toContain('Photo-to-Template Draft Integration & Human Review Editing');
    expect(combined).toContain('registry chain paused after Phase 10U');
    expect(combined).toContain('Phase 10V is intentionally not the active next phase');
    expect(combined).toContain('candidate-only');
    expect(combined).toContain('not fully automatic');
  });

  it('updates project-state to 12B without resuming registry writes', async () => {
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

    expect(combined).toContain('"lastCompletedPhase": "12B"');
    expect(combined).toContain('"currentPhaseId": "12B"');
    expect(combined).toContain('"nextRecommendedPhase": "12C"');
    expect(combined).toContain('Makeup Semantic Extraction Baseline');
    expect(combined).toContain('MakeupSemanticExtractionReport');
    expect(combined).toContain('MakeupSemanticCandidate');
    expect(combined).toContain('MakeupSemanticExtractionPanel');
    expect(combined).toContain('candidate-only');
    expect(combined).toContain('registry chain paused after Phase 10U');
    expect(combined).not.toContain('Phase 10V actual write authorization is active');
  });
});
