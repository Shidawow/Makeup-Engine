# Data Flow

## Main Flow

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
-> User App Shell
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
-> Template Content QA / Trial Template Selection / Trial Content Readiness
-> MVP Release Readiness Gate / Trial Go-No-Go
-> Internal Trial Operations / Observation Template / Outcome Review
-> Internal Trial Result Review / Issue Taxonomy / Decision Framework
-> Internal Trial Iteration Plan / Backlog / Priority Framework
-> Internal Trial Learning Summary / Product Decision Gate / Next Phase Recommendation
-> Anonymous Internal Trial Follow-up Iteration / Gap Action Plan / Follow-up Readiness
-> Phase 8 Roadmap / V1 Non-Goals
-> User App Consumption Manifest
-> Dataset Review
-> MaterializedTrainingDataset
-> Lightweight Model
-> Export Package
```

## Stage Notes

- `Real Photo`: admin-provided local source image.
- `SourceImagePackage`: import result with manifest, artifacts, quality reports, checksums, and quarantine.
- `SourceImageManifest`: package-level reference document for source image entries and artifact locations.
- `SourceImageEntry`: normalized source image record that can become ready, blocked, or failed.
- `SourceImageArtifactBinding`: explicit operator binding from a source image entry to selected browser-readable artifacts.
- `BrowserArtifactResource`: temporary browser runtime resource such as a `blob:` object URL or validated image data boundary.
- `TemplateAnalysisSeed`: bridge from ready source image entries into analysis.
- `TemplateProductionBatch / TemplateProductionTask`: local administrator queue that tracks seed readiness, analysis, mask review, evidence, and review/publish lifecycle.
- `Production QA Report`: deterministic operator diagnostics for missing binding, blocked images, analysis status, evidence status, reject reasons, publish confirmation, and rebinding recovery.
- `Vision Analysis`: local CV and rule-based analysis.
- `Editable Masks`: generated and human-editable mask artifacts.
- `Human Correction`: correction records produced by human review and mask editing.
- `Template Evidence`: structured evidence supporting extracted template decisions.
- `Template Review`: local approval/rejection/publish lifecycle for a production task.
- `Template Library Entry`: formal local library asset derived from an approved or locally published production task, with version, lineage, evidence, quality, and local lifecycle state.
- `Template Publish Package`: local export package for downstream template consumers. It includes template JSON, evidence summary, source lineage, compatibility metadata, checksums, and local-only disclaimers.
- `UserAppTemplatePackage`: local/export consumption contract for a future user app. It includes app-facing makeup steps, region instructions, tool and product suggestions, style tags, duration, difficulty, evidence references, compatibility target, and lineage.
- `User App Prototype Contract Consumer`: read-only admin preview that proves the package can drive app-facing template list, detail, step guidance, region instructions, tools, products, and contract validation without building the real user app.
- `User App Shell`: Phase 7A local MVP shell that consumes `UserAppTemplatePackage` for user-facing list/detail/guidance, region instructions, tools/products, compatibility, and local progress. It is not a production app.
- `Step Guidance UX Hardening`: Phase 7B user-facing layer over the local shell. It improves step summaries, detailed instructions, tool/product checklists, region guidance, warning messages, blocked reasons, next actions, and small-screen layout without adding backend, camera, AR, training, native iOS, or online publication.
- `User Photo Intake Placeholder / Personalization Boundary`: Phase 7C placeholder layer for future user photo and personalization work. It shows disabled future photo/camera controls, privacy copy, and non-sensitive display hints without collecting, uploading, analyzing, storing, or training on user photos.
- `User App Local Preferences / Onboarding`: Phase 7D local-only layer for optional onboarding and non-sensitive preferences. It creates display-only guidance hints without modifying `UserAppTemplatePackage`, syncing to backend/cloud, creating accounts, collecting photos, or creating training input.
- `User App Template Discovery / Recommendation Placeholder`: Phase 7E local-only layer for deterministic discovery filters and rule-based recommendation placeholder ranking. It uses `UserAppTemplatePackage` plus non-sensitive local preferences only.
- `User App Session Persistence / Local State Hardening`: Phase 7F local-only layer for selected template, active step, progress ids, onboarding summary, non-sensitive preferences, discovery filters, sort mode, last visited section, storage sanitization, recovery, and privacy boundary validation.
- `User App Mobile QA / App Readiness Gate`: Phase 7G local-only layer for deterministic mobile interaction QA and app prototype readiness reports over the existing shell.
- `Browser / Mobile QA Harness`: Phase 7H local-only layer for HTTP smoke, critical copy, privacy copy, Chinese copy, and forbidden-token checks over the local shell.
- `Product Route Decision / App MVP Plan`: Phase 8A planning layer that selects React Web / PWA MVP first, defines MVP scope, records V1 non-goals, and separates future user app ownership from Makeup Engine.
- `PWA / Mobile Web MVP Polish`: Phase 8B local shell polish layer for manifest metadata, lightweight icon placeholder, PWA readiness, MVP polish readiness, mobile home, Chinese user copy, and separated administrator QA surfaces.
- `User App MVP Trial Pack`: Phase 8C local trial planning layer for ordered user tasks, feedback questionnaire, mock/example feedback summary, and trial readiness checks. It is not a backend form, production release, App Store/TestFlight test, analytics flow, real user record store, or training data source.
- `Template Content QA / Trial Template Selection / Trial Content Readiness`: Phase 8D local content QA layer for template copy, step actionability, region instructions, tools/products, recommendation reasons, trial-ready template selection, and integrated content readiness. It is not production release approval, AI content generation, backend readiness, OpenAI/external API usage, camera/AR readiness, real user record storage, or training data.
- `MVP Release Readiness Gate / Trial Go-No-Go`: Phase 8E local gate layer that summarizes 8A-8D evidence and decides go, go with warnings, or no-go for internal trial preparation only. It is not production release approval, App Store/TestFlight readiness, backend readiness, camera/AR readiness, analytics readiness, AI generation approval, OpenAI/external API approval, real user record storage, or training data.
- `Internal Trial Operations / Observation Template / Outcome Review`: Phase 9A local operations layer for broad participant type planning, session checklist, anonymous observation signals, and outcome recommendations. It is not public recruitment, production release, App Store/TestFlight readiness, backend form, analytics readiness, camera/AR readiness, AI analysis, OpenAI/external API usage, real user record storage, or training data.
- `Internal Trial Result Review / Issue Taxonomy / Decision Framework`: Phase 9B local review layer for anonymous/mock result signals, issue category/severity/actionability, and next-step decisions. It is not production analytics, backend collection, public recruitment, AI analysis, OpenAI/external API usage, real user record storage, or training data.
- `Internal Trial Iteration Plan / Backlog / Priority Framework`: Phase 9C local planning layer for turning anonymous/mock review results into next-iteration workstreams, backlog items, priorities, risks, and acceptance criteria. It is not a formal production roadmap, backend issue tracker, production analytics, public recruitment, AI analysis, OpenAI/external API usage, real user record storage, or training data.
- `Internal Trial Learning Summary / Product Decision Gate / Next Phase Recommendation`: Phase 9D local decision layer for summarizing 9A-9C anonymous/mock learnings and recommending Phase 9E, 10A, 10B, DOC-ILLUSTRATED, or 9D-Fix. It is not production analytics, production app approval, backend collection, AI analysis, real user record storage, or training data.
- `Anonymous Internal Trial Follow-up Iteration / Gap Action Plan / Follow-up Readiness`: Phase 9J local planning layer for converting 9I evidence review outputs into conservative next actions, P0/P1/P2/P3/no-action gap priorities, and follow-up readiness decisions. It is not production roadmap approval, production analytics, backend collection, AI analysis, real user record storage, MVP validation approval, or training data.
- `Phase 8 Roadmap / V1 Non-Goals`: planning docs for 8A through 8E and the anti-scope list for login, backend, database, camera, AR, native apps, OpenAI API, ecommerce, community, paid features, and training.
- `User App Consumption Manifest`: handoff manifest with app template entries, versions, compatibility target, checksums, readiness, and local-only disclaimer.
- `Dataset Review`: explicit review decisions before data becomes training-ready.
- `MaterializedTrainingDataset`: reviewed dataset with splits, masks, image references, checksums, and audit reports.
- `Lightweight Model`: deterministic local lightweight model output.
- `Export Package`: packaged model and runtime metadata for downstream use.

## Boundary Rule

`SourceImagePackage` cannot bypass artifact binding, mask correction, evidence, template review, dataset review, accepted/training-ready filtering, or quality gate to become `MaterializedTrainingDataset`. Browser artifact binding is an explicit runtime bridge, not a shortcut around review or training boundaries.

`TemplateProductionBatch` local `published` means only local admin workflow state. It is not online publication and does not create a training dataset.

`TemplateLibrary` local `local_published` is also local-only. It does not upload to a backend, publish online, or create a training dataset. `SourceImagePackage` cannot directly become a `TemplateLibraryEntry`; it must pass through artifact binding, analysis seed, production task, evidence, QA, and review lifecycle.

`TemplatePublishPackage` cannot contain object URLs, local absolute paths, large image bytes, or React state. Asset references must be durable artifact references or package metadata, not temporary browser resources.

`UserAppTemplatePackage` and `UserAppConsumptionManifest` are also local/export contracts. They cannot contain object URLs, local absolute paths, large image bytes, or React state, and they do not build or publish the user-facing app.

`User App Prototype Contract Consumer` is a read-only validation layer over `UserAppTemplatePackage`. It cannot become a durable app state store, cannot publish online, cannot train a model, and cannot bypass app contract validation.

`User App Shell` is a local prototype consumer over `UserAppTemplatePackage`. It cannot read `SourceImagePackage` directly, cannot publish online, cannot call a backend, cannot use camera or AR, cannot train a model, and cannot persist object URLs, local absolute paths, large image bytes, or React state as durable export data.

`User App MVP Trial Pack` is a local administrator planning layer over the polished shell. It cannot collect real names, contact information, photos, health information, sensitive identity information, face embeddings, biometric identifiers, backend records, analytics records, or training data. Trial tasks, feedback, readiness, sessions, preferences, and recommendations cannot mutate `UserAppTemplatePackage` or write real user trial records into `project-state`.

`Template Content QA / Trial Template Selection / Trial Content Readiness` is a local administrator content QA layer over `UserAppTemplatePackage`. It can identify trial-ready, backup warning, and blocked templates, but it cannot mutate `UserAppTemplatePackage`, call OpenAI/external APIs, generate AI content, collect user photos, write real user trial records into `project-state`, or create training input.

`MVP Release Readiness Gate / Trial Go-No-Go` is a local administrator gate over Phase 8A-8D evidence. It can decide whether to prepare an internal small-scope trial, but it cannot approve production release, mutate `UserAppTemplatePackage`, call backend/analytics/camera/AR/OpenAI/external APIs, collect photos, write real user trial records into `project-state`, or create training input.

`Internal Trial Operations / Observation Template / Outcome Review` is a local administrator operations layer over Phase 8C-8E trial readiness evidence. It can define participant types, session flow, anonymous observation signals, and outcome recommendations, but it cannot recruit publicly, collect real names, contact information, photos, health information, sensitive identity information, biometrics, backend records, analytics records, write real participant records into `project-state`, mutate `UserAppTemplatePackage`, or create training input.

`Internal Trial Result Review / Issue Taxonomy / Decision Framework` is a local administrator review layer over anonymous/mock Phase 9A-style trial signals. It can classify issue categories, severity, actionability, and next-step decisions, but it cannot collect real names, contact information, photos, health information, sensitive identity information, biometrics, backend records, analytics records, use AI analysis, write real participant records into `project-state`, mutate `UserAppTemplatePackage`, or create training input.

`Internal Trial Iteration Plan / Backlog / Priority Framework` is a local administrator planning layer over anonymous/mock Phase 9B-style review outputs. It can create workstreams, backlog items, priorities, risks, blocked reasons, and acceptance criteria, but it cannot become a formal production roadmap, backend issue tracker, analytics system, AI analysis system, real participant record store, training input, or production release approval. It cannot mutate `UserAppTemplatePackage`.

`Internal Trial Learning Summary / Product Decision Gate / Next Phase Recommendation` is a local administrator decision layer over anonymous/mock Phase 9A-9C outputs. It can summarize learning themes, decide continue/revise/pause/MVP validation planning, and recommend the next phase, but it cannot approve production app development, create backend records, use AI analysis, collect real participant data, write real user records into `project-state`, or create training input. It cannot mutate `UserAppTemplatePackage`.

Phase 6L-1 adds a QA loop inside this read-only layer:

```text
UserAppTemplatePackage
-> JSON round-trip check
-> Prototype readiness checks
-> Empty / warning / blocked diagnostics
-> Operator-visible next action
-> App MVP shell readiness decision
```

This QA loop does not create a new data source. It only validates the existing consumption contract before a future App MVP shell reads it.

Phase 7A adds the shell consumption layer:

```text
UserAppTemplatePackage
-> User App Shell view model
-> Template cards
-> Selected template detail
-> Current makeup step
-> Region instruction view
-> Tool / product panel
-> Local progress
-> Compatibility banner
```

Phase 7B hardens the step guidance layer:

```text
UserAppTemplatePackage
-> User App Shell view model
-> Step Guidance View Model
-> Friendly warning / blocked messages
-> Region guidance summary
-> Tool / product checklist
-> Local progress controls
```

Phase 7C adds the future personalization boundary without creating a new durable data source:

```text
User App Shell
-> Photo Intake Placeholder
-> Personalization Placeholder
-> Privacy Notice
-> Guidance remains UserAppTemplatePackage-driven
```

User photo placeholders cannot contain object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo bytes, face embeddings, biometric identifiers, training input markers, or persistent photo references. `SourceImagePackage` cannot feed user photo intake directly.

Phase 7D adds local onboarding and preference hints without creating a durable user profile:

```text
User App Shell
-> Local Onboarding
-> Local Preferences
-> Guidance Hints
-> Step Guidance Display
```

Preferences can affect display hints only. They cannot mutate `UserAppTemplatePackage`, enter training datasets, write user preference records into `project-state`, sync to a backend, or become sensitive profile storage.

Phase 7E adds local discovery and recommendation placeholders without creating an AI recommender or durable user profile:

```text
UserAppTemplatePackage
-> Local Preferences
-> Template Discovery Filters
-> Rule-based Recommendation Placeholder
-> User-friendly Recommendation Reasons
-> Template Selection
```

Recommendations can affect display order and reasons only. They cannot mutate `UserAppTemplatePackage`, call OpenAI or external recommendation APIs, enter training datasets, write recommendation results as real user records into `project-state`, sync to backend/cloud, create analytics, or become advertising/ecommerce recommendations.

Phase 7F adds local session persistence without creating accounts, backend state, or durable sensitive profile storage:

```text
User App Shell
-> Local Session Snapshot
-> Session Storage Sanitization
-> Session Recovery
-> Clear Local State
```

Session persistence can affect local UI continuity only. It cannot mutate `UserAppTemplatePackage`, store photos, object URLs, local paths, image bytes, base64 images, biometrics, sensitive profile fields, React state, recommendation result records, or training input. `project-state` can document session boundaries, but it cannot store real user session records.

Phase 7G adds mobile QA and readiness gating without creating a production app:

```text
User App Shell
-> Mobile QA Checklist
-> App Readiness Report
-> Readiness Gate
-> Product QA next action
```

Readiness can affect local QA decisions only. It cannot mutate `UserAppTemplatePackage`, write real user records into `project-state`, store photos, object URLs, local paths, image bytes, base64 images, biometrics, sensitive profile fields, React state, recommendation records, or training input. It is not production release approval and does not replace future real browser/device QA.

Phase 7H adds local browser/mobile QA harness coverage without creating a production app:

```text
User App Shell
-> Browser / Mobile QA Report
-> HTTP Smoke
-> Critical Path Copy Checks
-> Mobile Viewport Readiness
-> Privacy / Chinese Copy Checks
```

The harness can document local prototype readiness only. It cannot mutate `UserAppTemplatePackage`, persist real user records, collect photos, call camera APIs, call external APIs, train models, or certify production release readiness.

Phase 8A adds a product route decision without creating a production app:

```text
Phase 7H QA Evidence
-> React Web / PWA MVP First Route Decision
-> MVP Scope / V1 Non-Goals
-> Ownership Boundary
-> Phase 8B PWA / Mobile Web MVP Polish
```

Route planning can document product direction only. It cannot bootstrap a production app, mutate `UserAppTemplatePackage`, write user records into `project-state`, call backend/cloud/API services, collect photos, add analytics, train models, add ecommerce/community/paid scope, start React Native/Flutter/iOS native work, or certify release readiness.

Phase 8B adds PWA/mobile polish without creating a production app:

```text
User App Shell
-> Mobile Home
-> PWA Manifest Metadata
-> PWA Readiness Report
-> MVP Polish Readiness Report
-> Admin QA Separation
-> Phase 8C Trial Pack Recommendation
```

PWA/mobile polish can improve local UI, metadata, and readiness checks only. It cannot add service worker, offline cache, push notification, background sync, install tracking, analytics, backend, database, accounts, camera, AR, OpenAI/external APIs, training, native apps, online publication, app store release work, or new runtime dependencies. It cannot mutate `UserAppTemplatePackage` or write real user records into `project-state`.

Phase 8E adds MVP release readiness and trial go/no-go without creating a production app:

```text
8A Route Decision
-> 8B PWA / Mobile Polish
-> 8C Trial Pack
-> 8D Content QA
-> MVP Release Readiness Report
-> Trial Go / No-Go Decision
-> Phase 9A Internal Trial Operations Pack
-> Phase 9B Internal Trial Result Review
-> Phase 9C Internal Trial Iteration Plan
```

Release readiness can decide internal trial preparation only. It cannot add production release, App Store/TestFlight, backend, database, accounts, analytics, camera, AR, AI generation, OpenAI/external APIs, training, native apps, online publication, service worker, offline cache, push notification, background sync, install tracking, or real user data collection.

## Phase 9E Internal Trial Evidence Flow

`UserAppInternalTrialOpsPack` / `UserAppTrialResultReview` / `UserAppTrialIterationPlan` / `UserAppInternalTrialLearningSummary` / `UserAppProductDecisionGate`
-> `UserAppInternalTrialEvidencePack`
-> `UserAppTrialEvidenceSummary`
-> `UserAppEvidenceSufficiencyGate`
-> next recommendation for Phase 9F or future MVP validation planning.

The flow is local, anonymous/mock/example-only, and cannot write real user records into project-state, backend systems, analytics systems, AI analysis systems, or training datasets.

## Phase 9F Internal Trial Evidence Collection Preparation Flow

`UserAppEvidenceSufficiencyGate`
-> `UserAppEvidenceCollectionProtocol`
-> `UserAppEvidenceCollectionChecklist`
-> `UserAppEvidenceCollectionQualityGate`
-> next recommendation for Phase 9G anonymous internal dry run pack.

The flow is local, anonymous, and preparation-only. It can define allowed evidence, forbidden data, anonymization rules, participant notice, stop conditions, checklist items, and quality decisions. It cannot collect real user records, photos, contact information, health information, sensitive identity information, biometrics, backend records, analytics records, AI analysis records, uploads, or training data.

## Phase 9G Anonymous Internal Trial Dry Run Flow

`UserAppEvidenceCollectionQualityGate`
-> `UserAppAnonymousTrialDryRunPack`
-> `UserAppAnonymousTrialDryRunChecklist`
-> `UserAppAnonymousTrialDryRunReview`
-> next recommendation for Phase 9H anonymous internal trial launch pack.

The flow is local, anonymous, mock/rehearsal-only, and administrator-only. It can rehearse participant notice, user shell task flow, allowed anonymous observations, forbidden data handling, stop conditions, and review decisions. It cannot launch a real trial, collect real user records, collect photos, collect contact information, collect health information, collect sensitive identity information, collect biometrics, create backend records, create analytics records, run AI analysis, upload data, or write training data.

## Phase 9H Anonymous Internal Trial Launch Flow

`UserAppAnonymousTrialDryRunReview`
-> `UserAppAnonymousTrialLaunchPack`
-> `UserAppAnonymousTrialLaunchReadiness`
-> `UserAppAnonymousTrialPostLaunchHandoff`
-> next recommendation for Phase 9I anonymous internal trial evidence review.

The flow is local, anonymous, internal, non-public, and administrator-only. It can prepare a participant notice, administrator launch script, anonymous evidence capture sheet, stop conditions, readiness decision, and post-launch handoff template. It cannot create public recruitment, production launch, backend records, analytics records, AI analysis records, uploads, training data, photos, contact data, health data, sensitive identity data, biometrics, or real user trial records in project-state.

## Phase 9I Anonymous Internal Trial Evidence Review Flow

`UserAppAnonymousTrialPostLaunchHandoff`
-> `UserAppAnonymousTrialEvidenceReview`
-> `UserAppAnonymousTrialEvidenceGapReview`
-> `UserAppAnonymousTrialDecisionInput`
-> next recommendation for Phase 9J anonymous internal trial follow-up iteration.

The flow is local, anonymous, post-trial review-only, and administrator-only. It can review evidence completeness, evidence gaps, privacy incidents, stopped or paused sessions, learning signals, and decision inputs. It cannot create production analytics, backend records, AI analysis records, uploads, training data, photos, contact data, health data, sensitive identity data, biometrics, MVP validation approval, production app approval, production release approval, or real user trial records in project-state.
