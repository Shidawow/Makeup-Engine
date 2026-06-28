# Master Codex Context

This is the recovery entry for any Codex, GPT, PackyAPI, CLI, or provider switch session working on Makeup Engine. Repository state is the source of truth. Chat memory is not.

Codex and compatible agents should also read root `AGENTS.md` as the short repository-level entry point. `AGENTS.md` summarizes source-of-truth files, compact handoff defaults, validation commands, frozen legacy directories, durable export boundaries, and external skill rules.

## Project Position

Makeup Engine is a local makeup template production system for a future makeup coaching app. It is not the user-facing app, not a chat product, not an AR app, and not a backend publishing service.

It produces templates, template evidence, correction records, review state, local template library entries, publish packages, user app consumption contracts, materialized training datasets, lightweight model artifacts, and export packages.

## Current Phase

- Current business phase: `Phase 12D completed`
- Last completed phase: `Phase 12D`
- Last completed phase name: `Phase 12D - Photo-to-Template Operator Workflow & Draft Preview QA`
- Next recommended phase: `Phase 12E - Photo-to-Template End-to-End Demo Script & Acceptance Trial`
- Strategic focus: registry chain paused after Phase 10U; active work is photo-to-template semantic evidence and human-reviewed draft integration.

Historical recovery marker retained for Phase 10U tests: `Phase 10U completed`.
Historical recovery marker retained for Phase 9C tests: `Phase 9C completed`.
Historical recovery marker retained for Phase 9E tests: `Phase 9E completed`.
Historical recovery marker retained for Phase 9F tests: `Phase 9F completed`.
Historical recovery marker retained for Phase 9G tests: `Phase 9G completed`.
Historical recovery marker retained for Phase 9H tests: `Phase 9H completed`.
Historical recovery marker retained for Phase 9I tests: `Phase 9I completed`.
Historical recovery marker retained for Phase 9J tests: `Phase 9J completed`.
Historical recovery marker retained for Phase 10O tests: `Phase 10O completed`.
Historical recovery marker retained for Phase 10R tests: `Phase 10R completed`.
Historical recovery marker retained for Phase 10P tests: `Phase 10P completed`.
Historical recovery marker retained for Phase 10S tests: `Phase 10S completed`.
Historical recovery milestone retained for older phase tests: `Phase 8A completed` / `Phase 8A - Product Route Decision / App MVP Planning`.
Historical recovery milestone retained for Phase 8B tests: `Phase 8B completed` / `Phase 8B - PWA / Mobile Web MVP Polish`.
Historical recovery milestone retained for Phase 8C tests: `Phase 8C completed` / `Phase 8C - User App MVP Trial Pack`.
Historical recovery milestone retained for Phase 8D tests: `Phase 8D completed` / `Phase 8D - Template Content QA for Real User Trial`.
Historical recovery milestone retained for Phase 8E tests: `Phase 8E completed` / `Phase 8E - MVP Release Readiness Gate`.
Historical recovery milestone retained for Phase 9B tests: `Phase 9B completed` / `Phase 9B - Internal Trial Result Review Framework`.
Historical recovery marker retained for Phase 11D tests: `Phase 11D completed`.

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
-> Anonymous Internal Trial Follow-up Iteration
-> FaceMesh-driven Makeup Intelligence Baseline
-> Template Draft Review Workflow
-> Template Library Candidate Packaging
-> Candidate-to-App Package Contract Preparation
-> User App Package Draft Preview
-> Official User App Package Draft Gate
-> Official UserAppTemplatePackage Draft Builder
-> UserAppTemplatePackage Draft Publish Gate
-> UserAppTemplatePackage Registry Preparation
-> UserAppTemplatePackage Registry Write Gate
-> Controlled UserAppTemplatePackage Registry Writer Draft
-> Explicit Registry Write Authorization Gate
-> Controlled Registry Write Execution Design
-> Real Registry Write Implementation Gate
-> Real Registry Write Implementation Draft
-> Final Real Write Review Gate
-> Real Write Execution Authorization
-> Real Write Execution Plan
-> Guarded Real Write Execution Simulator
-> Guarded Simulator Review Gate
-> Real Write Approval Boundary
-> User App MVP Experience Reset
-> User App Guided Step Experience Polish
-> User App Visual Guidance & Template Content Polish
-> User App Demo Readiness & Operator QA
-> Photo-to-Template Draft Reality Check
-> Makeup Semantic Extraction Baseline
-> Photo-to-Template Draft Integration & Human Review Editing
-> Photo-to-Template Operator Workflow & Draft Preview QA
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
- `src/vision/facemeshRegionQa.ts`: Phase 10A FaceMesh region QA for local
  template-production drafting.
