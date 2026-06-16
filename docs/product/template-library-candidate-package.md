# Template Library Candidate Package

Phase 10C packages a Phase 10B human-approved draft into a local Template
Library Candidate Package.

This is not a published template, not a formal Template Library write, and not
automatic `UserAppTemplatePackage` generation.

## Inputs

- `MakeupTemplateDraftReport`
- `TemplateDraftQaResult`
- `TemplateDraftHumanReview`
- `TemplateDraftReviewWorkflow`
- reviewed attribute candidates
- reviewed rule-based draft steps

Only `approved_as_library_candidate` / `approve_for_template_library_candidate`
can produce a ready candidate package.

## Package Contents

- candidate id
- source draft id
- source review workflow id
- approved human review decision
- title and summary
- style tags
- difficulty and estimated time
- suitable scenarios
- region guidance
- reviewed attribute candidates
- reviewed draft steps
- tools checklist
- product suggestion placeholders
- QA trace
- human review trace
- privacy boundary trace
- warnings and blocked reasons

## Blocking Rules

Candidate packaging is blocked when:

- human review approval is missing
- draft QA is blocked
- privacy or scope risk appears
- raw image references appear
- object URLs, base64, image bytes, local paths, or MediaPipe runtime assets appear
- real personal, health, contact, or biometric data appears
- `UserAppTemplatePackage` mutation markers appear
- final recognition, medical, or product shade claims appear

## Boundaries

- No backend.
- No upload.
- No training.
- No OpenAI or external AI/CV API.
- No camera or AR.
- No automatic publication.
- No automatic `UserAppTemplatePackage` creation.
