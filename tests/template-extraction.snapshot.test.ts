import { describe, expect, it } from 'vitest';
import { buildMakeupTemplateFromVisionAnalysis } from '../src/template-engine';
import {
  runMakeupAnalysisPipeline,
  type ImagePixelData,
  type MakeupPhotoInput,
} from '../src/vision';
import { createMockVisionProvider } from '../src/vision/providers/mock';

const photo: MakeupPhotoInput = {
  id: 'template-pixel-fixture',
  fileName: 'template-pixel-fixture.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 120000,
  source: 'fixture',
  uploadedAt: '2026-05-27T00:00:00.000Z',
};

const pixelData: ImagePixelData = {
  width: 12,
  height: 12,
  data: new Uint8ClampedArray(
    Array.from({ length: 12 * 12 }).flatMap((_, index) => {
      const x = index % 12;
      const y = Math.floor(index / 12);
      const isLip = x >= 5 && x <= 7 && y >= 8;
      const isEye = y >= 3 && y <= 5;
      const isBlush = y >= 6 && y <= 8;
      return isLip
        ? [210, 70, 110, 255]
        : isEye
          ? [90, 78, 70, 255]
          : isBlush
            ? [225, 128, 118, 255]
            : [190, 178, 164, 255];
    }),
  ),
};

describe('vision template extraction', () => {
  it('builds MakeupTemplate JSON from pixel and semantic analysis', async () => {
    const analysis = await runMakeupAnalysisPipeline({
      image: photo,
      provider: createMockVisionProvider(),
      pixelData,
    });
    const template = buildMakeupTemplateFromVisionAnalysis({
      image: photo,
      templateName: 'Pixel Semantic Template',
      createdBy: 'test',
      analysis,
    });

    expect({
      id: template.id,
      goals: template.goals,
      styleTags: template.metadata.styleTags,
      stepRegions: template.steps.map((step) => step.region),
      notes: template.notes?.slice(0, 4),
    }).toMatchInlineSnapshot(`
      {
        "goals": [
          "photo_to_template_conversion",
          "pixel_makeup_understanding",
          "future_coaching",
        ],
        "id": "template-template-pixel-fixture",
        "notes": [
          "lip_style:soft_gradient",
          "lip_finish:gloss",
          "blush_style:soft_diffused",
          "eye_style:clean_defined",
        ],
        "stepRegions": [
          "lip",
          "blush",
          "eye",
        ],
        "styleTags": [
          "soft_gradient",
          "gloss",
          "soft_diffused",
          "clean_defined",
        ],
      }
    `);
  });
});
