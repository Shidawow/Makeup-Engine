import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadMaterializedDataset, type TrainingDatasetFileReader } from '../src/training/loaders';
import { trainLightweightSegmentationClassifier } from '../src/training/trainers';
import { loadPixelFixtureMap, pixelFixtureDatasetRoot } from './baselineTestUtils';

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

describe('lightweight classifier trainer', () => {
  it('trains deterministic nearest-centroid and logistic-linear classifiers', async () => {
    const dataset = await loadMaterializedDataset({ reader });
    const pixels = await loadPixelFixtureMap();
    const nearest = trainLightweightSegmentationClassifier({
      dataset,
      imagePixelsByImageId: pixels,
      regions: ['lips', 'blush', 'eyeshadow'],
      classifierKind: 'nearest-centroid',
    });
    const logistic = trainLightweightSegmentationClassifier({
      dataset,
      imagePixelsByImageId: pixels,
      regions: ['lips', 'blush', 'eyeshadow'],
      classifierKind: 'logistic-linear',
    });
    expect(nearest.trainedRegions).toEqual(['blush', 'eyeshadow', 'lips']);
    expect(logistic.classifierKind).toBe('logistic-linear');
    expect(nearest.artifactChecksum).toBe(trainLightweightSegmentationClassifier({
      dataset,
      imagePixelsByImageId: pixels,
      regions: ['lips', 'blush', 'eyeshadow'],
      classifierKind: 'nearest-centroid',
    }).artifactChecksum);
  });
});
