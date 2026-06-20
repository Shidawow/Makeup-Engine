# Current Architecture

Makeup Engine is a local template production system for a future makeup coaching app. It is organized as deterministic local modules with explicit boundaries between source images, browser artifact binding, vision analysis, human correction, review, training, and export.

## System Layers

### Source Image Import

Admin-provided real photos enter through `scripts/import-source-images.mjs` and `src/training/import`. The output is a `SourceImagePackage` with manifest, checksums, import report, quarantine report, and optional normalized artifacts.

### Source Image Artifact Binding

`src/templates/storage/sourceImageArtifactBinding` owns the browser handoff boundary. It turns operator-selected normalized PNG or JSON RGBA artifacts into `BrowserArtifactResource` values and bound seed metadata. It does not turn manifest paths into browser files.

### Source Image Production Batch

`src/templates/storage/sourceImagePackageStorage` and `src/template-engine/production` now cooperate on batch seed creation, batch task status, and local review lifecycle. Source image packages can create production batches, but they still do not become training datasets.

### Production Batch QA / Review Hardening

`src/templates/schema/template-production-qa.schema.ts` defines the QA report, issue severity, review reason taxonomy, publish confirmation, and operator checklist. `src/template-engine/production/templateProductionQaRules.ts` evaluates task and batch readiness. `templateReviewLifecycle.ts` enforces reject reason capture and publish confirmation. `templateProductionRebinding.ts` detects session-restored tasks whose temporary browser artifact resource must be rebound. `templateProductionSmokeChecklist.ts` provides deterministic local smoke coverage.

### Template Library Management

`src/templates/schema/template-library.schema.ts` defines `TemplateLibrary`, `TemplateLibraryEntry`, entry lifecycle status, source lineage, evidence summary, quality summary, version history, manifest, and validation result. `src/template-engine/library/productionToLibrary.ts` converts only approved or locally published production tasks into library entries. `templateLibraryLifecycle.ts` enforces review, ready for package, packaged, local published, archive, deprecate, and reject transitions.

### Template Publish Package

`src/templates/schema/template-publish-package.schema.ts` defines the local publish package, package manifest, package entries, compatibility metadata, readiness, checksums, and export options. `src/templates/storage/templatePublishPackageBuilder.ts` and `templatePublishPackageExport.ts` build and export package JSON without object URLs, local absolute paths, large image bytes, or React state.

### User App Template Consumption Contract

`src/templates/schema/user-app-template-contract.schema.ts` defines `UserAppTemplatePackage`, `UserAppTemplate`, app-facing makeup steps, region instructions, product suggestions, tool suggestions, compatibility, readiness, and validation. `src/template-engine/app-contract` adapts validated `TemplatePublishPackage` records into app-facing contract data and validates that consumption exports contain no object URLs, local absolute paths, large image bytes, or React state. `src/templates/storage/userAppConsumptionExport.ts` creates consumption manifests, checksums, JSON exports, and handoff summaries.

### User App Prototype Contract Consumer

`src/template-engine/app-contract/userAppPrototypeConsumer.ts` derives read-only prototype consumer view models from `UserAppTemplatePackage`. It creates package summary, app-facing template list, selected template detail, ordered step guidance, region instruction summaries, tool/product summaries, lineage summaries, and validation panel data. `src/components/template-studio/user-app-prototype-consumer-panel` renders the admin-only prototype consumer and example package smoke preview. It is not the real user app.

### User App MVP Shell

`src/user-app` derives local user-side shell view models, navigation state, progress state, and shell summaries from `UserAppTemplatePackage`. `src/components/user-app` renders the local MVP shell: package summary, template list, template detail, step-by-step guidance, region instructions, tools/products, compatibility banner, and local progress. It is a Phase 7A prototype shell, not a production app, not backend publication, not iOS native, not camera capture, and not AR.

### Step-by-step Guidance UX Hardening

Phase 7B extends the shell with user-facing guidance view models and copy. Step guidance now exposes progress labels, step categories, friendly summaries, detailed instructions, region guidance, tool/product checklists, common mistakes, correction tips, warning messages, blocked reasons, and next actions. This remains local UX hardening over `UserAppTemplatePackage`; it is not backend publication, camera capture, AR, native iOS, training, or production app behavior.

### User Photo Intake Placeholder / Personalization Boundary

Phase 7C adds placeholder-only user photo and personalization boundaries. `src/user-app/userPhotoIntake.ts` defines disabled future photo intake state and readiness. `src/user-app/userPersonalization.ts` defines non-sensitive local personalization hints. `src/user-app/userPhotoPrivacy.ts` blocks object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo bytes, face embeddings, biometric identifiers, training inputs, and persistent photo references. `src/components/user-app` renders disabled photo intake controls, personalization placeholders, and privacy notices inside the local shell. It does not add real camera capture, upload, AR, backend, database, training, or native iOS scope.

### User App Local Preferences & Onboarding

Phase 7D adds local-only onboarding and non-sensitive preferences. `src/user-app/userOnboarding.ts` owns optional onboarding state and progress. `src/user-app/userLocalPreferences.ts` owns local preference state, readiness, summaries, and display-only guidance hints. `src/user-app/userPreferencePrivacy.ts` blocks object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo bytes, face embeddings, biometric identifiers, sensitive fields, and training input markers from preference data. `src/components/user-app` renders onboarding, preference setup, preference summary, and guidance hint preview inside the local shell. It does not add login, backend, database, cloud sync, real camera capture, upload, AR, training, or native iOS scope.

### User App Template Discovery / Recommendation Placeholder

Phase 7E adds local-only discovery and recommendation placeholders. `src/user-app/userTemplateDiscovery.ts` owns deterministic filters, sorting, and discovery summaries over `UserAppTemplatePackage`. `src/user-app/userTemplateRecommendation.ts` owns rule-based recommendation scoring, ranking, summaries, and boundary validation using only template metadata and non-sensitive local preferences. `src/user-app/userRecommendationReasons.ts` converts recommendation reasons into user-facing copy. `src/components/user-app` renders discovery filters, recommended templates, all templates, reason panels, and blocked-template explanations inside the local shell. It does not add real AI recommendation, backend services, account systems, database storage, cloud sync, analytics, advertising, ecommerce, training, external APIs, or new runtime dependencies.

### User App Session Persistence / Local State Hardening

