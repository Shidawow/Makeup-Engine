# PNG Mask Support Boundary

PNG alpha mask support is implemented for materialized training mask artifacts.

Current behavior:

- `json-alpha-grid` remains readable.
- `binary-alpha-mask` remains a dependency-free fallback.
- `png-alpha-mask` can be written and read as a real 8-bit grayscale PNG.
- PNG mask lineage is stored in `.png.meta.json` sidecars.

This support is scoped to alpha masks. It does not decode arbitrary PNG/JPEG
source images and does not introduce `sharp`, `canvas`, `pngjs`, or native image
bindings.
