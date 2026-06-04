# Phase 6L - User App Prototype Contract Consumer

## Goal

Build a read-only prototype consumer that proves a future user-side makeup coaching app can consume `UserAppTemplatePackage` records.

Phase 6L does not build the real user app. It adds contract-driven view models, Template Studio preview UI, tests, documentation, and recoverable state updates.

## Added

- `userAppPrototypeConsumer` app-contract utility.
- Prototype package summary view model.
- Prototype app-facing template list view model.
- Prototype template detail view model.
- Step-by-step makeup guidance view model.
- Region instruction view model.
- Tool and product suggestion view model.
- Prototype contract validation panel data.
- `UserAppPrototypeConsumerPanel` in Template Studio.
- Example package smoke preview when no active `UserAppTemplatePackage` exists.

## Main Flow

```text
UserAppTemplatePackage
-> Prototype template list
-> Template detail
-> Step-by-step makeup guidance preview
-> Region instruction preview
-> Tool / product suggestion preview
-> Contract compatibility check
```

## Boundaries

- No real user app implementation.
- No iOS native app.
- No backend.
- No database.
- No online publication.
- No OpenAI API.
- No AR.
- No model training.
- No PyTorch, TensorFlow, ONNX Runtime, WebGPU runtime, or ONNX writer.
- No changes to legacy `src/engine`, `src/runtime`, or `src/intelligence/runtime`.
- No durable object URLs, local absolute paths, large image bytes, or React state.

## Implementation Notes

`src/template-engine/app-contract/userAppPrototypeConsumer.ts` is pure TypeScript and deterministic. It derives read-only view models from `UserAppTemplatePackage` and reuses Phase 6K compatibility validation. It also reports prototype readiness as `ready`, `warning`, or `blocked`.

`src/components/template-studio/user-app-prototype-consumer-panel/UserAppPrototypeConsumerPanel.tsx` renders the prototype consumer in the admin workbench. It shows package summary, contract validation, template list, selected template detail, ordered steps, region instructions, tools/products, and lineage.

The panel uses `userAppTemplatePackageExample` as a smoke preview only when no active app package exists. This does not persist state, upload data, or create a real app.

## Tests

Phase 6L adds tests for:

- prototype consumer view model loading
- deterministic template detail, steps, regions, tools, products, and lineage
- runtime-only reference blocking
- panel SSR/render coverage
- Template Studio wiring
- documentation and project-state recovery

## Current Limitations

- The prototype consumer is read-only.
- Browser-click automation was not added; coverage is local HTTP smoke, SSR/render, and pure logic tests.
- The prototype does not implement real app navigation, user accounts, persistence, backend sync, camera capture, AR, or online publication.
- It does not change package export semantics from Phase 6K.

## Next Recommendation

Proceed to Phase 6L-1 - Prototype Consumer QA / Compatibility Hardening if operator smoke or compatibility review finds gaps.

Proceed to a later Phase 6M only after the prototype consumer is stable enough to design interaction-level user app behavior.
