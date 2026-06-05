import { describe, expect, it } from 'vitest';
import {
  DATASET_MANIFEST_SCHEMA_VERSION,
  type DatasetManifest,
} from '../src/templates/schema';
import {
  batchAcceptReviewItems,
  createDatasetManifest,
  createDatasetReviewQueue,
} from '../src/templates/storage';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
} from './dataset-review-fixtures';

const reviewer = {
  reviewerId: 'manifest-reviewer',
  reviewedAt: '2026-05-28T00:03:00.000Z',
  notes: [],
};

describe('dataset manifest schema', () => {
  it('summarizes quality, split, region, and dedupe counts', () => {
    const samples = [
      sampleFixture({ sampleId: 'sample-manifest-a', target: 'lips' }),
      sampleFixture({
        sampleId: 'sample-manifest-b',
        target: 'blush',
        imageId: 'image-a',
        templateId: 'template-a',
      }),
    ];
    const dataset = datasetFixture(samples);
    const queue = batchAcceptReviewItems(
      createDatasetReviewQueue({
        dataset,
        evidence: evidenceFixture(),
        createdAt: '2026-05-28T00:02:00.000Z',
      }),
      {
        reviewerMetadata: reviewer,
        decidedAt: reviewer.reviewedAt,
      },
    );
    const manifest: DatasetManifest = createDatasetManifest({
      dataset,
      queue,
      exportFormat: 'manifest',
      createdAt: '2026-05-28T00:04:00.000Z',
      exportedAt: '2026-05-28T00:05:00.000Z',
    });

    expect(manifest.schemaVersion).toBe(DATASET_MANIFEST_SCHEMA_VERSION);
    expect(manifest.sampleCount).toBe(2);
    expect(manifest.acceptedCount).toBe(2);
    expect(manifest.regionSummary.lips).toBe(1);
    expect(manifest.regionSummary.blush).toBe(1);
    expect(manifest.imageDeduplicationSummary.duplicateIds).toEqual(['image-a']);
    expect(manifest.templateDeduplicationSummary.duplicateIds).toEqual(['template-a']);
    expect(manifest.qualityDistribution.accepted).toBe(2);
    expect(manifest.exportManifest.exportFormat).toBe('manifest');
  });
});
