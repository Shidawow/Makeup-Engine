import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { evaluateLightweightSegmentationClassifier } from '../src/training/evaluation';
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

describe('lightweight classifier evaluator', () => {
  it('computes deterministic classifier metrics', async () => {
    const dataset = await loadMaterializedDataset({ reader });
    const pixels = await loadPixelFixtureMap();
    const model = trainLightweightSegmentationClassifier({ dataset, imagePixelsByImageId: pixels, regions: ['lips', 'blush', 'eyeshadow'] });
    const evaluation = evaluateLightweightSegmentationClassifier({ model, dataset, imagePixelsByImageId: pixels });
    expect(evaluation.evaluationSampleCount).toBe(2);
    expect(evaluation.readinessStatus).toBe('evaluated-lightweight-classifier');
  });
});
