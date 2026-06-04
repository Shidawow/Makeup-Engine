# Start Here

Makeup Engine is the makeup template production system for a future makeup coaching app. It is not the user-facing app. Its job is to produce templates, evidence, correction records, review state, local template library assets, publish packages, user app consumption contracts, prototype consumer validation, materialized training datasets, lightweight model artifacts, and export packages.

## Current Position

- Project role: makeup template production system plus a local contract-driven user app shell prototype, not a production user app.
- Last completed phase: `Phase 7G`.
- Current completed business phase: `Phase 7G - User App Mobile Interaction QA / App Readiness Gate`.
- Next recommended phase: `Phase 7H - User App Prototype Device/Browser QA Harness`.
- Recent recovery milestones retained in phase docs: `Phase 6K`, `Phase 6L`, `Phase 6L-1`, `Phase 7A`, `Phase 7B`, `Phase 7C`, `Phase 7D`, `Phase 7E`, `Phase 7F`, and `Phase 7G`; the shell entry component is `UserAppShell`.

## Current Core Capability

```text
SourceImagePackage manifest
-> SourceImageEntry
-> operator explicitly binds normalized PNG / json-rgba artifact
-> BrowserArtifactResource
-> TemplateAnalysisSeed ready_for_vision_analysis
-> Vision Analysis
-> Mask Editing
-> Human Correction
-> Template Evidence
-> Template Review
-> Template Library Entry
-> Publish Package
-> UserAppTemplatePackage
-> Prototype Contract Consumer
-> Prototype Consumer QA / Compatibility Hardening
-> User App MVP Shell
-> Step Guidance UX Hardening
-> User Photo Intake Placeholder / Personalization Boundary
-> User App Local Preferences / Onboarding
-> User App Template Discovery / Recommendation Placeholder
-> User App Session Persistence / Local State Hardening
-> User App Mobile QA / App Readiness Gate
-> Consumption Manifest
-> Dataset Review
-> Materialized Training Dataset
```

`SourceImagePackage` can enter Vision Analysis only through explicit operator artifact binding. It still cannot become a training dataset directly, and it still cannot skip review, package validation, app contract validation, or quality gates to become a library entry, publish package, user app contract, or prototype consumer state.

## Must Read First

1. `docs/status/CURRENT_PROJECT_STATUS.md`
2. `docs/status/NEXT_ACTION.md`
3. `docs/prompts/MASTER_CODEX_CONTEXT.md`
4. `docs/app-contract/user-app-prototype-contract-consumer.md`
5. `docs/user-app/user-photo-intake-placeholder.md`
6. `docs/user-app/user-personalization-boundary.md`
7. `docs/user-app/user-photo-privacy-boundary.md`
8. `docs/user-app/user-app-local-onboarding.md`
9. `docs/user-app/user-local-preferences.md`
10. `docs/user-app/preferences-to-guidance-hints.md`
11. `docs/user-app/user-template-discovery.md`
12. `docs/user-app/user-template-recommendation-placeholder.md`
13. `docs/privacy/user-template-recommendation-boundary.md`
14. `docs/user-app/user-app-session-persistence.md`
15. `docs/user-app/user-app-session-recovery.md`
16. `docs/privacy/user-app-session-data-boundary.md`
17. `docs/user-app/user-app-mobile-interaction-qa.md`
18. `docs/user-app/user-app-readiness-gate.md`
19. `docs/user-app/user-app-readiness-checklist.md`
20. `docs/phases/phase-7G.md`
21. `project-state/project-state.snapshot.json`
22. `project-state/provider-handoff.json`
23. `project-state/latest-handoff.json`

## What The System Can Do Now

- Import local admin source images into a `SourceImagePackage`.
- Show ready, blocked, and failed source image entries in Template Studio.
- Bind operator-selected normalized PNG or JSON RGBA artifacts into browser-readable runtime resources.
- Create `TemplateAnalysisSeed` records from ready source image entries.
- Create local `TemplateProductionBatch` and `TemplateProductionTask` queues from source image packages.
- Evaluate batch QA, reject reasons, publish confirmation, and rebinding recovery for production tasks.
- Convert approved local production tasks into `TemplateLibrary` entries.
- Build local `TemplatePublishPackage` exports for downstream template consumption.
- Convert validated `TemplatePublishPackage` entries into `UserAppTemplatePackage` contract JSON.
- Preview app-facing makeup steps, region instructions, difficulty, duration, style tags, tool/product suggestions, compatibility warnings, and local-only disclaimers.
- Load `UserAppTemplatePackage` into a read-only prototype consumer view model with template list, detail, step guidance, region instructions, tools, products, lineage, and contract validation.
- Render a Template Studio prototype consumer panel and an example package smoke preview without building the real user app.
- Validate prototype consumer multi-template, empty, warning, blocked, selected-template fallback, and JSON round-trip readiness states.
- Render a local User App MVP Shell from `UserAppTemplatePackage` with package summary, template list, template detail, step-by-step guidance, region instructions, tools/products, compatibility banner, and local progress.
- Render hardened step guidance with user-friendly instruction summaries, detailed instructions, tool/product checklists, region guidance, common mistakes, correction tips, friendly warnings, blocked reasons, and next actions.
- Render disabled user photo intake and personalization placeholder sections in the local User App Shell without real upload, camera, AR, analysis, backend, database, or training behavior.
- Validate that photo placeholders do not contain object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo bytes, face embeddings, biometric identifiers, training input markers, or persistent photo references.
- Show local-only personalization hints without mutating `UserAppTemplatePackage`, exporting user profile data, or creating training data.
- Render optional local onboarding and non-sensitive local preferences in the User App Shell.
- Map local preferences into display-only guidance hints for pacing, verbosity, tools, style, comfort level, and time constraints without mutating `UserAppTemplatePackage`.
- Validate preference objects against object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo bytes, face embeddings, biometric identifiers, sensitive fields, and training input markers.
- Discover and sort templates locally by difficulty, duration, style tags, occasions, tools, step count, warning/blocked status, and compatibility target.
- Create rule-based recommendation placeholders from `UserAppTemplatePackage` and non-sensitive local preferences with user-friendly reasons.
- Exclude blocked templates from recommendations while showing blocked reasons in the discovery UI.
- Save, load, clear, sanitize, and recover local User App Shell session state for selected template, active step, local progress ids, onboarding summary, non-sensitive preferences, discovery filters, sort mode, and last visited section.
- Validate session payloads against object URLs, local absolute paths, base64 images, image/photo bytes, biometrics, sensitive profile fields, React state, recommendation user records, and training markers.
- Generate local app readiness reports for template package, step guidance, onboarding, preferences, discovery, local session, privacy, mobile interaction, empty state, and blocked state.
- Generate deterministic mobile QA reports for narrow viewport layout, touch targets, navigation, guidance usability, empty states, blocked states, local session controls, privacy copy, and raw JSON hiding.
- Render `App 就绪度`, `移动端 QA`, and `交互检查` in the local User App MVP Shell.
- Export user app consumption manifests and handoff summaries without object URLs, local absolute paths, large image bytes, or React state.
- Export/import production batch, library, and package JSON handoff summaries without storing object URLs, large image bytes, or local absolute paths.
- Continue from Vision Analysis into mask editing, evidence capture, dataset review, and training-bound materialization.

