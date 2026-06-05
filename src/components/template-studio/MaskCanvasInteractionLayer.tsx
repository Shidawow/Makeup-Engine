import { useMemo, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import {
  createMaskCanvasMapping,
  mapPointerToNormalizedImage,
  type MaskBrushPoint,
} from '../../vision';
import {
  VisionDebugOverlay,
  type OverlayBeforeAfterMode,
  type VisionDebugBrushCursor,
  type VisionDebugOverlayData,
  type VisionDebugOverlayLayers,
} from './vision-debug-overlay';

export interface MaskCanvasInteractionLayerProps {
  imageUrl: string;
  imageAlt: string;
  overlayData: VisionDebugOverlayData | null;
  layers: VisionDebugOverlayLayers;
  opacity: number;
  zoom: number;
  editingEnabled: boolean;
  activeRegion: VisionDebugOverlayData['activeRegion'];
  brushRadius: number;
  brushStrength: number;
  beforeAfterMode: OverlayBeforeAfterMode;
  onBrushPoint: (point: MaskBrushPoint) => void;
}

const toPixelRect = (rect: DOMRect) => ({
  x: rect.left,
  y: rect.top,
  width: rect.width,
  height: rect.height,
});

export function MaskCanvasInteractionLayer({
  imageUrl,
  imageAlt,
  overlayData,
  layers,
  opacity,
  zoom,
  editingEnabled,
  activeRegion,
  brushRadius,
  brushStrength,
  beforeAfterMode,
  onBrushPoint,
}: MaskCanvasInteractionLayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [cursor, setCursor] = useState<VisionDebugBrushCursor | null>(null);

  const dataWithCursor = useMemo<VisionDebugOverlayData | null>(() => {
    if (!overlayData) {
      return null;
    }

    return {
      ...overlayData,
      activeRegion,
      beforeAfterMode,
      brushCursor: editingEnabled ? cursor : null,
    };
  }, [activeRegion, beforeAfterMode, cursor, editingEnabled, overlayData]);

  const mapEventToPoint = (event: PointerEvent<HTMLDivElement>): MaskBrushPoint | null => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!container || !image) {
      return null;
    }

    const containerRect = container.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const naturalWidth = image.naturalWidth || imageRect.width;
    const naturalHeight = image.naturalHeight || imageRect.height;
    const mapping = createMaskCanvasMapping({
      naturalImageSize: {
        width: naturalWidth,
        height: naturalHeight,
      },
      canvasSize: {
        width: containerRect.width,
        height: containerRect.height,
      },
      renderedImageRect: {
        x: imageRect.left - containerRect.left,
        y: imageRect.top - containerRect.top,
        width: imageRect.width,
        height: imageRect.height,
      },
    });

    return mapPointerToNormalizedImage({
      pointer: event,
      canvasRect: toPixelRect(containerRect),
      mapping,
    });
  };

  const updateCursor = (point: MaskBrushPoint | null) => {
    setCursor(
      point
        ? {
            point,
            radius: brushRadius,
            strength: brushStrength,
            visible: true,
          }
        : null,
    );
  };

  const paintFromEvent = (
    event: PointerEvent<HTMLDivElement>,
    shouldPaint: boolean,
  ) => {
    const point = mapEventToPoint(event);

    updateCursor(point);

    if (editingEnabled && shouldPaint && point) {
      onBrushPoint(point);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!editingEnabled) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    setIsPainting(true);
    paintFromEvent(event, true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    paintFromEvent(event, isPainting);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsPainting(false);
    paintFromEvent(event, false);
  };

  const onPointerLeave = () => {
    setIsPainting(false);
    setCursor(null);
  };

  return (
    <div
      className={`relative grid min-h-[640px] w-full min-w-0 place-items-center overflow-hidden rounded-md border border-stone-200 bg-stone-100 ${
        editingEnabled ? 'cursor-crosshair touch-none' : ''
      }`}
      onPointerDown={onPointerDown}
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      ref={containerRef}
    >
      <img
        alt={imageAlt}
        className="block max-h-[760px] max-w-full select-none object-contain"
        draggable={false}
        ref={imageRef}
        src={imageUrl}
      />
      <VisionDebugOverlay
        data={dataWithCursor}
        layers={layers}
        opacity={opacity}
        zoom={zoom}
      />
    </div>
  );
}
