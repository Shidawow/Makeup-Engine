# Template Production Task Status

Phase 6I task statuses are local production workflow states:

- `draft`
- `blocked_by_source_image`
- `needs_artifact_binding`
- `ready_for_analysis`
- `analyzing`
- `analysis_failed`
- `analysis_complete`
- `needs_mask_review`
- `needs_human_correction`
- `correction_complete`
- `evidence_ready`
- `ready_for_template_review`
- `approved`
- `rejected`
- `published`

## State Rules

- Blocked source images cannot enter `ready_for_analysis`.
- Tasks without validated bound artifacts remain `needs_artifact_binding`.
- Only seeds with `ready_for_vision_analysis` can enter `ready_for_analysis`.
- `analysis_complete` must happen before `needs_mask_review`.
- Evidence is required before approval.
- Rejected tasks cannot be published.
- Published tasks cannot return to `draft` in Phase 6I.
- `training-ready` is not a production task status.

## Meaning Of Published

`published` is a local admin lifecycle state. It does not create a backend publication, remote template library record, user app release, or training dataset.
