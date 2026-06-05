import { describe, expect, it } from 'vitest';
import {
  confirmPublishProductionTask,
  createTemplateProductionBatchFromSourceImages,
  markTaskAnalysisComplete,
  markTaskApproved,
  markTaskEvidenceReady,
  markTaskNeedsMaskReview,
  publishTemplateProductionTask,
  rejectTemplateProductionTaskWithReason,
} from '../src/template-engine/production';
import {
  exportProductionBatchOperatorHandoff,
  exportProductionBatchQaReport,
  exportProductionBatchReviewSummary,
  includePublishConfirmationsInBatchExport,
  includeRejectReasonsInBatchExport,
} from '../src/templates/storage';
import {
  createReadySourceImageBinding,
  createTemplateProductionTestManifest,
} from './templateProductionTestUtils';

describe('template production batch QA export', () => {
  it('includes QA, reject reasons, confirmations, disclaimers, and no durable browser resources', async () => {
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const batch = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
    });
    const ready = batch.tasks.find((task) => task.sourceImageId === 'ready-with-binding')!;
    const approved = markTaskApproved(markTaskEvidenceReady(markTaskNeedsMaskReview(markTaskAnalysisComplete(ready))));
    const published = publishTemplateProductionTask(
      confirmPublishProductionTask(approved, {
        confirmedAt: '2026-05-31T04:00:00.000Z',
      }),
    );
    const rejected = rejectTemplateProductionTaskWithReason(
      batch.tasks.find((task) => task.sourceImageId === 'ready-without-binding')!,
      {
        reason: 'bad_source_image',
        note: '光照不足',
        rejectedAt: '2026-05-31T04:05:00.000Z',
      },
    );
    const reviewedBatch = {
      ...batch,
      tasks: batch.tasks.map((task) =>
        task.taskId === published.taskId
          ? published
          : task.taskId === rejected.taskId
            ? rejected
            : task,
      ),
    };
    const handoff = exportProductionBatchOperatorHandoff(reviewedBatch);
    const qa = JSON.parse(exportProductionBatchQaReport(reviewedBatch)) as { blockingCount: number };
    const review = exportProductionBatchReviewSummary(reviewedBatch);

    expect(qa.blockingCount).toBeGreaterThan(0);
    expect(handoff).toContain('localPublishDisclaimer');
    expect(handoff).toContain('bad_source_image');
    expect(handoff).toContain('template-production-publish-confirmation');
    expect(handoff).toContain('nextRecommendedPhase');
    expect(review).toContain('not online publication');
    expect(includeRejectReasonsInBatchExport(reviewedBatch)[0]?.reason).toBe('bad_source_image');
    expect(includePublishConfirmationsInBatchExport(reviewedBatch)).toHaveLength(1);
    expect(handoff).not.toContain('blob:phase-6i-test-binding');
    expect(handoff).not.toContain('data:image/');
    expect(handoff).not.toMatch(/(?:^|["\s])(?:[A-Za-z]:[\\/](?!\/)|\\\\)/);
  });
});
