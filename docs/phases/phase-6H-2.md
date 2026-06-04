# Phase 6H-2

## Phase name

Source Image Import Pipeline and SourceImagePackage Boundary.

## Objective

Import admin-provided source images into a deterministic local source image package before template analysis and before any training dataset can be produced.

## Added files

- `scripts/import-source-images.mjs`
- Source image package schema and storage tests.
- Source image import, quality gate, quarantine, and Studio read-only inspection tests.
- Documentation under `docs/training` and `docs/template-studio`.

## Modified files

- Training dataset CLI boundary checks.
- Source image storage and Studio inspection surfaces.
- Training preflight readiness documentation and tests.

## Capabilities added

- `SourceImagePackage` and `SourceImageManifest` schema.
- Source image import pipeline.
- Source image quality gate.
- Source image quarantine.
- `sourceImagePackageStorage` boundary.
- TemplateAnalysisSeed creation/readiness path from source image storage.
- Guardrail that blocks source image packages from becoming training data directly.

## Validation commands

```bash
npm run typecheck
npm run test
npm run build
```

## Test/build status

Reported passing by current project context.

## CLI status

- `npm run images:import` runs the source image import CLI.
- `npm run build:training-dataset` blocks source image package bypass attempts unless required masks, corrections, review decisions, and training-ready split data exist.

## Current limitations

- Browser UI reads source image package state but does not write CLI packages.
- JPEG pixel decode remains unsupported.
- Full real photo distribution is not covered.

## Next recommendation

Proceed to Phase DOC-0 before business work, then Phase 6H-3.

## Forbidden areas touched: yes/no

No.

## New dependencies: yes/no

No.

## External API usage: yes/no

No.

## Recovery notes

The package is an intake and analysis seed boundary. It cannot bypass correction or review queue before dataset materialization.