Phase 7F adds local-only session boundaries for the User App MVP Shell. `src/user-app/userAppSession.ts` owns versioned session snapshots and summaries. `src/user-app/userAppSessionStorage.ts` owns testable memory/localStorage adapters, sanitization, save/load/clear, and import/export helpers. `src/user-app/userAppSessionRecovery.ts` reconciles selected template, active step, stale progress ids, discovery filters, blocked-package restore state, and version mismatch. `src/user-app/userAppSessionPrivacy.ts` blocks photos, object URLs, local paths, base64 images, image bytes, biometrics, sensitive fields, React state, non-serializable values, recommendation user records, and training markers. `src/components/user-app` renders session controls and recovery notices. It does not add account systems, login, backend session sync, cloud sync, database persistence, analytics, production app storage, camera, AR, training, external APIs, or new runtime dependencies.

### User App Mobile QA / Readiness Gate

Phase 7G adds local app prototype readiness gating for the User App MVP Shell. `src/user-app/userAppMobileQa.ts` owns deterministic mobile viewport and interaction checklist reports. `src/user-app/userAppReadiness.ts` owns `UserAppReadinessReport` across template package, step guidance, onboarding, preferences, discovery, local session, privacy, mobile interaction, empty state, and blocked state. `src/components/user-app` renders App readiness, mobile QA, interaction checklist, and readiness gate panels inside the local shell. It does not add production app scope, native iOS, backend, database, accounts, cloud sync, analytics, camera, AR, training, external APIs, or new runtime dependencies.

### User App Product Route Decision

Phase 8A selects React Web / PWA MVP first as the next product route. The canonical route decision is documented in `docs/app-roadmap/app-technology-route-decision.md`, `docs/app-roadmap/user-app-mvp-plan.md`, `docs/app-roadmap/makeup-engine-vs-user-app-boundary.md`, `docs/app-roadmap/phase-8-roadmap.md`, and `docs/product/user-app-v1-non-goals.md`. It does not add runtime code. Makeup Engine remains the template production system, local contract prototype, and package export owner. The future production user-facing app should be planned as a separate app surface or repository after an explicit phase gate, with `UserAppTemplatePackage` as the handoff contract.

### PWA / Mobile Web MVP Polish

Phase 8B adds lightweight PWA metadata and local mobile shell polish. `public/manifest.webmanifest`, `public/pwa-icon.svg`, and `index.html` provide install-readiness placeholders. `src/user-app/userAppPwaReadiness.ts` and `src/user-app/userAppMvpPolish.ts` provide deterministic local readiness reports. `src/components/user-app` renders a mobile-first home plus separated administrator QA panels for PWA readiness and MVP polish readiness. It does not add service worker, offline cache, push notification, background sync, install tracking, analytics, backend, database, camera, AR, native app scope, external APIs, training, online publication, or production app release.

### User App MVP Trial Pack

Phase 8C adds local internal / small-scope trial planning structures. `src/user-app/userAppTrialPack.ts` owns ordered trial tasks and trial checklist. `src/user-app/userAppTrialFeedback.ts` owns privacy-safe feedback form structure, mock/example summaries, and unsafe feedback blocking. `src/user-app/userAppTrialReadiness.ts` owns trial readiness checks across tasks, feedback, privacy, local-only boundary, PWA carryover, mobile shell carryover, user path readiness, and admin QA separation. `src/components/user-app` renders MVP 试用包, 反馈表预览, and 试用就绪度 panels inside the administrator checks area. It does not add production app scope, backend forms, analytics, real user record storage, camera, AR, training, App Store/TestFlight, online publication, or new runtime dependencies.

### Template Content QA For Real User Trial

Phase 8D adds local content QA structures for trial preparation. `src/user-app/userAppTemplateContentQa.ts` checks template title, summary, steps, actionability, region instructions, tools, products, duration, difficulty, recommendation reasons, privacy/placeholder copy, internal technical terms, and trial suitability. `src/user-app/userAppTrialTemplateSelection.ts` separates trial-ready, backup warning, and blocked templates. `src/user-app/userAppTrialContentReadiness.ts` combines Phase 8C trial readiness with template content QA, template selection, privacy boundary, and local-only boundary. `src/components/user-app` renders 模板内容 QA, 试用模板选择, and 试用内容就绪度 panels inside the administrator checks area. It does not add production app scope, backend services, analytics, AI content generation, OpenAI/external API usage, real user record storage, camera, AR, training, App Store/TestFlight, online publication, or new runtime dependencies.

### MVP Release Readiness Gate

Phase 8E adds local release readiness gate structures for internal trial preparation. `src/user-app/userAppMvpReleaseReadiness.ts` summarizes Phase 8A route decision, Phase 8B PWA/mobile polish, PWA manifest readiness, ordinary user path readiness, privacy/local-only boundary, Phase 8C trial pack and feedback form, Phase 8D template content QA and trial template selection, browser/mobile QA evidence, known limitations, and production non-goals. `src/user-app/userAppTrialGoNoGo.ts` returns `go_for_internal_trial`, `go_with_warnings`, or `no_go`. `src/components/user-app` renders MVP 发布就绪度 and 试用 Go/No-Go panels inside the administrator checks area. It does not add production app scope, backend services, analytics, camera, AR, AI generation, OpenAI/external API usage, real user record storage, training, App Store/TestFlight, online publication, or new runtime dependencies.

### Internal Trial Operations Pack

Phase 9A adds local internal trial operations structures for small-scope trial preparation. `src/user-app/userAppInternalTrialOps.ts` owns participant type coverage, session plan, checklist, risks, boundaries, and operations status. `src/user-app/userAppTrialObservation.ts` owns anonymous observation signals and mock/example summaries. `src/user-app/userAppTrialOutcome.ts` owns outcome review recommendations for continuing trials, revising content, revising shell, blocking for privacy/scope, or entering Phase 9B. `src/components/user-app` renders 内部试用运营, 观察记录模板, and 试用结果复盘 panels inside the administrator checks area. It does not add public recruitment, production app scope, backend forms, analytics, real user record storage, camera, AR, AI analysis, OpenAI/external API usage, training, App Store/TestFlight, online publication, or new runtime dependencies.

### Internal Trial Result Review Framework

Phase 9B adds local result review structures for anonymous/mock internal trial review. `src/user-app/userAppTrialResultReview.ts` owns review signals, summaries, warnings, and blocked states. `src/user-app/userAppTrialIssueTaxonomy.ts` owns issue categories, severity, actionability, and issue summaries. `src/user-app/userAppTrialDecisionFramework.ts` owns next-step decisions for continuing trials, revising template content, revising the Shell, revising the trial pack, pausing for privacy/scope, or entering Phase 9C. `src/components/user-app` renders 试用结果复盘框架, 问题分类汇总, and 下一步决策框架 panels inside the administrator checks area. It does not add production analytics, backend forms, real user record storage, camera, AR, AI analysis, OpenAI/external API usage, training, App Store/TestFlight, online publication, or new runtime dependencies.

### Internal Trial Iteration Plan

