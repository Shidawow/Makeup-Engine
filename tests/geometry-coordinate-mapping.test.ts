import { describe, expect, it } from 'vitest';
import {
  createOverlayCoordinateMapping,
  normalizedBoxToCanvasRect,
  normalizedToCanvasPoint,
} from '../src/vision';

describe('overlay coordinate mapping', () => {
  it('maps normalized points through object-contain letterboxing', () => {
    const mapping = createOverlayCoordinateMapping(
      { width: 1000, height: 500 },
      { width: 500, height: 500 },
    );

    expect(mapping.renderedImageRect).toEqual({
      x: 0,
      y: 125,
      width: 500,
      height: 250,
    });
    expect(normalizedToCanvasPoint({ x: 0.5, y: 0.5, space: 'normalized-image' }, mapping)).toEqual({
      x: 250,
      y: 250,
    });
  });

  it('keeps face boxes aligned to rendered image rect', () => {
    const mapping = createOverlayCoordinateMapping(
      { width: 800, height: 1200 },
      { width: 800, height: 800 },
    );
    const faceBox = normalizedBoxToCanvasRect(
      { x: 0.25, y: 0.2, width: 0.5, height: 0.5, space: 'normalized-image' },
      mapping,
    );

    expect({
      x: Number(faceBox.x.toFixed(2)),
      y: Number(faceBox.y.toFixed(2)),
      width: Number(faceBox.width.toFixed(2)),
      height: Number(faceBox.height.toFixed(2)),
    }).toMatchInlineSnapshot(`
      {
        "height": 400,
        "width": 266.67,
        "x": 266.67,
        "y": 160,
      }
    `);
  });
});