- `src/template-engine/makeupAttributeCandidates.ts`, `src/template-engine/ruleBasedStepGenerator.ts`, and `src/template-engine/templateDraftGenerator.ts`:
  Phase 10A candidate, rule-based step, and draft-only template generation.
- `src/template-engine/photoToTemplateRealityCheck.ts`,
  `src/template-engine/photoToTemplateRealityValidation.ts`, and
  `src/template-engine/photoToTemplateRealityHandoff.ts`: Phase 12A
  operator-only reality audit for photo-to-template draft source labels,
  overclaim blocking, and handoff to Phase 12B semantic extraction baseline.
- `src/vision/makeupSemanticExtraction.ts`: Phase 12B local deterministic
  makeup semantic extraction baseline. It creates candidate-only
  `MakeupSemanticExtractionReport` and `MakeupSemanticCandidate` outputs with
  explicit source labels and human-review-required boundaries.
- `src/template-engine/photoToTemplateDraftIntegration.ts` and
  `src/template-engine/photoToTemplateHumanReviewEditing.ts`: Phase 12C local
  draft integration and human review editing logic. They bind semantic
  candidates to editable draft fields, preserve source type, confidence band,
  evidence, limitations, original candidate value, editable draft value,
  reviewer decision, reviewer note, `humanReviewRequired`, and `notFinal`, and
  keep all accepted values draft-only.
- `src/template-engine/templateLibraryCandidatePackage.ts`,
  `src/template-engine/templateLibraryCandidateValidation.ts`, and
  `src/template-engine/templateLibraryCandidateHandoff.ts`: Phase 10C local
  candidate package, validation, and handoff logic after Phase 10B human
  approval. They do not publish, write the formal Template Library, or generate
  `UserAppTemplatePackage`.
- `src/template-engine/candidateToAppPackageContract.ts`,
  `src/template-engine/candidateToAppPackageValidation.ts`, and
  `src/template-engine/candidateToAppPackageHandoff.ts`: Phase 10D local
  candidate-to-app contract preparation, validation, and handoff logic after
  Phase 10C candidate validation. They create mapping previews only and do not
  generate formal `UserAppTemplatePackage`, publish, write a user app package
  registry, or train models.
- `src/template-engine/userAppPackageDraftPreview.ts`,
  `src/template-engine/userAppPackageDraftPreviewValidation.ts`, and
  `src/template-engine/userAppPackageDraftPreviewHandoff.ts`: Phase 10E local
  user app package draft preview, validation, and handoff logic. They preview
  user-facing fields only and do not generate formal `UserAppTemplatePackage`.
- `src/template-engine/officialUserAppPackageDraftGate.ts` and
  `src/template-engine/officialUserAppPackageDraftGateHandoff.ts`: Phase 10F
  local official draft gate and handoff logic. They decide future builder
  eligibility only and do not write registries, publish, or generate formal app
  packages.
- `src/template-engine/officialUserAppTemplatePackageDraft.ts`,
  `src/template-engine/officialUserAppTemplatePackageDraftBuilder.ts`,
  `src/template-engine/officialUserAppTemplatePackageDraftValidation.ts`, and
  `src/template-engine/officialUserAppTemplatePackageDraftHandoff.ts`: Phase
  10G local official draft builder, validation, and handoff logic. They build
  draft-only objects and do not publish, write registries, replace the current
  User App Shell package, or mark production readiness.
