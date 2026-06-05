import type { NormalizedPoint, NormalizedPolygon } from '../providers';
import { averageHue, rgbToHsb, type RgbColor } from './color';
import type { ImagePixelData, RegionColorSample } from './types';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const pointInPolygon = (
  point: { x: number; y: number },
  polygon: NormalizedPolygon,
): boolean => {
  let inside = false;
  const points = polygon.points;

  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const current = points[i];
    const previous = points[j];
    const intersects =
      current.y > point.y !== previous.y > point.y &&
      point.x <
        ((previous.x - current.x) * (point.y - current.y)) /
          (previous.y - current.y) +
          current.x;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
};

const polygonBounds = (
  polygon: NormalizedPolygon,
): { minX: number; maxX: number; minY: number; maxY: number } => {
  const xs = polygon.points.map((point) => point.x);
  const ys = polygon.points.map((point) => point.y);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
};

export const readPixel = (
  image: ImagePixelData,
  x: number,
  y: number,
): RgbColor => {
  const clampedX = clamp(Math.round(x), 0, image.width - 1);
  const clampedY = clamp(Math.round(y), 0, image.height - 1);
  const offset = (clampedY * image.width + clampedX) * 4;

  return {
    r: image.data[offset] ?? 0,
    g: image.data[offset + 1] ?? 0,
    b: image.data[offset + 2] ?? 0,
  };
};

export const samplePolygonPixels = (
  image: ImagePixelData,
  polygon: NormalizedPolygon,
): RgbColor[] => {
  const bounds = polygonBounds(polygon);
  const minX = Math.floor(bounds.minX * image.width);
  const maxX = Math.ceil(bounds.maxX * image.width);
  const minY = Math.floor(bounds.minY * image.height);
  const maxY = Math.ceil(bounds.maxY * image.height);
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const step = Math.max(1, Math.floor(Math.max(width, height) / 32));
  const pixels: RgbColor[] = [];

  for (let y = minY; y <= maxY; y += step) {
    for (let x = minX; x <= maxX; x += step) {
      const normalized = {
        x: x / image.width,
        y: y / image.height,
      };

      if (pointInPolygon(normalized, polygon)) {
        pixels.push(readPixel(image, x, y));
      }
    }
  }

  return pixels;
};

export const summarizeRegionColor = (
  image: ImagePixelData,
  polygon: NormalizedPolygon,
): RegionColorSample => {
  const pixels = samplePolygonPixels(image, polygon);
  const safePixels = pixels.length > 0 ? pixels : [readPixel(image, 0, 0)];
  const rgb = safePixels.reduce(
    (sum, pixel) => ({
      r: sum.r + pixel.r,
      g: sum.g + pixel.g,
      b: sum.b + pixel.b,
    }),
    { r: 0, g: 0, b: 0 },
  );
  const averageRgb = {
    r: Number((rgb.r / safePixels.length).toFixed(2)),
    g: Number((rgb.g / safePixels.length).toFixed(2)),
    b: Number((rgb.b / safePixels.length).toFixed(2)),
  };
  const hsbValues = safePixels.map(rgbToHsb);

  return {
    sampleCount: safePixels.length,
    dominant: {
      hue: averageHue(hsbValues.map((value) => value.hue)),
      saturation: Number(
        (
          hsbValues.reduce((sum, value) => sum + value.saturation, 0) /
          hsbValues.length
        ).toFixed(4),
      ),
      brightness: Number(
        (
          hsbValues.reduce((sum, value) => sum + value.brightness, 0) /
          hsbValues.length
        ).toFixed(4),
      ),
    },
    averageRgb,
  };
};

export const polygonCentroid = (polygon: NormalizedPolygon): NormalizedPoint => {
  const total = polygon.points.reduce(
    (sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y }),
    { x: 0, y: 0 },
  );

  return {
    x: Number((total.x / polygon.points.length).toFixed(4)),
    y: Number((total.y / polygon.points.length).toFixed(4)),
    space: 'normalized-image',
  };
};

export const polygonAverageRadius = (polygon: NormalizedPolygon): number => {
  const centroid = polygonCentroid(polygon);
  const total = polygon.points.reduce((sum, point) => {
    const dx = point.x - centroid.x;
    const dy = point.y - centroid.y;
    return sum + Math.sqrt(dx * dx + dy * dy);
  }, 0);

  return Number((total / polygon.points.length).toFixed(4));
};

