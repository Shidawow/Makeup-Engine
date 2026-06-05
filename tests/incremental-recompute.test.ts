import { describe, expect, it } from 'vitest';
import {
  createMaskSignature,
  recomputeInvalidatedRegions,
  type IncrementalRegionCache,
} from '../src/vision/pipeline/incremental';
import { createMockSegmentationProvider } from '../src/vision/segmentation/providers/mock';
import { buildFaceMeshRegionsFromCanonicalFace } from '../src/vision/cosmetic-regions';
import { createMockVisionProvider } from '../src/vision/providers/mock';
import { runMakeupAnalysisPipeline, type ImagePixelData, type MakeupPhotoInput } from '../src/vision';

const image: MakeupPhotoInput = {
  id: 'incremental-fixture',
  fileName: 'incremental.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 128000,
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
      return isLip ? [220, 60, 90, 255] : isBlush ? [210, 140, 125, 255] : [180, 170, 160, 255];
    }),
  ),
};

describe('incremental recompute', () => {
  it('recomputes only invalidated cosmetic targets', async () => {
    const analysis = await runMakeupAnalysisPipeline({
      image,
      provider: createMockVisionProvider(),
      segmentationProvider: createMockSegmentationProvider(),
      pixelData,
    });
    const cache: IncrementalRegionCache = {
      imageId: analysis.imageId,
      entries: {
        lips: {
          target: 'lips',
          maskId: analysis.cosmeticSegmentation.masks.find((mask) => mask.target === 'lips')?.id ?? 'lips',
          maskSignature: 'stale-signature',
          stages: ['weighted-pixel-analysis', 'skin-baseline', 'edge-analysis'],
          weighted: analysis.pixelAnalysis!.weighted!,
          skinBaseline: analysis.pixelAnalysis!.skinBaseline!,
          edgeAnalysis: analysis.pixelAnalysis!.edgeAnalysis!,
        },
        blush: {
          target: 'blush',
          maskId: analysis.cosmeticSegmentation.masks.find((mask) => mask.target === 'blush')?.id ?? 'blush',
          maskSignature: createMaskSignature(
            analysis.cosmeticSegmentation.masks.find((mask) => mask.target === 'blush') ??
              analysis.cosmeticSegmentation.masks[0],
          ),
          stages: ['weighted-pixel-analysis', 'skin-baseline', 'edge-analysis'],
          weighted: analysis.pixelAnalysis!.weighted!,
          skinBaseline: analysis.pixelAnalysis!.skinBaseline!,
          edgeAnalysis: analysis.pixelAnalysis!.edgeAnalysis!,
        },
      },
    };

    const recompute = recomputeInvalidatedRegions({
      imageId: analysis.imageId,
      pixelData,
      masks: analysis.cosmeticSegmentation.masks,
      invalidatedTargets: ['lips'],
      previousCache: cache,
    });

    expect(recompute.recomputedTargets).toContain('lips');
    expect(recompute.reusedTargets).toContain('blush');
    expect(recompute.debug.join('|')).toContain('recomputed:lips');
  });
});