Phase 9C adds local iteration planning structures for anonymous/mock next-iteration planning. `src/user-app/userAppTrialIterationPlan.ts` owns workstreams, goals, actions, risks, and iteration status. `src/user-app/userAppTrialIterationBacklog.ts` owns issue-derived backlog items with category, severity, confidence, actionability, owner area, fix type, target iteration, acceptance criteria, and blocked reason. `src/user-app/userAppTrialIterationPriority.ts` owns deterministic P0/P1/P2/P3/observe-more priority recommendations. `src/components/user-app` renders 试用迭代计划, 迭代 backlog, and 优先级建议 panels inside the administrator checks area. It does not add a formal production roadmap, backend issue tracker, production analytics, real user record storage, camera, AR, AI analysis, OpenAI/external API usage, training, App Store/TestFlight, online publication, or new runtime dependencies.

### Internal Trial Learning Summary & Product Decision Gate

Phase 9D adds local learning and product decision structures for anonymous/mock internal trial summaries. `src/user-app/userAppInternalTrialLearningSummary.ts` owns learning themes, signals, insights, risks, and status. `src/user-app/userAppProductDecisionGate.ts` owns decisions for continuing trials, revising content, revising the Shell, revising trial ops, pausing, planning MVP validation, exploring production app discovery, or no-go. `src/user-app/userAppNextPhaseRecommendation.ts` owns recommendations for Phase 9E, Phase 10A, Phase 10B, DOC-ILLUSTRATED, or Phase 9D-Fix. `src/components/user-app` renders 试用学习总结, 产品决策门, and 下一阶段建议 panels inside the administrator checks area. It does not add production analytics, backend forms, real user record storage, camera, AR, AI analysis, OpenAI/external API usage, training, App Store/TestFlight, online publication, production app approval, or new runtime dependencies.

### FaceMesh-driven Makeup Intelligence Baseline

Phase 10A adds local template-production intelligence on top of the existing
Vision Analysis pipeline. `src/vision/facemeshRegionQa.ts` evaluates real local
FaceMesh landmark coverage, confidence, normalized coordinates, key makeup
region readiness, and crop warnings. `src/template-engine/makeupAttributeCandidates.ts`
generates deterministic candidate makeup attributes. `src/template-engine/ruleBasedStepGenerator.ts`
creates ordered draft steps, and `src/template-engine/templateDraftGenerator.ts`
creates a draft-only `MakeupTemplate` with publishing blocked and human review
required. `src/components/template-studio/FaceMeshMakeupIntelligencePanel.tsx`
renders the administrator panel. Phase 10A does not publish drafts, mutate
`UserAppTemplatePackage`, add backend/camera/AR/OpenAI/external APIs/training,
  or commit local MediaPipe assets.

### Template Library Candidate Packaging

Phase 10C adds a local candidate packaging layer after Phase 10B human review.
`src/template-engine/templateLibraryCandidatePackage.ts` creates
`TemplateLibraryCandidatePackage` artifacts from approved draft review workflow
outputs. `templateLibraryCandidateValidation.ts` validates approval trace, QA
trace, reviewed steps, region guidance, product placeholders, privacy boundary,
raw image reference blocking, no automatic publication, no user app package
mutation, and JSON round-trip stability. `templateLibraryCandidateHandoff.ts`
creates local next-action summaries for candidate library review, copy polish,
region fix, step revision, privacy review, example-only retention, or blocked
packages.

`src/components/template-studio/TemplateLibraryCandidatePackagingPanel.tsx`
renders the Template Workbench candidate package, validation, and handoff
summary. Candidate packaging does not appear in Vision Analysis and does not
publish, write the formal Template Library, generate `UserAppTemplatePackage`,
call backend/API services, or train models.

### Candidate-to-App Package Contract Preparation

Phase 10D adds a local contract preparation layer after Phase 10C candidate
validation. `src/template-engine/candidateToAppPackageContract.ts` creates
mapping previews from a validated `TemplateLibraryCandidatePackage` into future
app-facing contract fields. `candidateToAppPackageValidation.ts` checks source
candidate readiness, required mappings, raw image boundaries, personal data
boundaries, no automatic publish, no `UserAppTemplatePackage` mutation, trace
preservation, and JSON round-trip safety. `candidateToAppPackageHandoff.ts`
creates local next actions for a later User App Package Draft Preview.

`src/components/template-studio/CandidateToAppPackageContractPanel.tsx` renders
the Template Workbench contract preparation, validation, and handoff summary.
Candidate-to-app preparation does not appear in Vision Analysis and does not
generate a formal `UserAppTemplatePackage`, write a user app package registry,
publish to the user app, call backend/API services, or train models.

### Controlled UserAppTemplatePackage Registry Writer Draft

Phase 10K adds a local dry-run writer draft after Phase 10J registry write
gate. `src/template-engine/controlledUserAppTemplatePackageRegistryWriterDraft.ts`
creates package id/version candidates, proposed registry entry preview,
existing entry preview, write plan, diff preview, rollback plan, and
trace-preserved draft status from a gate-ready source.

`controlledUserAppTemplatePackageRegistryWriterValidation.ts` validates source
gate readiness, dry-run-only, actual-write-blocked, publish-blocked,
package-replacement-blocked, write plan, diff preview, rollback plan, trace,
unsafe payload, no production marker, and JSON round-trip safety.
`controlledUserAppTemplatePackageRegistryWriterHandoff.ts` summarizes next
actions for a future explicit write authorization gate.

`src/components/template-studio/ControlledUserAppTemplatePackageRegistryWriterDraftPanel.tsx`
renders the Template Workbench writer draft, validation, and handoff summary.
The controlled writer draft does not appear in Vision Analysis and does not
execute registry writes, publish to the user app, replace the current User App
Shell package, call backend/API services, or train models.

### Explicit Registry Write Authorization Gate

Phase 10L adds a local explicit authorization gate after Phase 10K writer
validation. `src/template-engine/explicitRegistryWriteAuthorizationGate.ts`
checks source writer validation readiness, dry-run-only, actual-write-blocked,
publish-blocked, package-replacement-blocked, write plan, diff preview,
rollback plan, reviewer acknowledgement, future owner authorization, production
write disabled, trace, unsafe payload, no actual registry write, no User App
Shell package replacement, no production marker, and JSON round-trip safety.

`explicitRegistryWriteAuthorizationChecklist.ts` records required owner
confirmation items without triggering writes. `explicitRegistryWriteAuthorizationHandoff.ts`
creates local next actions for future controlled write execution design,
write-plan revision, versioning review, rollback review, privacy review, owner
authorization review, dry-run-only retention, or blocking.

`src/components/template-studio/ExplicitRegistryWriteAuthorizationGatePanel.tsx`
renders the Template Workbench authorization gate, checklist, blocked reasons,
and handoff summary. The gate does not appear in Vision Analysis and does not
authorize or execute registry writes, publish to the user app, replace the
current User App Shell package, call backend/API services, use camera/AR, or
train models.

