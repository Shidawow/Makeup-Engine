# Real Image Decoder Boundary

Phase 6F introduces an explicit image decoder boundary for training artifacts.

Supported now:

- `json-rgba-grid`
- `raw-rgba-binary`

Preparation-only placeholders:

- `png-image-placeholder`
- `jpeg-image-placeholder`

The boundary is intentionally dependency-free. It does not use browser canvas, PNG/JPEG libraries, OpenAI Vision, MediaPipe, or any ML runtime. PNG/JPEG inputs return explicit unsupported issues instead of pretending to decode pixels.

The next production step is to attach a real decoder implementation behind the same contract without changing the training bridge.
