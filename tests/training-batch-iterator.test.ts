import { describe, expect, it } from 'vitest';
import {
  createBalancedRegionBatchIterator,
  createRegionBatchIterator,
  createSplitBatchIterator,
  createTrainingBatchIterator,
  loadMaterializedDataset,
  summarizeBatches,
} from '../src/training';
import { fixtureReader } from './training-bridge-fixtures';

describe('training batch iterator', () => {
  it('creates deterministic split, region, and balanced batches', async () => {
    const dataset = await loadMaterializedDataset({ reader: fixtureReader() });
    const batches = createTrainingBatchIterator(dataset.samples, { batchSize: 2 });

    expect(batches.map((batch) => batch.sampleCount)).toEqual([2, 1]);
    expect(createSplitBatchIterator(dataset, 'train', { batchSize: 8 })).toHaveLength(1);
    expect(createRegionBatchIterator(dataset, 'lips', { batchSize: 8 })).toHaveLength(1);
    expect(
      createBalancedRegionBatchIterator(dataset, {
        batchSize: 8,
        regions: ['blush', 'lips'],
      }).map((batch) => batch.regionId),
    ).toEqual(['blush', 'lips']);
    expect(summarizeBatches(batches)).toContain('training-batch');
  });
});
