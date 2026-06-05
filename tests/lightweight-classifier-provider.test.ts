import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createLightweightClassifierSegmentationProvider } from '../src/vision/segmentation/providers';
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

describe('lightweight classifier provider', () => {
  it('outputs CosmeticSegmentationMask through opt-in provider', async () => {
    const dataset = await loadMaterializedDataset({ reader });
    const pixels = await loadPixelFixtureMap();
    const model = trainLightweightSegmentationClassifier({ dataset, imagePixelsByImageId: pixels, regions: ['lips'] });
    const provider = createLightweightClassifierSegmentationProvider({ model, imagePixelsByImageId: pixels });
    const result = await provider.segment({
      image: { id: 'image-train', uri: 'fixture://image-train' },
      faceMesh: { imageId: 'image-train', landmarks: [], bounds: { x: 0, y: 0, width: 1, height: 1 }, confidence: 1 },
      cosmeticRegions: [{
        id: 'region-lips',
        kind: 'lips',
        label: 'lips',
        polygon: { points: [{ x: 0.2, y: 0.2 }, { x: 0.8, y: 0.2 }, { x: 0.8, y: 0.8 }, { x: 0.2, y: 0.8 }] },
        mask: { kind: 'polygon', polygon: { points: [{ x: 0.2, y: 0.2 }, { x: 0.8, y: 0.2 }, { x: 0.8, y: 0.8 }, { x: 0.2, y: 0.8 }] }, feather: 0.03, opacity: 1 },
        confidence: 1,
        source: 'inference',
        editable: true,
        debug: [],
        parameters: { coverage: 'full-lip', colorFamily: 'pink', edgeSoftness: 0.2, glossLevel: 0.3 },
      }],
      targets: ['lips'],
    });
    expect(result.masks[0].target).toBe('lips');
    expect(result.masks[0].grid.alpha).toHaveLength(9);
  });
});
