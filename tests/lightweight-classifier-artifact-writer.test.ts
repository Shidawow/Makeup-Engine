import { describe, expect, it } from 'vitest';
import { exportLightweightClassifierJson, validateLightweightClassifierArtifact } from '../src/training/artifacts';
import { trainLightweightSegmentationClassifier } from '../src/training/trainers';
import { loadMaterializedDataset, type TrainingDatasetFileReader } from '../src/training/loaders';
import { loadPixelFixtureMap, pixelFixtureDatasetRoot } from './baselineTestUtils';
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

describe('lightweight classifier artifact writer', () => {
  it('exports stable model json', async () => {
    const dataset = await loadMaterializedDataset({ reader });
    const pixels = await loadPixelFixtureMap();
    const model = trainLightweightSegmentationClassifier({ dataset, imagePixelsByImageId: pixels, regions: ['lips'] });
    expect(validateLightweightClassifierArtifact(model).valid).toBe(true);
    expect(exportLightweightClassifierJson(model)).toContain('lightweight-classifier-v0.1');
  });
});