### Controlled Registry Write Execution Design

Phase 10M adds a local execution design layer after Phase 10L explicit
authorization gate. `src/template-engine/controlledRegistryWriteExecutionDesign.ts`
creates design-only preflight checks, planned execution steps, audit plan,
rollback execution design, write lock requirements, owner authorization trace,
and trace-preserved design status.

`controlledRegistryWriteExecutionValidation.ts` validates source authorization
gate readiness, design-only mode, dry-run-only, actual-write-blocked,
publish-blocked, package-replacement-blocked, audit plan, rollback design, write
locks, owner authorization trace, unsafe payload boundaries, no actual registry
write, no User App Shell package replacement, no production marker, and JSON
round-trip stability. `controlledRegistryWriteExecutionHandoff.ts` summarizes
next actions for a future Phase 10N real write implementation gate.

`src/components/template-studio/ControlledRegistryWriteExecutionDesignPanel.tsx`
renders the Template Workbench execution design, validation, and handoff
summary. The design does not appear in Vision Analysis and does not execute
registry writes, publish to the user app, replace the current User App Shell
package, call backend/API services, use camera/AR, or train models.

### Vision Analysis

`src/vision` owns local face, cosmetic, pixel, region, quality, provider, and pipeline logic. It consumes `TemplateAnalysisSeed` records when they are ready for Vision Analysis.

### Segmentation / Mask Editing

`src/vision/segmentation` owns segmentation boundaries, masks, editing, refinement, debug artifacts, and providers. Human-editable masks are not replaced by source image package metadata.

### Template Engine

`src/template-engine` owns template parsing, extraction, production, convergence, inference, region taxonomy, and validation contracts.

### Template Evidence

`src/templates/schema` and `src/templates/storage` represent evidence, correction, review, audit, dataset, and storage contracts. Evidence helps justify templates and supports later review.

### Dataset Review

Dataset review queues and decisions live in `src/templates/storage` and `src/templates/schema`. Review is required before training-ready materialization.

### Training Dataset

Materialized training datasets are produced only after masks, human corrections, review decisions, and split/package metadata exist. A source image package is an upstream input, not training data.

### Lightweight Training

`src/training` contains deterministic local trainers, loaders, evaluators, predictors, tensor readers, config schemas, and runtime adapters.

### Export Package

`src/training/export` and export scripts prepare local model packages, runtime compatibility reports, provider specs, manifests, checksums, and smoke reports.

### Template Studio UI

`src/components/template-studio` is an operator UI for inspection, binding, correction, batch production, review, and export workflows. It must not directly write training datasets from UI state.

## Current Module Relationships

```text
src/training/import
-> SourceImagePackage

src/templates/storage/sourceImagePackageStorage
-> SourceImageEntry / TemplateAnalysisSeed

src/templates/storage/sourceImageArtifactBinding
-> BrowserArtifactResource

src/components/template-studio/source-image-intake-panel
-> artifact binding
-> seed creation

src/templates/storage/sourceImagePackageStorage
-> batch seed creation
-> TemplateProductionBatch tasks

src/template-engine/production
-> TemplateProductionBatch / TemplateProductionTask
-> queue / state machine / QA rules / rebinding recovery / review lifecycle

src/components/template-studio/template-production-batch-panel
-> batch creation
-> QA summary / issue filtering
-> reject reason capture
-> publish confirmation
-> rebinding recovery prompts
-> task handoff

src/template-engine/library
-> ProductionTask -> TemplateLibraryEntry conversion
-> TemplateLibrary lifecycle
-> Template versioning

src/templates/storage/templateLibraryStorage
-> local TemplateLibrary storage / import / export

src/templates/storage/templatePublishPackageBuilder
-> TemplatePublishPackage manifest / checksums / readiness

src/components/template-studio/template-library-panel
-> Template Library management
-> Publish Package build / export

src/components/template-studio/template-package-preview
-> package summary / evidence / lineage preview

src/template-engine/app-contract
-> TemplatePublishPackage -> UserAppTemplatePackage conversion
-> makeup step normalization
-> app compatibility validation

src/templates/storage/userAppConsumptionExport
-> consumption manifest / checksums / handoff export

src/components/template-studio/user-app-template-preview
-> app-facing step / region / compatibility preview

src/template-engine/app-contract/userAppPrototypeConsumer
-> read-only prototype consumer view models

src/components/template-studio/user-app-prototype-consumer-panel
-> prototype template list / detail / validation preview

src/user-app
-> User App Shell view model / navigation / progress / guidance UX / photo intake placeholder / personalization boundary / local onboarding / local preferences / local template discovery / recommendation placeholders / local session persistence and recovery / mobile QA / readiness gate / PWA readiness / MVP polish readiness / trial pack / trial feedback / trial readiness / template content QA / trial template selection / trial content readiness / MVP release readiness / trial go-no-go / internal trial operations / trial observation / trial outcome review / trial result review / trial issue taxonomy / trial decision framework / trial iteration plan / trial iteration backlog / trial iteration priority / internal trial learning summary / product decision gate / next phase recommendation

docs/app-roadmap/app-technology-route-decision.md
-> React Web / PWA MVP first route decision / deferred native-backend-camera-AR routes

docs/app-roadmap/user-app-mvp-plan.md
-> template discovery / detail / step guidance / local preferences / local session / privacy MVP plan

docs/user-app/pwa-mobile-web-mvp-polish.md
-> Phase 8B mobile shell polish / user path / admin QA separation / PWA boundary
-> Phase 8C trial pack / feedback preview / trial readiness / no real user record boundary

docs/user-app/template-content-qa-for-trial.md
-> Phase 8D template content QA / trial suitability / no AI generation boundary

docs/user-app/trial-template-selection.md
-> Phase 8D trial-ready / backup warning / blocked template selection

docs/user-app/trial-content-readiness.md
-> Phase 8D integrated trial content readiness / privacy and local-only boundary

docs/user-app/mvp-release-readiness-gate.md
-> Phase 8E MVP release readiness gate / internal trial readiness only / not production ready

docs/user-app/trial-go-no-go-decision.md
-> Phase 8E go / go-with-warnings / no-go decision for internal trial preparation

docs/product/internal-trial-result-review-framework.md
-> Phase 9B anonymous result review / no real data collection boundary

docs/product/internal-trial-issue-taxonomy.md
-> Phase 9B issue categories / severity / actionability

docs/product/internal-trial-decision-framework.md
-> Phase 9B continue / revise / pause / ready-for-9C decisions

docs/product/internal-trial-iteration-plan.md
-> Phase 9C next-iteration workstreams / no real collection boundary

docs/product/internal-trial-iteration-backlog.md
-> Phase 9C backlog items / owner areas / acceptance criteria

docs/product/internal-trial-priority-framework.md
-> Phase 9C P0/P1/P2/P3/observe-more priority rules

docs/product/internal-trial-learning-summary.md
-> Phase 9D learning themes / anonymous summary boundary

docs/product/product-decision-gate.md
-> Phase 9D continue / revise / pause / MVP validation planning decisions

docs/product/next-phase-recommendation-framework.md
-> Phase 9D Phase 9E / 10A / 10B / DOC / fix recommendation logic

docs/product/internal-trial-operations-pack.md
-> Phase 9A internal small-scope trial operations / participant type coverage / stop conditions

docs/product/internal-trial-observation-template.md
-> Phase 9A anonymous observation signals / no real participant records

docs/product/internal-trial-outcome-review.md
-> Phase 9A outcome recommendations / continue, revise, block, or enter Phase 9B

docs/user-app/pwa-install-readiness.md
-> manifest / metadata / icon placeholder / no service worker install-readiness boundary

docs/app-roadmap/makeup-engine-vs-user-app-boundary.md
-> Makeup Engine ownership / future User App ownership / SourceImagePackage exclusion

docs/app-roadmap/phase-8-roadmap.md
-> Phase 8A through 8E planning sequence

docs/product/user-app-v1-non-goals.md
-> V1 non-goals for login / backend / camera / AR / native / OpenAI / ecommerce / training

docs/user-app/user-app-product-route.md
-> compatibility entry point for Phase 8A route decision / ownership boundary / future separate app planning

src/components/user-app
-> local User App MVP Shell preview / mobile home / step guidance UX hardening / disabled photo intake and privacy placeholder UI / onboarding and preference setup UI / discovery and recommendation placeholder UI / session controls and recovery notice / PWA readiness panel / MVP polish checklist / trial pack panel / trial feedback panel / trial readiness panel / template content QA panel / trial template readiness panel / MVP release readiness panel / trial go-no-go panel / App readiness panel / mobile QA panel / interaction checklist

src/components/demo/vision-analysis-demo
-> seed analysis
```

