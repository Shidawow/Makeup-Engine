# Phase 6H-3 Plan

## Phase name

Template Studio Source Image Intake & Analysis Seed Workbench.

## Objective

Create a Template Studio workbench for source image intake and TemplateAnalysisSeed inspection or creation without weakening dataset and training boundaries.

## Added files

- Planned; none in DOC-0.

## Modified files

- Planned; none in DOC-0.

## Capabilities added

- Planned operator workflow for source image package inspection.
- Planned TemplateAnalysisSeed workbench.
- Planned handoff from ready source image entries to local vision analysis.

## Validation commands

```bash
npm run typecheck
npm run test
npm run build
```

## Test/build status

Not started.

## CLI status

No CLI changes planned unless the workbench needs a deterministic inspection command.

## Current limitations

- Must not train directly from source images.
- Must not turn browser UI state into training input.
- Must preserve review queue and quality gate boundaries.

## Next recommendation

Start only after DOC-0 passes recovery, status, CLI, test, typecheck, and build validation.

## Forbidden areas touched: yes/no

No in this plan.

## New dependencies: yes/no

No in this plan.

## External API usage: yes/no

No in this plan.

## Recovery notes

Begin by reading `START_HERE.md`, `docs/status/NEXT_ACTION.md`, and `project-state/latest-handoff.json`.
