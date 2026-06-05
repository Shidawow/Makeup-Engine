import { describe, expect, it } from 'vitest';
import { DATASET_REPLAY_SCHEMA_VERSION } from '../src/templates/schema';
import {
  createDatasetReplayPayload,
  createDatasetReviewQueue,
} from '../src/templates/storage';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
  templateFixture,
} from './dataset-review-fixtures';

describe('dataset replay schema', () => {
  it('builds replay payloads with masks, diff heatmap, before/after analysis, and evidence', () => {
    const sample = sampleFixture({ sampleId: 'sample-replay-schema' });
    const dataset = datasetFixture([sample]);
    const queue = createDatasetReviewQueue({
      dataset,
      evidence: evidenceFixture(),
      createdAt: '2026-05-28T00:02:00.000Z',
    });
    const payload = createDatasetReplayPayload({
      sample,
      item: queue.items[0],
      templateBefore: templateFixture('template-before'),
      templateAfter: templateFixture('template-after'),
    });

    expect(payload.schemaVersion).toBe(DATASET_REPLAY_SCHEMA_VERSION);
    expect(payload.originalMask.id).toBe('sample-replay-schema-original');
    expect(payload.humanEditedMask.id).toBe('sample-replay-schema-edited');
    expect(payload.diffHeatmap.alpha).toEqual(sample.maskDiff.diffHeatmap.alpha);
    expect(payload.templateBefore?.templateId).toBe('template-before');
    expect(payload.templateAfter?.templateId).toBe('template-after');
    expect(payload.evidenceSummary.isTrainingReady).toBe(true);
  });
});
