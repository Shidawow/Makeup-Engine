import { describe, expect, it } from 'vitest';
import { predictMaskWithLightweightClassifier } from '../src/training/prediction';
import { trainLightweightSegmentationClassifier } from '../src/training/trainers';
import { loadPixelFixtureMap, pixelFixtureDatasetRoot } from './baselineTestUtils';
import { loadMaterializedDataset, type TrainingDatasetFileReader } from '../src/training/loaders';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const reader: TrainingDatasetFileReader = {
  readText: async (relativePath) =>
    readFile(path.join(pixelFixtureDatasetRoot, ...relativePath.split('/')), 'utf8'),
  exists: async (relativePath) => {
    try {
      await access(path.join(pixelFixtureDatasetRoot, ...relativePath.split('/')));
      return true;
    } catch {
      return false;
    }
  },
};

describe('lightweight classifier predictor', () => {
  it('predicts a deterministic alpha mask', async () => {
    const dataset = await loadMaterializedDataset({ reader });
    const pixels = await loadPixelFixtureMap();
    const model = trainLightweightSegmentationClassifier({ dataset, imagePixelsByImageId: pixels, regions: ['lips'] });
    const prediction = predictMaskWithLightweightClassifier({
      image: pixels.get('image-train')!,
      classifier: model.regionClassifiers.lips!,
      featureConfig: { featureStride: 1, alphaPositiveThreshold: 0.4, alphaNegativeThreshold: 0.05, localContrastWindow: 1 },
    });
    expect(prediction.alpha).toHaveLength(9);
    expect(prediction.confidence).toBeGreaterThan(0);
  });
});
