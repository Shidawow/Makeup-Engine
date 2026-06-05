import { describe, expect, it } from 'vitest';
import {
  analyzeMakeupPixels,
  buildCosmeticRegionsFromFaceMesh,
  type FaceMeshGeometry,
  type ImagePixelData,
} from '../src/vision';
import { createMockVisionProvider } from '../src/vision/providers/mock';
import type { MakeupPhotoInput } from '../src/vision';

const image: MakeupPhotoInput = {
  id: 'pixel-fixture',
  fileName: 'pixel-fixture.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 10000,
  source: 'fixture',
};

const createSolidImage = (): ImagePixelData => {
  const width = 100;
  const height = 100;
  const data = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      data[offset] = x > 40 && x < 60 && y > 62 && y < 74 ? 210 : 180;
      data[offset + 1] = x > 25 && x < 75 && y > 45 && y < 65 ? 96 : 170;
      data[offset + 2] = x > 30 && x < 70 && y > 30 && y < 42 ? 120 : 160;
      data[offset + 3] = 255;
    }
  }

  return { width, height, data };
};

describe('pixel sampling engine', () => {
  it('extracts deterministic makeup pixel features from cosmetic polygons', async () => {
    const providerResult = await createMockVisionProvider().analyze(image);
    const regions = buildCosmeticRegionsFromFaceMesh({
      imageId: image.id,
      faceMesh: providerResult.faceMesh as FaceMeshGeometry,
      segmentationMasks: providerResult.segmentationMasks,
    });
    const analysis = analyzeMakeupPixels(image.id, createSolidImage(), regions);

    expect(analysis.lips.saturation).toBeGreaterThan(0.2);
    expect(
      analysis.lips.dominantHue < 30 || analysis.lips.dominantHue > 330,
    ).toBe(true);
    expect(analysis.blush.opacity).toBeGreaterThan(0.2);
    expect(analysis.eyes.eyeshadowDarkness).toBeGreaterThan(0.2);
    expect(analysis.debug).toHaveLength(3);
  });
});
