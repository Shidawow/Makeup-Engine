# Offline Training Package

Phase 5D turns a reviewed segmentation training manifest into a local-first offline training package.

The package is not a trained model and does not write real image files. It is a deterministic contract that future Phase 6A tooling can materialize into files or object-storage records.

## Inputs

- `HumanCorrectionDataset`
- `DatasetReviewQueue`
- `SegmentationTrainingManifest`

Only accepted, training-ready samples already present in the training manifest are included.

## Outputs

The package contains:

- `packageId`
- `schemaVersion`
- `datasetVersion`
- `sourceReviewedDatasetId`
- `sourceTrainingManifestId`
- `entries`
- `imageReferences`
- `maskArtifacts`
- `splitSummary`
- `regionSummary`
- `qualitySummary`
- `validationSummary`
- `auditSummary`

## Difference From Training Manifest

The training manifest says which samples should be consumed by a future training loader.

The offline package adds the training-package layer:

- stable dataset version
- image references
- mask artifact metadata
- package validation result
- operator audit summary
- exportable package and package manifest JSON

## Determinism

All package ids, artifact ids, checksums, and dataset versions are generated from stable hashes. The package builder does not use random values and does not depend on MediaPipe, OpenAI, remote resources, or the filesystem.

## Phase 6A Handoff

Phase 6A can replace placeholder `offline://` references with actual files:

- image copy references
- original mask artifact files
- human edited mask artifact files
- diff heatmap artifact files
- training loader manifest
