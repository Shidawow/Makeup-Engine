# Current Project Status

## Current Phase

Phase 7H: Browser / Mobile E2E Interaction QA is complete.

Last completed business phase: Phase 7H.

Next recommended phase: Phase 8A, Product Route Decision / App MVP Planning.

Phase 8A should decide the future app route and ownership boundary before adding production user-app scope. Makeup Engine remains the makeup template production system and the local User App Shell remains a contract-driven prototype.

## What The System Can Do

- Import local admin source images into a `SourceImagePackage`.
- Bind operator-selected normalized PNG or JSON RGBA artifacts to manifest references.
- Create browser-readable `BrowserArtifactResource` values from explicit file selections.
- Create `TemplateAnalysisSeed` records that distinguish browser-ready artifacts from CLI-only paths.
- Create local `TemplateProductionBatch` queues from source image packages.
- Track production task artifact binding, analysis, mask review, evidence, review, rejection, approval, and local publish state.
- Convert approved or local published production tasks into deterministic `TemplateLibraryEntry` records.
- Build local `TemplatePublishPackage` JSON with manifest, compatibility metadata, checksums, evidence summaries, lineage, template steps, and local-only disclaimers.
- Convert validated `TemplatePublishPackage` entries into `UserAppTemplatePackage` contracts.
- Validate app compatibility targets and block object URLs, local absolute paths, large image bytes, base64 image data, and React state in consumption exports.
- Load a `UserAppTemplatePackage` into a read-only prototype consumer view model.
- Render a local User App MVP Shell from `UserAppTemplatePackage`.
- Show package summary, template list, template detail, step-by-step guidance, region instructions, tools/products, safety notes, compatibility warnings, blocked states, and local progress.
- Render disabled user photo intake and personalization placeholder sections without real upload, camera, AR, analysis, backend, database, or training behavior.
- Store and recover local-only User App Shell session state for selected template, active step, progress ids, onboarding summary, non-sensitive preferences, discovery filters, sort mode, and last visited section.
- Generate deterministic User App readiness reports across template package, step guidance, onboarding, preferences, discovery, local session, privacy, mobile interaction, empty state, and blocked state.
- Generate deterministic mobile interaction QA reports for `375`, `390`, `414`, and `768` width viewport profiles.
- Render the local shell with Chinese-facing tab labels for template guidance, discovery, readiness, mobile QA, interaction checklist, local state, preferences, personalization placeholder, and privacy notice.
- Run a local browser/mobile QA harness with `npm run user-app:browser-qa`.
- Verify HTTP smoke, critical copy, privacy copy, Chinese copy, and source-level forbidden-token checks without browser photo capture, backend, AR, training, OpenAI, external APIs, or new runtime dependencies.
- Export operator/Codex handoff summaries without storing object URLs, large image bytes, local absolute paths, React state, user photo bytes, or sensitive profile data.

## What The System Cannot Do

- It cannot act as the production end-user makeup coaching app.
- It cannot collect, upload, analyze, store, preview, or train on real user photos.
- It cannot request camera permissions or call browser camera APIs.
- It cannot create face embeddings, biometric identifiers, or user photo training inputs.
- It cannot persist user photo state, user photo references, or sensitive user profile data in durable exports or project-state.
- It cannot treat local onboarding as an account system.
- It cannot sync preferences, sessions, recommendations, readiness, or QA reports to a backend or cloud service.
- It cannot write real user preference, recommendation, session, readiness, or browser QA records into `project-state`.
- It cannot treat Phase 7H browser/mobile QA as production release approval, native iOS QA, app store readiness, backend readiness, camera readiness, AR readiness, accessibility certification, or real device lab QA.
- It cannot use the Phase 7H harness as a substitute for future Playwright pointer/canvas/screenshot/device testing.
- It cannot train directly from a source image package.
- It cannot convert `SourceImagePackage` directly into a `TemplateLibraryEntry`, `TemplatePublishPackage`, `UserAppTemplatePackage`, prototype consumer model, User App Shell state, user photo intake state, or user app QA state.
- It cannot publish to a backend, online template library, or app store.
- It cannot treat `UserAppTemplatePackage` as a real user app or online release.
- It cannot decode JPEG pixels.
- It cannot let browser UI auto-read arbitrary CLI package paths.
- It cannot persist object URLs, local absolute paths, large image bytes, base64 image data, or React state in durable exports.
- It does not yet include a trained deep segmentation model or real ONNX writer.

## Core Module Status

- `src/vision`: active mainline module for local vision analysis, segmentation boundaries, image quality, geometry, and pixel analysis.
- `src/templates`: active mainline module for schemas, storage, review, corrections, evidence, dataset materialization, source image artifact binding, production batch storage/export, template library storage, publish package export, user app consumption manifest export, and examples.
- `src/template-engine`: active mainline module for production queues, state machine, QA rules, library conversion, lifecycle, versioning, app contract adapters, and prototype consumer view models.
- `src/template-engine/app-contract`: active app contract module for publish-package adapter, makeup step normalization, compatibility validation, and prototype consumer view models.
- `src/user-app`: active module for local user app shell view models, navigation, progress, guidance UX, friendly messages, state, photo placeholders, local onboarding/preferences, discovery/recommendation placeholders, local session persistence/recovery, privacy validation, mobile QA, app readiness, and browser/mobile QA.
- `src/components/user-app`: active local shell UI for package summary, template list/detail, hardened step guide, regions, tools/products, compatibility, progress, photo intake placeholder, personalization placeholder, local onboarding, local preferences, discovery/recommendation UI, session controls, recovery notice, app readiness, mobile QA, interaction checklist, and privacy notice.
- `src/components/template-studio`: active operator UI surface for Template Studio and local user app shell preview.
- `src/training`: active mainline module for source image import, artifact handling, preflight, loaders, training, evaluation, and export.
- `scripts`: active deterministic CLI and QA script surface.
- `docs`: active project recovery, architecture, runbook, workflow, and handoff surface.
- `src/engine`, `src/runtime`, `src/intelligence/runtime`: legacy or frozen compatibility areas.

## Recent Validation

Phase 7H validation must include:

```bash
npm run typecheck
npm run test
npm run build
npm run project:status
npm run project:context
node scripts/project-status.mjs --json
node scripts/context-pack.mjs --json
npm run user-app:browser-qa -- --json
```

The latest completed full validation is recorded in `project-state/test-status.json`.

## Next Phase Recommendation

Proceed to Phase 8A: Product Route Decision / App MVP Planning.

Use Phase 7H-1 only if the owner wants Playwright pointer/canvas/screenshot coverage before route planning.
