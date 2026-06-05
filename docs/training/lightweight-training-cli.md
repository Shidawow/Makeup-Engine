# Lightweight Training CLI

Use the CLI after creating a materialized dataset:

```bash
node scripts/train-lightweight-segmentation.mjs \
  --dataset ./datasets/makeup-engine/dev-v0 \
  --regions lips,blush,eyeshadow \
  --classifier nearest-centroid \
  --out ./tmp/models/makeup-segmentation-lightweight-classifier/dev-v0 \
  --evaluate \
  --strict \
  --json
```

Dry-run mode writes nothing:

```bash
node scripts/train-lightweight-segmentation.mjs \
  --dataset ./datasets/makeup-engine/dev-v0 \
  --classifier nearest-centroid \
  --dry-run \
  --json
```

The CLI writes:

- `model.json`
- `model-artifact-manifest.json`
- `evaluation-report.json`
- `training-run-package.json`
- `trainer-config.json`
- `failed-samples.json`
