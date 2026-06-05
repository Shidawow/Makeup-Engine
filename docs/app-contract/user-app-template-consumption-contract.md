# User App Template Consumption Contract

Phase 6K defines the stable contract that a future user-side makeup coaching app may read from a local `TemplatePublishPackage`.

This is not a user app implementation. Makeup Engine remains the local template production system. The user app is a future consumer that can read exported contract JSON.

## Contract Shape

`UserAppTemplatePackage` is produced from a validated `TemplatePublishPackage`.

It contains:

- package id, version, compatibility target, validation, summary, and local-only disclaimer
- app-facing `UserAppTemplate` records
- ordered makeup steps suitable for user guidance
- region instructions
- required tools and product suggestions
- safety notes
- display hints
- evidence references and lineage back to the source publish package and library entry

## Boundaries

- `TemplatePublishPackage` is consumption input, not online publication.
- `UserAppTemplatePackage` is local/export contract data, not a backend upload.
- The contract cannot contain object URLs, local absolute paths, large image bytes, or React state.
- `SourceImagePackage` cannot directly become a user app template. It must pass through artifact binding, analysis, production QA, template review, library entry, and publish package.

## Compatibility Targets

- `ios-app-v0`
- `web-app-v0`
- `backend-template-service-v0`
- `unknown`

`unknown` is allowed for recovery and diagnostics, but validators report it as a compatibility issue.

