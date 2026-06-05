import { describe, expect, it } from 'vitest';
import { loadMaterializedDataset } from '../src/training/loaders';
import { trainBaselineSegmentationModel } from '../src/training/trainers';
import { createFixtureReader } from './baselineTestUtils';

describe('baseline mask prior trainer', () => {
  it('trains a deterministic baseline model from accepted materialized samples', async () => {
    const dataset = await loadMaterializedDataset({ reader: createFixtureReader() });
    const model = trainBaselineSegmentationModel({
      dataset,
      regions: ['lips', 'blush', 'eyeshadow'],
    });

    expect(model.schemaVersion).toBe('baseline-segmentation-model-v0.1');
    expect(model.trainedRegions).toEqual(['blush', 'eyeshadow', 'lips']);
    expect(model.regionPriors.lips.meanAlphaGrid).toHaveLength(9);
    expect(model.artifactChecksum).toMatch(/^[0-9a-f]{8}$/);
  });
});
