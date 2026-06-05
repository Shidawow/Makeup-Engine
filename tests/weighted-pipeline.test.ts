import { describe, expect, it } from 'vitest';
import { runMakeupAnalysisPipeline, type ImagePixelData, type MakeupPhotoInput } from '../src/vision';
import { createMockVisionProvider } from '../src/vision/providers/mock';
import { createMockSegmentationProvider } from '../src/vision/segmentation/providers/mock';

const image: MakeupPhotoInput = {
  id: 'weighted-pipeline-fixture',
  fileName: 'weighted-pipeline.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 200000,
  source: 'fixture',
};

const pixelData: ImagePixelData = {
  width: 16,
  height: 16,
  data: new Uint8ClampedArray(
    Array.from({ length: 16 * 16 }).flatMap((_, index) => {
      const x = index % 16;
      const y = Math.floor(index / 16);
      const isLip = x >= 6 && x <= 10 && y >= 10;
      const isEye = y >= 4 && y <= 7;
      const isBlush = y >= 7 && y <= 10;
      return isLip
        ? [220, 50, 95, 255]
        : isEye
          ? [80, 70, 62, 255]
          : isBlush
            ? [225, 128, 118, 255]
            : [190, 174, 160, 255];
    }),
  ),
};

describe('weighted pipeline integration', () => {
  it('prefers segmentation-mask-weighted sampling when masks are available', async () => {
    const result = await runMakeupAnalysisPipeline({
      image,
      provider: createMockVisionProvider(),
      segmentationProvider: createMockSegmentationProvider(),
      pixelData,
    });

    expect(result.trace).toContain('weighted-pixel-analysis');
    expect(result.trace).not.toContain('pixel-analysis');
    expect(result.pixelAnalysis?.weighted?.samples.lips).toBeDefined();
    expect(result.pixelAnalysis?.skinBaseline?.differences.blush).toBeDefined();
    expect(result.pixelAnalysis?.edgeAnalysis?.features.lips).toBeDefined();
    expect(result.debug.some((item) => item.stage === 'weighted-pixel-analysis')).toBe(true);
  });
});

