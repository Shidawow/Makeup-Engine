# Dataset Review Queue

Phase 5B turns exported human correction samples into reviewable training assets.
The queue is local-only and deterministic: it does not require a database, backend,
LLM, agent runtime, or real MediaPipe runtime.

## Lifecycle

1. Template Studio builds a `HumanCorrectionDataset` from mask corrections.
2. `createDatasetReviewQueue` creates one `DatasetReviewItem` per sample.
3. Each item starts as `pending_review` and stores the deterministic quality gate
   suggestion in `evidenceSummary`.
4. A reviewer can accept, reject, mark for second review, exclude, or assign a
   train/validation/test/holdout split.
5. Accepted and training-ready samples can be exported as reviewed JSON or JSONL.
6. A manifest can be exported with quality, split, region, and deduplication
   summaries for future training pipelines.

## Decisions

Review decisions use `DatasetQualityStatus`:

- `pending_review`: created but not reviewed.
- `accepted`: reviewer accepted the sample.
- `rejected`: reviewer rejected the sample.
- `needs_second_review`: reviewer wants another human pass.
- `ready_for_training`: explicitly promoted as training-ready.
- `excluded`: removed from training exports without deleting the item.

Each decision stores reviewer metadata, reasons, notes, and `decidedAt`.
`reviewHistory` preserves every decision so the queue remains auditable.

## Reason Taxonomy

The queue uses a fixed reason taxonomy:

- `mask_boundary_error`
- `wrong_region`
- `low_confidence`
- `semantic_drift`
- `bad_source_image`
- `duplicate_sample`
- `insufficient_makeup_signal`
- `editor_uncertain`
- `accepted_clean`
- `accepted_minor_issue`

These reasons are intentionally stable strings. They can be counted in manifests
and used later by training scripts or data quality dashboards.

## Template Studio Usage

The Dataset Review Panel shows the local queue with filters for pending,
accepted, rejected, and second-review items. For each item it shows:

- region and sample id
- current decision
- quality score
- suggested quality gate decision
- review reasons
- training-ready and second-review indicators
- split selector

The panel supports accept, reject, second-review, batch accept, batch reject,
reviewed JSON export, reviewed JSONL export, and manifest export.

## Replay

Each queue item can open the Dataset Replay Viewer. Replay uses stored sample
artifacts only:

- AI original mask
- human edited mask
- diff heatmap
- before/after pixel analysis
- before/after semantics
- before/after template summary
- evidence summary

This makes the review loop repeatable without rerunning FaceMesh or segmentation.
