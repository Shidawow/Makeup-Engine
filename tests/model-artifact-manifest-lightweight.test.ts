import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createDefaultTrainerConfig } from '../src/training/config';
import { createLightweightClassifierArtifactManifest } from '../src/training/artifacts';
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

describe('model artifact manifest lightweight extension', () => {
  it('includes lightweight classifier and binary artifact boundaries', async () => {
    const dataset = await loadMaterializedDataset({ reader });
    const pixels = await loadPixelFixtureMap();
    const model = trainLightweightSegmentationClassifier({ dataset, imagePixelsByImageId: pixels, regions: ['lips'] });
    const manifest = createLightweightClassifierArtifactManifest({ model, config: createDefaultTrainerConfig(), createdAt: '2026-05-30T00:00:00.000Z' });
    expect(manifest.artifactEntries.map((entry) => entry.format)).toContain('lightweight-classifier-json');
    expect(manifest.artifactEntries.map((entry) => entry.format)).toContain('binary-mask-artifact');
  });
});
