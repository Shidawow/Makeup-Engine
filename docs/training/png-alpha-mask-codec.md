# PNG Alpha Mask Codec

Phase 6H-0 turns PNG alpha masks from an unsupported boundary into a real,
deterministic mask artifact format.

The codec uses:

- PNG color type: 8-bit grayscale
- alpha encoding: `uint8-alpha`
- compression: zlib stored deflate blocks
- dependency: none
- native binding: none

The codec deliberately handles mask PNGs only. It does not decode real PNG/JPEG
source photos; that remains a separate image codec decision.

Each PNG mask has a sidecar:

```json
{
  "schemaVersion": "png-alpha-mask-sidecar.v1",
  "maskId": "artifact-train-lips-edited",
  "sampleId": "sample-train-lips",
  "imageId": "image-train",
  "regionId": "lips",
  "target": "lips",
  "width": 64,
  "height": 64,
  "coordinateSpace": "image-pixel",
  "alphaEncoding": "uint8-alpha",
  "codecKind": "png",
  "codecVersion": "makeup-engine-png-alpha-grayscale-v0.1",
  "checksum": "..."
}
```

The sidecar carries training lineage and coordinate metadata that is not embedded
into the PNG itself.
