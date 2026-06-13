# Master Codex Context

This is the recovery entry for any Codex, GPT, PackyAPI, CLI, or provider switch session working on Makeup Engine. Repository state is the source of truth. Chat memory is not.

Codex and compatible agents should also read root `AGENTS.md` as the short repository-level entry point. `AGENTS.md` summarizes source-of-truth files, compact handoff defaults, validation commands, frozen legacy directories, durable export boundaries, and external skill rules.

## Project Position

Makeup Engine is a local makeup template production system for a future makeup coaching app. It is not the user-facing app, not a chat product, not an AR app, and not a backend publishing service.

It produces templates, template evidence, correction records, review state, local template library entries, publish packages, user app consumption contracts, materialized training datasets, lightweight model artifacts, and export packages.

## Current Phase

- Current business phase: `Phase 9I completed`
- Last completed phase: `Phase 9I`
- Last completed phase name: `Phase 9I - Anonymous Internal Trial Evidence Review`
- Next recommended phase: `Phase 9J - Anonymous Internal Trial Follow-up Iteration`

Historical recovery marker retained for Phase 9C tests: `Phase 9C completed`.
Historical recovery marker retained for Phase 9E tests: `Phase 9E completed`.
Historical recovery marker retained for Phase 9F tests: `Phase 9F completed`.
Historical recovery marker retained for Phase 9G tests: `Phase 9G completed`.
Historical recovery marker retained for Phase 9H tests: `Phase 9H completed`.
Historical recovery milestone retained for older phase tests: `Phase 8A completed` / `Phase 8A - Product Route Decision / App MVP Planning`.
Historical recovery milestone retained for Phase 8B tests: `Phase 8B completed` / `Phase 8B - PWA / Mobile Web MVP Polish`.
Historical recovery milestone retained for Phase 8C tests: `Phase 8C completed` / `Phase 8C - User App MVP Trial Pack`.
Historical recovery milestone retained for Phase 8D tests: `Phase 8D completed` / `Phase 8D - Template Content QA for Real User Trial`.
Historical recovery milestone retained for Phase 8E tests: `Phase 8E completed` / `Phase 8E - MVP Release Readiness Gate`.
Historical recovery milestone retained for Phase 9B tests: `Phase 9B completed` / `Phase 9B - Internal Trial Result Review Framework`.

## Current Main Data Flow

```text
Real Photo
-> SourceImagePackage
-> SourceImageManifest
-> SourceImageEntry
-> SourceImageArtifactBinding
-> BrowserArtifactResource
-> TemplateAnalysisSeed
-> TemplateProductionBatch / TemplateProductionTask
-> Production QA Report
-> Vision Analysis
-> Editable Masks
-> Human Correction
-> Template Evidence
-> Template Review
-> Template Library Entry
-> Template Publish Package
-> UserAppTemplatePackage
-> User App Prototype Contract Consumer
-> User App MVP Shell
-> Step Guidance UX Hardening
-> User Photo Intake Placeholder / Personalization Boundary
-> User App Local Preferences / Onboarding
-> User App Template Discovery / Recommendation Placeholder
-> User App Session Persistence / Local State Hardening
-> User App Mobile QA / App Readiness Gate
-> Browser / Mobile QA Harness
-> Product Route Decision / App MVP Plan
-> PWA / Mobile Web MVP Polish
-> User App MVP Trial Pack
-> Template Content QA for Real User Trial
-> MVP Release Readiness Gate
-> Internal Trial Operations Pack
-> Internal Trial Result Review Framework
-> Internal Trial Iteration Plan
-> Internal Trial Learning Summary & Product Decision Gate
-> Internal Trial Evidence Pack
-> Internal Trial Evidence Collection Preparation
-> Anonymous Internal Trial Dry Run Pack
-> Anonymous Internal Trial Launch Pack
-> Anonymous Internal Trial Evidence Review
-> Phase 8 Roadmap / V1 Non-Goals
-> User App Consumption Manifest
-> Dataset Review
-> Materialized Training Dataset
-> Lightweight Model
-> Export Package
```

Important boundary: `SourceImagePackage` can enter Vision Analysis through operator artifact binding, but it still is not a training dataset and cannot skip mask correction, evidence, review, package validation, or quality gates.

## Current Main Modules

