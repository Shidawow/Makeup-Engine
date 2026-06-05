import {
  calculateObjectContainRect,
  type PixelPoint,
  type PixelRect,
  type PixelSize,
} from '../../geometry';
import type { MaskBrushPoint } from './editableMask';

export interface MaskCanvasMappingInput {
  naturalImageSize: PixelSize;
  canvasSize: PixelSize;
  renderedImageRect?: PixelRect;
}

export interface MaskCanvasMapping {
  naturalImageSize: PixelSize;
  canvasSize: PixelSize;
  renderedImageRect: PixelRect;
}

export interface PointerClientPosition {
  clientX: number;
  clientY: number;
}

export interface MaskPointerMappingInput {
  pointer: PointerClientPosition;
  canvasRect: PixelRect;
  mapping: MaskCanvasMapping;
}

export interface BrushCursorPreview {
  center: PixelPoint;
  radius: number;
  visible: boolean;
}

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const createMaskCanvasMapping = (
  input: MaskCanvasMappingInput,
): MaskCanvasMapping => ({
  naturalImageSize: input.naturalImageSize,
  canvasSize: input.canvasSize,
  renderedImageRect:
    input.renderedImageRect ??
    calculateObjectContainRect(input.naturalImageSize, input.canvasSize),
});

export const mapCanvasPointToNormalizedImage = (
  point: PixelPoint,
  mapping: MaskCanvasMapping,
): MaskBrushPoint | null => {
  const rect = mapping.renderedImageRect;

  if (rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  const x = (point.x - rect.x) / rect.width;
  const y = (point.y - rect.y) / rect.height;

  if (x < 0 || x > 1 || y < 0 || y > 1) {
    return null;
  }

  return {
    x: clamp01(x),
    y: clamp01(y),
    space: 'normalized-image',
  };
};

export const mapPointerToNormalizedImage = (
  input: MaskPointerMappingInput,
): MaskBrushPoint | null =>
  mapCanvasPointToNormalizedImage(
    {
      x: input.pointer.clientX - input.canvasRect.x,
      y: input.pointer.clientY - input.canvasRect.y,
    },
    input.mapping,
  );

export const normalizedPointToCanvasPoint = (
  point: MaskBrushPoint,
  mapping: MaskCanvasMapping,
): PixelPoint => ({
  x: mapping.renderedImageRect.x + point.x * mapping.renderedImageRect.width,
  y: mapping.renderedImageRect.y + point.y * mapping.renderedImageRect.height,
});

export const normalizedBrushRadiusToCanvas = (
  radius: number,
  mapping: MaskCanvasMapping,
): number => {
  const shorterEdge = Math.min(
    mapping.renderedImageRect.width,
    mapping.renderedImageRect.height,
  );

  return Math.max(1, radius * shorterEdge);
};

export const createBrushCursorPreview = (
  point: MaskBrushPoint | null,
  radius: number,
  mapping: MaskCanvasMapping,
): BrushCursorPreview => {
  if (!point) {
    return {
      center: { x: 0, y: 0 },
      radius: 0,
      visible: false,
    };
  }

  return {
    center: normalizedPointToCanvasPoint(point, mapping),
    radius: normalizedBrushRadiusToCanvas(radius, mapping),
    visible: true,
  };
};
