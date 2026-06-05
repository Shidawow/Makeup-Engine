import { describe, expect, it } from 'vitest';
import {
  TRAINING_BRIDGE_SCHEMA_VERSION,
  type TrainingBatch,
  type TrainingDatasetLoaderConfig,
} from '../src/training';

describe('training bridge schema', () => {
  it('defines deterministic loader and batch contracts', () => {
    const config = {
      schemaVersion: TRAINING_BRIDGE_SCHEMA_VERSION,
      datasetRootDir: 'tests/fixtures/materialized-dataset.sample',
      includeSplits: ['train', 'validation', 'test'],
      includeRegions: ['lips', 'blush'],
      minQualityScore: 0.7,
      strict: true,
    } satisfies TrainingDatasetLoaderConfig;
    const batch = {
      batchId: 'batch-a',
      schemaVersion: TRAINING_BRIDGE_SCHEMA_VERSION,
      split: 'train',
      sampleCount: 0,
      samples: [],
      targets: [],
      validationIssues: [],
    } satisfies TrainingBatch;

    expect(config.schemaVersion).toBe('segmentation-training-bridge-v0.1');
    expect(batch.validationIssues).toEqual([]);
  });
});
