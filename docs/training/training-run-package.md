# Training Run Package

The training run package links one dry-run training bridge pass into an auditable
record.

It contains:

- input summary
- trainer config
- runtime execution plan
- quarantine summary
- evaluation report placeholder
- model artifact manifest placeholder
- trace events

The trace documents:

```text
materialized-dataset-loaded
split-jsonl-read
artifact-json-read
batch-iterator-created
runtime-dry-run
model-placeholder-created
```

This package is the predecessor to Phase 6C real baseline training run records.
It preserves the rule that training systems consume only materialized datasets
and training bridge output.
