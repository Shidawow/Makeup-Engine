# Real Image File Resolver

Phase 6E adds a real image file resolver boundary without introducing PNG or JPEG decoding.

Supported in this phase:

- `json-rgba-grid`
- `raw-rgba-binary` as a boundary that can be represented as JSON pixel artifact data

Explicit placeholders:

- `png-image`
- `jpeg-image`

The resolver validates portable paths, rejects absolute path leakage by default, and returns clear unsupported issues for PNG/JPEG. It does not read UI state and does not bypass reviewed dataset filters.
