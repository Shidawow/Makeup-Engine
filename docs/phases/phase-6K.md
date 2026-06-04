# Phase 6K - User App Template Consumption Contract

## Goal

Define how a future user-side makeup coaching app may consume Makeup Engine template publish packages.

Phase 6K adds schema, adapter, validation, manifest/export helpers, examples, and Template Studio preview for app-facing template contracts. It does not build the user app.

## Added

- `UserAppTemplatePackage` and `UserAppTemplate` schema
- app-facing makeup step contract
- app-facing region instruction contract
- product and tool suggestion contract
- compatibility target and validation
- `TemplatePublishPackage -> UserAppTemplatePackage` adapter
- deterministic makeup step normalization
- consumption manifest and handoff export
- `UserAppTemplatePreview` inside Template Studio
- example app template package fixture

## Boundaries

- No backend.
- No database.
- No online publication.
- No user-side app implementation.
- No OpenAI API.
- No PyTorch, TensorFlow, ONNX Runtime, WebGPU runtime, AR, or ONNX writer.
- No changes to legacy `src/engine`, `src/runtime`, or `src/intelligence/runtime`.
- No object URLs, local absolute paths, large image bytes, or React state in consumption exports.

## Main Flow

```text
TemplatePublishPackage
-> UserAppTemplatePackage
-> app-facing makeup steps
-> region instructions
-> tool / product suggestions
-> compatibility manifest
-> consumption export
```

## Why Not Build The User App Now

The stable data contract must exist before iOS, Web, or service consumers are built. Phase 6K defines the shape future consumers can rely on without mixing admin production workflows with user app UX.

## Next Recommendation

Proceed to Phase 6L - User App Prototype Contract Consumer.

Use Phase 6K-1 only if app contract compatibility or package validation needs hardening before a prototype consumer.
