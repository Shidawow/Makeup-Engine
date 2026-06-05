# Real PNG Image Decode

Phase 6H-1 adds a dependency-free PNG image codec for materialized training datasets.

Supported now:

- `png-image` RGBA decode into `ImagePixelData`
- 8-bit non-interlaced PNG
- color type `6` RGBA, with decode support for RGB/grayscale sources in the codec boundary
- filter type `0`
- zlib stored deflate blocks emitted by Makeup Engine
- deterministic checksum and sidecar metadata

Not supported yet:

- JPEG decode
- external PNG encoders/decoders
- PNG filter reconstruction beyond filter `0`
- real photo file ingestion outside the materialized artifact contract

The codec is intentionally small and local-first. It is used to validate the real artifact bridge before a future production image decoder is introduced.

