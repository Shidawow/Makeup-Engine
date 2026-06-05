# Binary Mask Artifact Format

The Phase 6E binary mask format is intentionally simple and dependency-free.

```json
{
  "magic": "MEAMASK",
  "version": 1,
  "width": 3,
  "height": 3,
  "regionId": "lips",
  "target": "lips",
  "valueType": "uint8-alpha",
  "values": [0, 255, 0]
}
```

Diff artifacts use the same idea with `MEADIFF`. The format is not a production binary codec yet; it is the deterministic artifact boundary that lets the training pipeline validate materialized files without image-processing dependencies.

PNG support is deliberately not faked. If a PNG mask is requested, the system must return an unsupported-format issue until a real PNG implementation exists.
