# Production Batch QA / Review Hardening

Phase 6I-1 turns the Phase 6I production queue into a recoverable operator QA workbench.

## Goal

Production Batch QA makes each `TemplateProductionTask` auditable before the project enters template library management. It shows whether a task is blocked, warning-only, ready for review, ready for local publish, or needs operator action.

## What It Adds

- `TemplateProductionQaReport` and per-task `TemplateProductionQaItem`.
- Blocking and warning issue taxonomy.
- Batch QA summary counts.
- Per-task next operator action.
- Reject reason capture.
- Publish confirmation.
- Rebinding recovery after object URL loss.
- Operator handoff export.

## Key Rules

- Missing bound artifact is blocking.
- Blocked source image is blocking.
- `analysis_failed` is blocking.
- Task cannot enter review before analysis is complete.
- Task cannot approve without evidence.
- Rejected task cannot publish.
- Approved task cannot publish until local publish confirmation is recorded.
- Published task must keep the confirmation.
- Local published is not online publication.

## Source Image Boundary

`SourceImagePackage` can feed production QA only through `TemplateAnalysisSeed` and explicit artifact binding. It still cannot become a training dataset directly.

## Next Step

If QA remains stable, proceed to Phase 6J: Template Library Management & Publish Package. If UI smoke finds gaps, use Phase 6I-2 for targeted hardening.
