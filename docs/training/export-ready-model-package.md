# Export-ready Model Package

Phase 6F adds an export package for the lightweight classifier model.

The package contains:

- `export-package.json`
- `export-package-manifest.json`
- `model.json`
- `provider-spec.json`
- `runtime-compatibility.json`
- `export-preparation-manifest.json`
- `checksums.json`
- `README.md`

Supported runtime targets in this phase are TypeScript, browser, and Node provider packages. ONNX, WebGPU, and mobile remain preparation-only placeholders.

The package is generated from a trained lightweight classifier artifact. It does not train a model and does not introduce ONNX Runtime, WebGPU, PyTorch, or TensorFlow.