- `src/vision`: local vision analysis, segmentation boundaries, image quality, geometry, and pixel analysis.
- `src/templates`: schemas, storage, review, corrections, evidence, dataset materialization, source image binding, production batch storage/export, template library storage, and publish package export.
- `src/template-engine/production`: production queue, state machine, QA rules, rebinding recovery, analysis handoff, review lifecycle, smoke checklist.
- `src/template-engine/library`: production task to library entry conversion, template versioning, and local library lifecycle.
- `src/template-engine/app-contract`: publish package to user app contract adapter, makeup step normalization, compatibility validation, and prototype consumer view models.
- `src/user-app`: local User App MVP Shell view models, navigation, progress, guidance UX, friendly messages, state, photo intake placeholder, personalization placeholder, local onboarding, local preferences, guidance hints, discovery, recommendation placeholders, local session persistence/recovery, privacy boundary utilities, mobile QA, app readiness gating, browser/mobile QA reports, trial operations, trial result review, issue taxonomy, decision framework, iteration backlog, priority framework, iteration plan, learning decision gate, evidence pack models, evidence collection preparation models, anonymous dry run models, anonymous launch models, and anonymous evidence review models.
- `src/components/user-app`: local shell UI for package summary, template list/detail, hardened step guidance, region instructions, tools/products, compatibility, progress, disabled photo intake placeholder, personalization placeholder, local onboarding, local preferences, discovery/recommendation UI, session controls, recovery notices, app readiness, mobile QA, interaction checklist, privacy notice, and administrator trial readiness/operations/review panels.
- `src/training`: source image import, artifact handling, deterministic training/evaluation/export utilities.
- `src/components/template-studio`: operator UI for source image intake, artifact binding, production QA, library management, package preview, app contract preview, prototype consumer preview, mask editing, evidence, review, and dataset panels.
- `src/components/demo`: Vision Analysis demo surfaces and seed handoff.
- `scripts`: deterministic CLI surfaces.
- `docs`, `project-state`, `tests`: recovery, architecture, validation, provider handoff, and regression coverage.

## Legacy Frozen Modules

These areas are retained for compatibility and historical runtime work, but they are frozen and must not expand into new mainline ownership:

- `src/engine`
- `src/runtime`
- `src/intelligence/runtime`

## What Can Be Done Now

