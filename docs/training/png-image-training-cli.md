# PNG Image Training CLI Flow

Materialize PNG image artifacts:

```bash
node scripts/build-training-dataset.mjs \
  --fixture ./tests/fixtures/materialized-dataset-realistic-synthetic.sample \
  --codec png \
  --materialize-png-images \
  --write-artifact-manifest \
  --write-codec-sidecars \
  --validate-codec-roundtrip \
  --out ./tmp/datasets/realistic-synthetic-png-image-v0 \
  --json
```

Train the lightweight classifier with PNG image preference:

```bash
node scripts/train-lightweight-segmentation.mjs \
  --dataset ./tmp/datasets/realistic-synthetic-png-image-v0 \
  --regions lips,blush,eyeshadow \
  --classifier nearest-centroid \
  --image-format-preference png,raw,json \
  --mask-format-preference png,binary,json \
  --evaluate \
  --strict \
  --json
```

The result reports:

- `actualImageArtifactFormats`, including `png-image` when PNG images were used
- `actualMaskArtifactFormats`, including `png-alpha-mask` when PNG masks were used

