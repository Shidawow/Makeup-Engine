import { describe, expect, it } from 'vitest';
import {
  approveTemplateProductionTask,
  confirmPublishProductionTask,
  publishTemplateProductionTask,
  rejectTemplateProductionTask,
  validateTemplateReviewTransition,
} from '../src/template-engine/production';
import {
  createTemplateProductionBatchFromSourceImages,
  markTaskAnalysisComplete,
  markTaskEvidenceReady,
} from '../src/template-engine/production';
import {
  createReadySourceImageBinding,
  createTemplateProductionTestManifest,
} from './templateProductionTestUtils';

describe('template review lifecycle', () => {
  it('requires evidence before approval and allows publish only after approval', async () => {
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const task = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
    }).tasks.find((candidate) => candidate.sourceImageId === 'ready-with-binding')!;

    expect(validateTemplateReviewTransition(task, 'approved').valid).toBe(false);

    const evidence = markTaskEvidenceReady(markTaskAnalysisComplete(task));
    const approved = approveTemplateProductionTask(evidence);
    const confirmed = confirmPublishProductionTask(approved, {
      confirmedAt: '2026-05-31T00:05:00.000Z',
    });
    const published = publishTemplateProductionTask(confirmed);

    expect(approved.currentStatus).toBe('approved');
    expect(published.currentStatus).toBe('published');
  });

  it('keeps rejected tasks from publishing', async () => {
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const task = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
    }).tasks.find((candidate) => candidate.sourceImageId === 'ready-with-binding')!;
    const rejected = rejectTemplateProductionTask(task, 'low_confidence');
    const published = publishTemplateProductionTask(rejected);

    expect(rejected.currentStatus).toBe('rejected');
    expect(rejected.events.at(-1)?.metadata?.reason).toBe('low_confidence');
    expect(published.currentStatus).toBe('rejected');
    expect(published.issues.map((issue) => issue.code)).toContain('invalid-transition');
  });
});
