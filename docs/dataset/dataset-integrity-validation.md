# Dataset Integrity Validation

Materialized dataset validation checks the local package before it is handed to
Phase 6A training bridge code.

Validation covers:

- required files exist: `manifest.json`, `package.json`, `audit-report.json`,
  `checksums.json`, image references, mask artifacts, diff artifacts, and split
  JSONL files;
- checksums match the stable checksum manifest;
- split files are present for `train`, `validation`, and `test`;
- split JSONL records come from reviewed training package entries;
- each entry links to image, original mask, edited mask, and diff artifacts;
- manifest paths do not leak absolute local paths;
- region and split coverage warnings are surfaced before training.

`checksums.json` uses deterministic stable JSON and FNV-1a checksums. It is a
reproducibility guard, not a cryptographic security boundary.

Current artifact files are JSON metadata. Future Phase 6A code can add real PNG
or binary mask materialization while keeping the same validation concepts:
reference, checksum, split membership, and leakage prevention.
