# Raw RGBA Artifact Format

Raw RGBA artifacts provide a dependency-free bridge from JSON pixel artifacts toward real image materialization.

The format uses stable JSON metadata with:

- magic: `MEARGBA`
- version: `1`
- width / height
- channels: `4`
- colorSpace: `srgb`
- uint8 RGBA values

The writer converts `json-rgba-grid` values from normalized `0..1` floats into deterministic `0..255` values. The reader converts them back into training pixel data. This is not PNG or JPEG decoding; it is a local reproducible intermediate artifact.
