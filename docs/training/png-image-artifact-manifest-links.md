# PNG Image Artifact Manifest Links

`build-training-dataset` can write PNG image artifact links into `artifact-manifest.json`.

Example link fields:

- `artifactType: image-pixel`
- `format: png-image`
- `relativePath: images-png/{imageId}.png`
- `sidecarMetadataReference: images-png/{imageId}.png.meta.json`
- `codecMetadataReference: image-codec-report.json`
- `codecKind: png`
- `codecVersion: makeup-engine-png-image-rgba-v0.1`
- `colorSpace: srgb`
- `alphaMode: straight-alpha`
- `channels: 4`

These links are metadata for training/runtime tools. They do not allow the trainer to bypass review queue, quality gate, or accepted + training-ready filtering.

