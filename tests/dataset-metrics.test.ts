import { describe, expect, it } from 'vitest';
import {
  assignReviewItemSplit,
  batchAcceptReviewItems,
  computeDatasetCurationMetrics,
  computeReviewReasonDistribution,
  computeSplitBalance,
  createDatasetReviewQueue,
  detectDatasetImbalance,
} from '../src/templates/storage';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
} from './dataset-review-fixtures';

describe('dataset curation metrics engine', () => {
  it('computes deterministic distribution, readiness, and risk metrics', () => {
    const dataset = datasetFixture([
      sampleFixture({ sampleId: 'sample-metrics-a', target: 'lips' }),
      sampleFixture({ sampleId: 'sample-metrics-b', target: 'blush' }),
    ]);
    const created = createDatasetReviewQueue({
      dataset,
      evidence: evidenceFixture(),
      createdAt: '2026-05-29T00:00:00.000Z',
    });
    const accepted = batchAcceptReviewItems(created, {
      reviewerMetadata: {
        reviewerId: 'metrics-reviewer',
        reviewedAt: '2026-05-29T00:01:00.000Z',
        notes: [],
      },
      decidedAt: '2026-05-29T00:01:00.000Z',
    });
    const split = assignReviewItemSplit(accepted, {
      reviewItemId: accepted.items[0].reviewItemId,
      split: 'train',
      updatedAt: '2026-05-29T00:02:00.000Z',
    });
    const metricsA = computeDatasetCurationMetrics({ dataset, queue: split });
    const metricsB = computeDatasetCurationMetrics({ dataset, queue: split });

    expect(metricsA).toEqual(metricsB);
    expect(metricsA.acceptedSamples).toBe(2);
    expect(metricsA.trainingReadinessScore).toBeGreaterThan(0);
    expect(computeReviewReasonDistribution(split).totalByReason.accepted_clean).toBeGreaterThan(0);
    expect(computeSplitBalance(split).splitDistribution.train).toBeGreaterThan(0);
    expect(detectDatasetImbalance(split)).toEqual(expect.arrayContaining([
      'missing region:contour',
    ]));
  });
});
