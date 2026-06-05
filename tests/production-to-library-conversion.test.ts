import { describe, expect, it } from 'vitest';
import {
  createLibraryEntriesFromProductionBatch,
  createLibraryEntryFromProductionTask,
  validateProductionTaskReadyForLibrary,
} from '../src/template-engine/library';
import { createReviewedProductionBatchFixture } from './templateLibraryTestUtils';

describe('Production Task to Template Library conversion', () => {
  it('converts approved and local published tasks while preserving lineage', async () => {
    const { batch, approvedTask, publishedTask, template } = await createReviewedProductionBatchFixture();
    const approvedEntry = createLibraryEntryFromProductionTask({
      task: approvedTask,
      template,
      sourceProductionBatchId: batch.batchId,
    });
    const publishedEntry = createLibraryEntryFromProductionTask({
      task: publishedTask,
      template,
      sourceProductionBatchId: batch.batchId,
    });

    expect(approvedEntry.status).toBe('imported_from_production');
    expect(publishedEntry.status).toBe('local_published');
    expect(publishedEntry.publishConfirmationSummary?.notOnlineRelease).toBe(true);
    expect(approvedEntry.lineage.source.sourceProductionBatchId).toBe(batch.batchId);
    expect(approvedEntry.sourceImageId).toBe(approvedTask.sourceImageId);
  });

  it('blocks rejected tasks and source package direct conversion', async () => {
    const { rejectedTask, template } = await createReviewedProductionBatchFixture();
    const validation = validateProductionTaskReadyForLibrary(rejectedTask, template);

    expect(validation.valid).toBe(false);
    expect(validation.issues.map((issue) => issue.code)).toContain('production-task-not-approved');
    expect(() => createLibraryEntryFromProductionTask({ task: rejectedTask, template })).toThrow();
  });

  it('requires evidence before a task can become a library entry', async () => {
    const { approvedTask, template } = await createReviewedProductionBatchFixture();
    const withoutEvidence = { ...approvedTask, evidenceStatus: 'missing' as const };

    expect(() =>
      createLibraryEntryFromProductionTask({
        task: withoutEvidence,
        template,
      }),
    ).toThrow(/evidence/i);
  });

  it('creates batch entries only from eligible tasks with provided template data', async () => {
    const { batch, approvedTask, template } = await createReviewedProductionBatchFixture();
    const entries = createLibraryEntriesFromProductionBatch({
      batch,
      templateByTaskId: {
        [approvedTask.taskId]: template,
      },
    });

    expect(entries).toHaveLength(1);
    expect(entries[0]?.templateId).toBe(template.id);
  });
});
