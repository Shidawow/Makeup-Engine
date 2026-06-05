import type { CosmeticRegionParameter } from '../../../vision/cosmetic-regions';
import {
  createOverlayCoordinateMapping,
  normalizedBoxToCanvasRect,
  normalizedToCanvasPoint,
  normalizedPolygonToCanvas,
} from '../../../vision/geometry';
import { compositeMasks, type CosmeticSegmentationMask } from '../../../vision/segmentation';
import type {
  VisionDebugOverlayLayers,
  VisionDebugOverlayRenderInput,
} from './types';

type DrawContext = Pick<
  CanvasRenderingContext2D,
  | 'beginPath'
  | 'clearRect'
  | 'fill'
  | 'fillRect'
  | 'lineTo'
  | 'moveTo'
  | 'rect'
  | 'restore'
  | 'save'
  | 'scale'
  | 'stroke'
  | 'arc'
> & {
  fillStyle: string | CanvasGradient | CanvasPattern;
  globalAlpha: number;
  lineWidth: number;
  strokeStyle: string | CanvasGradient | CanvasPattern;
};

const regionColors: Record<CosmeticRegionParameter['kind'], string> = {
  lips: '#e11d48',
  eyes: '#2563eb',
  brows: '#92400e',
  blush: '#fb7185',
  contour: '#7c2d12',
  highlight: '#facc15',
};

const shouldDrawRegion = (
  layers: VisionDebugOverlayLayers,
  region: CosmeticRegionParameter,
): boolean => layers[region.kind];

const targetColor = (target: CosmeticSegmentationMask['target']): string => {
  if (target === 'lips') {
    return regionColors.lips;
  }

  if (target === 'eyeshadow' || target === 'eyeliner') {
    return regionColors.eyes;
  }

  return regionColors[target];
};

const drawMaskGrid = (
  context: DrawContext,
  mask: CosmeticSegmentationMask,
  color: string,
  mapping: ReturnType<typeof createOverlayCoordinateMapping>,
  heatmap: boolean,
): void => {
  const cellWidth = mapping.renderedImageRect.width / mask.grid.width;
  const cellHeight = mapping.renderedImageRect.height / mask.grid.height;

  for (let y = 0; y < mask.grid.height; y += 1) {
    for (let x = 0; x < mask.grid.width; x += 1) {
      const alpha = mask.grid.alpha[y * mask.grid.width + x] ?? 0;

      if (alpha <= 0.04) {
        continue;
      }

      context.globalAlpha = heatmap ? Math.min(0.72, alpha * 0.72) : Math.min(0.42, alpha * 0.42);
      context.fillStyle = heatmap ? `rgba(250, 204, 21, ${context.globalAlpha})` : color;
      context.fillRect(
        mapping.renderedImageRect.x + x * cellWidth,
        mapping.renderedImageRect.y + y * cellHeight,
        cellWidth,
        cellHeight,
      );
    }
  }
};

const drawMaskPolygon = (
  context: DrawContext,
  mask: CosmeticSegmentationMask,
  mapping: ReturnType<typeof createOverlayCoordinateMapping>,
  color: string,
  lineWidth: number,
): void => {
  const canvasPolygon = normalizedPolygonToCanvas(mask.polygon, mapping);
  const [firstPoint, ...remainingPoints] = canvasPolygon.points;

  if (!firstPoint) {
    return;
  }

  context.beginPath();
  context.lineWidth = lineWidth;
  context.strokeStyle = color;
  context.moveTo(firstPoint.x, firstPoint.y);
  for (const point of remainingPoints) {
    context.lineTo(point.x, point.y);
  }
  context.lineTo(firstPoint.x, firstPoint.y);
  context.stroke();
};

const convergenceTargets = (
  data: VisionDebugOverlayRenderInput['data'],
): CosmeticSegmentationMask['target'][] => {
  const direct = data.convergenceDiff ?? [];
  const detailed =
    data.convergenceDiffItems
      ?.filter((item) => item.changed && item.region)
      .map((item) => item.region as CosmeticSegmentationMask['target']) ?? [];

  return Array.from(new Set([...direct, ...detailed]));
};

