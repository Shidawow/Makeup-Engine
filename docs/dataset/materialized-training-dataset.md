# Materialized Training Dataset

Phase 6A-0 turns the Phase 5D `OfflineTrainingPackage` metadata into a local
dataset directory that a future segmentation training bridge can consume.

The package remains local-first:

1. Template Studio exports `offline-package.json`, `offline-package-manifest.json`,
   and `audit-report.json`.
2. The CLI consumes those three files.
3. The CLI writes a deterministic directory with manifest, package, audit,
   checksum, image reference, mask artifact, diff artifact, and split JSONL
   files.

Recommended output structure:

```text
datasets/
  makeup-engine/
    dev-v0/
      manifest.json
      package.json
      audit-report.json
      checksums.json
      images/
      masks/
      diffs/
      splits/
        train.jsonl
        validation.jsonl
        test.jsonl
```

`OfflineTrainingPackage` is the reviewed, training-ready metadata package.
`MaterializedTrainingDataset` is the local file layout produced from it. The
materialized dataset must not read Template Studio React state and must not
bypass review queue, quality gate, or accepted + training-ready filtering.

Phase 6A-0 still writes mask and diff artifacts as JSON metadata, not PNG or
binary masks. Phase 6A can replace the JSON writer with a binary artifact writer
without changing the package boundary.
