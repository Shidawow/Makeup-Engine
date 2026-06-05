import { describe, expect, it } from 'vitest';
import { runMakeupAnalysisPipeline, type MakeupPhotoInput } from '../src/vision';
import { createMockVisionProvider } from '../src/vision/providers/mock';

const image: MakeupPhotoInput = {
  id: 'makeup-analysis-001',
  fileName: 'daily-makeup-analysis.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 220000,
  source: 'fixture',
};

describe('makeup analysis pipeline', () => {
  it('runs deterministic photo to makeup parameterization flow', async () => {
    const result = await runMakeupAnalysisPipeline({
      image,
      provider: createMockVisionProvider(),
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
    expect(result.cosmeticRegions.map((region) => region.kind)).toEqual([
      'lips',
      'eyes',
      'brows',
      'blush',
      'contour',
      'highlight',
    ]);
    expect(result.parameters.version).toBe('0.1');
    expect(result.parameters.lips.colorFamily).toBe('pink');
    expect(result.parameters.eyes.eyelinerWeight).toBeGreaterThan(0);
    expect(result.parameters.editableRegionIds).toHaveLength(6);
    expect(result.parameters.templateSignals).toHaveLength(6);
    expect(result.cosmeticSegmentation.masks).toHaveLength(6);
    expect(result.debug.some((item) => item.stage === 'cosmetic-regions')).toBe(
      true,
    );
  });

  it('produces mask and polygon output for every cosmetic region', async () => {
    const result = await runMakeupAnalysisPipeline({
      image,
      provider: createMockVisionProvider(),
    });

    for (const region of result.cosmeticRegions) {
      expect(region.editable).toBe(true);
      expect(region.polygon.space).toBe('normalized-image');
      expect(region.polygon.points.length).toBeGreaterThanOrEqual(3);
      expect(region.mask.kind).toBe('polygon');
      expect(region.mask.polygon.space).toBe('normalized-image');
      expect(region.confidence).toBeGreaterThan(0);
    }
  });
});
