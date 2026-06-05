import type { CosmeticRegionParameter } from '../../cosmetic-regions';
import {
  cosmeticRegionToSegmentationTarget,
  type CosmeticSegmentationMask,
} from '../masks';
import {
  distanceToPolygonEdge,
  pointInPolygon,
  polygonBounds,
} from '../masks/maskGeometry';
import { normalizeAlpha } from '../blending';

export interface PolygonMaskRefinementOptions {
  imageId: string;
  gridSize?: number;
  featherRadius?: number;
}

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const calculateAlpha = (
  point: { x: number; y: number },
  region: CosmeticRegionParameter,
  featherRadius: number,
): number => {
  const inside = pointInPolygon(point, region.polygon);
  const distance = distanceToPolygonEdge(point, region.polygon);

  if (inside) {
    return clamp01(0.72 + Math.min(0.28, distance / Math.max(0.001, featherRadius)));
  }

  return clamp01(1 - distance / Math.max(0.001, featherRadius)) * 0.42;
};

export const refineCosmeticRegionMask = (
  region: CosmeticRegionParameter,
  options: PolygonMaskRefinementOptions,
): CosmeticSegmentationMask => {
  const gridSize = options.gridSize ?? 32;
  const featherRadius = options.featherRadius ?? 0.04;
  const alpha: number[] = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      alpha.push(
        Number(
          calculateAlpha(
            {
              x: (x + 0.5) / gridSize,
              y: (y + 0.5) / gridSize,
            },
            region,
            featherRadius,
          ).toFixed(4),
        ),
      );
    }
  }

  const target = cosmeticRegionToSegmentationTarget(region);

  return {
    id: `${options.imageId}-${target}-refined-mask`,
    target,
    sourceRegionId: region.id,
    polygon: region.polygon,
    bounds: polygonBounds(region.polygon),
    grid: {
      width: gridSize,
      height: gridSize,
      alpha: normalizeAlpha(alpha),
    },
    confidence: Number((region.confidence * 0.92).toFixed(3)),
    debug: [
      `Refined ${region.kind} polygon into ${gridSize}x${gridSize} soft mask.`,
      `Feather radius: ${featherRadius}.`,
    ],
  };
};

export const refineCosmeticRegionMasks = (
  imageId: string,
  regions: CosmeticRegionParameter[],
): CosmeticSegmentationMask[] =>
  regions.map((region) =>
    refineCosmeticRegionMask(region, {
      imageId,
      featherRadius:
        region.kind === 'blush' || region.kind === 'contour' ? 0.065 : 0.035,
    }),
  );

