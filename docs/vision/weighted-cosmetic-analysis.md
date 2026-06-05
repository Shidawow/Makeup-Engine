# Weighted Cosmetic Analysis

Status: Phase 4B implementation  
Scope: `src/vision/pixel-analysis`, existing segmentation masks, pipeline integration

## Goal

Upgrade makeup pixel analysis from polygon-only sampling to segmentation-mask-weighted sampling.

The new flow is:

```text
image
-> FaceMesh
-> cosmetic regions
-> cosmetic segmentation masks
-> weighted-pixel-analysis
-> semantic-analysis
-> MakeupTemplate
```

No agent runtime, workflow engine, graph abstraction, LLM layer, or chat pipeline is involved.

## Weighted Mask Sampling

Implemented in:

```text
src/vision/pixel-analysis/weightedSampling.ts
```

Input:

```text
ImagePixelData
+ CosmeticSegmentationMask[]
```

Output:

```text
WeightedMakeupPixelAnalysis
```

Supported metrics:

- weighted RGB mean
- weighted HSV mean
- weighted saturation
- weighted brightness
- weighted opacity
- weighted hue distribution
- weighted heatmap debug labels
- sampling statistics

The sampling weight is:

```text
CosmeticSegmentationMask.grid.alpha
```

This makes the analysis provider-agnostic. A future ONNX/WebGPU/remote segmentation provider only needs to emit the same mask contract.

## Skin Baseline Strategy

Implemented in:

```text
src/vision/pixel-analysis/skinBaseline.ts
```

The baseline analysis compares:

```text
inner region
vs
outer alpha ring
```

Metrics:

- relative saturation
- relative brightness
- relative hue shift
- opacity estimate

This is used to estimate:

- lips opacity
- blush opacity
- eyeshadow intensity
- contour depth

The current implementation uses mask alpha thresholds for deterministic inner/outer sampling. It is intentionally simple and testable.

## Edge Ring Analysis

Implemented in:

```text
src/vision/pixel-analysis/edgeAnalysis.ts
```

The edge analyzer samples:

- inner ring
- edge ring
- outer ring

Metrics:

- edge softness score
- diffusion score
- gradient direction
- edge contrast

This improves:

- lip edge softness
- gradient diffusion
- blush feathering
- contour blend quality

## Pipeline Behavior

`runMakeupAnalysisPipeline()` now uses:

```text
weighted-pixel-analysis
```

when both are present:

- `pixelData`
- `cosmeticSegmentation.masks`

Fallback behavior:

- If masks exist: use weighted mask analysis.
- If masks do not exist: use existing polygon pixel analysis.

Debug artifacts now include:

- weighted heatmap count
- weighted sample group count
- opacity diagnostics
- edge diagnostics

## Overlay Debug Layers

`VisionDebugOverlay` now supports:

- `weightedSampling`
- `skinBaseline`
- `edgeRings`

These are added on top of the Phase 4A segmentation layers:

- segmentation masks
- alpha heatmap
- blended mask

The overlay architecture was not rewritten. It still consumes pipeline output and draws in the existing canvas layer.

## Template Extraction

`buildMakeupTemplateFromVisionAnalysis()` now receives weighted analysis through `pixelAnalysis`.

Template metadata can include:

- opacity confidence
- edge softness
- diffusion quality
- skin-relative intensity

These metrics are stored under:

```text
template.metadata.visionMetrics
```

## Compatibility

The new weighted analysis is compatible with future segmentation providers because it only depends on:

```text
CosmeticSegmentationMask.grid.alpha
```

Future providers may be:

- MediaPipe
- ONNX
- WebGPU
- remote inference

They should not change the pixel-analysis contract.

## Current Limits

- Skin baseline uses alpha-ring thresholds, not learned skin parsing.
- Edge rings are mask-alpha rings, not subpixel edge detectors.
- Hue distribution is binned into 12 deterministic hue buckets.
- Weighted opacity estimates are analysis signals, not physically exact cosmetic opacity.

## Next Stage

Recommended Phase 4C:

1. Make pixel sampling mask-weighted for each product category in template builder.
2. Add manual mask correction in Template Studio.
3. Add ONNX/WebGPU segmentation provider behind `SegmentationProvider`.
4. Add fixture images with known cosmetics for regression snapshots.
5. Add region-specific baselines, especially cheek skin vs blush and eyelid skin vs eyeshadow.

