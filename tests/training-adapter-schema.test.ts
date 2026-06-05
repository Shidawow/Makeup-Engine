import { describe, expect, it } from 'vitest';
import {
  TRAINING_ADAPTER_SCHEMA_VERSION,
  type SegmentationTrainingManifest,
} from '../src/templates/schema';
import {
  assignReviewItemSplit,
  batchAcceptReviewItems,
  createDatasetReviewQueue,
  createSegmentationTrainingManifest,
} from '../src/templates/storage';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
} from './dataset-review-fixtures';

describe('training adapter schema', () => {
  it('defines a segmentation training manifest contract', () => {
    const dataset = datasetFixture([sampleFixture({ sampleId: 'sample-training-schema' })]);
    const accepted = batchAcceptReviewItems(
      createDatasetReviewQueue({ dataset, evidence: evidenceFixture() }),
      {
        reviewerMetadata: {
          reviewerId: 'schema-reviewer',
          reviewedAt: '2026-05-29T00:00:00.000Z',
          notes: [],
        },
        decidedAt: '2026-05-29T00:00:00.000Z',
      },
    );
    const queue = assignReviewItemSplit(accepted, {
      reviewItemId: accepted.items[0].reviewItemId,
      split: 'train',
      updatedAt: '2026-05-29T00:01:00.000Z',
    });
    const manifest: SegmentationTrainingManifest = createSegmentationTrainingManifest({
      dataset,
      queue,
    });

    expect(manifest.schemaVersion).toBe(TRAINING_ADAPTER_SCHEMA_VERSION);
    expect(manifest.train.sampleCount).toBe(1);
    expect(manifest.targetSummary.regionCounts.lips).toBe(1);
    expect(manifest.validationResult.valid).toBe(true);
  });
});
