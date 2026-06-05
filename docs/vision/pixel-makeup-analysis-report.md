# Pixel Makeup Analysis Report

Status: Vision-first Phase 3 implementation

## Goal

Move from geometry-only makeup understanding to deterministic pixel-level makeup extraction.

Implemented modules:

```text
src/vision/pixel-analysis/
src/vision/makeup-semantics/
src/vision/geometry/
```

## Pixel Analysis

The pixel engine consumes:

```text
ImagePixelData
+ CosmeticRegionParameter[]
-> MakeupPixelAnalysis
```

It is provider-agnostic and UI-free.

Extracted features:

### Lips

- dominant hue
- saturation
- brightness
- edge softness
- gradient direction

### Blush

- blush center
- spread radius
- opacity
- warm/cool/neutral tone

### Eyes

- eyeshadow darkness
- shimmer estimation
- eyeliner direction

## Semantic Layer

The semantic layer is rule-based:

```text
MakeupPixelAnalysis
-> MakeupSemanticAnalysis
```

Example labels:

- `lip_style:soft_gradient`
- `lip_finish:velvet`
- `blush_style:high_lift`
- `eye_style:soft_smokey`

Each semantic output includes explanations. No LLM or chat system is involved.

## Template Integration

`buildMakeupTemplateFromVisionAnalysis()` now converts:

```text
MakeupAnalysisPipelineResult
-> MakeupTemplate
```

Template output includes:

- semantic summary
- style tags
- pixel-derived region evidence
- lip/blush/eye steps
- editable parameters

## Visual QA

The demo now includes `VisionQaPanel`, which displays:

- region debug
- color sampling preview
- semantic labels
- template diff
- before/after compare summary

## Tests

Added coverage:

- aspect ratio coordinate mapping
- overlay alignment snapshot
- pixel sampling
- semantic classification
- template extraction snapshot

