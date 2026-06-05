import { describe, expect, it } from 'vitest';
import {
  createBrushCursorPreview,
  createMaskCanvasMapping,
  mapPointerToNormalizedImage,
} from '../src/vision';

describe('mask canvas interaction mapping', () => {
  it('maps pointer events through object-contain offsets into normalized image coordinates', () => {
    const mapping = createMaskCanvasMapping({
      naturalImageSize: { width: 1000, height: 500 },
      canvasSize: { width: 500, height: 500 },
    });

    expect(mapping.renderedImageRect).toEqual({
      x: 0,
      y: 125,
      width: 500,
      height: 250,
    });

    const point = mapPointerToNormalizedImage({
      pointer: { clientX: 260, clientY: 270 },
      canvasRect: { x: 10, y: 20, width: 500, height: 500 },
      mapping,
    });

    expect(point).toEqual({
      x: 0.5,
      y: 0.5,
      space: 'normalized-image',
    });
  });

  it('rejects pointer events outside the rendered image and keeps cursor size resize-safe', () => {
    const mapping = createMaskCanvasMapping({
      naturalImageSize: { width: 1000, height: 500 },
      canvasSize: { width: 500, height: 500 },
    });
    const outside = mapPointerToNormalizedImage({
      pointer: { clientX: 250, clientY: 40 },
      canvasRect: { x: 0, y: 0, width: 500, height: 500 },
      mapping,
    });
    const cursor = createBrushCursorPreview(
      { x: 0.25, y: 0.25, space: 'normalized-image' },
      0.1,
      mapping,
    );

    expect(outside).toBeNull();
    expect(cursor.visible).toBe(true);
    expect(cursor.center).toEqual({ x: 125, y: 187.5 });
    expect(cursor.radius).toBe(25);
  });
});
