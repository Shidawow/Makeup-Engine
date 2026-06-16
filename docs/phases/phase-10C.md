# Phase 10C - Template Library Candidate Packaging

## Status

Completed.

## Goal

Phase 10C converts a Phase 10B approved template draft into a structured local
Template Library Candidate Package.

This phase is a packaging and validation layer only. It is not production
publication, not a formal Template Library write, and not automatic
`UserAppTemplatePackage` generation.

## Added

- `TemplateLibraryCandidatePackage`
- `TemplateLibraryCandidateValidationResult`
- `TemplateLibraryCandidateHandoff`
- Template Studio candidate packaging panel
- candidate package, validation, and handoff fixtures
- scoped regression tests

## Rules

- Only `approve_for_template_library_candidate` plus
  `approved_as_library_candidate` can produce a ready package.
- QA blocked state blocks packaging.
- Privacy or scope risk blocks packaging.
- Raw image references, object URLs, base64, local paths, and MediaPipe runtime
  assets block packaging.
- Real personal, health, contact, and biometric data block packaging.
- Product shade claims, medical claims, and unsupported final claims block
  packaging.
- `UserAppTemplatePackage` mutation markers block packaging.
- JSON round-trip must remain stable.

## Template Studio Placement

Vision Analysis Tab remains responsible for image understanding, FaceMesh,
overlay/mask, region QA, image quality, MediaPipe recovery hints, mock fallback,
and readiness summary.

Template Workbench remains responsible for candidates, step drafts, template
drafts, draft QA, human review, review workflow, candidate package, candidate
validation, and candidate handoff.

Candidate packaging must not appear in the Vision Analysis Tab or ordinary user
path.

## Boundaries

- No production app.
- No backend or database.
- No camera capture or AR.
- No OpenAI or external AI/CV API.
- No training.
- No automatic publishing.
- No automatic formal Template Library write.
- No automatic `UserAppTemplatePackage` generation.
- No committed `public/mediapipe/**` runtime assets.

## Next Recommended Phase

Phase 10D - Candidate-to-App Package Contract Preparation.
