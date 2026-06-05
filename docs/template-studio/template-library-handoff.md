# Template Library Handoff

Phase 6J adds handoff exports for Template Library and Publish Package recovery.

## Library Handoff Includes

- library summary
- entry statuses
- package readiness
- quality and evidence summary
- rejected / deprecated reasons
- source production batches
- next actions
- current limitations

## Publish Package Handoff Includes

- package id, name, version
- source library id
- source batch ids
- readiness
- compatibility
- evidence summary
- lineage
- checksums
- local-only disclaimer

## Exclusions

Handoff exports must not contain object URLs, local absolute paths, large image bytes, or React state.

Use these exports when switching between ChatGPT, Codex Desktop, PackyAPI, or CLI workflows.
