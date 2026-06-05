# Source Image To Template Analysis

Template analysis may consume a ready source image entry through `sourceImagePackageStorage`.

The storage boundary can:

- read a source image manifest
- list ready source images
- resolve normalized artifacts
- create a template analysis seed
- validate readiness

This is only a read boundary. It does not start FaceMesh, segmentation, correction review, or training. The local CV pipeline remains responsible for mask generation and later dataset production.
