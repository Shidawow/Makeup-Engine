# Engine Pipeline Analysis

## Current Legacy Pipeline

The legacy engine pipeline still exists and is composed of:

- `src/engine/stages/analyze-face.ts`
- `src/engine/stages/analyze-beauty.ts`
- `src/engine/stages/infer-style.ts`
- `src/engine/stages/build-makeup-plan.ts`
- `src/engine/stages/compile-layers.ts`
- `src/engine/stages/render-preview.ts`
- `src/engine/orchestrator/MakeupEngine.ts`
- `src/engine/executor/pipeline-executor.ts`
- `src/engine/graph/pipeline-graph.ts`
- `src/engine/runtime/render-runtime.ts`

## Data Flow

```text
FaceFeatures
→ FaceAnalysisResult
→ BeautyScoreResult
→ StyleInferenceResult
→ MakeupPlan
→ RenderInstruction[]
→ RenderFrame
```

## Stage Responsibilities

### analyzeFace

Normalizes `FaceFeatures` into a face analysis result.

### analyzeBeauty

Produces heuristic scoring dimensions.

### inferStyle

Runs rule-based recommendation inference.

### buildMakeupPlan

Assembles a plan from the look, face analysis, score, and style result.

### compileLayers

Converts plan steps into render instructions.

### renderPreview

Hands render instructions to the runtime.

## Weak Boundaries

The pipeline has multiple weak boundaries:

- The orchestrator owns too many concerns at once.
- The executor and graph are not truly independent business concepts.
- The runtime layer is generic and renderer-centric, not template-centric.
- Several stages are thin wrappers over direct function calls rather than meaningful domain boundaries.

## Coupling Problems

- `infer-style` depends on `intelligence/runtime/rule-engine`, which creates a hidden dependency on the older intelligence stack.
- `compile-layers` depends on compiler output, meaning engine and compiler are not cleanly separated at the business level.
- `MakeupEngine` coordinates runtime lifecycle and pipeline execution together, which makes it too broad for the new product direction.

## Directional Assessment

This pipeline is adequate as a legacy preview flow, but it is not the right abstraction for the makeup template factory. The new pipeline should center on template decomposition and template build, not runtime preview.