## Phase 6J Additions

- Source Image Artifact Binding remains the only browser bridge from manifest references to analysis-ready resources.
- `BrowserArtifactResource` remains runtime-only; object URLs disappear after restore and must be rebound.
- `TemplateAnalysisSeed` readiness now feeds production task QA diagnostics.
- Template Studio artifact handoff is paired with batch QA summary and operator handoff export.
- Production task local `published` can be converted into Template Library `local_published`, but neither state implies backend publication.
- Template Library entries preserve production task lineage, template version history, evidence summary, quality summary, style tags, and publish confirmation summary.
- Template Publish Package is a local export package for future template consumers; it is not online publication and cannot contain object URLs, local absolute paths, or large image bytes.

## Phase 6K Additions

- User App Template Consumption Contract defines how a future iOS/Web/service consumer can read template package data.
- `UserAppTemplatePackage` and consumption manifests are local/export contract data, not the user app and not online publication.
- App-facing makeup steps preserve step order, region, instruction text, technique, target effect, intensity, duration, tool/product references, correction tips, and evidence references.
- Region instructions preserve normalized region references, intensity range, blend direction, edge softness, symmetry hints, and user guidance text.
- The adapter preserves source lineage from publish package, library entry, production task, and source image id.
- Compatibility validation blocks object URLs, local absolute paths, large image bytes, and React state from app contract exports.

## Phase 6L Additions

- User App Prototype Contract Consumer proves `UserAppTemplatePackage` can drive a read-only app-facing preview without building the real user app.
- Prototype view models expose template list, selected template detail, step-by-step guidance, region instructions, tools, products, duration, difficulty, style tags, lineage, and validation.
- Prototype readiness reports `ready`, `warning`, or `blocked` using the app contract validation boundary.
- Template Studio includes `UserAppPrototypeConsumerPanel` after `UserAppTemplatePreview`.
- The prototype panel can render the example app package as a smoke preview when no active package exists.
- The prototype remains local-only admin validation and cannot contain object URLs, local absolute paths, large image bytes, or React state.

## Phase 6L-1 Additions

- Prototype consumer QA now covers multi-template packages, empty packages, empty templates, warning states, blocked states, and selected-template fallback.
- `userAppPrototypeConsumer` exposes detailed validation issues, readiness checks, empty-state diagnostics, and JSON round-trip readiness reports.
- App compatibility validation now blocks packages with no templates, templates with no region instructions, steps without matching region instructions, invalid step order, unknown compatibility targets, and runtime-only references.
- Missing tools and product suggestions are visible warnings so operator QA can decide whether to fix the package before App MVP work.
- Template Studio prototype panel now renders no-package, no-template, no-step, no-region, no-tool, no-product, warning, and blocked states without becoming a real user app.

## Phase 7A Additions

- `src/user-app` adds deterministic shell view model, navigation, progress, and local state helpers.
- `src/components/user-app` adds a local User App MVP Shell with package summary, template list, template detail, step guidance, region instruction view, tool/product panel, compatibility banner, and progress panel.
- Template Studio includes the shell as a local preview after the prototype consumer panel.
- The shell consumes `UserAppTemplatePackage` only; it does not consume `SourceImagePackage` directly.
- Blocked packages cannot enter step guide and must resolve compatibility issues first.
- Shell progress is local UI state only and is not durable app storage, training input, backend sync, or online publication.

## Phase 7B Additions

- Step guidance view models now expose user-friendly summaries, detailed instructions, region guidance, tool/product checklists, mistakes, correction tips, warning messages, blocked reasons, and next actions.
- Internal compatibility issues are translated into user-facing copy for missing instructions, missing regions, runtime-only references, and invalid step order.
- User App Shell components have mobile-friendly stacked layouts and clearer empty, warning, and blocked states.
- `userAppGuidanceUxExamplePackage` covers complete, warning, blocked, long-flow, and short-flow guidance cases.
- 7B remains local UX hardening only; it does not add backend, database, camera, AR, native iOS, online publication, training, or new runtime dependencies.

## Phase 7C Additions

- User photo intake is represented as placeholder-only state and disabled future UI controls.
- Personalization is represented as non-sensitive local display hints only.
- The shell now explains that template guidance works without a user photo.
- Privacy validators block object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo bytes, face embeddings, biometric identifiers, training inputs, and persistent photo references.
- User photo placeholders, personalization hints, and privacy notices cannot enter durable exports, training datasets, model artifacts, or project-state.
- `SourceImagePackage` remains an admin production input and cannot directly become user photo intake.

## Phase 7D Additions

