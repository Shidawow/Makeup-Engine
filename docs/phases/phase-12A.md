# Phase 12A - Photo-to-Template Draft Reality Check

## Status

Completed.

## Goal

Phase 12A audits the real boundary of the current photo-to-template draft
chain. It separates real photo/FaceMesh/region QA signals from rule-derived
candidate fields, demo fixture copy, placeholders, human-required fields, and
unsupported automatic extraction areas.

## Completed Work

- Added `PhotoToTemplateRealityCheckReport` for field-level source evidence.
- Added `PhotoToTemplateRealityValidationResult` to block overclaims.
- Added `PhotoToTemplateRealityHandoff` for Phase 12B handoff.
- Added a Template Workbench operator panel for the field source matrix.
- Added tests for source classification, validation blockers, handoff, UI
  boundaries, docs, and project-state recovery.
- Documented the photo-to-template field source matrix and current limitations.

## Reality Conclusion

The system can support semi-automatic template draft generation with human
review. It cannot claim fully automatic high-quality makeup extraction from
arbitrary photos.

## Boundaries Preserved

- Registry chain remains paused after Phase 10U.
- Phase 10V is not resumed.
- No registry write, registry mutation, publish action, production writer, or
  User App Shell package replacement occurs.
- No backend, database, account, payment, camera, AR, OpenAI/external AI API,
  training, real photo upload, or real user data storage is added.
- `public/mediapipe/**` runtime assets remain ignored and are not committed.

## Next Recommended Phase

Phase 12B - Makeup Semantic Extraction Baseline.
