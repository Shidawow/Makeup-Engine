# Segmentation Training Bridge

Phase 6A defines the bridge from a materialized dataset to future segmentation
training code. It does not train a model.

Allowed input:

```text
datasets/makeup-engine/{datasetVersion}/
  manifest.json
  package.json
  audit-report.json
  checksums.json
  images/*.json
  masks/*.json
  diffs/*.json
  splits/train.jsonl
  splits/validation.jsonl
  splits/test.jsonl
```

Forbidden inputs:

- Template Studio React state
- unsaved or unreviewed correction state
- rejected or excluded samples
- direct MediaPipe runtime output
- OpenAI output as a mask or pixel source

The bridge flow is:

```text
MaterializedTrainingDataset
-> materialized dataset loader
-> mask / diff artifact reader
-> split JSONL reader
-> region target loader
-> training sample normalizer
-> deterministic batch iterator
-> preflight validation
-> baseline trainer adapter dry-run
```

This keeps the future Phase 6B training runtime isolated from UI internals and
ensures training data always passes through review queue, quality gate, and
materialization first.
