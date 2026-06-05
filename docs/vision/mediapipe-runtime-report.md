# MediaPipe Runtime Report

Status: Vision-first Phase 2 implementation  
Date: 2026-05-27

## Runtime Scope

The project now has a browser MediaPipe FaceMesh runtime under:

```text
src/vision/providers/mediapipe/runtime/
```

Implemented lifecycle:

- `initialize()`
- `warmup()`
- `detect(image)`
- `dispose()`

The runtime is browser-only. It lazy-loads `@mediapipe/tasks-vision` inside `initialize()` so non-vision code does not pay the model/runtime cost at app startup.

## Runtime Boundary

Business and UI layers do not receive MediaPipe-native types.

Runtime flow:

```text
MakeupPhotoInput
-> BrowserMediaPipeFaceMeshRuntime.detect()
-> MediaPipe FaceLandmarker
-> MediaPipeFaceMeshResult
-> adaptMediaPipeFaceMesh()
-> FaceMeshGeometry
-> VisionProviderResult
```

MediaPipe object types stay inside:

```text
src/vision/providers/mediapipe/runtime/
src/vision/providers/mediapipe/faceMeshAdapter.ts
```

## Model Loading

Default WASM base URL:

```text
https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm
```

Default FaceLandmarker model:

```text
https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task
```

Both can be overridden through `MediaPipeFaceMeshRuntimeConfig`.

## Provider Integration

`createMediaPipeFaceMeshProvider()` now creates a provider backed by the browser runtime.

It emits:

- `VisionProviderResult`
- `VisionFaceDetection`
- `FaceMeshGeometry`
- debug artifacts
- normalized face bounding box
- normalized landmarks

## Test Strategy

Tests do not download the model. They inject a fake `MediaPipeFaceMeshRuntime` into the provider and verify:

- lifecycle calls
- provider output shape
- 468-landmark propagation
- debug artifact creation

This keeps tests deterministic while preserving the real browser runtime path for the demo.

## Current Limitation

The runtime depends on remote model assets by default. For production or offline demos, the `.task` model and WASM files should be vendored into public assets and referenced by local URLs.

