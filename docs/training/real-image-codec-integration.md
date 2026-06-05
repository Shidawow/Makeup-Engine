# Real Image Codec Integration

Phase 6G keeps the training bridge local-first and codec-aware.

Current support:

- `json-rgba-grid`: real support.
- `raw-rgba-binary`: real support through the dependency-free `MEARGBA` path.
- `png-image`: explicit unsupported boundary unless a real codec is later attached.
- `jpeg-image`: explicit unsupported boundary.

PNG/JPEG failures return codec issues and never silently fall back. Training can then choose raw/json fallback according to artifact preference.
