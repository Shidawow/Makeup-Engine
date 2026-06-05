# Training Dataset CLI

The local materialization CLI is:

```bash
node scripts/build-training-dataset.mjs \
  --package ./exports/offline-package.json \
  --manifest ./exports/offline-package-manifest.json \
  --audit ./exports/audit-report.json \
  --out ./datasets/makeup-engine/dev-v0 \
  --strict
```

Supported flags:

- `--package`: Studio-exported `OfflineTrainingPackage` JSON.
- `--manifest`: Studio-exported offline package manifest JSON.
- `--audit`: Studio-exported operator audit report JSON.
- `--out`: local output directory.
- `--dry-run`: builds and validates the write plan without writing files.
- `--validate-only`: validates input package, manifest, and audit files only.
- `--pretty`: writes formatted JSON.
- `--strict`: exits non-zero when validation has blocking errors.
- `--help`: prints CLI usage.

The CLI uses only Node built-ins and does not call MediaPipe, OpenAI, a backend,
or a training framework. It consumes only Phase 5D offline package files.

`dry-run` is for operator preview. `validate-only` is for CI or preflight checks
before a dataset directory is created. `strict` should be used before handing the
dataset to a training bridge.
