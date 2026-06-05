# Image-conditioned Cosmetic Segmentation Training

Phase 6D upgrades the baseline from an average mask prior to an image-conditioned
pixel prior. Training still consumes only `MaterializedTrainingDataset` and
training bridge outputs, but it now reads materialized JSON RGB/RGBA pixel
artifacts.

The model remains lightweight and deterministic. It does not use PyTorch,
TensorFlow, ONNX Runtime, WebGPU training, MediaPipe runtime, or OpenAI.

The training path is:

`MaterializedTrainingDataset -> image pixel artifact -> pixel feature extractor -> image-conditioned trainer -> model.json -> evaluation report -> provider`
