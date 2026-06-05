import { describe, expect, it } from 'vitest';
import {
  createInitialTemplateProgress,
  getNextIncompleteStep,
  markStepComplete,
  markStepSkipped,
  resetTemplateProgress,
  summarizeTemplateProgress,
} from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';

describe('user app progress model', () => {
  it('tracks local step completion, skipping, next step, and reset', () => {
    const template = userAppMvpShellExamplePackage.templates[0];
    const initial = createInitialTemplateProgress({ template, startedAt: '2026-06-01T00:00:00.000Z' });
    const firstStepId = template.steps[0].stepId;
    const secondStepId = template.steps[1].stepId;
    const completed = markStepComplete(initial, firstStepId, '2026-06-01T00:01:00.000Z');
    const skipped = markStepSkipped(completed, secondStepId, '2026-06-01T00:02:00.000Z');
    const reset = resetTemplateProgress(skipped, '2026-06-01T00:03:00.000Z');

    expect(initial.progressPercent).toBe(0);
    expect(completed.completedStepIds).toContain(firstStepId);
    expect(completed.currentStepId).toBe(secondStepId);
    expect(skipped.skippedStepIds).toContain(secondStepId);
    expect(getNextIncompleteStep(skipped)).toBe(template.steps[2].stepId);
    expect(reset.completedStepIds).toHaveLength(0);
    expect(reset.skippedStepIds).toHaveLength(0);
    expect(summarizeTemplateProgress(completed)).toContain('"localOnly":true');
  });
});
