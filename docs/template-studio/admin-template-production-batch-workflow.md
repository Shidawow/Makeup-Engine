# Admin Template Production Batch Workflow

Phase 6I adds the local administrator workbench for producing makeup templates in batches.

## Goal

The workflow upgrades the single-image path into a queue:

```text
SourceImagePackage
-> ready source images
-> batch TemplateAnalysisSeed creation
-> artifact binding status
-> TemplateProductionBatch / TemplateProductionTask
-> Vision Analysis
-> Mask Editing
-> Template Evidence
-> Template Review
-> approved / rejected / published local lifecycle
```

## What Production Batch Means

A `TemplateProductionBatch` is a local admin session for a source image package. It stores task status, seed metadata, artifact binding status, review state, and handoff summaries. It does not store large image bytes, local absolute paths, or long-lived object URLs.

A `TemplateProductionTask` tracks one source image through production. The task can be blocked by source image quality, blocked by missing artifact binding, ready for analysis, analyzed, ready for mask review, evidence ready, approved, rejected, or locally published.

## Binding And Readiness

- Ready source images can create seeds.
- A seed becomes `ready_for_vision_analysis` only when a browser-readable manifest artifact or validated operator artifact binding exists.
- Missing artifact binding keeps the production task in `needs_artifact_binding`.
- Blocked or failed source image entries become blocked tasks and cannot enter `ready_for_analysis`.

## Review And Dataset Boundary

The production batch is not a training phase. `SourceImagePackage` cannot directly become a training dataset. Mask editing, human correction, evidence, template review, dataset review, and quality gates are still required before `MaterializedTrainingDataset`.

## Storage And Export

The batch storage is local-only. Batch export and handoff JSON include task status, lineage, seed references, artifact binding summaries, analysis status, evidence status, and next actions. They exclude big image bytes, object URLs as long-term references, local absolute paths, and React state.

## Current UI

`TemplateProductionBatchPanel` is mounted in Template Studio after source image intake. It can create batch tasks, refresh artifact binding state, filter tasks, select a task, send a ready seed to Vision Analysis, mark analysis/mask/evidence milestones, approve/reject/publish local task state, and import/export batch JSON.
