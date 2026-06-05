# Template Analysis Seed

`TemplateAnalysisSeed` is the handoff contract between a SourceImagePackage entry and the existing local Vision Analysis flow.

It is defined in `src/templates/schema/template-analysis-seed.schema.ts`.

## Required Data

A seed contains:

- `seedId`
- `sourceImageId`
- `sourceImagePackageId`
- source manifest reference
- original file name
- selected artifact preference
- normalized PNG reference
- raw RGBA reference
- JSON RGBA reference
- image width and height
- color space
- source image quality report
- codec report
- source image lineage
- readiness
- issues
- creation time

## Readiness

Supported readiness states:

- `ready_for_vision_analysis`
- `blocked_by_source_image_quality`
- `blocked_by_codec`
- `blocked_by_missing_artifact`
- `failed`

Only `ready_for_vision_analysis` can be sent into the analysis action. Blocked seeds may be displayed for audit, but they do not run analysis.

## Determinism

`seedId` is stable for the same package id, source image id, selected artifact preference, and source checksum. The seed does not use random ids.

## Non-Training Boundary

A seed has no split assignment, no review decision, and no training-ready flag. It is upstream of all correction and dataset systems.
