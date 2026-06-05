import { describe, expect, it } from 'vitest';
import {
  createTemplateProductionBatchFromSourceImages,
  evaluateProductionBatchQa,
  evaluateProductionTaskQa,
  validateTaskReadyForPublish,
  validateTaskReadyForReview,
} from '../src/template-engine/production';
import {
  createReadySourceImageBinding,
  createTemplateProductionTestManifest,
} from './templateProductionTestUtils';

describe('template production QA rules', () => {
  it('reports missing artifact bindings and blocked source images as blocking issues', async () => {
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const batch = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
    });
    const qa = evaluateProductionBatchQa(batch);
    const missing = batch.tasks.find((task) => task.sourceImageId === 'ready-without-binding')!;
    const missingQa = evaluateProductionTaskQa(missing);

    expect(qa.totalTasks).toBe(4);
    expect(qa.readyForAnalysisCount).toBe(1);
    expect(qa.blockingCount).toBeGreaterThanOrEqual(3);
    expect(missingQa.blockingIssues.map((issue) => issue.code)).toContain('artifact-binding-required');
    expect(missingQa.blockingIssues.every((issue) => issue.nextAction.length > 0)).toBe(true);
  });

  it('blocks review before analysis complete and publish before approval confirmation', async () => {
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const ready = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
    }).tasks.find((task) => task.sourceImageId === 'ready-with-binding')!;

    expect(validateTaskReadyForReview(ready).valid).toBe(false);
    expect(validateTaskReadyForPublish(ready).valid).toBe(false);
    expect(validateTaskReadyForPublish(ready).issues.map((issue) => issue.code)).toContain('approval-required');
  });
});
