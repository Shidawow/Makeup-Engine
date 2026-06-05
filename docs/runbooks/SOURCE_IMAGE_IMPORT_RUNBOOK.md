# Source Image Import Runbook

## Purpose

Source image import turns local admin images into a `SourceImagePackage`. It does not create training data.

## Dry Run

```bash
node scripts/import-source-images.mjs \
  --input ./tests/fixtures/source-images \
  --out ./tmp/source-images/admin-batch-v0 \
  --dry-run \
  --json
```

## Real Write

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

## Expected Outputs

- `source-image-manifest.json`
- `checksums.json`
- `import-report.json`
- `import-quarantine.json`
- normalized PNG, raw RGBA, or JSON RGBA artifacts when requested and supported

## Quarantine

Review:

```text
tmp/source-images/admin-batch-v0/import-quarantine.json
```

Common quarantine causes include unsupported codec, unsupported JPEG pixel decode, failed decode, low source image quality, and missing artifacts.

## Browser Artifact Binding

Template Studio can import or paste `source-image-manifest.json`, but the browser cannot read CLI package relative paths by itself.

After importing a manifest:

1. Select a ready source image entry.
2. Bind the normalized PNG artifact through the Artifact Binding panel.
3. Studio creates a temporary object URL from the explicitly selected file.
4. Create `TemplateAnalysisSeed`.
5. If the binding validates, the seed can become `ready_for_vision_analysis`.

Rules:

- Manifest paths are references, not browser-readable files.
- Only operator-selected files can be read by Studio.
- Object URLs are temporary and must be rebound after refresh.
- Local absolute paths are not stored.
- Large image bytes are not stored in session storage.
- `SourceImagePackage` cannot bypass correction or review queue.
