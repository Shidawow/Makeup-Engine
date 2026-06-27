# Phase 12B - Makeup Semantic Extraction Baseline

## Status

Completed.

## Summary

Phase 12B adds a local Makeup Semantic Extraction Baseline on top of the existing FaceMesh region QA and pixel-analysis pipeline. It creates inspectable semantic candidates for lip, blush, eye, brow, highlight, contour, and overall style fields.

All outputs are candidate-only. All outputs require human review. The phase does not claim final recognition, does not create product shade claims, does not diagnose skin or medical conditions, and does not support fully automatic high-quality makeup extraction.

## Added Capabilities

- `src/vision/makeupSemanticExtraction.ts`
- `MakeupSemanticExtractionReport`
- `MakeupSemanticCandidate`
- semantic source labels for region pixel, FaceMesh region, color, brightness, saturation, semantic rules, insufficient evidence, and human review.
- Template Workbench `MakeupSemanticExtractionPanel`
- example fixtures for ready, insufficient, and blocked semantic extraction states.
- tests for lip, blush, eye, panel wiring, candidate-only boundaries, and documentation recovery.

## Boundary

Phase 12B keeps the registry chain paused after Phase 10U. Phase 10V is intentionally not the active next phase.

Phase 12B does not:

- write or mutate registry state
- publish templates
- create a production writer
- replace the current User App Shell package
- generate final `UserAppTemplatePackage`
- add backend, database, account, payment, camera, AR, OpenAI API, external AI/CV API, or training scope
- upload, store, or train on real user photos
- commit local MediaPipe `.task` or `.wasm` assets

## Next Recommended Phase

Phase 12C - Photo-to-Template Draft Integration & Human Review Editing.
