# Training Preflight CLI

Run preflight before handing a materialized dataset to future training code:

```bash
node scripts/training-preflight.mjs \
  --dataset ./datasets/makeup-engine/dev-v0 \
  --strict
```

Useful variants:

```bash
node scripts/training-preflight.mjs --dataset ./datasets/makeup-engine/dev-v0 --json
node scripts/training-preflight.mjs --dataset ./datasets/makeup-engine/dev-v0 --split train
node scripts/training-preflight.mjs --dataset ./datasets/makeup-engine/dev-v0 --region lips --quality-threshold 0.7
```

The CLI reports:

- dataset id and version
- train / validation / test counts
- region coverage
- quality summary
- checksum status
- artifact status
- split status
- batch iterator summary
- warnings and errors
- readiness: `pass`, `warning`, or `fail`

`--strict` exits non-zero only for blocking errors. Region coverage gaps are
warnings because early datasets may not yet cover every cosmetic region.
