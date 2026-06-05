# Build Training Dataset Codec Flow

Use the materialized dataset CLI to create real PNG mask artifacts from the
reviewed fixture/package data:

```bash
node scripts/build-training-dataset.mjs \
  --fixture ./tests/fixtures/materialized-dataset-realistic-synthetic.sample \
  --mask-codec png \
  --materialize-png-masks \
  --write-artifact-manifest \
  --write-codec-sidecars \
  --validate-codec-roundtrip \
  --out ./tmp/datasets/realistic-synthetic-png-mask-v0 \
  --json
```

The command writes:

- `masks-png/*.png`
- `masks-png/*.png.meta.json`
- `artifact-manifest.json`
- `codec-roundtrip-report.json`
- `checksums.json`

`--dry-run` performs capability and write-plan checks without writing files.
`--strict-codec` should be used when a missing or invalid PNG mask must block
the pipeline.
