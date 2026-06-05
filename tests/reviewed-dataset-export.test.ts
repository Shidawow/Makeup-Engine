import { describe, expect, it } from 'vitest';
import {
  assignReviewItemSplit,
  batchAcceptReviewItems,
  createDatasetReviewQueue,
  createDatasetManifest,
  exportManifestJson,
  exportReviewedDatasetJson,
  exportReviewedDatasetJsonl,
  exportTestSplit,
  exportTrainSplit,
  exportValidationSplit,
} from '../src/templates/storage';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
} from './dataset-review-fixtures';

const reviewerMetadata = {
  reviewerId: 'export-reviewer',
  reviewedAt: '2026-05-28T00:20:00.000Z',
  notes: [],
};

describe('reviewed dataset export', () => {
  it('exports only accepted training-ready samples and separate manifest JSON', () => {
    const samples = [
      sampleFixture({ sampleId: 'sample-reviewed-a' }),
      sampleFixture({
        sampleId: 'sample-reviewed-b',
        correctionConfidence: 0.3,
        humanVerificationStatus: 'human_corrected',
      }),
    ];
    const dataset = datasetFixture(samples);
    const queue = createDatasetReviewQueue({
      dataset,
      evidence: evidenceFixture(),
      createdAt: '2026-05-28T00:02:00.000Z',
    });
    const accepted = batchAcceptReviewItems(queue, {
      reviewItemIds: [queue.items[0].reviewItemId, queue.items[1].reviewItemId],
      reviewerMetadata,
      decidedAt: reviewerMetadata.reviewedAt,
    });
    const assigned = assignReviewItemSplit(accepted, {
      reviewItemId: queue.items[0].reviewItemId,
      split: 'train',
      updatedAt: '2026-05-28T00:21:00.000Z',
    });
    const reviewedJson = exportReviewedDatasetJson({
      dataset,
      queue: assigned,
      exportedAt: '2026-05-28T00:22:00.000Z',
    });
    const reviewedJsonl = exportReviewedDatasetJsonl({ dataset, queue: assigned });
    const manifestJson = exportManifestJson(
      createDatasetManifest({
        dataset,
        queue: assigned,
        exportFormat: 'manifest',
        exportedAt: '2026-05-28T00:23:00.000Z',
      }),
    );

    expect(reviewedJson).toContain('"schemaVersion":"human-correction-dataset-v0.1"');
    expect(reviewedJson).toContain('"sampleCount":1');
    expect(reviewedJsonl.split('\n')).toHaveLength(1);
    expect(reviewedJsonl).toContain('sample-reviewed-a');
    expect(reviewedJsonl).not.toContain('sample-reviewed-b');
    expect(manifestJson).toContain('"schemaVersion":"dataset-manifest-v0.1"');
    expect(exportTrainSplit({ dataset, queue: assigned })).toContain('sample-reviewed-a');
    expect(exportValidationSplit({ dataset, queue: assigned })).toBe('');
    expect(exportTestSplit({ dataset, queue: assigned })).toBe('');
  });
});
