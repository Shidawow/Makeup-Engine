import { describe, expect, it } from 'vitest';
import {
  DATASET_METRICS_SCHEMA_VERSION,
  type DatasetCurationMetrics,
} from '../src/templates/schema';
import {
  batchAcceptReviewItems,
  computeDatasetCurationMetrics,
  createDatasetReviewQueue,
  exportDatasetManifest,
} from '../src/templates/storage';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
} from './dataset-review-fixtures';

describe('dataset metrics schema', () => {
  it('creates a typed curation metrics contract', () => {
    const dataset = datasetFixture([sampleFixture({ sampleId: 'sample-metrics-schema' })]);
    const queue = batchAcceptReviewItems(
      createDatasetReviewQueue({
        dataset,
        evidence: evidenceFixture(),
        createdAt: '2026-05-29T00:00:00.000Z',
      }),
      {
        reviewerMetadata: {
          reviewerId: 'metrics-reviewer',
          reviewedAt: '2026-05-29T00:01:00.000Z',
          notes: [],
        },
        decidedAt: '2026-05-29T00:01:00.000Z',
      },
    );
    const metrics: DatasetCurationMetrics = computeDatasetCurationMetrics({
      dataset,
      queue,
      manifest: exportDatasetManifest({ dataset, queue }),
    });

    expect(metrics.schemaVersion).toBe(DATASET_METRICS_SCHEMA_VERSION);
    expect(metrics.totalSamples).toBe(1);
    expect(metrics.regionDistribution.totalByRegion.lips).toBe(1);
    expect(metrics.qualityScoreDistribution.totalByStatus.accepted).toBe(1);
    expect(metrics.riskSummary.riskLevel).toMatch(/low|medium|high/);
  });
});
