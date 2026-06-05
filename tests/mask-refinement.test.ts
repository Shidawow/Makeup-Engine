import { describe, expect, it } from 'vitest';
import { buildCosmeticRegionsFromFaceMesh, type MakeupPhotoInput } from '../src/vision';
import { createMockVisionProvider } from '../src/vision/providers/mock';
import {
  compositeMasks,
  refineCosmeticRegionMask,
  smoothMaskEdges,
} from '../src/vision/segmentation';

const image: MakeupPhotoInput = {
  id: 'mask-refinement-fixture',
  fileName: 'mask-refinement-fixture.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 128000,
  source: 'fixture',
};

describe('mask refinement', () => {
  it('converts heuristic polygons into normalized soft masks', async () => {
    const vision = await createMockVisionProvider().analyze(image);
    const [lipRegion] = buildCosmeticRegionsFromFaceMesh({
      imageId: image.id,
      faceMesh: vision.faceMesh,
      segmentationMasks: vision.segmentationMasks,
    });

    if (!lipRegion) {
      throw new Error('Missing lip region fixture.');
    }

    const mask = refineCosmeticRegionMask(lipRegion, {
      imageId: image.id,
      gridSize: 16,
      featherRadius: 0.04,
    });
    const smoothed = smoothMaskEdges(mask.grid, 1);
    const composite = compositeMasks([{ ...mask, grid: smoothed }]);

    expect(mask.target).toBe('lips');
    expect(mask.grid.width).toBe(16);
    expect(mask.grid.height).toBe(16);
    expect(mask.grid.alpha.every((alpha) => alpha >= 0 && alpha <= 1)).toBe(true);
    expect(Math.max(...mask.grid.alpha)).toBeGreaterThan(0.7);
    expect(composite.alpha.length).toBe(256);
  });
});

