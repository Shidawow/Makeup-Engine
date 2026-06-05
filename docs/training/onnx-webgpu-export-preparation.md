# ONNX / WebGPU Export Preparation

Phase 6F records ONNX and WebGPU export requirements without producing real runtime artifacts.

The preparation manifest captures:

- target runtime
- expected input names
- expected output names
- placeholder tensor layout
- blocking issues

This makes export readiness auditable while preserving the current boundary: no ONNX Runtime, no WebGPU training, and no generated model binary.
