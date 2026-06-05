import { describe, expect, it } from 'vitest';
import type { CosmeticRegionParameter } from '../src/vision/cosmetic-regions';
import { createImageConditionedSegmentationProvider } from '../src/vision/segmentation/providers/image-conditioned-baseline';
import { loadMaterializedDataset } from '../src/training/loaders';
import { trainImageConditionedSegmentationModel } from '../src/training/trainers';
import { createFixtureReader, loadPixelFixtureMap } from './baselineTestUtils';

const polygon = {
  space: 'normalized-image' as const,
  points: [
    { x: 0.2, y: 0.2, space: 'normalized-image' as const },
    { x: 0.8, y: 0.2, space: 'normalized-image' as const },
    { x: 0.8, y: 0.8, space: 'normalized-image' as const },
    { x: 0.2, y: 0.8, space: 'normalized-image' as const },
  ],
};

describe('image-conditioned segmentation provider', () => {
  it('outputs CosmeticSegmentationMask when pixel data is available', async () => {
    const dataset = await loadMaterializedDataset({ reader: createFixtureReader() });
    const pixels = await loadPixelFixtureMap();
    const model = trainImageConditionedSegmentationModel({ dataset, imagePixelsByImageId: pixels, regions: ['lips'] });
    const provider = createImageConditionedSegmentationProvider({ model, imagePixelsByImageId: pixels });
    const region: CosmeticRegionParameter = {
      id: 'region-lips',
      kind: 'lips',
      label: 'Lips',
      polygon,
      mask: { kind: 'polygon', polygon, feather: 0.03, opacity: 0.8 },
      confidence: 0.9,
      source: 'segmentation',
      editable: true,
      debug: [],
      parameters: { coverage: 'full-lip', colorFamily: 'pink', edgeSoftness: 0.5, glossLevel: 0.2 },
    };
    const result = await provider.segment({
      image: { id: 'image-train', fileName: 'fixture.jpg', mimeType: 'image/jpeg', sizeBytes: 1, source: 'fixture' },
      faceMesh: { imageId: 'image-train', faceId: 'face', landmarks: [], boundingBox: { x: 0, y: 0, width: 1, height: 1, space: 'normalized-image' }, confidence: 1 },
      cosmeticRegions: [region],
      targets: ['lips'],
    });
    expect(result.providerId).toBe('image-conditioned-pixel-prior-provider');
    expect(result.masks[0].grid.alpha).toHaveLength(9);
  });
});
