# Makeup Analysis Pipeline Report

Status: Phase 1 baseline

## Pipeline

```text
image
-> face detection
-> landmarks
-> segmentation
-> cosmetic regions
-> makeup analysis
-> template parameterization
```

Implemented entrypoint:

```ts
runMakeupAnalysisPipeline({ image, provider })
```

## Output Artifacts

The pipeline returns:

- `faceDetection`
- `faceMesh`
- `segmentationMasks`
- `cosmeticRegions`
- `parameters`
- `trace`
- `debug`

## Determinism

The pipeline is deterministic for a deterministic provider:

- stage order is fixed
- region builders are pure
- region defaults are fixed
- parameterization is derived from regions only

This makes the pipeline testable and suitable for template production QA.

## Debuggability

Every run includes:

- stage trace
- provider debug artifacts
- cosmetic region count
- average region confidence
- editable parameter count
- template signal count

This is sufficient for a Template Studio debug panel in the next phase.

## Visual Output Readiness

Every cosmetic region has:

- normalized polygon
- normalized polygon mask
- confidence
- region type
- editability marker

The UI can render these as face overlays without knowing provider internals.

## Template Parameterization

The parameter schema currently includes:

- lips: coverage, color family, edge softness, gloss level
- eyes: eyeliner weight, eyeshadow spread, lash emphasis, lift angle
- brows: definition, arch lift, density
- blush: placement, saturation, diffusion
- contour: cheek depth, jaw definition, nose definition, blend softness
- highlight: glow intensity, placement, particle shimmer

These fields are intentionally practical rather than exhaustive. They are enough to begin template production while leaving room for model-driven refinement.