export const drawVisionDebugOverlay = (
  context: DrawContext,
  input: VisionDebugOverlayRenderInput,
): void => {
  const { data, options } = input;
  const { width, height, opacity, zoom, layers } = options;
  const mapping =
    options.mapping ??
    createOverlayCoordinateMapping(
      { width, height },
      { width, height },
      { width, height },
    );

  context.clearRect(0, 0, width, height);
  context.save();
  context.globalAlpha = opacity;
  context.scale(zoom, zoom);

  if (layers.faceBox) {
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = '#14b8a6';
    const faceBox = normalizedBoxToCanvasRect(data.faceBox, mapping);
    context.rect(faceBox.x, faceBox.y, faceBox.width, faceBox.height);
    context.stroke();
  }

  if (layers.landmarks) {
    context.fillStyle = '#0f172a';
    for (const landmark of data.faceMesh.landmarks) {
      const { x, y } = normalizedToCanvasPoint(landmark.point, mapping);
      context.beginPath();
      context.arc(x, y, 1.2, 0, Math.PI * 2);
      context.fill();
    }
  }

  const beforeMode = layers.beforeAfter && data.beforeAfterMode === 'before';
  const segmentation = beforeMode
    ? data.aiOnlySegmentation ?? data.cosmeticSegmentation
    : data.cosmeticSegmentation;
  const editableMasks = beforeMode ? [] : data.editableMasks ?? [];

  if (segmentation && (layers.segmentationMasks || layers.alphaHeatmap)) {
    for (const mask of segmentation.masks) {
      drawMaskGrid(
        context,
        mask,
        targetColor(mask.target),
        mapping,
        layers.alphaHeatmap,
      );
    }

    context.globalAlpha = opacity;
  }

  if (layers.editableMasks) {
    for (const editableMask of editableMasks) {
      drawMaskGrid(context, editableMask.mergedMask, '#a855f7', mapping, false);
    }
    context.globalAlpha = opacity;
  }

  if (layers.userCorrections) {
    for (const editableMask of editableMasks) {
      const { baseMask, mergedMask } = editableMask;
      const cellWidth = mapping.renderedImageRect.width / mergedMask.grid.width;
      const cellHeight = mapping.renderedImageRect.height / mergedMask.grid.height;

      for (let y = 0; y < mergedMask.grid.height; y += 1) {
        for (let x = 0; x < mergedMask.grid.width; x += 1) {
          const index = y * mergedMask.grid.width + x;
          const diff = Math.abs(
            (mergedMask.grid.alpha[index] ?? 0) -
              (baseMask.grid.alpha[index] ?? 0),
          );

          if (diff <= 0.03) {
            continue;
          }

          context.globalAlpha = Math.min(0.75, diff * 0.9);
          context.fillStyle = '#ec4899';
          context.fillRect(
            mapping.renderedImageRect.x + x * cellWidth,
            mapping.renderedImageRect.y + y * cellHeight,
            cellWidth,
            cellHeight,
          );
        }
      }
    }
    context.globalAlpha = opacity;
  }

  if (layers.recomputeRegions && data.recomputeRegions) {
    for (const mask of segmentation?.masks ?? []) {
      if (!data.recomputeRegions.includes(mask.target)) {
        continue;
      }

      drawMaskPolygon(context, mask, mapping, '#06b6d4', 4);
    }
  }

  if (layers.convergenceDiff) {
    const targets = convergenceTargets(data);

    for (const mask of segmentation?.masks ?? []) {
      if (!targets.includes(mask.target)) {
        continue;
      }

      drawMaskGrid(context, mask, '#f43f5e', mapping, true);
    }
    context.globalAlpha = opacity;
  }

  if (segmentation && layers.weightedSampling) {
    for (const mask of segmentation.masks) {
      drawMaskGrid(context, mask, '#22c55e', mapping, true);
    }
    context.globalAlpha = opacity;
  }

  if (segmentation && layers.skinBaseline) {
    for (const mask of segmentation.masks) {
      drawMaskGrid(context, mask, '#38bdf8', mapping, false);
    }
    context.globalAlpha = opacity;
  }

  if (segmentation && layers.edgeRings) {
    for (const mask of segmentation.masks) {
      drawMaskPolygon(context, mask, mapping, '#f97316', 3);
    }
  }

  if (segmentation && layers.blendedMask) {
    const composite = compositeMasks(segmentation.masks);
    drawMaskGrid(
      context,
      {
        id: `${segmentation.imageId}-composite-overlay`,
        target: 'highlight',
        polygon: {
          points: [],
          space: 'normalized-image',
        },
        bounds: {
          x: 0,
          y: 0,
          width: 1,
          height: 1,
          space: 'normalized-image',
        },
        grid: composite,
        confidence: 1,
        debug: [],
      },
      '#14b8a6',
      mapping,
      false,
    );
    context.globalAlpha = opacity;
  }

  for (const region of data.cosmeticRegions) {
    if (!shouldDrawRegion(layers, region)) {
      continue;
    }

    const canvasPolygon = normalizedPolygonToCanvas(region.polygon, mapping);
    const [firstPoint, ...remainingPoints] = canvasPolygon.points;

    if (!firstPoint) {
      continue;
    }

    context.beginPath();
    context.lineWidth = region.kind === 'blush' ? 2 : 1.5;
    context.strokeStyle = regionColors[region.kind];
    context.fillStyle = regionColors[region.kind];

    context.moveTo(firstPoint.x, firstPoint.y);

    for (const point of remainingPoints) {
      context.lineTo(point.x, point.y);
    }

    context.lineTo(firstPoint.x, firstPoint.y);
    context.stroke();
    context.globalAlpha = opacity * 0.18;
    context.fill();
    context.globalAlpha = opacity;
  }

  if (layers.activeRegionHighlight && data.activeRegion && segmentation) {
    const activeMask = segmentation.masks.find(
      (mask) => mask.target === data.activeRegion,
    );

    if (activeMask) {
      context.globalAlpha = Math.min(1, opacity * 1.1);
      drawMaskPolygon(context, activeMask, mapping, '#0f766e', 5);
      context.globalAlpha = opacity;
    }
  }

  if (layers.brushCursor && data.brushCursor?.visible) {
    const point = normalizedToCanvasPoint(data.brushCursor.point, mapping);
    const radius =
      data.brushCursor.radius *
      Math.min(mapping.renderedImageRect.width, mapping.renderedImageRect.height);

    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = '#111827';
    context.fillStyle = '#f8fafc';
    context.globalAlpha = Math.min(0.85, opacity);
    context.arc(point.x, point.y, Math.max(1, radius), 0, Math.PI * 2);
    context.stroke();
    context.globalAlpha = Math.min(0.22, data.brushCursor.strength);
    context.fill();
    context.globalAlpha = opacity;
  }

  context.restore();
};