- Import local admin photos into `SourceImagePackage`.
- Bind explicit normalized PNG or JSON RGBA artifacts in Template Studio.
- Create browser-readable `BrowserArtifactResource` values from operator-selected files.
- Create ready `TemplateAnalysisSeed` records and hand them to Vision Analysis.
- Create and recover local `TemplateProductionBatch` and `TemplateProductionTask` queues.
- Convert approved or local published production tasks into local `TemplateLibraryEntry` records.
- Build local `TemplatePublishPackage` exports for downstream consumption.
- Convert validated `TemplatePublishPackage` records into `UserAppTemplatePackage` consumption contracts.
- Preview app-facing makeup steps, region instructions, duration, difficulty, style tags, tool/product suggestions, compatibility warnings, and local-only disclaimers.
- Load `UserAppTemplatePackage` into a read-only prototype consumer with template list, detail, step guidance, region instructions, tool/product summary, lineage, and validation panel.
- Render an example package smoke preview in Template Studio without building the real user app.
- Validate prototype consumer multi-template, empty, warning, blocked, selected-template fallback, and JSON round-trip readiness states.
- Render a local User App MVP Shell from `UserAppTemplatePackage`.
- Show user-facing template list, template detail, step-by-step guidance, region instructions, tools/products, compatibility, duration, difficulty, tags, and local progress.
- Show hardened step guidance with progress labels, user-friendly summaries, detailed instructions, region guidance, tool/product checklists, common mistakes, correction tips, friendly warnings, blocked reasons, and next actions.
- Show disabled future user photo intake, non-sensitive personalization placeholders, and privacy notices while keeping guidance usable without user photos.
- Validate that photo placeholder data contains no object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo bytes, face embeddings, biometric identifiers, training input markers, or persistent photo references.
- Render optional local onboarding and non-sensitive local preferences in the User App Shell.
- Map local preferences into display-only guidance hints without mutating `UserAppTemplatePackage`, writing templates, creating training input, or writing user records into project-state.
- Validate preference data against object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo bytes, face embeddings, biometric identifiers, sensitive fields, and training input markers.
- Discover templates locally with deterministic filters and sort modes over `UserAppTemplatePackage`.
- Rank templates with a local-only, rule-based recommendation placeholder using non-sensitive local preferences.
- Show user-friendly recommendation reasons, visible warnings, and blocked-template explanations without exposing internal score details.
- Save, load, clear, sanitize, and recover local-only User App Shell session snapshots for selected template, active step, progress ids, onboarding summary, non-sensitive preferences, discovery filters, sort mode, and last visited section.
- Reject unsafe session payloads containing object URLs, local paths, base64 images, image/photo bytes, biometrics, sensitive profile fields, React state, recommendation result records, or training input markers.
- Generate deterministic User App readiness reports across template package, step guidance, onboarding, preferences, discovery, local session, privacy, mobile interaction, empty state, and blocked state.
- Generate deterministic mobile interaction QA reports for narrow viewport layout, touch targets, navigation, guidance usability, empty states, blocked states, session controls, privacy copy, and raw JSON default hiding.
- Render App readiness, mobile QA, and interaction checklist panels in the local User App MVP Shell.
- Run deterministic browser/mobile QA for local HTTP smoke, critical shell copy, privacy copy, Chinese copy, forbidden-token checks, and mobile viewport readiness.
- Use the Phase 8A route decision to plan a future React Web / PWA user app MVP in a separate app surface or repository while keeping Makeup Engine as the template production system.
- Render Phase 8B PWA/mobile shell polish with lightweight manifest metadata, mobile home, PWA readiness, MVP polish readiness, and separated administrator QA surfaces.
- Render Phase 8C MVP trial pack, feedback form preview, mock/example feedback summary, and trial readiness administrator panels for internal / small-scope trial planning.
- Render Phase 8D template content QA, trial template selection, and trial content readiness administrator panels for real user trial preparation.
- Render Phase 8E MVP release readiness and trial go/no-go administrator panels for internal trial preparation decisions.
- Render Phase 9A internal trial operations, observation template, and outcome review administrator panels for internal small-scope trial preparation.
- Render Phase 9B internal trial result review, issue taxonomy, and decision framework administrator panels for anonymous/mock local trial result review.
- Render Phase 9C internal trial iteration plan; Phase 9D internal trial learning decision gate, backlog, and priority administrator panels for anonymous/mock local next-iteration planning.
- Export user app consumption manifest and handoff JSON.
- Evaluate batch QA issues, task readiness diagnostics, reject reasons, publish confirmation, rebinding recovery, library lifecycle, and operator handoff reports.
- Continue into mask editing, template evidence capture, dataset review, and training dataset materialization.
- Recover across providers using `project-state` and documentation files.

## What Cannot Be Done

