import { describe, expect, it } from 'vitest';
import { predictImageConditionedMask } from '../src/training/prediction';
import { loadMaterializedDataset } from '../src/training/loaders';
import { trainImageConditionedSegmentationModel } from '../src/training/trainers';
import { createFixtureReader, loadPixelFixtureMap } from './baselineTestUtils';

describe('image-conditioned mask predictor', () => {
  it('predicts deterministic alpha scores from pixel features', async () => {
    const dataset = await loadMaterializedDataset({ reader: createFixtureReader() });
    const pixels = await loadPixelFixtureMap();
    const model = trainImageConditionedSegmentationModel({ dataset, imagePixelsByImageId: pixels, regions: ['lips'] });
    const prediction = predictImageConditionedMask({
      image: pixels.get('image-train')!,
      regionModel: model.regionModels.lips,
      featureConfig: model.featureConfig,
    });
    expect(prediction.alpha).toHaveLength(9);
    expect(prediction.scoreSummary.max).toBeGreaterThanOrEqual(prediction.scoreSummary.min);
  });
});
