# Current Project Status

## Current Phase

Phase 7G: User App Mobile Interaction QA / App Readiness Gate is complete.

Last completed business phase: Phase 7G.

Next recommended phase: Phase 7H, User App Prototype Device/Browser QA Harness.

Phase 7H should add browser/device-like QA coverage around the local MVP shell without adding production app scope, backend sync, cloud sync, database storage, analytics, real photo capture, AR, training, online publication, or unapproved runtime dependencies.

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
- Show hardened step guidance with user-friendly summaries, detailed instructions, region guidance, tool/product checklists, common mistakes, correction tips, warning messages, blocked reasons, and next actions.
- Render Phase 7C photo intake placeholder, personalization placeholder, and privacy notice sections without real photo capture, upload, preview, camera permission, backend storage, AR, or analysis.
- Validate photo placeholder boundaries against object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo bytes, face embeddings, biometric identifiers, training input markers, and persistent photo references.
- Keep guidance usable without a user photo.
- Create local-only personalization display hints without mutating templates, exporting user profile data, or creating training data.
- Render optional local onboarding for skill level, guidance style, available time, available tools, preferred styles, and privacy reminder.
- Store local-only non-sensitive preferences in shell state for display hints only.
- Map preferences to guidance hints for pacing, verbosity, tool availability, style, comfort level, and time constraints without mutating `UserAppTemplatePackage`.
- Validate preferences against object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo bytes, face embeddings, biometric identifiers, sensitive fields, and training input markers.
- Discover templates locally with deterministic filters for difficulty, duration, style tags, occasions, tools, step count, warning/blocked status, and compatibility target.
- Rank templates with a rule-based recommendation placeholder using only `UserAppTemplatePackage` and non-sensitive local preferences.
- Show user-friendly recommendation reasons without exposing internal score details.
- Keep blocked templates out of recommendations while showing blocked reasons in discovery UI.
- Store and recover local-only User App Shell session state for selected template, active step, current template progress ids, onboarding summary, non-sensitive preferences, discovery filters, sort mode, and last visited section.
- Sanitize and validate local session payloads before storage, rejecting object URLs, local absolute paths, base64 images, image/photo bytes, biometrics, sensitive profile fields, React state, recommendation result records, and training input markers.
- Show local session controls and recovery notices in the User App Shell without adding accounts, backend sync, cloud sync, database storage, analytics, or production app behavior.
- Generate deterministic User App readiness reports across template package, step guidance, onboarding, preferences, discovery, local session, privacy, mobile interaction, empty state, and blocked state.
- Generate deterministic mobile interaction QA reports for narrow viewports, touch targets, navigation, guidance usability, empty states, blocked states, session controls, privacy copy, and default raw JSON hiding.
- Render `App 就绪度`, `移动端 QA`, and `交互检查` entries in the local User App MVP Shell without creating a production app, backend, camera flow, AR flow, training flow, or external API call.
- Export operator/Codex handoff summaries without storing object URLs, large image bytes, local absolute paths, React state, user photo bytes, or sensitive profile data.

## What The System Cannot Do

- It cannot act as the production end-user makeup coaching app.
- It cannot collect, upload, analyze, store, preview, or train on real user photos.
- It cannot request camera permissions or call browser camera APIs.
- It cannot create face embeddings, biometric identifiers, or user photo training inputs.
- It cannot persist user photo state, user photo references, or sensitive user profile data in durable exports or project-state.
- It cannot treat local onboarding as an account system.
- It cannot sync preferences to a backend or cloud service.
- It cannot write user preference records into `project-state`.
- It cannot let preferences modify `UserAppTemplatePackage` or enter training datasets.
- It cannot treat Phase 7E discovery as real AI recommendation, backend personalization, analytics, advertising, ecommerce, or user profiling.
- It cannot call recommendation APIs, OpenAI APIs, or external AI/CV APIs for template ranking.
- It cannot write recommendation results as real user records into `project-state`, training datasets, durable exports, or model artifacts.
- It cannot treat Phase 7F local session persistence as an account system, backend session service, cloud sync, database, analytics, or production app storage.
- It cannot persist user photos, image bytes, base64 image data, object URLs, local paths, biometrics, sensitive profile fields, React state, recommendation result records, or training input in User App session storage.
- It cannot write real user session records into `project-state`.
- It cannot treat Phase 7G readiness as production release approval, native iOS QA, backend readiness, app store readiness, camera readiness, AR readiness, or training readiness.
- It cannot use the Phase 7G mobile QA checklist as a substitute for future browser/device smoke tests.
- It cannot train directly from a source image package.
- It cannot convert `SourceImagePackage` directly into a `TemplateLibraryEntry`, `TemplatePublishPackage`, `UserAppTemplatePackage`, prototype consumer model, User App Shell state, or user photo intake state.
- It cannot publish to a backend, online template library, or app store.
- It cannot treat `UserAppTemplatePackage` as a real user app or online release.
- It cannot treat the prototype consumer or Phase 7A/7B/7C shell as a production app.
- It cannot treat Template Library `local_published` as online publication.
- It cannot decode JPEG pixels.
- It cannot let browser UI auto-read arbitrary CLI package paths.
- It cannot persist object URLs, local absolute paths, large image bytes, base64 image data, or React state in durable exports.
- It does not yet include a trained deep segmentation model or real ONNX writer.

## Core Module Status

- `src/vision`: active mainline module for local vision analysis, segmentation boundaries, image quality, geometry, and pixel analysis.
- `src/templates`: active mainline module for schemas, storage, review, corrections, evidence, dataset materialization, source image artifact binding, production batch storage/export, template library storage, publish package export, user app consumption manifest export, and examples.
- `src/template-engine`: active mainline module for production queues, state machine, QA rules, library conversion, lifecycle, versioning, app contract adapters, and prototype consumer view models.
- `src/template-engine/app-contract`: active app contract module for publish-package adapter, makeup step normalization, compatibility validation, and prototype consumer view models.
- `src/user-app`: active 7A/7B/7C/7D/7E/7F/7G module for local user app shell view models, navigation, progress, guidance UX, friendly messages, state, photo intake placeholder, personalization placeholder, local onboarding, local preferences, guidance hints, discovery, recommendation placeholders, local session persistence/recovery, privacy boundary validation, mobile QA, and app readiness gating.
- `src/components/user-app`: active local shell UI for package summary, template list/detail, hardened step guide, regions, tools/products, compatibility, progress, photo intake placeholder, personalization placeholder, local onboarding, local preferences, discovery/recommendation UI, session controls, recovery notice, app readiness, mobile QA, interaction checklist, and privacy notice.
- `src/components/template-studio`: active operator UI surface for Template Studio and local user app shell preview.
- `src/training`: active mainline module for source image import, artifact handling, preflight, loaders, training, evaluation, and export.
- `scripts`: active deterministic CLI surface.
- `docs`: active project recovery, architecture, runbook, workflow, and handoff surface.
- `src/engine`, `src/runtime`, `src/intelligence/runtime`: legacy or frozen compatibility areas.

## Recent Validation

Phase 7G validation must include:

```bash
npm run typecheck
npm run test
npm run build
npm run project:status
npm run project:context
node scripts/project-status.mjs --json
node scripts/context-pack.mjs --json
```

The latest completed full validation is recorded in `project-state/test-status.json`.

## Next Phase Recommendation

Proceed to Phase 7H: User App Prototype Device/Browser QA Harness.

Use Phase 7G-1 only if readiness gate copy, mobile interaction checklist, or shell tab density needs hardening before browser/device QA work.
