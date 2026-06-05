# Dataset Manifest And Splits

Phase 5B adds deterministic split assignment and manifest export for reviewed
human correction datasets. This prepares the data for future segmentation
training without introducing a training runtime in the app.

## Split Assignment

Supported splits are:

- `train`
- `validation`
- `test`
- `holdout`
- `unassigned`

The default target ratio is:

- train: 80%
- validation: 10%
- test: 10%

Assignment uses stable hashing rather than randomness. Re-exporting the same
queue with the same sample ids produces the same split decisions.

## Leakage Prevention

`autoAssignDatasetSplits` groups samples by connected image and template ids.
Samples linked through the same `imageId` or `templateId` stay in one split.

`validateSplitLeakage` checks train/test leakage:

- the same image should not appear in both train and test
- the same template should not appear in both train and test unless explicitly
  allowed

This is conservative because makeup templates generated from the same source
image or template can carry correlated mask and semantic evidence.

## Manifest Schema

`DatasetManifest` contains:

- `datasetId`
- `schemaVersion`
- `createdAt`
- `sampleCount`
- `acceptedCount`
- `rejectedCount`
- `splitSummary`
- `regionSummary`
- `imageDeduplicationSummary`
- `templateDeduplicationSummary`
- `qualityDistribution`
- `exportFormat`
- `entries`
- `exportManifest`

Each entry records sample id, image id, template id, region, split, quality
status, quality score, and review reasons.

## Export Formats

Reviewed exports support:

- JSON bundle: reviewed dataset with accepted training-ready samples.
- JSONL: one accepted training-ready sample per line.
- Manifest JSON: queue-level summary for training orchestration.
- Train split JSONL.
- Validation split JSONL.
- Test split JSONL.

JSONL intentionally excludes rejected, pending, second-review, holdout, and
unassigned samples. The manifest remains the audit artifact for the full queue.

## Future Training Usage

A future segmentation training pipeline can consume:

- split-specific JSONL for training examples
- manifest JSON for audit and quality reporting
- replay payloads for human debugging
- reason distributions for data improvement planning

No current Phase 5B code trains a model. The output is a deterministic, reviewed
data asset ready for a later training stage.