- Local onboarding is optional and covers welcome, skill level, guidance style, available time, tools, preferred styles, privacy reminder, skip, complete, and reset states.
- Local preferences cover only non-sensitive values: skill level, verbosity, available time, available tools, preferred style tags, occasion, and comfort level.
- Preference hints can change display copy for pacing, verbosity, tool availability, style, comfort level, and time constraints, but cannot mutate `UserAppTemplatePackage`.
- Preference privacy validation blocks object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo bytes, face embeddings, biometric identifiers, sensitive fields, and training input markers.
- Phase 7D does not add login, account systems, backend sync, cloud sync, database storage, real photo capture, camera APIs, AR, training, native iOS scope, OpenAI API, external CV API, or new runtime dependencies.

## Phase 7E Additions

- Template discovery filters and sorts `UserAppTemplatePackage` templates by difficulty, duration, style tags, occasions, tools, step count, warning/blocked status, and compatibility target.
- Recommendation placeholder ranking is deterministic, local-only, rule-based, and explainable.
- Recommendation inputs are limited to `UserAppTemplatePackage` metadata and non-sensitive local preferences.
- Blocked templates are excluded from recommendation lists but can be shown with blocked reasons.
- Warning templates can appear in recommendations with visible warning messages.
- User-facing recommendation reasons explain why a template is prioritized without exposing internal score details.
- Phase 7E does not add real AI recommendation, backend recommendation APIs, accounts, cloud sync, database storage, analytics, advertising, ecommerce, training, native iOS scope, OpenAI API, external CV API, or new runtime dependencies.

## Phase 7F Additions

- Local User App session snapshots are versioned, deterministic, local-only, and schema-aware.
- Session storage can use browser `localStorage` or a memory adapter, but all payloads are sanitized and validated before storage.
- Recovery reconciles selected template, active step, stale completed/skipped step ids, discovery filters, blocked packages, and version mismatch without mutating `UserAppTemplatePackage`.
- Session privacy guards block object URLs, local absolute paths, base64 image data, image/photo bytes, face embeddings, biometric identifiers, sensitive fields, React state, non-serializable values, recommendation user records, and training input markers.
- The shell exposes local session save, restore, clear progress, reset preferences, clear all local state, and recovery notices.
- Phase 7F does not add account systems, login, backend sync, cloud sync, database storage, analytics, real camera capture, user photo upload, AR, training, native iOS scope, online publication, external APIs, or new runtime dependencies.

## Phase 7G Additions

- Mobile QA is represented as deterministic local viewport/checklist data, not real browser automation or native iOS QA.
- App readiness reports combine template package, step guidance, onboarding, preferences, discovery, session, privacy, mobile interaction, empty state, and blocked state checks.
- The shell exposes `App 就绪度`, `移动端 QA`, and `交互检查` entries.
- Readiness and mobile QA panels are product/admin QA surfaces; they are not production release approval.
- Phase 7G does not add backend, database, accounts, cloud sync, analytics, camera, AR, training, external APIs, native iOS scope, online publication, or new runtime dependencies.

## Phase 7H Additions

- `src/user-app/userAppBrowserQa.ts` defines deterministic browser/mobile QA report metadata for the local User App MVP Shell.
- `scripts/user-app-browser-qa.mjs` provides local HTTP smoke and source/copy checks without new runtime dependencies.
- Mobile viewport readiness covers `375`, `390`, `414`, and `768` width profiles.
- The User App Shell uses readable Chinese labels for the main prototype surfaces instead of mixed or mojibake copy.
- Browser/mobile QA reports are local QA evidence only. They cannot mutate `UserAppTemplatePackage`, store real user records, or become production release approval.

### Internal Trial Evidence Pack

Phase 9E adds local evidence packaging structures for anonymous/mock internal trial evidence. `src/user-app/userAppInternalTrialEvidencePack.ts` owns evidence items, evidence types, risks, status, and the 9A/9B/9C/9D/9E evidence chain. `src/user-app/userAppTrialEvidenceSummary.ts` groups evidence into themes, insights, gaps, and recommendations. `src/user-app/userAppEvidenceSufficiencyGate.ts` decides whether evidence supports another internal trial, MVP validation planning, more evidence collection, privacy/scope blocking, or missing-evidence blocking. `src/components/user-app` renders 内部试用证据包, 试用证据摘要, and 证据充分性判断 panels inside the administrator checks area. It does not add production analytics, backend collection, real user record storage, camera, AR, AI analysis, OpenAI/external API usage, training, App Store/TestFlight, online publication, production app approval, or new runtime dependencies.

### Internal Trial Evidence Collection Preparation

Phase 9F adds local evidence collection preparation structures for anonymous internal dry run readiness. `src/user-app/userAppEvidenceCollectionProtocol.ts` owns allowed anonymous evidence types, forbidden data types, anonymization rules, participant notice, stop conditions, and protocol status. `src/user-app/userAppEvidenceCollectionChecklist.ts` owns before/during/after trial checks, privacy boundary checks, evidence quality checks, stop condition checks, and review handoff checks. `src/user-app/userAppEvidenceCollectionQualityGate.ts` decides whether preparation is ready for anonymous internal evidence collection, ready with warnings, or blocked by missing protocol, missing notice, forbidden data request, or privacy/scope risk. `src/components/user-app` renders 证据收集协议, 证据收集 checklist, and 证据收集质量门 panels inside the administrator checks area. It does not add real data collection, backend storage, public recruitment, camera, AR, AI analysis, OpenAI/external API usage, training, MVP validation approval, production app approval, production release approval, or new runtime dependencies.

### Anonymous Internal Trial Dry Run Pack

Phase 9G adds local anonymous dry run rehearsal structures before an anonymous internal trial launch pack. `src/user-app/userAppAnonymousTrialDryRunPack.ts` owns required scenarios, session script, participant notice, allowed evidence, forbidden data, stop conditions, and dry run status. `src/user-app/userAppAnonymousTrialDryRunChecklist.ts` owns before-dry-run, participant notice, administrator rehearsal, allowed evidence, forbidden data, during-dry-run, stop condition, after-dry-run, and review handoff checks. `src/user-app/userAppAnonymousTrialDryRunReview.ts` decides whether the dry run is ready for anonymous internal trial launch preparation, ready with warnings, should repeat, should revise protocol/checklist, or is blocked by missing notice, forbidden data request, or privacy/scope issue. `src/components/user-app` renders 匿名内部试用 dry run, dry run checklist, and dry run 复盘 panels inside the administrator checks area. It does not add real trial launch, backend storage, public recruitment, camera, AR, AI analysis, OpenAI/external API usage, training, MVP validation approval, production app approval, production release approval, or new runtime dependencies.

### Anonymous Internal Trial Launch Pack

