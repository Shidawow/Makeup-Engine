import { describe, expect, it } from 'vitest';
import {
  assignReviewItemSplit,
  batchAcceptReviewItems,
  createDatasetReviewQueue,
  createSegmentationTrainingManifest,
  exportTestSplitManifestJson,
  exportTrainSplitManifestJson,
  exportTrainingManifestJson,
  exportValidationSplitManifestJson,
} from '../src/templates/storage';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
} from './dataset-review-fixtures';

describe('training manifest export', () => {
  it('exports deterministic training manifests and split manifests', () => {
    const dataset = datasetFixture([sampleFixture({ sampleId: 'sample-training-export' })]);
    const accepted = batchAcceptReviewItems(
      createDatasetReviewQueue({ dataset, evidence: evidenceFixture() }),
      {
        reviewerMetadata: {
          reviewerId: 'training-export',
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
    const manifest = createSegmentationTrainingManifest({ dataset, queue });
    const jsonA = exportTrainingManifestJson(manifest);
    const jsonB = exportTrainingManifestJson(manifest);

    expect(jsonA).toBe(jsonB);
    expect(jsonA).toContain('"schemaVersion":"segmentation-training-adapter-v0.1"');
    expect(exportTrainSplitManifestJson(manifest)).toContain('sample-training-export');
    expect(exportValidationSplitManifestJson(manifest)).toContain('"sampleCount":0');
    expect(exportTestSplitManifestJson(manifest)).toContain('"sampleCount":0');
  });
});
