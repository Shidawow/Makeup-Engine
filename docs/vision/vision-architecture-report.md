# Vision-first Architecture Report

Status: Phase 1 implementation baseline  
Date: 2026-05-27

## Goal

Move the project from platform skeleton toward real visual makeup decomposition.

This phase establishes:

- provider-based vision architecture
- FaceMesh adapter boundary
- normalized coordinate schema
- cosmetic region parameterization
- deterministic makeup analysis pipeline

It intentionally does not add chat AI, backend services, agent orchestration, or generic runtime abstractions.

## New Source Structure

```text
src/vision/
  providers/
    types.ts
    mediapipe/
      faceMeshAdapter.ts
      index.ts
    opencv/
      index.ts
    onnx/
      index.ts
    webgpu/
      index.ts
    mock/
      mockVisionProvider.ts
      index.ts
  cosmetic-regions/
    types.ts
    faceMeshRegions.ts
    index.ts
  pipeline/
    makeup-analysis-pipeline.ts
    index.ts
  makeup-parameters.ts
```

## Provider Architecture

All real vision execution should go through `VisionProvider`.

```ts
export interface VisionProvider {
  id: string;
  kind: VisionProviderKind;
  capabilities: VisionProviderCapability[];
  analyze(image: MakeupPhotoInput): Promise<VisionProviderResult>;
}
```

The pipeline receives a provider as input. It does not import a concrete provider implementation.

Current provider status:

| Provider | Status | Purpose |
| --- | --- | --- |
| `mediapipe` | adapter boundary implemented | FaceMesh integration point |
| `opencv` | capability descriptor | future deterministic CV preprocessing |
| `onnx` | capability descriptor | future local model inference |
| `webgpu` | capability descriptor | future accelerated segmentation |
| `mock` | test-only implementation | deterministic unit/integration tests |

Important boundary:

- `src/vision/providers/index.ts` does not export the mock provider.
- Tests import `src/vision/providers/mock` explicitly.
- Business code should receive a provider through dependency injection.

## FaceMesh Integration

The first FaceMesh boundary is:

```text
MediaPipe-style landmark result
-> adaptMediaPipeFaceMesh()
-> FaceMeshGeometry
```

The adapter normalizes:

- landmark coordinates
- confidence values
- bounding box
- face ID / image ID ownership

Coordinates use:

```text
normalized-image
```

This is the correct base for region masks, template authoring, and later canvas/WebGL overlays.

## Cosmetic Region System

Implemented regions:

- lips
- eyes
- brows
- blush
- contour
- highlight

Each region includes:

- `kind`
- normalized polygon
- polygon mask
- confidence
- editability marker
- debug notes
- region-specific parameters

Example shape:

```ts
{
  kind: 'lips',
  polygon,
  mask,
  editable: true,
  parameters: {
    coverage: 'center-gradient',
    colorFamily: 'pink',
    edgeSoftness: 0.72,
    glossLevel: 0.35
  }
}
```

## Makeup Parameter Schema

`MakeupParameterSchema` is the editable bridge from vision output to template generation:

```ts
{
  version: '0.1',
  imageId,
  faceId,
  lips,
  eyes,
  brows,
  blush,
  contour,
  highlight,
  editableRegionIds,
  templateSignals
}
```

This format is designed for:

- admin editing
- template generation
- recommendation engines
- coach runtime instruction generation

## Design Rule

Vision output must remain explainable. Every region is derived from:

- normalized landmarks
- segmentation masks when available
- deterministic parameter defaults
- debug artifacts

There is no hidden black-box logic in the new pipeline. Future model providers can improve detection quality, but they must still emit the same transparent protocol.

