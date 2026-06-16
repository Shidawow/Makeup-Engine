# Candidate-to-App Package Validation

Phase 10D validates the candidate-to-app package contract preparation before it
can be handed to a later app package draft preview.

Passing validation means the mapping preview is ready for a later draft step. It
does not mean a formal `UserAppTemplatePackage` exists.

## Checks

- source candidate is ready
- title and summary are mapped
- step sequence is mapped
- region guidance is mapped
- tools checklist is mapped
- product suggestions remain placeholders
- no raw image reference
- no real user personal data
- no automatic publish
- no `UserAppTemplatePackage` mutation
- user app contract boundary remains safe
- QA trace, human review trace, and privacy trace are preserved
- JSON round-trip is stable

## Statuses

- `app_contract_validation_ready`
- `app_contract_validation_ready_with_warnings`
- `app_contract_validation_blocked`

## Blocking Rules

Validation blocks if approved source candidate trace is missing, raw image
references are present, `UserAppTemplatePackage` mutation markers are present,
privacy trace is unsafe, or required mappings are missing.

## Boundary

Validation is local and administrator-only. It does not publish to the user app,
does not generate formal app packages, does not write backend records, does not
call AI APIs, and does not train models.
