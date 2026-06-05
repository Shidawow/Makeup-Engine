# ONNX Export Prototype

Phase 6G creates a JSON graph prototype for future ONNX export.

The prototype includes:

- input tensor spec
- output tensor spec
- per-region graph nodes
- initializer checksums
- limitations

It does not emit a binary `.onnx` file and does not validate with ONNX Runtime. The goal is to make the lightweight classifier graph auditable before Phase 6H real writer work.