- `SourceImagePackage` cannot directly become a training dataset.
- `SourceImagePackage` cannot directly become a `TemplateLibraryEntry`.
- UI state cannot directly train a model.
- Unreviewed correction data cannot enter training-ready materialization.
- Correction queue, template review, dataset review, accepted/training-ready filtering, package validation, and quality gate cannot be bypassed.
- Browser UI cannot auto-read CLI package-relative artifact paths.
- Local absolute paths, object URLs, large image bytes, and React state must not be persisted as durable production artifacts.
- Local `published` is not backend or online publication.
- Template Library `local_published` is local-only and not online publication.
- `UserAppTemplatePackage` is a local/export consumption contract, not the user app and not online publication.
- The prototype consumer is read-only admin validation, not the user app and not online publication.
- Phase 7A User App MVP Shell is local contract-driven prototype behavior, not a production app, backend publication, AR, camera, training, or native iOS scope.
- Phase 7B step guidance hardening is local UX polish only, not production app behavior, backend publication, AR, camera, training, native iOS scope, or unapproved runtime dependencies.
- Phase 7C user photo intake and personalization are placeholder/boundary only; they do not collect, upload, analyze, preview, store, export, or train on real user photos.
- Phase 7C must not add real camera capture, file input upload, AR, backend storage, database storage, training, native iOS scope, or unapproved runtime dependencies.
- Phase 7D onboarding and preferences are local-only and non-sensitive; they are not account onboarding, backend sync, cloud sync, database persistence, analytics, production profile storage, or training input.
- Phase 7D preferences can affect guidance hints only and cannot mutate `UserAppTemplatePackage`, write templates, enter training datasets, write user preference records into `project-state`, or infer sensitive attributes.
- Phase 7E discovery and recommendations are local-only placeholders; they are not real AI recommendation, backend personalization, analytics, advertising, ecommerce, or user profiling.
- Phase 7E recommendations can use only `UserAppTemplatePackage` metadata and non-sensitive local preferences; they cannot mutate templates, call external APIs, write training input, sync to backend/cloud, or write real user records into `project-state`.
- Phase 7F local session persistence is local-only shell behavior; it is not account storage, login, backend sync, cloud sync, database persistence, analytics, production app storage, or cross-device sync.
- Phase 7F session payloads cannot store photos, object URLs, local paths, image bytes, base64 images, biometrics, sensitive profile fields, React state, recommendation result records, or training input, and recovery cannot mutate `UserAppTemplatePackage`.
- Phase 7G readiness gate is local product/QA gating only; it is not production release approval, native iOS QA, backend readiness, app store readiness, camera readiness, AR readiness, training readiness, or a substitute for future real browser/device QA.
- Phase 7G readiness and mobile QA reports cannot mutate `UserAppTemplatePackage`, write real user records into `project-state`, store photos, object URLs, local paths, base64 images, biometrics, sensitive profile data, React state, recommendation records, or training input.
- Phase 7H browser/mobile QA is local deterministic prototype QA only; it is not production release approval, real device lab QA, Playwright pointer/canvas/screenshot QA, native iOS QA, backend readiness, camera readiness, AR readiness, training readiness, or app store readiness.
- Phase 7H browser/mobile QA reports cannot mutate `UserAppTemplatePackage`, write real user records into `project-state`, store photos, temporary image URLs, local paths, encoded image data, biometrics, sensitive profile data, React state, recommendation records, readiness records, browser QA records, or training input.
- Phase 8A product route planning selected a React Web / PWA MVP first route only; it is not production app implementation, repository bootstrap, backend, database, accounts, analytics, camera, AR, native iOS, React Native, Flutter, ecommerce, community, paid features, cross-platform implementation, OpenAI/external API work, training, online publication, app store release work, or a new dependency phase.
- Phase 8B PWA/mobile polish added only local shell UI polish, lightweight manifest metadata, PWA readiness, and MVP polish readiness; it is not production PWA release approval and does not add service worker, offline cache, push notification, background sync, install tracking, analytics, backend, camera, AR, native app, external API, training, or online publication scope.
- Phase 8C trial pack adds only local internal / small-scope trial planning structures; it is not production release, App Store/TestFlight, backend form, analytics, real user record collection, camera, AR, training, or online publication scope.
- Phase 8D template content QA adds only local content QA and trial content readiness structures; it is not production release, App Store/TestFlight, backend, analytics, AI generation, OpenAI/external API usage, real user record collection, camera, AR, training, or online publication scope.
- Phase 8E MVP release readiness and trial go/no-go add only local gate decisions for internal trial preparation; they are not production release, App Store/TestFlight, backend readiness, analytics readiness, camera readiness, AR readiness, AI generation approval, OpenAI/external API approval, training readiness, online publication, or real user data collection approval.
- Phase 9A internal trial operations add only local participant type planning, session flow, anonymous observation templates, and outcome review; they are not public recruitment, production release, App Store/TestFlight, backend forms, analytics, real user record collection, camera, AR, AI analysis, OpenAI/external API usage, training, or online publication scope.
- Phase 9B internal trial result review adds only local anonymous/mock result review, issue taxonomy, and decision framework; it is not production analytics, public recruitment, backend record collection, AI analysis, OpenAI/external API usage, training, production release, or real user record collection scope.
- Phase 9C internal trial iteration plan adds only local anonymous/mock iteration planning, backlog, and priority framework; it is not a formal production roadmap, backend issue tracker, production analytics, public recruitment, AI analysis, OpenAI/external API usage, training, production release, or real user record collection scope.
- Phase 9D internal trial learning decision gate adds only local anonymous/mock learning summary, product decision gate, and next phase recommendation structures.
- Phase 9E internal trial evidence pack adds only local anonymous/mock evidence packaging, evidence summary, and sufficiency gate structures; it is not production analytics, backend evidence collection, public recruitment, AI analysis, training, production app approval, or production release approval.
- Phase 9F internal trial evidence collection preparation adds only local anonymous protocol, checklist, participant notice, stop conditions, and quality gate structures; it is not real data collection, backend evidence storage, public recruitment, AI analysis, training, MVP validation approval, production app approval, or production release approval.
- Phase 9G anonymous internal trial dry run adds only local rehearsal pack, checklist, participant notice, stop conditions, and review structures; it is not real trial launch, backend evidence storage, public recruitment, AI analysis, training, MVP validation approval, production app approval, or production release approval.
- Phase 9H completed anonymous internal trial launch pack only, not public recruitment, production launch, backend collection, AI analysis, training, or MVP validation planning.
- Phase 9I anonymous internal trial evidence review adds only local anonymous evidence review, gap review, and decision input structures; it is not production analytics, backend evidence collection, AI analysis, training, public recruitment, MVP validation approval, production app approval, or production release approval.
- Future production user-facing app work should be planned as a separate app surface or repository after an explicit phase gate. Makeup Engine remains the template production system and `UserAppTemplatePackage` remains the handoff contract.
- User photo data, face embeddings, biometric identifiers, sensitive profile data, and user photo references must not enter durable export, training, model artifacts, or project-state.
- User app consumption exports cannot persist object URLs, local absolute paths, large image bytes, or React state.
- JPEG pixel decoding remains unsupported.
- raw RGBA remains summary-only in Studio.
- No OpenAI API, backend, database, PyTorch, TensorFlow, ONNX Runtime, WebGPU runtime, AR, or user-side app behavior is part of this phase.
- Legacy frozen modules must not be expanded for new mainline features.

