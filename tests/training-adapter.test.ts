import { describe, expect, it } from 'vitest';
import {
  assignReviewItemSplit,
  batchAcceptReviewItems,
  createDatasetReviewQueue,
  createSegmentationTrainingManifest,
  createTrainingSampleReferences,
  filterTrainingReadySamples,
  summarizeTrainingTargets,
  validateTrainingManifest,
} from '../src/templates/storage';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
} from './dataset-review-fixtures';

describe('training adapter implementation', () => {
  it('filters to accepted training-ready samples and validates deterministic manifests', () => {
    const dataset = datasetFixture([
      sampleFixture({ sampleId: 'sample-training-a' }),
      sampleFixture({
        sampleId: 'sample-training-b',
        correctionConfidence: 0.3,
        humanVerificationStatus: 'human_corrected',
      }),
    ]);
    const created = createDatasetReviewQueue({ dataset, evidence: evidenceFixture() });
    const accepted = batchAcceptReviewItems(created, {
      reviewerMetadata: {
        reviewerId: 'training-reviewer',
        reviewedAt: '2026-05-29T00:00:00.000Z',
        notes: [],
      },
      decidedAt: '2026-05-29T00:00:00.000Z',
    });
    const queue = assignReviewItemSplit(accepted, {
      reviewItemId: accepted.items[0].reviewItemId,
      split: 'train',
      updatedAt: '2026-05-29T00:01:00.000Z',
    });
    const ready = filterTrainingReadySamples({ dataset, queue });
    const references = createTrainingSampleReferences({ dataset, queue });
    const manifestA = createSegmentationTrainingManifest({ dataset, queue });
    const manifestB = createSegmentationTrainingManifest({ dataset, queue });

    expect(ready).toHaveLength(1);
    expect(references[0].sampleId).toBe('sample-training-a');
    expect(manifestA).toEqual(manifestB);
    expect(validateTrainingManifest(manifestA).valid).toBe(true);
    expect(summarizeTrainingTargets(references).totalSamples).toBe(1);
  });
});
