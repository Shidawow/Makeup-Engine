# PNG Image Readiness Gate

The readiness gate checks:

- PNG image files exist
- PNG image sidecars exist
- `image-codec-report.json` exists and is ready/pass
- artifact manifest has `png-image` links
- PNG image and PNG mask dimensions can be checked together

`training-preflight` reports:

- `phase6fReadiness.pngImageCodecReady`
- `phase6fReadiness.pngImageDecodeReady`
- existing PNG alpha mask readiness fields

Export package readiness now also includes image codec readiness:

- `codecReadiness.imageCodecReadiness`
- `codecReadiness.supportedImageArtifactFormats`
- `codecReadiness.preferredImageArtifactFormat`

This remains a training bridge gate. Browser UI does not write local datasets, and training does not read Template Studio React state.