## Required Validation Commands

Run these on every implementation, recovery, or documentation sync pass:

```bash
npm run typecheck
npm run test
npm run build
npm run project:status
npm run project:context
node scripts/project-status.mjs --json
node scripts/context-pack.mjs --json
```

## Token Budget And Compact Handoff

Default to compact handoff. Repository documents are the stable context; chat should contain only incremental instructions and concise summaries.

- Do not paste full directory trees in normal prompts.
- Never paste `node_modules`, `dist`, `.test-dist`, or `.vite`.
- Use `docs/prompts/COMPACT_CODEX_TASK_TEMPLATE.md` for small fixes, test fixes, documentation sync, project-state maintenance, and provider handoff refreshes.
- Only output a full long prompt when the owner explicitly asks for "完整 prompt" or "full prompt".
- Codex completion reports default to the fixed compact structure: added/modified files, new rules or behavior, tests and validation, current limitations, next recommendation.
- Detailed implementation notes belong in `docs/phases/phase-xxx.md`, not in chat.
- Token optimization compresses repeated background only; it must not reduce task goals, acceptance standards, tests, guardrails, docs/status, docs/phases, or project-state updates.

## Available Project Skills

Project execution skills live in `docs/skills` and are indexed by `project-state/skills.json`. Use the relevant skill before acting:

- `PROJECT_RECOVERY_SKILL.md`: use for new sessions, provider switches, recovery, and source-of-truth checks.
- `PHASE_EXECUTION_SKILL.md`: use for every phase, test repair, documentation sync, and recoverable state update.
- `CONTRACT_SCHEMA_GUARD_SKILL.md`: use for schema, contract, state machine, storage, export, and handoff JSON changes.
- `TEMPLATE_PRODUCTION_QA_SKILL.md`: use for Production Batch, QA, reject reason, publish confirmation, Template Library, Publish Package, and operator handoff work.
- `COMPACT_HANDOFF_SKILL.md`: use for compact prompts, provider switches, PackyAPI handoffs, and completion reports.

Later Codex / PackyAPI / native GPT runs should cite `project-state/skills.json` and the relevant `docs/skills/*.md` instead of repeating full operating rules in chat.

## External Skill Governance

External skills are governed separately from project skills. They are optional review aids, not project authority.