## What The System Must Not Do

- `SourceImagePackage` cannot directly become a training dataset.
- `SourceImagePackage` cannot directly become a `TemplateLibraryEntry`, `TemplatePublishPackage`, `UserAppTemplatePackage`, or prototype consumer model.
- UI state cannot directly train a model.
- Unreviewed correction data cannot enter training-ready materialization.
- The correction queue, review queue, production QA, app contract validation, and quality gate cannot be bypassed.
- Browser UI cannot auto-read CLI package-relative artifact paths.
- Browser UI cannot store large image bytes or local absolute paths as persistent state.
- Browser object URLs cannot be treated as long-term artifacts.
- Local `published` is a production workflow state, not backend publication.
- Template Library `local_published` is also local-only and not online publication.
- `UserAppTemplatePackage` is a consumption contract, not a user app implementation or online release.
- The prototype consumer is read-only validation, not a formal user app.
- The Phase 7A User App MVP Shell is a local contract-driven prototype, not a production app, backend release, iOS native implementation, camera, or AR experience.
- The Phase 7B step guidance hardening is UX polish over the local shell, not a production app, backend release, iOS native implementation, camera, or AR experience.
- The Phase 7C photo intake and personalization work is placeholder/boundary only; it does not collect, upload, analyze, store, or train on user photos.
- The Phase 7D onboarding and preference work is local-only and non-sensitive; it is not account onboarding, backend sync, cloud sync, database persistence, analytics, production profile storage, or training input.
- Local preferences cannot modify `UserAppTemplatePackage`, enter training datasets, or write user preference records into `project-state`.
- The Phase 7E recommendation placeholder is local-only, rule-based, deterministic, and explainable; it is not real AI recommendation, backend personalization, analytics, ads, ecommerce, or training.
- Recommendation results cannot modify `UserAppTemplatePackage`, create user profiles, enter training datasets, call external APIs, or write real user records into `project-state`.
- The Phase 7F session persistence layer is local-only and is not an account system, backend session service, cloud sync, database, analytics, or production app storage.
- User App session state cannot store user photos, image bytes, base64 images, object URLs, local absolute paths, biometrics, sensitive profile fields, React state, recommendation result records, or training input.
- The Phase 7G readiness gate is local product/QA gating only; it is not production release approval, native iOS QA, backend readiness, camera readiness, AR readiness, training readiness, or a substitute for future real browser/device smoke tests.
- Readiness and mobile QA reports cannot mutate `UserAppTemplatePackage`, persist real user records, or store photos, object URLs, local paths, base64 images, biometrics, sensitive profile data, React state, recommendation records, or training input.
- User photos, photo bytes, object URLs, local paths, face embeddings, biometric identifiers, and personalization profile data must not enter durable export, training, or project-state.
- User app consumption exports and prototype consumer handoff must not contain object URLs, local absolute paths, large image bytes, or React state.
- The legacy `src/engine`, `src/runtime`, and `src/intelligence/runtime` areas must not be expanded for new mainline work.

## Validation Commands

Run these whenever you restore or update project state:

```bash
npm run typecheck
npm run test
npm run build
npm run project:status
npm run project:context
node scripts/project-status.mjs --json
node scripts/context-pack.mjs --json
```

## Source Of Truth

Project state comes from repository documents and `project-state/*.json`, not from chat memory.

Root `AGENTS.md` is the concise agent entry point. Project skills are indexed in `project-state/skills.json`; external skill candidates and approvals are indexed in `project-state/external-skills-registry.json`.

## Provider Switching

Before every provider switch, update `project-state/latest-handoff.json` and `project-state/provider-handoff.json`. After the switch, reread the master context and rerun `npm run project:context`.

## Forbidden Legacy Areas

- Do not route new mainline work through `src/engine`.
- Do not route new mainline work through `src/runtime`.
- Do not route new mainline work through `src/intelligence/runtime`.