- `src/template-engine/userAppTemplatePackageDraftPublishGate.ts` and
  `src/template-engine/userAppTemplatePackageDraftPublishGateHandoff.ts`: Phase
  10H local draft publish gate and handoff logic. They decide future registry
  preparation eligibility only and do not publish, write registries, replace the
  current User App Shell package, or mark production readiness.
- `src/template-engine/userAppTemplatePackageRegistryPreparation.ts`,
  `src/template-engine/userAppTemplatePackageRegistryPreparationValidation.ts`,
  and `src/template-engine/userAppTemplatePackageRegistryPreparationHandoff.ts`:
  Phase 10I local registry preparation, validation, and handoff logic. They
  prepare registry entry previews only and do not write registries, publish,
  replace the current User App Shell package, or mark production readiness.
- `src/template-engine/userAppTemplatePackageRegistryWriteGate.ts` and
  `src/template-engine/userAppTemplatePackageRegistryWriteGateHandoff.ts`:
  Phase 10J local registry write gate and handoff logic. They check future
  controlled-writer eligibility only and do not write registries, publish,
  replace the current User App Shell package, or mark production readiness.
- `src/template-engine/controlledUserAppTemplatePackageRegistryWriterDraft.ts`,
  `src/template-engine/controlledUserAppTemplatePackageRegistryWriterValidation.ts`,
  and `src/template-engine/controlledUserAppTemplatePackageRegistryWriterHandoff.ts`:
  Phase 10K local dry-run controlled writer draft, validation, and handoff
  logic. They create write plan, diff preview, existing entry preview, and
  rollback plan only; they do not execute registry writes, publish, replace the
  current User App Shell package, or mark production readiness.
- `src/template-engine/explicitRegistryWriteAuthorizationGate.ts`,
  `src/template-engine/explicitRegistryWriteAuthorizationChecklist.ts`, and
  `src/template-engine/explicitRegistryWriteAuthorizationHandoff.ts`: Phase
  10L local explicit authorization gate, checklist, and handoff logic. They
  decide future controlled write execution design eligibility only; they do not
  authorize or execute registry writes, publish, replace the current User App
  Shell package, or mark production readiness.
- `src/template-engine/controlledRegistryWriteExecutionDesign.ts`,
  `src/template-engine/controlledRegistryWriteExecutionValidation.ts`, and
  `src/template-engine/controlledRegistryWriteExecutionHandoff.ts`: Phase 10M
  local controlled registry write execution design, validation, and handoff
  logic. They define preflight, planned execution steps, audit plan, rollback
  execution design, and write lock requirements only; they do not execute
  registry writes, publish, replace the current User App Shell package, or mark
  production readiness.
- `src/template-engine/realRegistryWriteImplementationGate.ts`,
  `src/template-engine/realRegistryWriteImplementationChecklist.ts`, and
  `src/template-engine/realRegistryWriteImplementationHandoff.ts`: Phase 10N
  local real registry write implementation gate, checklist, and handoff logic.
  They decide future implementation draft eligibility only; they do not
  implement or execute a registry writer, write registry data, publish, replace
  the current User App Shell package, or mark production readiness.
- `src/template-engine/realRegistryWriteImplementationDraft.ts`,
  `src/template-engine/realRegistryWriteImplementationDraftValidation.ts`, and
  `src/template-engine/realRegistryWriteImplementationDraftHandoff.ts`: Phase
  10O local real registry write implementation draft, validation, and handoff
  logic. They describe future writer interface, transaction, write lock, audit
  event, and rollback command drafts only; they do not execute a registry
  writer, write registry data, create a production writer, publish, replace the
  current User App Shell package, or mark production readiness.
