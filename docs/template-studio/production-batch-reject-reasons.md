# Production Batch Reject Reasons

Reject reason capture is mandatory in Phase 6I-1.

## Behavior

- Reject must use a fixed `TemplateProductionReviewReason`.
- Optional note is allowed.
- Rejected task records `rejectReason`, `rejectNote`, `rejectedAt`, and optional `rejectedBy`.
- Rejected task cannot publish.
- Reject reason enters batch export and operator handoff.

## Taxonomy

- `artifact_missing`
- `artifact_binding_mismatch`
- `source_image_blocked`
- `analysis_not_run`
- `analysis_failed`
- `mask_review_missing`
- `human_correction_missing`
- `evidence_missing`
- `low_confidence`
- `semantic_uncertain`
- `operator_rejected_quality`
- `duplicate_template`
- `wrong_makeup_region`
- `bad_source_image`
- `publish_without_approval_blocked`
- `accepted_minor_issue`

## UI

Template Studio shows a reject reason select, optional note input, and disables reject until a reason is selected.
