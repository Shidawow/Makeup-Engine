import {
  assignReviewItemSplit,
  batchAcceptReviewItems,
  createDatasetReviewQueue,
  createSegmentationTrainingManifest,
} from '../src/templates/storage';
import type {
  DatasetReviewQueue,
  HumanCorrectionDataset,
  SegmentationTrainingManifest,
} from '../src/templates/schema';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
} from './dataset-review-fixtures';

export const offlinePackageFixture = (): {
  dataset: HumanCorrectionDataset;
  queue: DatasetReviewQueue;
  manifest: SegmentationTrainingManifest;
} => {
  const dataset = datasetFixture([
    sampleFixture({ sampleId: 'sample-offline-train', imageId: 'image-train' }),
    sampleFixture({
      sampleId: 'sample-offline-validation',
      imageId: 'image-validation',
      target: 'blush',
    }),
    sampleFixture({
      sampleId: 'sample-offline-test',
      imageId: 'image-test',
      target: 'eyeshadow',
    }),
  ]);
  const accepted = batchAcceptReviewItems(
    createDatasetReviewQueue({
      dataset,
      evidence: evidenceFixture(),
      createdAt: '2026-05-29T00:00:00.000Z',
    }),
    {
      reviewerMetadata: {
        reviewerId: 'offline-reviewer',
        reviewedAt: '2026-05-29T00:01:00.000Z',
        notes: [],
      },
      decidedAt: '2026-05-29T00:01:00.000Z',
    },
  );
  const splitBySampleId = new Map([
    ['sample-offline-train', 'train'],
    ['sample-offline-validation', 'validation'],
    ['sample-offline-test', 'test'],
  ] as const);
  const queue = accepted.items.reduce(
    (current, item) =>
      assignReviewItemSplit(current, {
        reviewItemId: item.reviewItemId,
        split: splitBySampleId.get(item.sampleId) ?? 'train',
        updatedAt: '2026-05-29T00:02:00.000Z',
      }),
    accepted,
  );
  const manifest = createSegmentationTrainingManifest({
    dataset,
    queue,
    createdAt: '2026-05-29T00:03:00.000Z',
  });

  return { dataset, queue, manifest };
};
