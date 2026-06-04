# Module Map

## Mainline Modules

- `src/vision`: local vision analysis, face/cosmetic processing, segmentation, masks, pixel analysis, geometry, quality scoring, and provider boundaries.
- `src/templates`: template schemas, examples, storage, correction datasets, evidence, review queues, materialized dataset writing, checksums, audit reports, and source image package storage.
- `src/template-engine`: template parsing, building, validation, extraction, convergence, inference, classifiers, and production pipeline.
- `src/training`: source image import, artifact codecs, binary readers, materialization, loaders, iterators, trainers, predictors, evaluation, failed-sample quarantine, runtime adapters, and export package writers.
- `src/components/template-studio`: Template Studio operator panels for source images, evidence, corrections, dataset review, training hints, replay, QA, and admin workflows.
- `src/components/demo`: local demo surfaces and inspection flows.
- `scripts`: deterministic local commands for source image import, training preflight, dataset build, training, export, and project status.
- `docs`: human-readable architecture, dataset, training, Template Studio, status, phase, standard, and runbook documentation.
- `tests`: Vitest coverage for schemas, CLIs, storage, UI components, training, export, artifacts, and guardrails.

## Legacy Frozen Areas

- `src/engine`: retained compatibility and older engine orchestration surfaces.
- `src/runtime`: retained runtime compatibility surfaces.
- `src/intelligence/runtime`: retained intelligence runtime compatibility surfaces.

New mainline features should be added to the active modules above, not to the legacy frozen areas.
