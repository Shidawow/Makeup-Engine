# Cosmetic Segmentation Foundation

Status: Phase 4A implementation  
Scope: `src/vision/segmentation`, pipeline integration, debug overlay

## Goal

Move the vision pipeline from pure FaceMesh heuristic polygons toward replaceable cosmetic segmentation masks.

This phase does not train or integrate a large model. It establishes the architecture needed for future MediaPipe, ONNX, WebGPU, or remote segmentation providers.

## New Structure

```text
src/vision/segmentation/
  providers/
    types.ts
    mock/
      mockSegmentationProvider.ts
      index.ts
  refinement/
    polygonRefinement.ts
    index.ts
  blending/
    maskBlending.ts
    index.ts
  masks/
    types.ts
    maskGeometry.ts
    index.ts
  debug/
    debugArtifacts.ts
    index.ts
  pipeline/
    segmentationPipeline.ts
    index.ts
```

The existing `segmentation.ts` fixture helper remains for compatibility.

## Provider Boundary

The canonical segmentation provider contract is:

```ts
export interface SegmentationProvider {
  id: string;
  kind: SegmentationProviderKind;
  targets: CosmeticSegmentationTarget[];
  initialize(): Promise<void>;
  warmup(): Promise<void>;
  segment(input: SegmentationProviderInput): Promise<CosmeticSegmentationResult>;
  dispose(): void;
}
```

Supported targets:

- lips
- eyeshadow
- eyeliner
- blush
- contour
- highlight

Business pipeline code accepts a provider by dependency injection. It does not import the mock provider.

## Mask Schema

`CosmeticSegmentationMask` contains:

- target
- source region ID
- normalized polygon
- normalized bounds
- alpha grid
- confidence
- debug notes

The alpha grid is small and deterministic by design. It is enough for tests, debugging, and template parameter experiments before a real segmentation model is connected.

## Polygon-to-Mask Refinement

`refineCosmeticRegionMask()` converts an existing heuristic cosmetic polygon into a soft mask:

```text
CosmeticRegionParameter
-> polygon containment
-> distance to polygon edge
-> feathered alpha grid
-> normalized alpha
```

This creates a replacement-friendly bridge:

```text
FaceMesh polygons today
real model masks later
same CosmeticSegmentationMask contract
```

## Blending Utilities

Implemented:

- `normalizeAlpha()`
- `smoothMaskEdges()`
- `featherMask()`
- `compositeMasks()`

These utilities are pure and testable. They do not depend on React, Zustand, or browser APIs.

## Pipeline Integration

`runMakeupAnalysisPipeline()` now includes:

```text
image-input
-> face-detection
-> landmarks
-> segmentation
-> cosmetic-regions
-> segmentation-analysis
-> pixel-analysis
-> semantic-analysis
-> makeup-analysis
-> template-parameterization
```

When no `segmentationProvider` is passed, the pipeline uses polygon refinement as a deterministic fallback. When a provider is passed, it uses the provider output and still applies smoothing/feathering through the segmentation pipeline.

## Debug Overlay

`VisionDebugOverlay` now supports:

- segmentation masks
- alpha heatmap
- blended mask visualization

The overlay consumes `CosmeticSegmentationResult` from the pipeline output.

## Test Coverage

Added:

- `tests/segmentation-provider.test.ts`
- `tests/mask-refinement.test.ts`
- `tests/segmentation-overlay.test.ts`
- `tests/segmentation-pipeline.test.ts`

Coverage includes:

- provider lifecycle
- deterministic mask output
- polygon-to-mask refinement
- alpha normalization
- mask compositing
- overlay rendering
- pipeline trace integration

## Current Limits

- The mock provider and polygon refinement are not real cosmetic segmentation models.
- Alpha masks are low-resolution grids for deterministic debugging.
- Eye region mapping currently treats eyes as eyeshadow and brows as eyeliner for foundation purposes.
- Real segmentation model integration is intentionally deferred to a future provider.

## Next Stage

Highest ROI next:

1. Add an ONNX or WebGPU segmentation provider behind the existing `SegmentationProvider` interface.
2. Use segmentation masks instead of polygons for pixel sampling.
3. Add mask-aware opacity estimation using skin baseline sampling.
4. Add Template Studio mask inspection and manual correction controls.

