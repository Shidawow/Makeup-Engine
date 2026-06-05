# Baseline Training CLI

Run a dry-run plan:

```bash
node scripts/train-baseline-segmentation.mjs \
  --dataset ./tests/fixtures/materialized-dataset.sample \
  --regions lips,blush,eyeshadow \
  --dry-run \
  --json
```

Train and evaluate a baseline model:

```bash
node scripts/train-baseline-segmentation.mjs \
  --dataset ./tests/fixtures/materialized-dataset.sample \
  --regions lips,blush,eyeshadow \
  --out ./tmp/models/makeup-segmentation-baseline/dev-v0 \
  --evaluate \
  --strict \
  --json
```

The CLI writes:

- `model.json`
- `model-artifact-manifest.json`
- `evaluation-report.json`
- `training-run-package.json`
- `trainer-config.json`
- `failed-samples.json`

Strict mode fails on blocking errors. Missing region coverage is a warning unless
the trainer config changes the missing region policy to fail.
