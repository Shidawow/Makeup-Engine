# Phase 10D - Candidate-to-App Package Contract Preparation

## Status

Completed.

## Goal

Phase 10D prepares a safe local contract bridge from Phase 10C Template Library
Candidate Packages to a future app-facing package draft preview.

This phase is not formal `UserAppTemplatePackage` generation. It creates only
contract preparation, validation, mapping preview, blocked reasons, and handoff.

## Added

- `CandidateToAppPackageContractPreparation`
- `CandidateToAppPackageValidationResult`
- `CandidateToAppPackageHandoff`
- Candidate-to-App Contract Preparation panel in Template Workbench
- contract, validation, and handoff fixtures
- scoped regression tests

## Rules

- Only `candidate_validation_ready` or
  `candidate_validation_ready_with_warnings` can create ready preparation.
- Blocked candidate packages cannot create ready preparation.
- Approved human review trace is required.
- QA trace, human review trace, privacy trace, and candidate lineage must be
  preserved.
- Raw image references, local paths, object URLs, base64, MediaPipe runtime
  asset names, personal data, medical claims, product shade claims, final
  claims, and `UserAppTemplatePackage` mutation markers block preparation.
- JSON round-trip must remain stable.

## Template Studio Placement

Vision Analysis Tab remains responsible for image understanding, FaceMesh,
overlay/mask, region QA, image quality, MediaPipe recovery hints, mock fallback,
and readiness summary.

Template Workbench remains responsible for candidates, step drafts, template
drafts, draft QA, human review, candidate package, candidate validation,
candidate handoff, candidate-to-app contract preparation, app contract
validation, and app package handoff.

Candidate-to-app contract preparation must not appear in the Vision Analysis Tab
or ordinary user path.

## Boundaries

- No production app.
- No backend or database.
- No camera capture or AR.
- No OpenAI or external AI/CV API.
- No training.
- No automatic publishing.
- No automatic formal Template Library write.
- No automatic formal `UserAppTemplatePackage` generation.
- No user app package registry write.
- No committed `public/mediapipe/**` runtime assets.

## Next Recommended Phase

Phase 10E - User App Package Draft Preview.
