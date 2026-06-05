# Operator Audit Report

The operator audit report summarizes a generated offline training package for PMs, dataset owners, and training pipeline operators.

It is intentionally concise. It does not include raw sample JSON, full masks, or long evidence payloads.

## Contents

The report contains:

- package source
- correction count
- correction region distribution
- accepted / rejected / second-review counts
- reviewer distribution
- rejected reason summary
- training readiness
- validation warnings
- next-step recommendations

## Generation

The report is generated from:

- `HumanCorrectionDataset`
- `DatasetReviewQueue`
- `SegmentationTrainingManifest`
- `OfflinePackageValidationResult`

The output is deterministic and exportable through:

```text
exportOperatorAuditReportJson
```

## Intended Use

Use the report to answer operational questions:

- How many corrections went into this package?
- Which regions are underrepresented?
- Did reviewers reject any samples?
- Is the package ready for training preparation?
- What should the operator fix before Phase 6A?

## Current Limits

The report uses local review queue metadata only. It does not read a backend audit log and does not include user identity beyond the local reviewer metadata already stored in the queue.
