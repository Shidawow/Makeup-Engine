# Training Dataset Runbook

## Purpose

`build-training-dataset` materializes reviewed training data. It must not train from a source image package alone.

## Command

```bash
npm run build:training-dataset -- --help
```

Use project-specific dataset inputs that include masks, corrections, review decisions, splits, manifests, and checksums.

## Source Image Boundary

A `SourceImagePackage` is only an upstream import and analysis seed boundary. It cannot skip masks, correction, or review queue.

Boundary example:

```bash
node scripts/build-training-dataset.mjs \
  --source-image-package ./tmp/source-images/admin-batch-v0/source-image-manifest.json \
  --use-source-image-artifacts \
  --dry-run \
  --json
```

Expected result: blocked with `source-image-package-is-not-training-ready-dataset`.

## Requirements Before Training

- Editable masks exist.
- Human correction data exists.
- Dataset review queue decisions approve the samples.
- Materialized dataset package, splits, checksums, and audit reports are generated.
