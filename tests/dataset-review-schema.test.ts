import { describe, expect, it } from 'vitest';
import {
  DATASET_QUALITY_STATUSES,
  DATASET_REVIEW_REASONS,
  DATASET_REVIEW_SCHEMA_VERSION,
  DATASET_SPLITS,
  type DatasetReviewItem,
} from '../src/templates/schema';
import {
  createDatasetReviewQueue,
  runQualityGate,
} from '../src/templates/storage';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
} from './dataset-review-fixtures';

describe('dataset review schema', () => {
  it('defines deterministic review states, split states, and reason taxonomy', () => {
    expect(DATASET_REVIEW_SCHEMA_VERSION).toBe('dataset-review-v0.1');
    expect(DATASET_QUALITY_STATUSES).toEqual([
      'pending_review',
      'accepted',
      'rejected',
      'needs_second_review',
      'ready_for_training',
      'excluded',
    ]);
    expect(DATASET_SPLITS).toEqual([
      'train',
      'validation',
      'test',
      'holdout',
      'unassigned',
    ]);
    expect(DATASET_REVIEW_REASONS).toContain('mask_boundary_error');
    expect(DATASET_REVIEW_REASONS).toContain('accepted_clean');
  });

  it('creates typed review items with evidence summaries and history', () => {
    const sample = sampleFixture({ sampleId: 'sample-review-schema' });
    const dataset = datasetFixture([sample]);
    const queue = createDatasetReviewQueue({
      dataset,
      evidence: evidenceFixture(),
      createdAt: '2026-05-28T00:02:00.000Z',
    });
    const item: DatasetReviewItem = queue.items[0];

    expect(item.schemaVersion).toBe(DATASET_REVIEW_SCHEMA_VERSION);
    expect(item.sampleId).toBe(sample.sampleId);
    expect(item.currentDecision.status).toBe('pending_review');
    expect(item.reviewHistory).toHaveLength(1);
    expect(item.evidenceSummary).toEqual(runQualityGate({ sample, evidence: evidenceFixture() }).evidenceSummary);
  });
});
