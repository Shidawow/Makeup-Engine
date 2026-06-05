import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplateStudio } from '../src/components/template-studio/TemplateStudio';
import {
  applyMaskBrushEdit,
  createEditableCosmeticMask,
  recomputeInvalidatedRegions,
  reanalyzeMakeupWithEditableMasks,
  runMakeupAnalysisPipeline,
  type ImagePixelData,
  type MakeupPhotoInput,
} from '../src/vision';
import { createMockSegmentationProvider } from '../src/vision/segmentation/providers/mock';
import { createMockVisionProvider } from '../src/vision/providers/mock';

const image: MakeupPhotoInput = {
  id: 'studio-reanalysis',
  fileName: 'studio-reanalysis.jpg',
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

      return isLip
        ? [220, 60, 90, 255]
        : isBlush
          ? [210, 140, 125, 255]
          : [180, 170, 160, 255];
    }),
  ),
};

describe('Template Studio reanalysis UX', () => {
  it('renders the local workbench entry points', () => {
    const html = renderToStaticMarkup(<TemplateStudio />);

    expect(html).toContain('Template');
    expect(html).toContain('蒙版编辑工具');
    expect(html).toContain('蒙版编辑画布');
    expect(html).toContain('Correction Persistence');
    expect(html).toContain('模板差异');
    expect(html).toContain('Dataset Curation Metrics');
    expect(html).toContain('Dataset Curation Metrics');
    expect(html).toContain('training');
    expect(html).toContain('Template Evidence');
  });

  it('uses incremental mask reanalysis and preserves FaceMesh without rerunning analysis', async () => {
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
    const editableMasks = baseEditableMasks.map((mask) =>
      mask.mergedMask.target === 'lips'
        ? applyMaskBrushEdit(mask, {
            id: 'studio-reanalysis-lips',
            target: 'lips',
            tool: 'brush-add',
            point: { x: 0.5, y: 0.7, space: 'normalized-image' },
            radius: 0.2,
            strength: 0.75,
            createdAt: '2026-05-28T00:00:00.000Z',
          })
        : mask,
    );
    const next = reanalyzeMakeupWithEditableMasks({
      previous: analysis,
      pixelData,
      editableMasks,
      invalidatedTargets: ['lips'],
      previousCache: cache,
    });

    expect(next.analysis.trace).toContain('mask-reanalysis');
    expect(next.recomputedTargets).toEqual(['lips']);
    expect(next.reusedTargets).toEqual(
      expect.arrayContaining(['eyeshadow', 'eyeliner', 'blush', 'contour', 'highlight']),
    );
    expect(next.analysis.faceMesh.faceId).toBe(analysis.faceMesh.faceId);
    expect(next.analysis.faceMesh.landmarks).toEqual(analysis.faceMesh.landmarks);
  });
});
