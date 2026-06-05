# Real Photo Import Pipeline

Phase 6H-2 adds a source-image import pipeline before template analysis and before any training dataset is built.

The pipeline reads admin-provided source image files, detects the codec, decodes supported PNG images into normalized pixel artifacts, runs a deterministic source image quality gate, and writes a local source image package.

It does not create masks, corrections, review items, split JSONL files, or training-ready samples. A source image package is only an input boundary for later local CV analysis.

Recommended command:

```bash
node scripts/import-source-images.mjs \
  --input ./tests/fixtures/source-images \
  --out ./tmp/source-images/admin-batch-v0 \
  --codec-preference png,jpeg \
  --materialize-normalized-png \
  --materialize-raw-rgba \
  --materialize-json-rgba \
  --write-manifest \
  --quality-gate \
  --json
```

Outputs include `source-image-manifest.json`, `checksums.json`, `import-report.json`, `import-quarantine.json`, and optional normalized image artifacts.
