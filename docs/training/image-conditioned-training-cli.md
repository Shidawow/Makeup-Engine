# Image-conditioned Training CLI

Dry run:

```bash
node scripts/train-image-conditioned-segmentation.mjs \
  --dataset ./tests/fixtures/materialized-dataset-with-pixels.sample \
  --regions lips,blush,eyeshadow \
  --dry-run \
  --json
```

Train and evaluate:

```bash
node scripts/train-image-conditioned-segmentation.mjs \
  --dataset ./tests/fixtures/materialized-dataset-with-pixels.sample \
  --regions lips,blush,eyeshadow \
  --out ./tmp/models/makeup-segmentation-image-conditioned/dev-v0 \
  --evaluate \
  --strict \
  --json
```

The CLI writes `model.json`, `model-artifact-manifest.json`,
`evaluation-report.json`, `training-run-package.json`, `trainer-config.json`,
and `failed-samples.json`.
