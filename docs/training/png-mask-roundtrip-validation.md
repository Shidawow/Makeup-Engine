# PNG Mask Round-Trip Validation

PNG alpha masks use an 8-bit grayscale PNG representation. The source training
alpha grid is normalized `0..1`; PNG stores it as `0..255` uint8 values.

Allowed round-trip error:

- max alpha delta: `1 / 255 + epsilon`
- mean alpha delta: reported in `codec-roundtrip-report.json`
- changed pixel ratio: must be `0` for current deterministic fixtures

Validation checks:

- PNG file exists and decodes
- sidecar metadata exists
- width and height match
- sample, image, and region lineage match
- coordinate space is `image-pixel` / pixel-grid compatible
- checksum and alpha encoding are stable

Blocking errors are routed to failed sample quarantine in strict mode.
