import { describe, expect, it } from 'vitest';
import {
  applyMaskBrushEdit,
  createEditableCosmeticMask,
} from '../src/vision';
import {
  assignReviewItemSplit,
  batchAcceptReviewItems,
  createDatasetReviewQueue,
  createHumanCorrectionDataset,
  createHumanMaskCorrectionSample,
  exportReviewedDatasetJsonl,
} from '../src/templates/storage';
import {
  evidenceFixture,
  maskFixture,
} from './dataset-review-fixtures';

describe('Template Studio E2E operator flow', () => {
  it('moves from mask edit to reviewed JSONL without remote runtime', () => {
    const baseMask = maskFixture(
      'studio-flow-mask',
      'lips',
      [0, 0, 0, 0, 0.4, 0, 0, 0, 0],
    );
    const edited = applyMaskBrushEdit(createEditableCosmeticMask(baseMask), {
      id: 'studio-flow-edit',
      target: 'lips',
      tool: 'brush-add',
      point: { x: 0.5, y: 0.5, space: 'normalized-image' },
      radius: 0.4,
      strength: 0.9,
      createdAt: '2026-05-29T00:00:00.000Z',
    });
    const sample = createHumanMaskCorrectionSample({
      imageId: 'studio-flow-image',
      templateId: 'studio-flow-template',
      editableMask: edited,
      editorMetadata: {
        editorId: 'operator',
        tool: 'template-studio',
        sessionId: 'studio-flow-session',
        editedAt: '2026-05-29T00:00:00.000Z',
        notes: [],
      },
      correctionReason: 'operator boundary refinement',
      correctionConfidence: 0.92,
      humanVerificationStatus: 'ready_for_dataset',
      exportedAt: '2026-05-29T00:01:00.000Z',
    });
    const dataset = createHumanCorrectionDataset({
      imageId: 'studio-flow-image',
      templateId: 'studio-flow-template',
      samples: [sample],
      createdAt: '2026-05-29T00:00:00.000Z',
      exportedAt: '2026-05-29T00:01:00.000Z',
      humanVerificationStatus: 'ready_for_dataset',
    });
    const queue = createDatasetReviewQueue({
      dataset,
      evidence: evidenceFixture(),
      createdAt: '2026-05-29T00:02:00.000Z',
    });
    const accepted = batchAcceptReviewItems(queue, {
      reviewerMetadata: {
        reviewerId: 'operator',
        reviewedAt: '2026-05-29T00:03:00.000Z',
        notes: [],
      },
      decidedAt: '2026-05-29T00:03:00.000Z',
    });
    const assigned = assignReviewItemSplit(accepted, {
      reviewItemId: accepted.items[0].reviewItemId,
      split: 'train',
      updatedAt: '2026-05-29T00:04:00.000Z',
    });
    const reviewedJsonl = exportReviewedDatasetJsonl({ dataset, queue: assigned });

    expect(edited.userModifications).toHaveLength(1);
    expect(edited.history.undo.length).toBeGreaterThan(0);
    expect(dataset.sampleCount).toBe(1);
    expect(queue.items[0].currentDecision.status).toBe('pending_review');
    expect(assigned.items[0].currentDecision.status).toBe('accepted');
    expect(reviewedJsonl).toContain(sample.sampleId);
  });
});
