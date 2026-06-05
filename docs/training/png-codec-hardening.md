# PNG Codec Hardening

The PNG image codec supports dependency-free decoding for project-compatible PNG files:

- 8-bit depth
- color types 0, 2, and 6
- non-interlaced images
- PNG filter types 0, 1, 2, 3, and 4
- stored-deflate streams produced by the project codec

Unsupported PNGs return explicit validation issues instead of being silently accepted.

The hardening functions are:

- `decodePngIdatChunks`
- `reconstructPngScanlines`
- `applyPngFilterReconstruction`
- `convertPngColorToRgba`
- `validatePngDecodeSupport`
- `summarizePngCodecSupport`
