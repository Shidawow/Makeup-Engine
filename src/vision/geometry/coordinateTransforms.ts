import type {
  CanvasPolygon,
  OverlayCoordinateMapping,
  PixelPoint,
  PixelRect,
  PixelSize,
} from './types';
import type {
  NormalizedBoundingBox,
  NormalizedPoint,
  NormalizedPolygon,
} from '../providers';

export const calculateObjectContainRect = (
  naturalImageSize: PixelSize,
  viewportSize: PixelSize,
): PixelRect => {
  if (
    naturalImageSize.width <= 0 ||
    naturalImageSize.height <= 0 ||
    viewportSize.width <= 0 ||
    viewportSize.height <= 0
  ) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const scale = Math.min(
    viewportSize.width / naturalImageSize.width,
    viewportSize.height / naturalImageSize.height,
  );
  const width = naturalImageSize.width * scale;
  const height = naturalImageSize.height * scale;

  return {
    x: (viewportSize.width - width) / 2,
    y: (viewportSize.height - height) / 2,
    width,
    height,
  };
};

export const createOverlayCoordinateMapping = (
  naturalImageSize: PixelSize,
  viewportSize: PixelSize,
  canvasSize: PixelSize = viewportSize,
): OverlayCoordinateMapping => ({
  naturalImageSize,
  viewportSize,
  canvasSize,
  renderedImageRect: calculateObjectContainRect(naturalImageSize, viewportSize),
});

export const normalizedToNaturalPoint = (
  point: NormalizedPoint,
  naturalImageSize: PixelSize,
): PixelPoint => ({
  x: point.x * naturalImageSize.width,
  y: point.y * naturalImageSize.height,
});

export const naturalToCanvasPoint = (
  point: PixelPoint,
  mapping: OverlayCoordinateMapping,
): PixelPoint => {
  if (
    mapping.naturalImageSize.width <= 0 ||
    mapping.naturalImageSize.height <= 0
  ) {
    return { x: 0, y: 0 };
  }

  return {
    x:
      mapping.renderedImageRect.x +
      (point.x / mapping.naturalImageSize.width) * mapping.renderedImageRect.width,
    y:
      mapping.renderedImageRect.y +
      (point.y / mapping.naturalImageSize.height) * mapping.renderedImageRect.height,
  };
};

export const normalizedToCanvasPoint = (
  point: NormalizedPoint,
  mapping: OverlayCoordinateMapping,
): PixelPoint =>
  naturalToCanvasPoint(
    normalizedToNaturalPoint(point, mapping.naturalImageSize),
    mapping,
  );

export const normalizedPolygonToCanvas = (
  polygon: NormalizedPolygon,
  mapping: OverlayCoordinateMapping,
): CanvasPolygon => ({
  points: polygon.points.map((point) => normalizedToCanvasPoint(point, mapping)),
});

export const normalizedBoxToCanvasRect = (
  box: NormalizedBoundingBox,
  mapping: OverlayCoordinateMapping,
): PixelRect => {
  const topLeft = normalizedToCanvasPoint(
    { x: box.x, y: box.y, space: 'normalized-image' },
    mapping,
  );
  const bottomRight = normalizedToCanvasPoint(
    {
      x: box.x + box.width,
      y: box.y + box.height,
      space: 'normalized-image',
    },
    mapping,
  );

  return {
    x: topLeft.x,
    y: topLeft.y,
    width: bottomRight.x - topLeft.x,
    height: bottomRight.y - topLeft.y,
  };
};

