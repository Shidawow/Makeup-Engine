# Export Package Runtime Smoke

Runtime smoke validates that an export-ready package can be loaded into the lightweight classifier provider contract.

It checks:

- provider compatibility
- model id consistency
- trained region availability
- predicted mask shape

It does not run a browser, ONNX Runtime, WebGPU, MediaPipe, or a model accuracy benchmark.
