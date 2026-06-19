# Controlled UserAppTemplatePackage Registry Writer Draft

Phase 10K adds a local administrator-only controlled registry writer draft for
the `UserAppTemplatePackage` registry write gate output.

This is a dry-run writer plan only. It does not execute a registry write, does
not publish to a user app, does not replace the current User App Shell package,
and does not mark a production package.

## Purpose

The draft converts a Phase 10J registry write gate result into an auditable
write plan, diff preview, existing entry preview, rollback plan, and preserved
trace. It is meant to prepare the next explicit authorization gate without
mutating any registry or app state.

## Required Input

The only ready input is a Phase 10J registry write gate result with status
`registry_write_gate_ready` or `registry_write_gate_ready_with_warnings` and
future writer eligibility.

Blocked gate results may produce a blocked writer draft for UI and tests, but
they cannot become a ready dry-run plan.

## Draft Output

- package id and package version candidates
- proposed registry entry preview
- existing registry entry preview
- dry-run write plan
- diff preview
- rollback plan
- QA, human review, candidate, contract, preview, draft, publish gate, registry
  preparation, and registry write gate trace
- warnings and blocked reasons

## Required Boundaries

- `dryRunOnly` must stay true
- actual registry write must remain blocked
- publish must remain blocked
- current User App Shell package replacement must remain blocked
- production package markers must remain blocked
- no raw image reference, object URL, base64 image, local path, or MediaPipe
  runtime asset may enter the writer draft
- no personal, contact, health, sensitive identity, or biometric data may enter
  the writer draft
- no medical, product shade, unsupported final, or AI-confirmed claim may enter
  the writer draft
- JSON round-trip must remain stable

## Status

- `writer_draft_ready`
- `writer_draft_ready_with_warnings`
- `writer_draft_blocked`
- `writer_draft_example_only`

Ready means only that Phase 10L may review an explicit write authorization
gate. Phase 10K still does not write any registry.
