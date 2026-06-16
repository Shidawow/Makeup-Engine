# Candidate-to-App Package Handoff

Phase 10D handoff summarizes whether a candidate-to-app contract preparation can
move into a later User App Package Draft Preview phase.

The handoff is local, reviewable, and preview-only.

## Next Actions

- `ready_for_user_app_package_draft`
- `request_candidate_copy_polish`
- `request_step_revision`
- `request_region_guidance_revision`
- `request_privacy_review`
- `keep_as_template_library_candidate_only`
- `blocked_do_not_prepare_app_package`

## Decisions

- `handoff_to_user_app_package_draft_preview`
- `revise_contract_preparation`
- `block_app_package_preparation`
- `retain_template_library_candidate_only`

## What It Preserves

- source candidate package id
- preparation id
- title mapping preview
- step mapping preview
- region guidance preview
- validation status
- next action
- no-publish boundary
- no formal `UserAppTemplatePackage` generation boundary

## Boundary

The handoff does not generate `UserAppTemplatePackage`, does not publish to the
user app, does not write a package registry, does not call a backend, and does
not train models. It is intended only as input for a later reviewed draft phase.
