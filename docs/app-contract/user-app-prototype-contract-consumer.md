# User App Prototype Contract Consumer

Phase 6L adds a read-only prototype consumer for `UserAppTemplatePackage`.

The consumer validates that the contract created in Phase 6K can support a future user-side makeup coaching app without building that app now.

## Scope

The prototype consumer reads:

- `UserAppTemplatePackage`
- `UserAppTemplate`
- app-facing makeup steps
- region instructions
- tool suggestions
- product suggestions
- duration and difficulty metadata
- style tags
- source lineage
- compatibility and validation results

It renders those records as local admin preview data in Template Studio.

## Non Goals

- It is not the real user app.
- It is not an iOS native screen.
- It is not a backend or database feature.
- It is not online publication.
- It does not call OpenAI APIs.
- It does not add AR, ONNX, PyTorch, TensorFlow, or ONNX Runtime.
- It does not persist object URLs, local absolute paths, large image bytes, or React state.

## Prototype View Model

`src/template-engine/app-contract/userAppPrototypeConsumer.ts` creates deterministic view models:

- package summary
- template list items
- selected template detail
- step-by-step guidance
- region instruction summaries
- tool and product summaries
- lineage summary
- contract validation panel
- selected-template fallback diagnostics
- empty-state diagnostics
- round-trip readiness reports

The view model is derived from `UserAppTemplatePackage` and does not mutate package data.

## Contract Validation

The prototype consumer reuses app contract validation and adds prototype readiness:

- `ready`: no blocking issues or warnings.
- `warning`: no blocking issues, but warnings exist.
- `blocked`: blocking issues exist.

Blocking issues include runtime-only references such as `blob:` object URLs, local absolute paths, large inline image data, or React state keys.

Phase 6L-1 expands validation so the prototype consumer also surfaces:

- package with no templates
- template with no steps
- template with no region instructions
- step regions without matching region instructions
- invalid step order
- missing compatibility target
- missing tools or product suggestions as warnings
- object URLs, local absolute paths, image bytes, large inline bytes, or React state as blocked runtime-only references

The validation panel now includes issue severity, issue source, next operator action, readiness checks, and empty-state diagnostics.

## Round-Trip Readiness

`validatePrototypePackageRoundTrip` verifies that a `UserAppTemplatePackage` can be serialized to JSON, parsed back, and still produce the same prototype readiness summary. This is a local contract stability check; it is not backend publication and not user app persistence.

## Template Studio Panel

`UserAppPrototypeConsumerPanel` sits after `UserAppTemplatePreview` in Template Studio.

It shows:

- app-facing template list
- selected template detail
- ordered makeup steps
- region instructions
- required tools and product suggestions
- lineage
- validation state
- warning and blocking issue detail
- empty states
- selected-template fallback state
- local-only disclaimer

When no active package exists, it renders the existing example `UserAppTemplatePackage` as a smoke preview. This is only local preview data and does not create a real app.

## Boundary

The chain remains:

```text
TemplatePublishPackage
-> UserAppTemplatePackage
-> Prototype Contract Consumer
```

The forbidden shortcut remains:

```text
SourceImagePackage
-> UserAppTemplatePackage
```

`SourceImagePackage` must still pass through artifact binding, `TemplateAnalysisSeed`, Vision Analysis, mask editing, evidence, production QA, template review, library conversion, publish package validation, and app contract validation before it can be represented in the prototype consumer.

## Next Step

Phase 6L-1 has hardened prototype smoke, compatibility, empty states, warning states, blocked states, and round-trip readiness.

Use Phase 7A for a narrow contract-driven User App MVP Shell. Use a targeted Phase 6L-2 only if new prototype compatibility gaps appear before 7A starts.
