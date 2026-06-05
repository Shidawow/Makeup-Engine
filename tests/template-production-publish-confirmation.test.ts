import { describe, expect, it } from 'vitest';
import {
  confirmPublishProductionTask,
  createPublishConfirmation,
  createTemplateProductionBatchFromSourceImages,
  markTaskAnalysisComplete,
  markTaskApproved,
  markTaskEvidenceReady,
  markTaskNeedsMaskReview,
  publishTemplateProductionTask,
  rejectTemplateProductionTaskWithReason,
  summarizePublishConfirmation,
  validatePublishConfirmation,
} from '../src/template-engine/production';
import {
  createReadySourceImageBinding,
  createTemplateProductionTestManifest,
} from './templateProductionTestUtils';

const createApprovedTask = async () => {
  const manifest = createTemplateProductionTestManifest();
  const binding = await createReadySourceImageBinding(manifest);
  const ready = createTemplateProductionBatchFromSourceImages({
    manifest,
    artifactBindings: { [binding.bindingId]: binding },
  }).tasks.find((task) => task.sourceImageId === 'ready-with-binding')!;

  return markTaskApproved(markTaskEvidenceReady(markTaskNeedsMaskReview(markTaskAnalysisComplete(ready))));
};

describe('template production publish confirmation', () => {
  it('blocks publish until the explicit local confirmation is recorded', async () => {
    const approved = await createApprovedTask();
    const blocked = publishTemplateProductionTask(approved);
    const confirmed = confirmPublishProductionTask(approved, {
      confirmedAt: '2026-05-31T02:00:00.000Z',
      operatorNote: 'QA checked',
    });
    const published = publishTemplateProductionTask(confirmed);

    expect(blocked.currentStatus).toBe('approved');
    expect(blocked.issues.map((issue) => issue.code)).toContain('publish-confirmation-required');
    expect(confirmed.currentStatus).toBe('approved');
    expect(confirmed.publishConfirmation?.notOnlineRelease).toBe(true);
    expect(confirmed.events.at(-1)?.eventType).toBe('publish-confirmed');
    expect(published.currentStatus).toBe('published');
    expect(summarizePublishConfirmation(confirmed.publishConfirmation)).toContain('published');
  });

  it('rejects publish confirmation for rejected tasks', async () => {
    const approved = await createApprovedTask();
    const rejected = rejectTemplateProductionTaskWithReason(approved, {
      reason: 'operator_rejected_quality',
    });
    const confirmation = createPublishConfirmation({
      taskId: rejected.taskId,
      confirmedAt: '2026-05-31T02:05:00.000Z',
    });

    expect(validatePublishConfirmation(rejected, confirmation).valid).toBe(false);
    expect(confirmPublishProductionTask(rejected).publishConfirmation).toBeUndefined();
  });
});
