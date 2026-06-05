import { describe, expect, it } from 'vitest';
import { loadMaterializedDataset } from '../src/training/loaders';
import { trainImageConditionedSegmentationModel } from '../src/training/trainers';
import { createFixtureReader, loadPixelFixtureMap } from './baselineTestUtils';

describe('image-conditioned baseline trainer', () => {
  it('trains an image-conditioned pixel prior model from pixel artifacts', async () => {
    const dataset = await loadMaterializedDataset({ reader: createFixtureReader() });
    const model = trainImageConditionedSegmentationModel({
      dataset,
      imagePixelsByImageId: await loadPixelFixtureMap(),
      regions: ['lips', 'blush', 'eyeshadow'],
    });
    expect(model.trainedRegions).toEqual(['blush', 'eyeshadow', 'lips']);
    expect(model.trainingSummary.positivePixelCount).toBeGreaterThan(0);
    expect(model.artifactChecksum).toMatch(/^[0-9a-f]{8}$/);
  });
});
