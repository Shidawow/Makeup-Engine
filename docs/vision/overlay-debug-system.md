# Overlay Debug System

Status: Vision-first Phase 2 implementation

## Goal

Render visual proof of the CV pipeline:

```text
real photo
-> FaceMesh landmarks
-> cosmetic polygons
-> canvas overlay
```

## Implementation

New overlay module:

```text
src/components/template-studio/vision-debug-overlay/
  types.ts
  drawOverlay.ts
  VisionDebugOverlay.tsx
  index.ts
```

## Supported Layers

- face box
- landmarks
- lips
- eyes
- brows
- blush
- contour
- highlight

Each layer can be toggled independently.

## Rendering Model

The overlay uses a `<canvas>` positioned over the uploaded image.

The draw function receives normalized coordinates and scales them to canvas dimensions:

```text
normalized-image point
-> canvas pixel point
```

This keeps provider output independent from image display size.

## Debug Controls

The demo supports:

- layer toggles
- opacity slider
- zoom slider

## Testability

The rendering core is separated into:

```ts
drawVisionDebugOverlay(context, input)
```

This allows node-based tests with a fake canvas context. React and browser APIs are only needed for the visual component itself.

## Current Limitation

The overlay currently aligns to the displayed image container. For production-grade QA, the next step is to explicitly measure natural image dimensions, rendered image dimensions, and letterboxing offsets.

