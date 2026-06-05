import { useEffect, useMemo, useRef } from 'react';
import { createOverlayCoordinateMapping } from '../../../vision/geometry';
import { drawVisionDebugOverlay } from './drawOverlay';
import type {
  VisionDebugOverlayData,
  VisionDebugOverlayLayers,
} from './types';

export const defaultVisionDebugLayers: VisionDebugOverlayLayers = {
  faceBox: true,
  landmarks: true,
  lips: true,
  eyes: true,
  brows: true,
  blush: true,
  contour: false,
  highlight: false,
  segmentationMasks: false,
  alphaHeatmap: false,
  blendedMask: false,
  weightedSampling: false,
  skinBaseline: false,
  edgeRings: false,
  editableMasks: false,
  userCorrections: false,
  recomputeRegions: false,
  convergenceDiff: false,
  brushCursor: false,
  activeRegionHighlight: false,
  beforeAfter: false,
};

export interface VisionDebugOverlayProps {
  data: VisionDebugOverlayData | null;
  opacity: number;
  zoom: number;
  layers: VisionDebugOverlayLayers;
  className?: string;
}

export function VisionDebugOverlay({
  data,
  opacity,
  zoom,
  layers,
  className,
}: VisionDebugOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const serializedLayers = useMemo(() => JSON.stringify(layers), [layers]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !data) {
      return;
    }

    const parent = canvas.parentElement;
    const rect = parent?.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect?.width ?? canvas.clientWidth));
    const height = Math.max(1, Math.round(rect?.height ?? canvas.clientHeight));
    const image = parent?.querySelector('img');
    const imageRect = image?.getBoundingClientRect();
    const naturalWidth = image?.naturalWidth || width;
    const naturalHeight = image?.naturalHeight || height;
    const mapping = createOverlayCoordinateMapping(
      { width: naturalWidth, height: naturalHeight },
      { width, height },
      { width, height },
    );

    if (rect && imageRect) {
      mapping.renderedImageRect = {
        x: imageRect.left - rect.left,
        y: imageRect.top - rect.top,
        width: imageRect.width,
        height: imageRect.height,
      };
    }

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    drawVisionDebugOverlay(context, {
      data,
      options: {
        width,
        height,
        opacity,
        zoom,
        layers: JSON.parse(serializedLayers) as VisionDebugOverlayLayers,
        mapping,
      },
    });
  }, [data, opacity, zoom, serializedLayers]);

  return (
    <canvas
      aria-label="Vision debug overlay"
      className={className ?? 'pointer-events-none absolute inset-0 h-full w-full'}
      ref={canvasRef}
    />
  );
}
