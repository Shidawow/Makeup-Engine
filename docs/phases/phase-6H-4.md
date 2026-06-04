# Phase 6H-4

## Phase name

Source Image Artifact Handoff Hardening

## Objective

Let Template Studio consume CLI-imported real-photo source image artifacts only after an operator explicitly binds the corresponding local files, preserving browser security boundaries and training-data guardrails.

## Added files

- `src/templates/schema/source-image-artifact-binding.schema.ts`
- `src/templates/storage/sourceImageArtifactBinding.ts`
- `src/components/template-studio/source-image-artifact-binding-panel/SourceImageArtifactBindingPanel.tsx`
- `src/components/template-studio/source-image-artifact-binding-panel/index.ts`
- `docs/template-studio/source-image-artifact-binding.md`
- `docs/template-studio/browser-artifact-handoff.md`
- `docs/template-studio/source-image-to-vision-analysis.md`
- `tests/source-image-artifact-binding-schema.test.ts`
- `tests/source-image-artifact-binding-storage.test.ts`
- `tests/source-image-artifact-binding-panel.test.tsx`
- `tests/source-image-preview-bound-artifact.test.tsx`
- `tests/source-image-intake-binding-flow.test.tsx`
- `tests/template-analysis-seed-bound-artifact.test.ts`
- `tests/vision-analysis-bound-seed-integration.test.tsx`
- `tests/template-studio-bound-source-image-flow.test.tsx`

## Modified files

- `src/templates/schema/template-analysis-seed.schema.ts`
- `src/templates/schema/index.ts`
- `src/templates/storage/index.ts`
- `src/templates/storage/sourceImagePackageStorage.ts`
- `src/components/template-studio/source-image-preview/SourceImagePreview.tsx`
- `src/components/template-studio/source-image-intake-panel/SourceImageIntakePanel.tsx`
- `src/components/demo/vision-analysis-demo/VisionAnalysisDemo.tsx`
- `src/components/template-studio/TemplateStudio.tsx`
- `docs/runbooks/SOURCE_IMAGE_IMPORT_RUNBOOK.md`
- `docs/status/*`
- `project-state/*`

## Capabilities added

- Explicit source image artifact binding schema.
- Normalized PNG file binding to temporary browser object URLs.
- JSON RGBA parsing and validation boundary.
- raw RGBA summary-only unsupported boundary in Studio.
- Bound artifact metadata on `TemplateAnalysisSeed`.
- Seed readiness upgrade from `blocked_by_missing_artifact` to `ready_for_vision_analysis` when a validated browser-readable artifact exists.
- SourceImagePreview bound artifact priority.
- VisionAnalysisDemo bound seed handoff.

## Validation commands

```bash
npm run typecheck
npm run test
npm run build
```

## Test/build status

Passed final 6H-4 validation in `project-state/test-status.json`: `npm run typecheck`, `npm run test`, `npm run build`, `npm run project:status`, `npm run project:context`, `node scripts/project-status.mjs --json`, and `node scripts/context-pack.mjs --json`.

## CLI status

No new CLI was required in this phase. `scripts/import-source-images.mjs` remains the source image package producer.

## Current limitations

- Browser cannot auto-read package-relative manifest paths.
- Object URLs do not persist after refresh.
- JSON RGBA preview is browser-canvas dependent.
- raw RGBA is summary-only in Studio.
- No backend, database, OpenAI API, new ML runtime, or training shortcut was added.

## Next recommendation

Proceed to Phase 6I: Admin Template Production Batch Workflow.

## Forbidden areas touched: yes/no

No.

## New dependencies: yes/no

No.

## External API usage: yes/no

No.

## Recovery notes

Start with `START_HERE.md`, `docs/status/CURRENT_PROJECT_STATUS.md`, `docs/template-studio/source-image-artifact-binding.md`, and `project-state/project-state.snapshot.json`. The key boundary is that only operator-selected files can become browser-readable resources.
