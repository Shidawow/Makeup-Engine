import { describe, expect, it } from 'vitest';
import { buildCosmeticRegionsFromFaceMesh, type MakeupPhotoInput } from '../src/vision';
import { createMockVisionProvider } from '../src/vision/providers/mock';
import { createMockSegmentationProvider } from '../src/vision/segmentation/providers/mock';

const image: MakeupPhotoInput = {
  id: 'segmentation-provider-fixture',
  fileName: 'segmentation-provider-fixture.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 128000,
  source: 'fixture',
};

describe('segmentation provider', () => {
  it('covers provider lifecycle and emits deterministic masks', async () => {
    const vision = await createMockVisionProvider().analyze(image);
    const cosmeticRegions = buildCosmeticRegionsFromFaceMesh({
      imageId: image.id,
      faceMesh: vision.faceMesh,
      segmentationMasks: vision.segmentationMasks,
    });
    const provider = createMockSegmentationProvider();

    await provider.initialize();
    await provider.warmup();
    const first = await provider.segment({
      image,
      faceMesh: vision.faceMesh,
      cosmeticRegions,
    });
    const second = await provider.segment({
      image,
      faceMesh: vision.faceMesh,
      cosmeticRegions,
    });
    provider.dispose();

    expect(provider.kind).toBe('mock');
    expect(first).toEqual(second);
    expect(first.masks).toHaveLength(6);
    expect(first.masks.map((mask) => mask.target)).toEqual([
      'lips',
      'eyeshadow',
      'eyeliner',
      'blush',
      'contour',
      'highlight',
    ]);
    expect(first.debug[0]?.stage).toBe('segmentation-provider');
  });
});

