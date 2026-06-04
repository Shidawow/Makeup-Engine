# Phase 6L-1 - Prototype Consumer QA / Compatibility Hardening

## Goal

Phase 6L-1 hardens the read-only User App Prototype Contract Consumer before any App MVP shell work. The goal is to prove that `UserAppTemplatePackage` consumption remains stable across multi-package, multi-template, empty, warning, blocked, and JSON round-trip scenarios.

This phase still does not build the real user app. It does not add iOS native screens, backend services, databases, online publication, AR, external APIs, model training, PyTorch, TensorFlow, or ONNX Runtime.

## What Changed

- Added multi-template QA fixtures for app contract packages.
- Added an empty-package fixture for prototype blocked-state coverage.
- Hardened selected-template behavior with deterministic fallback diagnostics.
- Added explicit package, template, runtime-reference, and compatibility issue details to the prototype validation panel model.
- Added empty-state diagnostics for:
  - no package
  - package with no templates
  - template with no steps
  - template with no region instructions
  - template with no tools
  - template with no product suggestions
- Added compatibility validation for:
  - missing app templates
  - missing region instructions
  - steps without matching region instructions
  - missing tools and products as warnings
  - unknown compatibility target as blocking
  - object URLs, local absolute paths, image bytes, large inline bytes, and React state as runtime-only blocked references
- Added prototype package JSON round-trip readiness validation.
- Updated `UserAppPrototypeConsumerPanel` to show finer readiness checks, issue detail, empty-state diagnostics, selected-template fallback, and no-package rendering.

## Main Flow

```text
UserAppTemplatePackage
-> Prototype readiness validation
-> Template list
-> Selected template fallback check
-> Template detail
-> Step guidance
-> Region instruction preview
-> Tool / product suggestion preview
-> Runtime reference checks
-> JSON round-trip readiness
```

## Round-Trip Rule

`validatePrototypePackageRoundTrip` serializes a `UserAppTemplatePackage`, parses it back, and re-validates prototype readiness. A package is stable only when the parsed package has the same prototype summary, readiness status, template count, and no runtime-only references.

## Boundaries

- The prototype consumer remains read-only admin validation.
- `UserAppTemplatePackage` remains local/export contract data.
- No durable export can contain object URLs, local absolute paths, large image bytes, or React state.
- `SourceImagePackage` cannot directly become a prototype consumer model.
- The path still requires artifact binding, analysis, evidence, production QA, template review, library entry, publish package, and app contract validation.
- The phase does not modify legacy `src/engine`, `src/runtime`, or `src/intelligence/runtime`.

## Tests

Phase 6L-1 adds or expands coverage for:

- multi-template package loading
- selected-template fallback
- empty package diagnostics
- empty template diagnostics
- invalid step order
- missing region instruction
- missing compatibility target
- runtime-only reference blocking
- prototype package JSON round-trip readiness
- panel SSR/render empty, warning, and blocked states
- Template Studio prototype consumer flow wiring
- documentation and project-state recovery

## UI / Smoke

Component SSR/render smoke covers the prototype consumer panel and Template Studio wiring. Local HTTP smoke was run against the Vite dev server and returned HTTP 200 for the app shell. Browser-click automation was not added in this phase.

## Result

Phase 6L-1 is complete. The prototype consumer is stable enough to start a narrow `Phase 7A - User App MVP Shell`, provided 7A remains shell-only and contract-driven.