Phase 9H adds local anonymous internal trial launch preparation structures. `src/user-app/userAppAnonymousTrialLaunchPack.ts` owns launch scope, participant notice, administrator script, anonymous evidence capture sheet, forbidden data requests, stop conditions, and launch pack status. `src/user-app/userAppAnonymousTrialLaunchReadiness.ts` decides whether launch is ready, ready with warnings, missing notice, missing admin script, missing stop conditions, forbidden data request, or blocked by privacy/scope issue. `src/user-app/userAppAnonymousTrialPostLaunchHandoff.ts` defines the post-launch handoff template for anonymous evidence collected, evidence gaps, stopped session reason, privacy incidents, issue summary handoff, decision gate handoff, and next phase recommendation. `src/components/user-app` renders 匿名内部试用启动包, 启动就绪度, and 试用后 handoff panels inside the administrator checks area. It does not add public recruitment, production app launch, backend storage, camera, AR, AI analysis, OpenAI/external API usage, training, MVP validation approval, production app approval, production release approval, or new runtime dependencies.

### Anonymous Internal Trial Evidence Review

Phase 9I adds local anonymous internal trial evidence review structures. `src/user-app/userAppAnonymousTrialEvidenceReview.ts` owns evidence review items, completeness checks, privacy checks, privacy incidents, stopped/paused reasons, source type, sample size, risks, and review status. `src/user-app/userAppAnonymousTrialEvidenceGapReview.ts` classifies evidence gaps and severity for missing task completion, step comprehension, template value, Shell usability, privacy clarity, stop condition records, post-launch handoff, insufficient sample size, unclear admin notes, forbidden data over-collection, and privacy incidents. `src/user-app/userAppAnonymousTrialDecisionInput.ts` converts review and gap signals into continue, repeat, revise launch pack, revise evidence collection protocol, pause, prepare MVP validation plan, or do-not-advance recommendations. `src/components/user-app` renders 匿名试用证据复盘, 证据缺口复盘, and 下一步决策输入 panels inside the administrator checks area. It does not add production analytics, backend evidence storage, camera, AR, AI analysis, OpenAI/external API usage, training, public recruitment, MVP validation approval, production app approval, production release approval, or new runtime dependencies.

### Anonymous Internal Trial Follow-up Iteration

Phase 9J adds local anonymous internal trial follow-up iteration structures.
`src/user-app/userAppAnonymousTrialFollowUpIteration.ts` owns follow-up goals,
actions, risks, status, and conservative recommendations.
`src/user-app/userAppAnonymousTrialGapActionPlan.ts` maps evidence gaps into
P0/P1/P2/P3/no-action priorities with owner areas and acceptance criteria.
`src/user-app/userAppAnonymousTrialFollowUpReadiness.ts` owns readiness
decisions for next anonymous trial, warnings, repeat dry run, protocol revision,
launch pack revision, privacy/scope pause, MVP validation preconditions, or
do-not-advance. `src/components/user-app` renders 匿名试用后续迭代,
证据缺口行动计划, and 后续试用就绪度 panels inside the administrator checks
area. It does not add production roadmap approval, production analytics,
backend evidence storage, camera, AR, AI analysis, OpenAI/external API usage,
training, public recruitment, MVP validation approval, production app approval,
production release approval, or new runtime dependencies.

### Template Draft Review Workflow

Phase 10B adds local administrator review structures for FaceMesh-driven
template drafts. `src/template-engine/templateDraftQa.ts` owns deterministic
draft QA checks. `src/template-engine/templateDraftHumanReview.ts` owns the
human review checklist and decisions. `src/template-engine/templateDraftReviewWorkflow.ts`
owns review queue status, priority, next action, and candidate handoff.
`src/template-engine/templateStudioWorkflow.ts` owns the cross-tab workflow
state between Vision Analysis and Template Workbench.

Vision Analysis owns FaceMesh, overlay/mask, region QA, image quality,
MediaPipe recovery hints, mock fallback, and readiness summary. Template
Workbench owns candidates, step drafts, template draft, draft QA, human review,
and candidate handoff. Approval means template library candidate only; it does
not publish and does not generate `UserAppTemplatePackage`.

### User App Package Draft Preview

Phase 10E adds a local draft preview layer after Phase 10D app contract
validation. `src/template-engine/userAppPackageDraftPreview.ts` creates preview
fields for future user app package drafts. `userAppPackageDraftPreviewValidation.ts`
checks source readiness, user-facing copy, step guidance, region guidance,
privacy copy, raw image boundaries, personal data boundaries, medical/product
claim boundaries, no automatic publish, no registry write, no formal
`UserAppTemplatePackage` mutation, and JSON round-trip safety.
`userAppPackageDraftPreviewHandoff.ts` creates local next actions for a later
Official User App Package Draft Gate.

`src/components/template-studio/UserAppPackageDraftPreviewPanel.tsx` renders the
Template Workbench preview, validation, and handoff summary. The preview does
not appear in Vision Analysis and does not generate formal
`UserAppTemplatePackage`, write a user app package registry, publish, call
backend/API services, use camera/AR, or train models.

### Official User App Package Draft Gate

Phase 10F adds a local gate after Phase 10E draft preview validation.
`src/template-engine/officialUserAppPackageDraftGate.ts` checks source preview
validation readiness, user-facing copy, step guidance, region guidance, tools,
privacy notice, raw image boundaries, personal data boundaries, medical/product
claim boundaries, unsupported final claims, no registry write, no automatic
publish, no formal `UserAppTemplatePackage` mutation, trace preservation, and
JSON round-trip safety. `officialUserAppPackageDraftGateHandoff.ts` creates
local next actions for a future Official UserAppTemplatePackage Draft Builder.

`src/components/template-studio/OfficialUserAppPackageDraftGatePanel.tsx`
renders the Template Workbench gate, blocked reasons, trace, and handoff
summary. The gate does not appear in Vision Analysis and does not generate
formal `UserAppTemplatePackage`, write a user app package registry, publish,
call backend/API services, use camera/AR, or train models. Gate ready means
eligible for a later builder only.

### Official UserAppTemplatePackage Draft Builder

Phase 10G adds a local draft builder after Phase 10F gate-ready handoff.
`src/template-engine/officialUserAppTemplatePackageDraft.ts` defines the
draft-only data shape. `officialUserAppTemplatePackageDraftBuilder.ts` builds a
draft from a ready gate, source preview, and gate handoff while preserving QA,
human review, candidate, contract, preview, and gate trace.
`officialUserAppTemplatePackageDraftValidation.ts` checks draft-only,
publish-blocked, no registry write, no User App Shell package replacement,
privacy, raw image, personal data, medical/product/final claim, production
marker, mutation marker, trace, and JSON round-trip boundaries.
`officialUserAppTemplatePackageDraftHandoff.ts` creates local next actions for
a later draft publish gate.

