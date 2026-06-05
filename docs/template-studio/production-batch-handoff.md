# Production Batch Handoff

Phase 6I-1 operator handoff export is designed for ChatGPT, Codex, PackyAPI, and later template library work.

## Export Includes

- Batch summary.
- QA summary.
- Task statuses.
- Blocking issues.
- Warning issues.
- Next operator actions.
- Reject reasons and notes.
- Publish confirmations.
- Rebinding-needed tasks.
- Source image lineage and seed references.
- Local publish disclaimer.
- Next recommended phase.

## Export Excludes

- Large image bytes.
- `blob:` object URLs as durable references.
- Local absolute paths.
- React state.
- Backend publication state.

## Boundary

The handoff can resume operator work. It cannot create a training dataset, bypass review, or publish online.