- `src/template-engine/finalRealWriteReviewGate.ts`,
  `src/template-engine/finalRealWriteReviewChecklist.ts`, and
  `src/template-engine/finalRealWriteReviewHandoff.ts`: Phase 10P local final
  real write review gate, checklist, and handoff logic. They preserve owner
  authorization scope A as review-gate-only, check that real writes,
  publication, production writer creation, and current User App Shell package
  replacement remain blocked, and recommend a future Phase 10Q authorization
  phase only.
- `src/template-engine/realWriteExecutionAuthorization.ts`,
  `src/template-engine/realWriteExecutionAuthorizationChecklist.ts`, and
  `src/template-engine/realWriteExecutionAuthorizationHandoff.ts`: Phase 10Q
  local real write execution authorization, checklist, and handoff logic. They
  preserve owner authorization scope A as Phase-10Q-only, check that real
  writes, publication, production writer creation, and current User App Shell
  package replacement remain blocked, and recommend a future Phase 10R
  execution plan only.
- `src/template-engine/realWriteExecutionPlan.ts`,
  `src/template-engine/realWriteExecutionPlanValidation.ts`, and
  `src/template-engine/realWriteExecutionPlanHandoff.ts`: Phase 10R local real
  write execution plan, validation, and handoff logic. They describe future
  execution sequence, preflight, locks, audit, rollback, failure handling, and
  dry-run verification only.
- `src/template-engine/guardedRealWriteExecutionSimulator.ts`,
  `src/template-engine/guardedRealWriteExecutionSimulatorValidation.ts`, and
  `src/template-engine/guardedRealWriteExecutionSimulatorHandoff.ts`: Phase 10S
  local guarded real write execution simulator, validation, and handoff logic.
  They simulate preflight, write lock, operation, audit, rollback, and failure
  handling only; they do not write or mutate registry state.
- `src/template-engine/guardedSimulatorReviewGate.ts`,
  `src/template-engine/guardedSimulatorReviewChecklist.ts`, and
  `src/template-engine/guardedSimulatorReviewHandoff.ts`: Phase 10T local
  guarded simulator review gate, checklist, and handoff logic. They review
  simulator evidence only and do not authorize writes, mutate registry state,
  publish, replace the current User App Shell package, or create a production
  writer.
- `src/templates`: schemas, storage, review, corrections, evidence, dataset materialization, source image binding, production batch storage/export, template library storage, and publish package export.
- `src/template-engine/production`: production queue, state machine, QA rules, rebinding recovery, analysis handoff, review lifecycle, smoke checklist.
- `src/template-engine/library`: production task to library entry conversion, template versioning, and local library lifecycle.
- `src/template-engine/app-contract`: publish package to user app contract adapter, makeup step normalization, compatibility validation, and prototype consumer view models.
- `src/user-app`: local User App MVP Shell view models, navigation, progress, guidance UX, friendly messages, state, photo intake placeholder, personalization placeholder, local onboarding, local preferences, guidance hints, discovery, recommendation placeholders, local session persistence/recovery, privacy boundary utilities, mobile QA, app readiness gating, browser/mobile QA reports, trial operations, trial result review, issue taxonomy, decision framework, iteration backlog, priority framework, iteration plan, learning decision gate, evidence pack models, evidence collection preparation models, anonymous dry run models, anonymous launch models, anonymous evidence review models, and anonymous follow-up iteration models.
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
- Render Phase 9J anonymous internal trial follow-up iteration, gap action plan, and follow-up readiness administrator panels for conservative next-round planning.
- Generate FaceMesh region QA, makeup attribute candidates, rule-based draft
  steps, and draft-only templates from local Template Studio analysis results
  while requiring human review and keeping publishing blocked.
- Render Phase 10P final real write review gate, checklist, and handoff in
  Template Workbench as local administrator review-gate-only metadata.
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
- Phase 10D candidate-to-app contract preparation adds only local mapping preview, validation, and handoff structures. It is not formal `UserAppTemplatePackage` generation, user app package registry writing, user app publication, production app readiness, backend work, OpenAI/external API usage, camera/AR work, or training.
- Phase 10P final real write review gate adds only local administrator review
  gate, checklist, and handoff structures. It is not actual registry write
  authorization, registry write execution, production writer readiness,
  publication, production package creation, current User App Shell package
  replacement, backend work, OpenAI/external API usage, camera/AR work, or
  training.
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

