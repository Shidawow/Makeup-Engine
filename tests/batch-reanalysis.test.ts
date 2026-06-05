import { describe, expect, it } from 'vitest';
import {
  applyMaskBrushEdit,
  createEditableCosmeticMask,
  recomputeInvalidatedRegions,
  reanalyzeMakeupWithEditableMasksBatch,
  runMakeupAnalysisPipeline,
  type ImagePixelData,
  type MakeupPhotoInput,
} from '../src/vision';
import { createMockVisionProvider } from '../src/vision/providers/mock';
import { createMockSegmentationProvider } from '../src/vision/segmentation/providers/mock';

const image: MakeupPhotoInput = {
  id: 'batch-image',
  fileName: 'batch.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 120000,
  source: 'fixture',
};

const pixelData: ImagePixelData = {
  width: 12,
  height: 12,
  data: new Uint8ClampedArray(
    Array.from({ length: 12 * 12 }).flatMap((_, index) => {
      const x = index % 12;
      const y = Math.floor(index / 12);
      const isLip = x >= 4 && x <= 7 && y >= 8;
      const isBlush = y >= 5 && y <= 8;

      return isLip
        ? [220, 60, 90, 255]
        : isBlush
          ? [210, 140, 125, 255]
          : [180, 170, 160, 255];
    }),
  ),
};

describe('batch mask reanalysis', () => {
  it('reanalyzes all dirty regions without rerunning FaceMesh or clean masks', async () => {
    const analysis = await runMakeupAnalysisPipeline({
      image,
      provider: createMockVisionProvider(),
      segmentationProvider: createMockSegmentationProvider(),
      pixelData,
    });
    const baseEditableMasks =
      analysis.cosmeticSegmentation.masks.map(createEditableCosmeticMask);
    const cache = recomputeInvalidatedRegions({
      imageId: analysis.imageId,
      pixelData,
      masks: baseEditableMasks.map((mask) => mask.mergedMask),
      invalidatedTargets: baseEditableMasks.map((mask) => mask.mergedMask.target),
    }).cache;
    const editedMasks = baseEditableMasks.map((mask) => {
      if (mask.mergedMask.target !== 'lips' && mask.mergedMask.target !== 'blush') {
        return mask;
      }

      return applyMaskBrushEdit(mask, {
        id: `batch-${mask.mergedMask.target}`,
        target: mask.mergedMask.target,
        tool: 'brush-add',
        point: { x: 0.5, y: 0.6, space: 'normalized-image' },
        radius: 0.2,
        strength: 0.7,
        createdAt: '2026-05-28T00:00:00.000Z',
      });
    });
    const result = reanalyzeMakeupWithEditableMasksBatch({
      previous: analysis,
      pixelData,
      editableMasks: editedMasks,
      dirtyTargets: ['lips', 'blush'],
      mode: 'all-dirty',
      previousCache: cache,
    });

    expect(result.analysis.trace).toContain('batch-mask-reanalysis');
    expect(result.recomputedTargets.sort()).toEqual(['blush', 'lips']);
    expect(result.reusedTargets).toEqual(
      expect.arrayContaining(['eyeshadow', 'eyeliner', 'contour', 'highlight']),
    );
    expect(result.analysis.faceMesh.faceId).toBe(analysis.faceMesh.faceId);
    expect(result.invalidatedTargets).toEqual(['blush', 'lips']);
  });
});
