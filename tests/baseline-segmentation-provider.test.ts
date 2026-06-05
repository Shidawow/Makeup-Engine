import { describe, expect, it } from 'vitest';
import type { CosmeticRegionParameter } from '../src/vision/cosmetic-regions';
import { createBaselineSegmentationProvider } from '../src/vision/segmentation/providers/baseline';
import { loadMaterializedDataset } from '../src/training/loaders';
import { trainBaselineSegmentationModel } from '../src/training/trainers';
import { createFixtureReader } from './baselineTestUtils';

const polygon = {
  space: 'normalized-image' as const,
  points: [
    { x: 0.3, y: 0.45, space: 'normalized-image' as const },
    { x: 0.7, y: 0.45, space: 'normalized-image' as const },
    { x: 0.7, y: 0.58, space: 'normalized-image' as const },
    { x: 0.3, y: 0.58, space: 'normalized-image' as const },
  ],
};

describe('baseline segmentation provider', () => {
  it('outputs CosmeticSegmentationMask from a trained baseline prior', async () => {
    const dataset = await loadMaterializedDataset({ reader: createFixtureReader() });
    const model = trainBaselineSegmentationModel({ dataset, regions: ['lips'] });
    const provider = createBaselineSegmentationProvider(model);
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
      parameters: {
        coverage: 'full-lip',
        colorFamily: 'pink',
        edgeSoftness: 0.5,
        glossLevel: 0.2,
      },
    };
    const result = await provider.segment({
      image: {
        id: 'image-provider',
        fileName: 'fixture.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 1,
        source: 'fixture',
      },
      faceMesh: {
        imageId: 'image-provider',
        faceId: 'face',
        landmarks: [],
        boundingBox: { x: 0, y: 0, width: 1, height: 1, space: 'normalized-image' },
        confidence: 1,
      },
      cosmeticRegions: [region],
      targets: ['lips'],
    });

    expect(result.providerId).toBe('baseline-mask-prior-provider');
    expect(result.masks[0].target).toBe('lips');
    expect(result.masks[0].grid.alpha).toHaveLength(9);
  });
});
