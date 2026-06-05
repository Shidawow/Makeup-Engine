import { describe, expect, it } from 'vitest';
import {
  assignReviewItemSplit,
  batchAcceptReviewItems,
  batchRejectReviewItems,
  createDatasetReviewQueue,
  exportDatasetManifest,
  exportReviewedDataset,
  markReviewItemsNeedsSecondReview,
  updateReviewDecision,
  validateReviewQueueSplitLeakage,
} from '../src/templates/storage';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
} from './dataset-review-fixtures';

const reviewedAt = '2026-05-28T00:10:00.000Z';
const reviewerMetadata = {
  reviewerId: 'queue-reviewer',
  reviewedAt,
  notes: ['reviewed'],
};

describe('dataset review queue storage', () => {
  it('creates queues, updates decisions, assigns splits, and exports reviewed data', () => {
    const dataset = datasetFixture([
      sampleFixture({ sampleId: 'sample-queue-a', target: 'lips' }),
      sampleFixture({ sampleId: 'sample-queue-b', target: 'eyeshadow' }),
    ]);
    const queue = createDatasetReviewQueue({
      dataset,
      evidence: evidenceFixture(),
      createdAt: '2026-05-28T00:02:00.000Z',
    });
    const firstId = queue.items[0].reviewItemId;
    const accepted = batchAcceptReviewItems(queue, {
      reviewItemIds: [firstId],
      reviewerMetadata,
      decidedAt: reviewedAt,
    });
    const assigned = assignReviewItemSplit(accepted, {
      reviewItemId: firstId,
      split: 'train',
      updatedAt: '2026-05-28T00:11:00.000Z',
    });
    const reviewed = exportReviewedDataset({
      dataset,
      queue: assigned,
      exportedAt: '2026-05-28T00:12:00.000Z',
    });

    expect(queue.summary.pending).toBe(2);
    expect(assigned.summary.accepted).toBe(1);
    expect(reviewed.sampleCount).toBe(1);
    expect(reviewed.samples[0].sampleId).toBe('sample-queue-a');
    expect(validateReviewQueueSplitLeakage(assigned).valid).toBe(true);
  });

  it('supports single update, batch reject, second review, and manifest export', () => {
    const dataset = datasetFixture([
      sampleFixture({ sampleId: 'sample-queue-c' }),
      sampleFixture({ sampleId: 'sample-queue-d' }),
    ]);
    const queue = createDatasetReviewQueue({
      dataset,
      evidence: evidenceFixture(),
      createdAt: '2026-05-28T00:02:00.000Z',
    });
    const firstId = queue.items[0].reviewItemId;
    const secondId = queue.items[1].reviewItemId;
    const needsReview = markReviewItemsNeedsSecondReview(queue, {
      reviewItemIds: [firstId],
      reviewerMetadata,
      decidedAt: reviewedAt,
    });
    const rejected = batchRejectReviewItems(needsReview, {
      reviewItemIds: [secondId],
      reviewerMetadata,
      decidedAt: '2026-05-28T00:13:00.000Z',
    });
    const excluded = updateReviewDecision(rejected, {
      reviewItemId: secondId,
      status: 'excluded',
      reasons: ['duplicate_sample'],
      reviewerMetadata,
      decidedAt: '2026-05-28T00:14:00.000Z',
    });
    const manifest = exportDatasetManifest({
      dataset,
      queue: excluded,
      exportedAt: '2026-05-28T00:15:00.000Z',
    });

    expect(excluded.summary.needsSecondReview).toBe(1);
    expect(excluded.items.find((item) => item.reviewItemId === secondId)?.currentDecision.status).toBe('excluded');
    expect(manifest.rejectedCount).toBe(1);
    expect(manifest.entries).toHaveLength(2);
  });
});
