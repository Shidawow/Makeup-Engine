import { describe, expect, it } from 'vitest';
import {
  batchAcceptReviewItems,
  createDatasetReviewQueue,
  createDatasetReplayPayload,
  exportDatasetManifest,
  exportReviewedDatasetJsonl,
} from '../src/templates/storage';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
} from './dataset-review-fixtures';

describe('review queue linkage', () => {
  it('links correction samples to pending review, replay, acceptance, and manifest export', () => {
    const sample = sampleFixture({ sampleId: 'sample-linkage' });
    const dataset = datasetFixture([sample]);
    const queue = createDatasetReviewQueue({
      dataset,
      evidence: evidenceFixture(),
      createdAt: '2026-05-29T00:00:00.000Z',
    });
    const replay = createDatasetReplayPayload({
      sample,
      item: queue.items[0],
    });
    const accepted = batchAcceptReviewItems(queue, {
      reviewerMetadata: {
        reviewerId: 'linkage-reviewer',
        reviewedAt: '2026-05-29T00:01:00.000Z',
        notes: [],
      },
      decidedAt: '2026-05-29T00:01:00.000Z',
    });
    const manifest = exportDatasetManifest({ dataset, queue: accepted });
    const jsonl = exportReviewedDatasetJsonl({ dataset, queue: accepted });

    expect(queue.summary.pending).toBe(1);
    expect(replay.sampleId).toBe(sample.sampleId);
    expect(accepted.summary.accepted).toBe(1);
    expect(manifest.acceptedCount).toBe(1);
    expect(jsonl).toContain(sample.sampleId);
  });
});
