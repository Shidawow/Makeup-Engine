import type {
  NormalizedBoundingBox,
  NormalizedPoint,
  NormalizedPolygon,
} from '../providers';

export interface PixelSize {
  width: number;
  height: number;
}

export interface PixelPoint {
  x: number;
  y: number;
}

export interface PixelRect extends PixelPoint, PixelSize {}

export interface OverlayCoordinateMapping {
  naturalImageSize: PixelSize;
  viewportSize: PixelSize;
  canvasSize: PixelSize;
  renderedImageRect: PixelRect;
}

export interface CanvasPolygon {
  points: PixelPoint[];
}

export const zeroRect = (): PixelRect => ({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});

