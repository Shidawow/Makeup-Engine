import { describe, expect, it } from 'vitest';
import {
  attachEvidenceSummaryToProductionTask,
  attachTemplatePreviewToProductionTask,
  createAnalysisResultHandoff,
  summarizeProductionTaskAnalysisResult,
  updateProductionTaskFromAnalysis,
} from '../src/template-engine/production';
import { createTemplateProductionBatchFromSourceImages } from '../src/template-engine/production';
import {
  createReadySourceImageBinding,
  createTemplateProductionAnalysisResult,
  createTemplateProductionTestManifest,
} from './templateProductionTestUtils';

describe('template production analysis handoff', () => {
  it('records analysis metadata without storing full UI state or image bytes', async () => {
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const task = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
    }).tasks.find((candidate) => candidate.sourceImageId === 'ready-with-binding')!;
    const analysis = createTemplateProductionAnalysisResult();
    const handoff = createAnalysisResultHandoff({ task, analysis, evidenceReady: false });
    const withPreview = attachTemplatePreviewToProductionTask(handoff.task, 'preview-phase-6i');
    const withEvidence = attachEvidenceSummaryToProductionTask(withPreview, true);
    const updated = updateProductionTaskFromAnalysis(task, analysis, undefined, 'preview-phase-6i');
    const summary = summarizeProductionTaskAnalysisResult(withEvidence);

    expect(handoff.summary.traceSummary).toEqual([
      'image-input',
      'face-detection',
      'cosmetic-segmentation',
    ]);
    expect(summary.previewId).toBe('preview-phase-6i');
    expect(summary.evidenceReady).toBe(true);
    expect(updated.currentStatus).toBe('analysis_complete');
    expect(JSON.stringify(updated)).not.toContain('data:image/');
  });
});
