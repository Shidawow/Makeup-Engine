import { describe, expect, it } from 'vitest';
import { runMakeupAnalysisPipeline, type MakeupPhotoInput } from '../src/vision';
import { createMockVisionProvider } from '../src/vision/providers/mock';
import { createMockSegmentationProvider } from '../src/vision/segmentation/providers/mock';

const image: MakeupPhotoInput = {
  id: 'segmentation-pipeline-fixture',
  fileName: 'segmentation-pipeline-fixture.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 128000,
  source: 'fixture',
};

describe('segmentation pipeline integration', () => {
  it('runs segmentation-analysis between cosmetic regions and makeup analysis', async () => {
    const result = await runMakeupAnalysisPipeline({
      image,
      provider: createMockVisionProvider(),
      segmentationProvider: createMockSegmentationProvider(),
    });

    expect(result.trace).toEqual([
      'image-input',
      'face-detection',
      'landmarks',
      'segmentation',
      'cosmetic-regions',
      'segmentation-analysis',
      'makeup-analysis',
      'template-parameterization',
    ]);
    expect(result.cosmeticSegmentation.providerId).toBe('mock-segmentation-provider');
    expect(result.cosmeticSegmentation.masks).toHaveLength(6);
    expect(result.debug.some((artifact) => artifact.stage === 'segmentation-analysis')).toBe(true);
  });
});