## Phase 10F Current Capability

Phase 10F completed Official User App Package Draft Gate. It added local gate,
handoff, examples, Template Workbench UI, documentation, and recovery state for
deciding whether a Phase 10E draft preview is eligible for a future Official
UserAppTemplatePackage Draft Builder. It is not formal `UserAppTemplatePackage`
generation, does not write a user app package registry, does not publish, does
not call backend/OpenAI/external APIs, does not use camera/AR, and does not
train models.

Historical marker retained for Phase 10E recovery tests: Phase 10E completed.

Next recommended phase: Phase 10G - Official UserAppTemplatePackage Draft Builder.

## Phase 10J Current Capability

Phase 10J completed UserAppTemplatePackage Registry Write Gate. It added a
local gate, handoff, examples, Template Workbench UI, documentation, and
recovery state for deciding whether a Phase 10I registry preparation validation
result is eligible for a future controlled registry writer draft. It is not an
actual registry write, does not publish, does not replace the current User App
Shell package, does not mark production readiness, does not call
backend/OpenAI/external APIs, does not use camera/AR, and does not train models.

Historical marker retained for Phase 10I recovery tests: Phase 10I completed.

Next recommended phase: Phase 10K - Controlled UserAppTemplatePackage Registry Writer Draft.

## Phase 10M Current Capability

Phase 10M completed Controlled Registry Write Execution Design. It added a
local execution design, safety validation, handoff, examples, Template Workbench
UI, documentation, and recovery state for deciding whether a Phase 10L
authorization gate result is eligible for a future real write implementation
gate. It is not actual write authorization, does not write a registry, does not
publish, does not replace the current User App Shell package, does not mark
production readiness, does not call backend/OpenAI/external APIs, does not use
camera/AR, and does not train models.

Historical marker retained for Phase 10K recovery tests: Phase 10K completed.
Historical marker retained for Phase 10L recovery tests: Phase 10L completed.

Historical marker retained for Phase 10M recovery tests: Phase 10M completed.

## Phase 10O Current Capability

Phase 10O completed Real Registry Write Implementation Draft. It added a local
implementation draft, validation, handoff, examples, Template Workbench UI,
documentation, and recovery state for describing a future writer interface,
transaction, write lock, audit event, and rollback command after the Phase 10N
implementation gate. It is not actual registry write, does not create or
execute a production writer, does not write a registry, does not publish, does
not replace the current User App Shell package, does not mark production
readiness, does not call backend/OpenAI/external APIs, does not use camera/AR,
and does not train models.

Historical marker retained for Phase 10O recovery tests: Phase 10O completed.

Historical marker retained for Phase 10N recovery tests: Phase 10N completed.

## Phase 10Q Current Capability

Phase 10Q completed Real Write Execution Authorization. It added a local
authorization model, checklist, handoff, examples, Template Workbench UI,
documentation, and recovery state after Phase 10P final review gate readiness.
Owner authorization scope is preserved as Phase-10Q-only: `授权范围：A。只授权进入 Phase 10Q — Real Write Execution Authorization，不授权真实写入 registry，不授权发布，不授权替换当前 User App Shell package，不授权创建 production writer。`
It does not authorize actual registry writes, publication, production writer
creation, production package creation, or current User App Shell package
replacement. It does not write a registry, does not publish, does not call
backend/OpenAI/external APIs, does not use camera/AR, and does not train models.

Historical marker retained for Phase 10P recovery tests: Phase 10P completed.

Next recommended phase: Phase 10R - Real Write Execution Plan.

## Phase 10R Current Capability

