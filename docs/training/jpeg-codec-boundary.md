# JPEG Codec Boundary

JPEG support is intentionally metadata-only in this phase.

The boundary detects JPEG files, reads basic dimensions when possible, reads EXIF orientation when available, and returns `jpeg-decode-unsupported` for pixel decoding.

This prevents the training pipeline from pretending JPEG pixels were decoded. Real JPEG decoding is reserved for a later phase or for an explicitly reviewed lightweight pure-JS decoder.
