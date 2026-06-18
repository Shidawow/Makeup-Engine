# Official User App Package Draft Gate

Phase 10F adds a local administrator-only gate after Phase 10E User App Package
Draft Preview.

This gate decides whether a validated draft preview is eligible for a future
Official UserAppTemplatePackage Draft Builder. It does not generate a formal
`UserAppTemplatePackage`, write a user app package registry, publish to a user
app, create production routing, call backend services, call OpenAI or external
APIs, use camera/AR, train models, or store real user data.

## Purpose

The gate prevents a preview from being mistaken for a formal package. It checks
that the preview is complete, user-facing, privacy-safe, traceable, and
serializable before any later builder can use it.

## Required Inputs

- Phase 10E `UserAppPackageDraftPreview`
- Phase 10E `UserAppPackageDraftPreviewValidationResult`
- QA trace
- human review trace
- candidate package trace
- candidate-to-app contract trace

The source preview validation must be `draft_preview_validation_ready` or
`draft_preview_validation_ready_with_warnings`.

## Gate Checks

- source preview validation ready
- user-facing title and summary ready
- step guidance complete
- region guidance complete
- tools checklist ready
- privacy notice ready
- no raw image references
- no personal data
- no medical claims
- no product shade claims
- no unsupported final claims
- no registry write
- no automatic publish
- no formal `UserAppTemplatePackage` mutation
- user app contract boundary safe
- QA, human review, candidate, and contract trace preserved
- JSON round-trip safe

## Blocking Rules

The gate blocks when source preview validation is missing, step guidance is
missing, region guidance is missing, raw image references appear, personal data
appears, medical/product shade/final claims appear, a registry write appears,
automatic publish appears, formal `UserAppTemplatePackage` mutation appears, or
JSON round-trip is unstable.

## Decisions

- `eligible_for_official_user_app_package_draft_builder`
- `request_user_facing_copy_revision`
- `request_step_guidance_revision`
- `request_region_guidance_revision`
- `request_privacy_review`
- `keep_as_preview_only`
- `blocked_do_not_create_official_package_draft`

## Boundary

Gate ready means only that a later explicit builder phase may use the preview as
input. Gate ready is not production readiness, not publication, not registry
write approval, and not formal `UserAppTemplatePackage` generation.
