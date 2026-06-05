# EXIF Orientation Boundary

The EXIF orientation boundary parses JPEG APP1 EXIF orientation when present.

Supported normalized orientations are:

- missing orientation
- 1
- 3
- 6
- 8

Unsupported mirrored orientations are reported instead of being silently ignored. Any future JPEG decoder must apply orientation before creating `ImagePixelData`.
