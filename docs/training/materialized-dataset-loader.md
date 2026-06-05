# Materialized Dataset Loader

The materialized dataset loader reads a completed local training package
directory. It uses a file reader adapter so application code does not import
Node `fs`.

Loader responsibilities:

- read `manifest.json`
- read `package.json`
- read `audit-report.json`
- read `checksums.json`
- verify package id and dataset version consistency
- validate checksums for materialized files
- read split JSONL files
- read image reference, mask, and diff artifact JSON files
- return `LoadedTrainingDataset`

The loader filters samples to accepted and training-ready records from split
JSONL. Samples that are not `validationStatus: "ready"` are reported as
validation issues and are not included in training batches.

The loader does not read images pixels, call MediaPipe, call OpenAI, or access
Template Studio state.
