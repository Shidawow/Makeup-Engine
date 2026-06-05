# Baseline Segmentation Provider

The baseline provider adapts a trained `BaselineSegmentationModel` to the
existing segmentation provider contract. It is explicit opt-in and does not
replace the production default provider.

For each requested region:

1. locate the region prior
2. project the prior `meanAlphaGrid` into the segmentation mask output
3. use the current cosmetic region polygon and bounds
4. emit confidence from the quality-weighted confidence prior
5. fall back to polygon refinement if a prior is unavailable

The provider does not call OpenAI, MediaPipe, ONNX Runtime, WebGPU, PyTorch, or
TensorFlow. It is a baseline integration point for the trained prior model.
