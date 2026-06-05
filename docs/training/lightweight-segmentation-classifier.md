# Lightweight Segmentation Classifier

Phase 6E introduces a pure TypeScript lightweight classifier baseline. It is not a neural network and does not use PyTorch, TensorFlow, ONNX Runtime, WebGPU, OpenAI, or MediaPipe runtime.

Supported classifier kinds:

- `nearest-centroid`
- `logistic-linear`
- `hybrid-threshold` boundary

Training consumes pixel features extracted from `ImagePixelArtifact` and labels from human-edited alpha masks. Positive pixels use `alpha >= alphaPositiveThreshold`; negative pixels use `alpha <= alphaNegativeThreshold`.

The model artifact is JSON and contains per-region centroids, weights, thresholds, feature names, sample counts, and deterministic checksums.