`src/components/template-studio/OfficialUserAppTemplatePackageDraftBuilderPanel.tsx`
renders the Template Workbench builder, validation, blocked reasons, and
handoff summary. The builder does not appear in Vision Analysis and does not
publish, write a user app package registry, replace the current User App Shell
package, call backend/API services, use camera/AR, or train models.

### UserAppTemplatePackage Draft Publish Gate

Phase 10H adds a local draft publish gate after Phase 10G official draft
validation. `src/template-engine/userAppTemplatePackageDraftPublishGate.ts`
checks source draft validation readiness, `draftOnly`, `publishBlocked`,
user-facing copy, step sequence, region guidance, tools, privacy notice, trace
preservation, raw image boundaries, personal data boundaries, medical/product
claim boundaries, unsupported final claims, no registry write, no automatic
publish, no User App Shell package replacement, no production package markers,
contract boundary safety, and JSON round-trip stability.
`userAppTemplatePackageDraftPublishGateHandoff.ts` creates local next actions
for future registry preparation, focused revisions, draft-only retention, or
blocking.

`src/components/template-studio/UserAppTemplatePackageDraftPublishGatePanel.tsx`
renders the Template Workbench publish gate, blocked reasons, trace, and
handoff summary. The gate does not appear in Vision Analysis and does not
publish, write a user app package registry, replace the current User App Shell
package, call backend/API services, use camera/AR, or train models. Gate ready
means eligible for future registry preparation only.

### UserAppTemplatePackage Registry Preparation

Phase 10I adds local registry preparation after Phase 10H draft publish gate.
`src/template-engine/userAppTemplatePackageRegistryPreparation.ts` prepares a
registry entry preview with package id/version candidates, title, summary,
style tags, difficulty, estimated time, step count, safety flags, privacy
notice, source trace, and explicit draft-only / publish-blocked /
registry-write-blocked flags.

`userAppTemplatePackageRegistryPreparationValidation.ts` checks source publish
gate readiness, registry entry preview presence, package id/version candidates,
draft-only flags, publish block flags, registry-write-blocked flags, trace
preservation, raw image boundaries, personal data boundaries, medical/product
claim boundaries, unsupported final claims, no actual registry write, no User
App Shell package replacement, no production markers, and JSON round-trip
stability. `userAppTemplatePackageRegistryPreparationHandoff.ts` creates local
next actions for a future registry write gate, metadata/version/privacy/shell
boundary review, preview-only retention, or blocking.

`src/components/template-studio/UserAppTemplatePackageRegistryPreparationPanel.tsx`
renders the Template Workbench preparation, validation, blocked reasons, trace,
and handoff summary. The panel does not appear in Vision Analysis and does not
write a registry, publish, replace the current User App Shell package, call
backend/API services, use camera/AR, or train models. Preparation ready means
eligible for a future registry write gate only.

### UserAppTemplatePackage Registry Write Gate

Phase 10J adds a local registry write gate after Phase 10I registry
preparation validation. `src/template-engine/userAppTemplatePackageRegistryWriteGate.ts`
checks source preparation validation readiness, registry entry preview
presence, package id/version candidates, draft-only flags, publish-blocked
flags, registry-write-blocked flags, trace preservation, raw image boundaries,
personal data boundaries, medical/product claim boundaries, unsupported final
claims, no actual registry write, no User App Shell package replacement, no
production markers, User App contract boundary safety, and JSON round-trip
stability.

`userAppTemplatePackageRegistryWriteGateHandoff.ts` creates local next actions
for a future controlled registry writer, metadata/version/privacy/shell
boundary review, preview-only retention, or blocking.

`src/components/template-studio/UserAppTemplatePackageRegistryWriteGatePanel.tsx`
renders the Template Workbench write gate, blocked reasons, trace, and handoff
summary. The panel does not appear in Vision Analysis and does not write a
registry, publish, replace the current User App Shell package, call backend/API
services, use camera/AR, train models, or mark production readiness. Gate ready
means eligible for a future controlled registry writer only.

### Real Registry Write Implementation Gate

Phase 10N adds a local implementation gate after Phase 10M controlled execution
validation. `src/template-engine/realRegistryWriteImplementationGate.ts` checks
source execution validation readiness, dry-run-only, actual-write-blocked,
publish-blocked, package-replacement-blocked, audit plan, rollback design,
write lock requirements, owner authorization trace, future explicit approval,
trace preservation, unsafe marker boundaries, no actual registry write, no User
App Shell package replacement, no production writer/package marker, and JSON
round-trip stability.

`realRegistryWriteImplementationChecklist.ts` records administrator
confirmations that 10N remains gate-only and dry-run-only, with no write,
publish, package replacement, production writer, or bypass of future owner
approval. `realRegistryWriteImplementationHandoff.ts` creates local next
actions for a future real implementation draft, focused revision, review, or
blocking.

`src/components/template-studio/RealRegistryWriteImplementationGatePanel.tsx`
renders the Template Workbench gate, checklist, blocked reasons, and handoff
summary. The panel does not appear in Vision Analysis and does not implement or
execute a registry writer, write a registry, publish, replace the current User
App Shell package, call backend/API services, use camera/AR, train models, or
mark production readiness. Gate ready means eligible for a future implementation
draft only.

### Real Registry Write Implementation Draft

Phase 10O adds a local implementation draft after Phase 10N implementation gate.
`src/template-engine/realRegistryWriteImplementationDraft.ts` creates a
writer interface draft, transaction draft, write lock draft, audit event draft,
rollback command draft, warnings, blocked reasons, trace, and draft status while
preserving dry-run-only, actual-write-blocked, publish-blocked,
package-replacement-blocked, production-writer-blocked, no actual registry
write, no User App Shell package replacement, no production marker, and JSON
round-trip boundaries.

`realRegistryWriteImplementationDraftValidation.ts` validates source gate
readiness, required safety flags, required draft sections, trace preservation,
unsafe marker boundaries, and JSON round-trip stability.
`realRegistryWriteImplementationDraftHandoff.ts` creates local next actions for
a future final real write review gate, focused draft revisions, owner
authorization review, draft-only retention, or blocking.

`src/components/template-studio/RealRegistryWriteImplementationDraftPanel.tsx`
renders the Template Workbench implementation draft, validation, blocked
reasons, writer interface, transaction, write lock, audit event, rollback
command, and handoff summary. The panel does not appear in Vision Analysis and
does not create a production writer, execute registry writes, publish, replace
the current User App Shell package, call backend/API services, use camera/AR,
train models, or mark production readiness. Draft ready means eligible for a
future final real write review gate only.
