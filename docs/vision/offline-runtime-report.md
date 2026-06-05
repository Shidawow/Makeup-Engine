# Offline MediaPipe Runtime Report

Status: Vision-first Phase 3 implementation  
Date: 2026-05-27

## Goal

Remove runtime dependency on public CDN/model URLs for FaceMesh.

The browser runtime now defaults to local assets:

```text
public/mediapipe/
  face_landmarker.task
  wasm/
    vision_wasm_internal.js
    vision_wasm_internal.wasm
    vision_wasm_module_internal.js
    vision_wasm_module_internal.wasm
    vision_wasm_nosimd_internal.js
    vision_wasm_nosimd_internal.wasm
```

## Runtime Paths

Default WASM path:

```text
/mediapipe/wasm
```

Default model path:

```text
/mediapipe/face_landmarker.task
```

These are used by:

```text
src/vision/providers/mediapipe/runtime/browserFaceMeshRuntime.ts
```

The provider still allows config overrides for tests and future deployment layouts.

## Offline Behavior

Once the Vite app is served, FaceMesh no longer needs:

- `cdn.jsdelivr.net`
- `storage.googleapis.com`

This makes local demos more stable and removes model download latency after the app is served.

## Remaining Caveat

The model asset is now local in the repository workspace. If the app is deployed elsewhere, the deploy pipeline must include `public/mediapipe/**`.

