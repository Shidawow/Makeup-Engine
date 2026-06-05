# Artifact Manifest Codec Links

Phase 6H-0 makes PNG alpha masks first-class materialized mask artifacts.

`artifact-manifest.json` can now record `png-alpha-mask` links with:

- `relativePath`: `masks-png/{sampleId}-{regionId}.png`
- `sidecarMetadataReference`: `masks-png/{sampleId}-{regionId}.png.meta.json`
- `codecKind`: `png`
- `codecVersion`: `makeup-engine-png-alpha-grayscale-v0.1`
- `alphaEncoding`: `uint8-alpha`
- `coordinateSpace`: `pixel-grid`
- source lineage fields for the source sample, image, and source alpha grid

The manifest remains portable. It records relative paths and `materialized://`
style references rather than absolute machine paths.
