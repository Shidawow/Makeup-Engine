# Template Library Candidate Validation

Phase 10C validation checks whether a candidate package can enter later
candidate library review.

Validation passing means candidate review readiness only. It does not mean
published readiness.

## Checks

- approved human review trace exists
- source draft trace exists
- QA trace exists and is not blocked
- title and summary are ready
- reviewed steps exist
- region guidance exists
- tools checklist exists
- product suggestions are placeholders
- privacy boundary is safe
- no raw image reference exists
- no automatic publishing or formal Template Library write occurs
- no `UserAppTemplatePackage` mutation occurs
- JSON round-trip is stable

## Status

- `candidate_validation_ready`
- `candidate_validation_ready_with_warnings`
- `candidate_validation_blocked`

## Hard Blocks

Raw image references, privacy risk, missing human approval, QA blocked state,
product shade claims, medical claims, unsupported final claims, and user app
package mutation markers block validation.
