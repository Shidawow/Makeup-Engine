# Real Artifact Boundary

The training bridge separates implemented artifact codecs from future runtime
boundaries.

Mask formats:

- `json-alpha-grid`
- `png-alpha-mask`
- `binary-alpha-mask`

Diff formats:

- `json-diff-grid`
- `png-diff-heatmap-placeholder`
- `binary-diff-placeholder`

Current behavior:

- JSON mask metadata can be converted into training payloads.
- Binary mask artifacts are supported as a fallback format.
- PNG alpha masks are supported as real 8-bit grayscale PNG artifacts.
- PNG diff heatmap and arbitrary image PNG/JPEG decode remain separate boundaries.
- No native image library is used.

Future work can add real PNG/JPEG image decode or a deployable model writer
without changing the training bridge contract.
