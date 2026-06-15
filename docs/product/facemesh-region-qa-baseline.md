# FaceMesh Region QA Baseline

Phase 10A adds a local FaceMesh-driven region QA baseline for Makeup Engine.

## Purpose

The baseline checks whether real FaceMesh output is usable before any makeup
intelligence draft is generated. It is a production-tooling aid for template
operators, not a user-facing app feature.

## Inputs

- Local MediaPipe FaceMesh landmarks from the Template Studio vision pipeline.
- FaceMesh confidence and normalized face bounding box.
- Existing local segmentation, pixel, and semantic outputs when available.

## Checks

- Landmark count is sufficient for FaceMesh-style analysis.
- Landmark coordinates are normalized image coordinates.
- Key makeup regions have coverage: lips, eyes, brows, cheeks, nose, chin,
  forehead, and face outline.
- Face bounding box is not cropped at the image edge.
- Confidence is high enough for candidate generation.

## Outputs

- `FaceMeshRegionQaReport`
- Region coverage by canonical landmark groups.
- Warning or blocking issues.
- Recommendations for human template review.

## Boundaries

- No camera API.
- No photo upload.
- No backend.
- No external AI or OpenAI API.
- No AR.
- No training.
- No automatic template publishing.
