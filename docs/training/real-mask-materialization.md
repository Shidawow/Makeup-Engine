# Real Mask Materialization

Phase 6E adds a deterministic binary mask materialization boundary for training data. The training bridge still starts from reviewed, accepted, training-ready `MaterializedTrainingDataset` samples. It does not read Template Studio state.

The first supported real materialization format is `binary-alpha-mask`, encoded as a stable JSON payload with a `MEAMASK` header and uint8 alpha values. PNG masks remain an explicit unsupported boundary until a real decoder/writer is introduced.

Materialized masks live under:

```text
datasets/makeup-engine/{datasetVersion}/masks-binary/
```

The writer checks width, height, region, target, alpha range, and checksum stability. Round-trip validation converts the binary payload back into a training mask payload within uint8 quantization limits.
