import { describe, expect, it } from 'vitest';
import { evaluateImageConditionedSegmentationModel } from '../src/training/evaluation';
import { loadMaterializedDataset } from '../src/training/loaders';
import { trainImageConditionedSegmentationModel } from '../src/training/trainers';
import { createFixtureReader, loadPixelFixtureMap } from './baselineTestUtils';

describe('image-conditioned model evaluator', () => {
  it('produces image-conditioned baseline metrics', async () => {
    const dataset = await loadMaterializedDataset({ reader: createFixtureReader() });
    const pixels = await loadPixelFixtureMap();
    const model = trainImageConditionedSegmentationModel({ dataset, imagePixelsByImageId: pixels, regions: ['lips', 'blush', 'eyeshadow'] });
    const evaluation = evaluateImageConditionedSegmentationModel({ model, dataset, imagePixelsByImageId: pixels });
    expect(evaluation.evaluationSampleCount).toBe(2);
    expect(evaluation.missingPixelArtifactCount).toBe(0);
    expect(evaluation.softIoU).toBeGreaterThanOrEqual(0);
  });
});
