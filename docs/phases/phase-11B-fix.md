# Phase 11B-Fix - Vision Readiness Confidence Label Correction

Status: completed.

Phase 11B-Fix corrects the Vision Analysis readiness label that previously made
runtime `confidence` look like MediaPipe model certainty.

## What Changed

- Added `readinessScore` to `FaceMeshRegionQaReport`.
- Derived the score from landmark count, region coverage, normalized
  coordinates, face crop margin, and blocking/warning issue counts.
- Changed Vision Analysis UI from `Confidence` to
  `Readiness Score（检测可用性评分）`.
- Changed Template Workbench visual-analysis summary from `置信度` to
  `检测可用性评分`.
- Added UI copy explaining that the score is a rule-based usability score, not
  MediaPipe model raw confidence.

## What Did Not Change

- Landmark count still comes from detected FaceMesh landmarks.
- Bounding box still comes from detected landmarks.
- Region coverage still comes from required landmark index coverage.
- Legacy/internal `confidence` remains available for compatibility, but it is
  not displayed as model certainty.

## Boundaries

This phase does not redo MediaPipe runtime, add models, connect backend,
connect camera/AR, upload images, train models, resume Phase 10V, write
registry state, publish, create a production writer, or replace the current
User App Shell package.
