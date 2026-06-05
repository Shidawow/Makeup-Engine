# PNG Image Sidecar Metadata

Every materialized PNG image artifact may have a sidecar:

```text
images-png/{imageId}.png.meta.json
```

The sidecar records:

- `imageId`
- `sampleId` when available
- `width`
- `height`
- `channels: 4`
- `colorSpace: srgb`
- `alphaMode: straight-alpha`
- `codecKind: png`
- `codecVersion: makeup-engine-png-image-rgba-v0.1`
- `checksum`
- `source`

The training bridge uses the sidecar to detect width/height mismatches before feature extraction. It does not trust file extension alone.

