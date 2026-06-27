# Vision Readiness Score

Phase 11B-Fix corrects a misleading label in the Vision Analysis readiness UI.

## What Changed

The UI no longer displays `Confidence` or `置信度` for FaceMesh readiness.
It displays `Readiness Score（检测可用性评分）`.

## What The Score Means

`readinessScore` is a rule-based usability score based on:

- FaceMesh landmark count
- normalized coordinate validity
- average makeup-region landmark coverage
- face crop margin
- blocking and warning issue count

It helps decide whether the local image analysis is usable for region QA,
candidate attributes, and draft template work.

## What The Score Is Not

It is not MediaPipe model raw confidence.

In the current browser FaceLandmarker integration, the project does not receive
a reliable single per-image face confidence. The runtime `confidence` value is
legacy/internal compatibility metadata and must not be shown as model certainty.

## Boundaries

This fix does not change landmark detection, region coverage calculation,
template drafting, User App MVP behavior, registry state, publication, backend
scope, camera/AR scope, OpenAI/external API scope, or training behavior.
