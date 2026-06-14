# Local MediaPipe Assets

This project runs the browser FaceMesh runtime from local MediaPipe Tasks Vision
assets. The assets are intentionally local machine setup files and must not be
committed to GitHub.

## Required Files

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

The runtime uses:

- Model path: `/mediapipe/face_landmarker.task`
- WASM base path: `/mediapipe/wasm`
- Readiness check path: `/mediapipe/wasm/vision_wasm_internal.js`

## Prepare

```bash
npm run mediapipe:prepare
```

This copies WASM files from `node_modules/@mediapipe/tasks-vision/wasm` and
downloads the official Face Landmarker model from:

```text
https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task
```

If the network download fails, manually place that official model at:

```text
public/mediapipe/face_landmarker.task
```

## Check

```bash
npm run mediapipe:check
```

The check command reports missing files and exits non-zero when local assets are
not ready.

## Git Boundary

`public/mediapipe` is ignored by `.gitignore`. Do not commit `.task`, `.wasm`,
or copied MediaPipe runtime files.

On a new machine or after deleting `public/mediapipe`, run the prepare command
again.

## Runtime Behavior

When these files exist, localhost should initialize the real MediaPipe
FaceLandmarker runtime before running the makeup analysis pipeline.

When these files are missing:

- localhost / `127.0.0.1` / `0.0.0.0` / `::1` can fall back to the existing
  mock vision provider so UI work remains unblocked.
- non-local hosts do not automatically fall back, so deployment resource
  problems are not hidden.

## Common Errors

- Missing `public/mediapipe/face_landmarker.task`: run
  `npm run mediapipe:prepare` or manually download the official model.
- Missing `public/mediapipe/wasm/vision_wasm_internal.js`: install dependencies
  and run `npm run mediapipe:prepare`.
- Browser console 404 for `/mediapipe/...`: confirm Vite is serving the project
  root and that files are under `public/mediapipe`.