Phase 10R completed Real Write Execution Plan, Execution Plan Validation, and
Execution Plan Handoff in Template Workbench. Plan ready means eligible for a
future guarded execution simulator only: dry-run only, no actual registry write,
no production writer creation or readiness, no publish, no production package
marker, no current User App Shell package replacement, future separate owner
approval required, execution sequence present, preflight present, write lock
present, audit present, rollback present, failure handling present, dry-run
verification present, no backend, no camera/AR, no OpenAI/external API, and no
training.

Historical marker retained for Phase 10Q recovery tests: Phase 10Q completed.

Next recommended phase: Phase 10S - Guarded Real Write Execution Simulator.

## Phase 10S Current Capability

Phase 10S completed Guarded Real Write Execution Simulator, Simulation
Validation, and Simulation Handoff in Template Workbench. Simulator ready means
eligible for a future guarded simulator review gate only: dry-run only, no
actual registry write, no registry mutation, no production writer creation or
readiness, no publish, no production package marker, no current User App Shell
package replacement, future separate owner approval required, simulated
preflight present, simulated write lock present, simulated operation present,
simulated audit present, simulated rollback present, simulated failure handling
present, no backend, no camera/AR, no OpenAI/external API, and no training.

Historical marker retained for Phase 10R recovery tests: Phase 10R completed.

Next recommended phase: Phase 10T - Guarded Simulator Review Gate.

## Phase 12A Current Capability

Phase 12A completed Photo-to-Template Draft Reality Check. The current chain
can support semi-automatic template draft generation with human review, but it
cannot claim fully automatic high-quality makeup extraction from arbitrary
photos. Field source labels now distinguish real_from_photo,
facemesh_derived, region_qa_derived, pixel_rule_derived,
semantic_rule_derived, template_rule_derived, demo_fixture, placeholder,
human_required, and unsupported. The Template Workbench has an operator-only
field source matrix. The registry chain remains paused after Phase 10U and
Phase 10V is still not the active next phase.

Next recommended phase: Phase 12B - Makeup Semantic Extraction Baseline.

## Phase 12B Current Capability

Phase 12B completed Makeup Semantic Extraction Baseline. The current
photo-to-template chain can produce local deterministic semantic candidates for
lip color, lip finish, blush placement, blush intensity, eye makeup intensity,
eyeshadow tone, brow definition, highlight signal, contour signal, and overall
style. All semantic outputs are candidate-only, human-review-required, not
final recognition, not AI-confirmed, not product shade matching, not medical or
skin diagnosis, and not fully automatic high-quality extraction.

Historical marker retained for Phase 12B recovery tests: Phase 12B completed.

Next recommended phase: Phase 12C - Photo-to-Template Draft Integration & Human Review Editing.

## Phase 12C Current Capability

Phase 12C completed Photo-to-Template Draft Integration & Human Review Editing.
The current chain can bind Phase 12B semantic candidates into editable draft
fields and show a local human review editing session in Template Workbench. The
binding matrix preserves source type, confidence band, evidence, limitations,
original candidate value, editable draft value, reviewer decision, reviewer
note, `humanReviewRequired`, and `notFinal`.

Accepted or edited candidates enter draft QA only. They are not final
recognition, not AI-confirmed, not published, not registry-written, not
production writer output, not `UserAppTemplatePackage` mutation, and not User
App Shell package replacement. The registry chain remains paused after Phase
10U, and Phase 10V is intentionally not the active next phase.

Next recommended phase: Phase 12D - Photo-to-Template Operator Workflow & Draft Preview QA.

## Phase 12D Current Capability

Phase 12D completed Photo-to-Template Operator Workflow & Draft Preview QA. The
current chain can show an operator-only workflow from Vision / FaceMesh through
Reality Check, Semantic Extraction, Draft Integration, Human Review Editing,
Draft QA, User App Draft Preview QA, and handoff. Each workflow step has
status, required inputs, produced outputs, issues, warnings, next action, and
allowed / forbidden handoff destinations.

