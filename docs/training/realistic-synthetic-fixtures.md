# Realistic Synthetic Fixtures

Phase 6G adds `materialized-dataset-realistic-synthetic.sample`.

The fixture uses deterministic 64x64 generated RGBA pixel grids and covers:

- lips
- blush
- eyeshadow
- eyeliner
- contour
- highlight

It is not a real face dataset. It exists to validate codec fallback, full-region training, runtime smoke, and ONNX prototype export without remote resources or image decoding dependencies.
