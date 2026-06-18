# User App Package Draft Preview Validation

Phase 10E validation checks the User App Package Draft Preview before it can be
handed to a later official user app package draft gate.

Validation is local, deterministic, and administrator-only. It is not production
release approval and it is not formal `UserAppTemplatePackage` readiness.

## Checks

- source contract ready
- title and summary user-facing
- steps user-comprehensible
- region guidance user-safe
- tools checklist ready
- product placeholders safe
- privacy notice present
- no raw image reference
- no personal data
- no medical claims
- no product shade claims
- no automatic publish
- no registry write
- no `UserAppTemplatePackage` mutation
- JSON round-trip safe

## Status

- `draft_preview_validation_ready`: preview may enter a later official draft
  gate.
- `draft_preview_validation_ready_with_warnings`: preview is usable for admin
  inspection but should be revised before 10F.
- `draft_preview_validation_blocked`: preview must not create an app package.

## Non-Goals

Validation does not publish, write a registry, call backend services, call
OpenAI or external APIs, train models, request camera permissions, use AR, or
collect real user data.
