import { describe, expect, it } from 'vitest';
import { runMakeupAnalysisPipeline, type MakeupPhotoInput } from '../src/vision';
import { createMockVisionProvider } from '../src/vision/providers/mock';

const image: MakeupPhotoInput = {
  id: 'polygon-snapshot-001',
  fileName: 'polygon-snapshot.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 128000,
  source: 'fixture',
};

describe('cosmetic polygon snapshots', () => {
  it('keeps normalized cosmetic polygons stable', async () => {
    const result = await runMakeupAnalysisPipeline({
      image,
      provider: createMockVisionProvider(),
    });

    const snapshot = result.cosmeticRegions.map((region) => ({
      kind: region.kind,
      pointCount: region.polygon.points.length,
      firstPoint: region.polygon.points[0],
      maskKind: region.mask.kind,
      confidence: region.confidence,
    }));

    expect(snapshot).toMatchInlineSnapshot(`
      [
        {
          "confidence": 0.95,
          "firstPoint": {
            "space": "normalized-image",
            "x": 0.42,
            "y": 0.68,
          },
          "kind": "lips",
          "maskKind": "polygon",
          "pointCount": 12,
        },
        {
          "confidence": 0.95,
          "firstPoint": {
            "space": "normalized-image",
            "x": 0.34,
            "y": 0.36,
          },
          "kind": "eyes",
          "maskKind": "polygon",
          "pointCount": 12,
        },
        {
          "confidence": 0.95,
          "firstPoint": {
            "space": "normalized-image",
            "x": 0.33,
            "y": 0.305,
          },
          "kind": "brows",
          "maskKind": "polygon",
          "pointCount": 8,
        },
        {
          "confidence": 0.95,
          "firstPoint": {
            "space": "normalized-image",
            "x": 0.24,
            "y": 0.46,
          },
          "kind": "blush",
          "maskKind": "polygon",
          "pointCount": 6,
        },
        {
          "confidence": 0.95,
          "firstPoint": {
            "space": "normalized-image",
            "x": 0.24,
            "y": 0.46,
          },
          "kind": "contour",
          "maskKind": "polygon",
          "pointCount": 4,
        },
        {
          "confidence": 0.95,
          "firstPoint": {
            "space": "normalized-image",
            "x": 0.5,
            "y": 0.43,
          },
          "kind": "highlight",
          "maskKind": "polygon",
          "pointCount": 4,
        },
      ]
    `);
  });
});