Draft Preview QA checks user-visible title, summary, scenario, difficulty,
estimated time, tool checklist, step guidance, beginner tips, common mistakes,
correction tips, region guidance, and local-only privacy copy. It blocks
sourceType, confidenceBand, evidence, limitations, reviewerDecision, reviewer
notes, `humanReviewRequired`, `notFinal`, registry/write/publish terminology,
production writer wording, final claims, AI-confirmed claims, fully automatic
extraction claims, medical claims, and product shade hard claims from ordinary
user-facing preview copy.

The registry chain remains paused after Phase 10U, and Phase 10V is
intentionally not the active next phase. Next recommended phase: Phase 12E -
Photo-to-Template End-to-End Demo Script & Acceptance Trial.

## Phase 10T Current Capability

Phase 10T completed Guarded Simulator Review Gate, Review Checklist, and Review
Handoff in Template Workbench. Review gate ready means eligible for a future
real write approval boundary only: dry-run only, no actual registry write, no
registry mutation, no production writer creation or readiness, no publish, no
production package marker, no current User App Shell package replacement,
future separate owner approval required, simulated preflight reviewed,
simulated write lock reviewed, simulated operation reviewed, simulated audit
reviewed, simulated rollback reviewed, simulated failure handling reviewed, no
backend, no camera/AR, no OpenAI/external API, and no training.

Historical marker retained for Phase 10S recovery tests: Phase 10S completed.

Next recommended phase: Phase 10U - Real Write Approval Boundary.

## Phase 10U Current Handoff

Phase 10U completed local Real Write Approval Boundary, Approval Checklist, and Approval Handoff in Template Workbench. Boundary ready means eligible for a future actual write authorization request only: approval-boundary-only, no actual registry write, no registry mutation, no publish, no production package marker, no current User App Shell package replacement, no production writer, future separate owner approval required, audit requirements present, rollback approval requirements present, no backend, no camera/AR, no OpenAI/external API, and no training. Next recommended phase: Phase 10V - Actual Write Authorization Request.

Phase 11A completed User App MVP Experience Reset. The registry chain is paused
after Phase 10U, Phase 10V is intentionally not the active next phase, and the
default shell path returns to ordinary users: Home, Template Selection, Template
Detail, Preparation, Step-by-step Guidance, and Completion. Administrator trial,
Template Studio, and registry safety terminology remain out of the default user
path. Next recommended phase: Phase 11B - User App Guided Step Experience
Polish.

Phase 11B completed User App Guided Step Experience Polish. The preparation
screen now shows title, difficulty, estimated time, step count, tool checklist,
privacy reminder, and start action. Step guidance now shows current step number,
progress, step status, region, tools/products, instructions, cautions,
correction tips, and mobile-friendly actions. Completion now includes template
name, completed count, step review, restart, and return-to-selection actions.
The registry chain remains paused after Phase 10U and Phase 10V is still not
the active next phase. Next recommended phase: Phase 11C - User App Visual
Guidance & Template Content Polish.

Phase 11C completed User App Visual Guidance & Template Content Polish. The
local MVP example package now uses Chinese user-facing template content, and
the shell shows step preview, region guidance, practice-first preparation copy,
region badges, intensity reminders, technique breakdowns, final checks, and
completed-region summaries. The registry chain remains paused after Phase 10U
and Phase 10V is still not the active next phase. Next recommended phase:
Phase 11D - User App Demo Readiness & Operator QA.

Phase 11D completed User App Demo Readiness & Operator QA. The local MVP shell
now has demo readiness docs, operator QA checklist, user path QA, mobile demo
checks, forbidden terms QA, known limitations, and an administrator-only Demo
Readiness panel. The registry chain remains paused after Phase 10U and Phase
10V is still not the active next phase. Next recommended phase: Phase 12A -
Photo-to-Template Draft Reality Check.

Historical handoff marker retained for Phase 10T recovery tests: Phase 10T completed / lastCompletedPhase: 10T / nextRecommendedPhase: 10U / Real Write Approval Boundary / Guarded Simulator Review Gate.
