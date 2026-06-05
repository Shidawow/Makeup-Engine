import { describe, expect, it } from 'vitest';
import {
  markTaskAnalysisComplete,
  markTaskApproved,
  markTaskEvidenceReady,
  markTaskNeedsMaskReview,
  markTaskPublished,
  markTaskReadyForAnalysis,
  confirmPublishProductionTask,
} from '../src/template-engine/production';
import { createTemplateProductionBatchFromSourceImages } from '../src/template-engine/production';
import {
  createReadySourceImageBinding,
  createTemplateProductionTestManifest,
} from './templateProductionTestUtils';

describe('template production state machine', () => {
  it('blocks ready_for_analysis without a validated bound artifact', () => {
    const manifest = createTemplateProductionTestManifest();
    const batch = createTemplateProductionBatchFromSourceImages({ manifest });
    const missingArtifactTask = batch.tasks.find(
      (task) => task.sourceImageId === 'ready-without-binding',
    )!;
    const updated = markTaskReadyForAnalysis(missingArtifactTask);

    expect(updated.currentStatus).toBe('needs_artifact_binding');
    expect(updated.issues.map((issue) => issue.code)).toContain('artifact-binding-required');
  });

  it('allows analysis, mask review, evidence, approval, and publish in order', async () => {
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const batch = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
    });
    const readyTask = batch.tasks.find((task) => task.sourceImageId === 'ready-with-binding')!;
    const complete = markTaskAnalysisComplete(readyTask);
    const review = markTaskNeedsMaskReview(complete);
    const evidence = markTaskEvidenceReady(review);
    const approved = markTaskApproved(evidence);
    const confirmed = confirmPublishProductionTask(approved, {
      confirmedAt: '2026-05-31T00:05:00.000Z',
    });
    const published = markTaskPublished(confirmed);

    expect(complete.currentStatus).toBe('analysis_complete');
    expect(review.currentStatus).toBe('needs_mask_review');
    expect(evidence.evidenceStatus).toBe('ready');
    expect(approved.currentStatus).toBe('approved');
    expect(confirmed.publishConfirmation?.localPublished).toBe(true);
    expect(published.currentStatus).toBe('published');
  });

  it('blocks publish until local confirmation is recorded', async () => {
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const batch = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
    });
    const readyTask = batch.tasks.find((task) => task.sourceImageId === 'ready-with-binding')!;
    const approved = markTaskApproved(markTaskEvidenceReady(markTaskNeedsMaskReview(markTaskAnalysisComplete(readyTask))));
    const blocked = markTaskPublished(approved);

    expect(blocked.currentStatus).toBe('approved');
    expect(blocked.issues.map((issue) => issue.code)).toContain('publish-confirmation-required');
  });
});
