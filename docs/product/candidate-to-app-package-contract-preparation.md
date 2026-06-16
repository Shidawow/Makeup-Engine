# Candidate-to-App Package Contract Preparation

Phase 10D prepares a local contract bridge from a Phase 10C Template Library
Candidate Package to a future app-facing package draft.

This is not formal `UserAppTemplatePackage` generation. It is a mapping preview,
readiness model, and handoff layer only.

## Inputs

- `TemplateLibraryCandidatePackage`
- `TemplateLibraryCandidateValidationResult`
- QA trace
- human review trace
- privacy boundary trace
- reviewed steps
- reviewed region guidance
- reviewed tools and product placeholders

Only `candidate_validation_ready` or `candidate_validation_ready_with_warnings`
can produce a ready contract preparation. A blocked candidate package cannot
produce ready app package preparation.

## Mapped Preview Fields

- title
- summary
- style tags
- difficulty
- estimated time
- suitable scenarios
- tools checklist
- product placeholders
- step sequence
- region guidance
- privacy boundary
- QA trace
- human review trace
- candidate trace

The output is a preview of future app contract fields. It does not write a user
app package registry and does not create an app package export.

## Blocking Rules

Contract preparation is blocked when:

- source candidate validation is blocked
- the candidate package is blocked
- approved human review trace is missing
- privacy trace is missing or unsafe
- raw image references appear
- object URLs, base64, local paths, or MediaPipe runtime asset names appear
- real personal, health, contact, or biometric data appears
- product shade claims, medical claims, or unsupported final claims appear
- `UserAppTemplatePackage` mutation markers appear
- reviewed step sequence or region guidance is missing

## Boundaries

- No production app.
- No backend or database.
- No camera capture or AR.
- No OpenAI or external AI/CV API.
- No training.
- No automatic publish.
- No formal Template Library write.
- No formal `UserAppTemplatePackage` generation.
- No user app package registry mutation.
- No committed `public/mediapipe/**` runtime assets.

## Next Step

Ready contract preparation can feed a future User App Package Draft Preview
phase, currently recommended as Phase 10E.