- External skill candidates and approvals live in `project-state/external-skills-registry.json`.
- Review rules live in `docs/skills/EXTERNAL_SKILL_VETTING.md`.
- Registry field definitions live in `docs/skills/EXTERNAL_SKILL_REGISTRY.md`.
- Recommended candidates live in `docs/skills/RECOMMENDED_EXTERNAL_SKILLS.md`.
- Current default: use instruction-only external skills only.
- Candidate external skills are `explicit-only` and cannot be invoked implicitly.
- Approved external skills may be used only within their recorded scope.
- External skill scripts are disabled by default and require manual review.
- External skills must not install production dependencies without explicit approval.
- External skills must not call external APIs unless the current phase explicitly allows that API.
- External skills must not override AGENTS.md, project skills, this master context, or `project-state/guardrails.json`.

Business phases still use `START_HERE.md`, this file, `docs/status/NEXT_ACTION.md`, and `project-state/*.json` as source-of-truth context. External skills can support execution quality, but they cannot change project boundaries.

## Required Documentation Updates Each Round

- `START_HERE.md`
- `docs/status/CURRENT_PROJECT_STATUS.md`
- `docs/status/CURRENT_PHASE.md`
- `docs/status/NEXT_ACTION.md`
- `docs/status/KNOWN_LIMITATIONS.md`
- `docs/prompts/MASTER_CODEX_CONTEXT.md`
- `docs/prompts/PROVIDER_SWITCH_PROMPT.md`
- `docs/phases/PHASE_HISTORY.md`
- `docs/app-roadmap/app-technology-route-decision.md`
- `docs/app-roadmap/user-app-mvp-plan.md`
- `docs/app-roadmap/makeup-engine-vs-user-app-boundary.md`
- `docs/app-roadmap/phase-8-roadmap.md`
- `docs/product/user-app-v1-non-goals.md`
- `docs/user-app/pwa-mobile-web-mvp-polish.md`
- `docs/user-app/pwa-install-readiness.md`
- `docs/user-app/mvp-release-readiness-gate.md`
- `docs/user-app/trial-go-no-go-decision.md`
- `docs/product/internal-trial-launch-checklist.md`
- `docs/architecture/CURRENT_ARCHITECTURE.md`
- `docs/architecture/DATA_FLOW.md`
- `docs/architecture/BOUNDARIES_AND_GUARDRAILS.md`
- `project-state/project-state.snapshot.json`
- `project-state/latest-handoff.json`
- `project-state/provider-handoff.json`
- `project-state/active-task.json`
- `project-state/test-status.json`
- `project-state/command-log.json`
- `project-state/artifact-index.json`
- `project-state/guardrails.json`

## Completion Report Format

When finishing a round, report in this order:

1. Completed work
2. Added files
3. Modified files
4. Validation commands and results
5. Test results
6. UI / smoke status
7. Current limitations
8. Next recommendation
9. Whether docs were updated
10. Whether project-state was updated
11. Whether any forbidden directories were touched
12. Whether any external APIs were called
13. Next provider recommendation
14. Handoff for the next provider

## Provider Handoff Rules

- Repository documents are the source of truth.
- Before switching providers, update `project-state/latest-handoff.json` and `project-state/provider-handoff.json`.
- After switching providers, reread this file and run `npm run project:context`.
- `PackyAPI + CLI` may be used for heavy local work, but it must keep the same guardrails.
- `ChatGPT` should receive a concise, machine-checked handoff summary.
- `SourceImagePackage` can move into Vision Analysis only through explicit binding; it still cannot become a training dataset directly, and it still cannot directly become a template library entry.
- Never expand `src/engine`, `src/runtime`, or `src/intelligence/runtime` for new mainline features.


- Phase 9D completed internal trial learning summary, product decision gate, next phase recommendation, fixtures, and administrator decision panels.
- Phase 9D is not production analytics, production app approval, backend collection, AI analysis, training, public recruitment, or production release approval.
- Phase 9E should create an internal trial evidence pack using privacy-safe anonymous/mock/example summaries only.
- Phase 9F completed privacy-safe internal trial evidence collection preparation only, not real data collection.
- Phase 9G completed anonymous internal trial dry run pack only, not real trial launch or MVP validation planning.
- Phase 9H completed anonymous internal trial launch pack only, not public recruitment, production launch, backend collection, AI analysis, training, or MVP validation planning.
