# Boundaries And Guardrails

## Required Guardrails

- `SourceImagePackage` cannot directly become a training dataset.
- SourceImagePackage cannot bypass correction, review queue, or quality gate.
- `SourceImagePackage` cannot bypass mask generation.
- `SourceImagePackage` cannot bypass human correction.
- `SourceImagePackage` cannot bypass review queue.
- UI state cannot directly train a model.
- Unreviewed correction data cannot enter training-ready materialization.
- Review queue decisions cannot be skipped.
- Source image quality gates cannot be skipped.
- Quarantine state cannot be ignored for blocked source images.
- Manifest paths are references, not browser-readable files.
- Only operator-selected files can become browser-readable `BrowserArtifactResource` values.
- Browser object URLs are temporary runtime resources.
- Session restore can invalidate `BrowserArtifactResource`; ready tasks must be marked for rebinding instead of pretending they can still run analysis.
- Local absolute paths must not be persisted in session state.
- Large image bytes must not be stored in session state.
- raw RGBA is currently summary-only.
- Production batch publish is a local lifecycle state, not backend publication.
- Production task `training-ready` does not exist in the production status machine.
- Reject requires a fixed taxonomy reason.
- Publish requires explicit local confirmation and cannot happen for rejected tasks.
- `SourceImagePackage` cannot directly become a `TemplateLibraryEntry`.
- `TemplateLibraryEntry` must be derived from an approved or locally published production task.
- Template Library `local_published` is local-only and is not online publication.
- Template Publish Package is a local/export package, not a backend upload.
- Template Publish Package must not contain object URLs, local absolute paths, large image bytes, or React state.
- `UserAppTemplatePackage` is a local/export consumption contract, not a real user app and not online publication.
- User app consumption exports must not contain object URLs, local absolute paths, large image bytes, or React state.
- The User App Prototype Contract Consumer is read-only admin validation, not a real app, backend service, online release, or training input.
- Prototype consumer view models must be derived from `UserAppTemplatePackage`; `SourceImagePackage` cannot feed them directly.
- Prototype consumer QA can report empty, warning, blocked, and round-trip states, but it cannot repair packages by bypassing publish-package or app-contract validation.
- Prototype consumer JSON round-trip checks are local contract stability checks, not durable app storage, backend upload, online publication, or training data.
- The Phase 7A User App MVP Shell is local contract-driven prototype behavior, not a production app, backend service, online release, native iOS app, camera flow, AR flow, or training input.
- User App Shell view models must be derived from `UserAppTemplatePackage`; `SourceImagePackage` cannot feed them directly.
- User App Shell local progress is local UI state only and cannot become durable export data or training data.
- Blocked `UserAppTemplatePackage` inputs cannot enter step guide.
- Phase 7B step guidance UX hardening is local shell polish only and cannot add backend, database, account, camera, AR, native iOS, online publication, training, external APIs, or unapproved runtime dependencies.
- User-friendly warning and blocked messages do not repair invalid packages; they only explain why guidance can continue, warn, or stop.
- Phase 7C user photo intake is placeholder-only and cannot add real camera capture, upload, file input, image preview, AR, face tracking, backend, database, native iOS, training, external APIs, or unapproved runtime dependencies.
- User photo placeholder state cannot contain object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo bytes, face embeddings, biometric identifiers, training input markers, or persistent photo references.
- User photo data and personalization profile data cannot enter durable exports, template packages, user app consumption manifests, handoff JSON, project-state, training datasets, or model artifacts.
- Personalization placeholders can affect display hints only and cannot mutate `UserAppTemplatePackage`, modify templates, infer sensitive attributes, export user profiles, or create training data.
- Phase 7D onboarding is optional and local-only; it cannot become account onboarding, backend sync, cloud sync, database persistence, analytics, production profile storage, or training input.
- Phase 7D preferences must remain non-sensitive local UI state and cannot contain user photos, object URLs, local absolute paths, base64 images, image/photo bytes, face embeddings, biometric identifiers, health information, sensitive identity fields, or training input markers.
- Phase 7D preferences can affect guidance hints only and cannot mutate `UserAppTemplatePackage`, write templates, enter training datasets, or write user preference records into `project-state`.
- Phase 7D must not add login, account systems, backend, database, cloud sync, real camera capture, user photo upload, AR, OpenAI API, external CV API, training, native iOS scope, online publication, or new runtime dependencies.
- Phase 7E recommendation is placeholder-only, local-only, rule-based, deterministic, and explainable; it is not real AI recommendation, backend personalization, analytics, advertising, ecommerce, or user profiling.
- Phase 7E recommendations can use only `UserAppTemplatePackage` metadata and non-sensitive local preferences.
- Phase 7E recommendations cannot mutate `UserAppTemplatePackage`, write templates, call OpenAI or external recommendation APIs, enter training datasets, sync to backend/cloud, or write real user recommendation records into `project-state`.
- Blocked templates cannot enter recommendation lists; warning templates can appear only with visible warning copy.
- Phase 7F session persistence is local-only shell behavior and cannot become an account system, backend session service, cloud sync, database persistence, analytics, production app storage, or cross-device sync.
- Phase 7F session snapshots can store only selected template id, active step id, current template progress ids, onboarding summary, non-sensitive preferences, discovery filters, sort mode, last visited section, and dismissed local warning ids.
- Phase 7F session snapshots cannot store user photos, object URLs, local absolute paths, base64 image data, image/photo bytes, face embeddings, biometric identifiers, health information, sensitive identity fields, React state, function values, class instances, recommendation result records, training input, or training dataset markers.
- Phase 7F session recovery must reconcile against the current `UserAppTemplatePackage` without mutating it.
- Phase 7F project-state updates can document session boundaries and validation status, but cannot store real user session records.
- Phase 7G app readiness gate is required before treating the local User App Shell as ready for app prototype QA.
- Phase 7G app readiness gate is not a production app, native iOS implementation, backend readiness, app store readiness, camera readiness, AR readiness, training readiness, or online release approval.
- Phase 7G mobile interaction QA is required before the next browser/device QA phase, but it is deterministic checklist readiness and not a substitute for real device or browser pointer QA.
- Phase 7G readiness and mobile QA must not add backend, database, accounts, cloud sync, analytics, camera, AR, training, OpenAI API, external API calls, native iOS scope, online publication, or new runtime dependencies.
- Phase 7G readiness reports cannot mutate `UserAppTemplatePackage` and cannot persist photos, object URLs, local paths, base64 images, image/photo bytes, face embeddings, biometric identifiers, sensitive profile fields, React state, recommendation records, or training input.
- Phase 7H browser/mobile QA is local deterministic prototype QA and is not production release approval, app store readiness, native iOS QA, real device lab QA, Playwright pointer/canvas/screenshot QA, backend readiness, camera readiness, AR readiness, or training readiness.
- Phase 7H browser/mobile QA must not add backend, database, accounts, cloud sync, analytics, camera, AR, training, OpenAI API, external API calls, native iOS scope, online publication, or new runtime dependencies.
- Phase 7H browser/mobile QA reports cannot mutate `UserAppTemplatePackage` and cannot persist photos, temporary image URLs, local paths, encoded image data, image/photo bytes, biometrics, sensitive profile fields, React state, recommendation records, readiness records, browser QA records, or training input.
- Phase 8A is product route and ownership planning only; it must not implement the production user app.
- Phase 8A selects React Web / PWA MVP first, but that decision is not a Web app implementation, deployment, backend, analytics surface, online release, native app implementation, camera flow, AR flow, ecommerce, community, paid feature, OpenAI API, external API, or training phase.
- Future production user-facing app work must be planned as a separate app surface or repository after an explicit phase gate; Makeup Engine remains the template production system.
- Phase 8A route planning must keep `UserAppTemplatePackage` as the handoff contract and cannot mutate package data, templates, shell state, training data, or project-state user records.
- Phase 8A must not add backend, database, accounts, analytics, camera, AR, OpenAI API, external API, training, native iOS implementation, online publication, production app code, or new runtime dependencies.
- Phase 8A must not add React Native, Flutter, ecommerce, community, paid features, App Store release work, TestFlight work, real photo capture, model training, or separate repository bootstrap.
- Phase 8B PWA/mobile polish is local shell polish only and is not production PWA release approval.
- Phase 8B may add manifest metadata, lightweight icon placeholder, PWA readiness, MVP polish readiness, and mobile UI polish only.
- Phase 8B must not add service worker, offline cache, push notification, background sync, install tracking, analytics, backend, database, accounts, cloud sync, camera, AR, OpenAI API, external API, native app scope, ecommerce, community, paid features, online publication, app store release work, model training, or new runtime dependencies.
- Phase 8B readiness, QA, preferences, recommendations, sessions, and shell state cannot mutate `UserAppTemplatePackage`, write real user records into `project-state`, or enter training datasets.
- Phase 8C trial pack is local internal / small-scope trial planning only and is not production release, App Store/TestFlight, online user growth, backend form, analytics, camera, AR, training, or real user data collection approval.
- Phase 8C feedback must not collect real names, contact information, photos, health information, sensitive identity information, face embeddings, biometric identifiers, backend records, analytics records, or training data.
- Phase 8C trial tasks, feedback, readiness, sessions, preferences, recommendations, and admin panels cannot mutate `UserAppTemplatePackage`, write real user trial records into `project-state`, or enter training datasets.
- Phase 8D template content QA, trial template selection, and trial content readiness are local content QA only and are not production release, App Store/TestFlight, backend, analytics, AI generation, OpenAI/external API, camera, AR, or training approval.
- Phase 8D reports cannot mutate `UserAppTemplatePackage`, collect photos, write real user trial records into `project-state`, or enter training datasets.
- Phase 8E MVP release readiness and trial go/no-go are local gate decisions only and are not production release, App Store/TestFlight, backend readiness, analytics readiness, camera readiness, AR readiness, AI generation approval, OpenAI/external API approval, or training approval.
- Phase 8E `go_for_internal_trial` and `go_with_warnings` mean internal small-scope trial preparation only, not production ready.
- Phase 8E reports cannot mutate `UserAppTemplatePackage`, collect photos, write real user trial records into `project-state`, call backend/analytics/camera/AR/OpenAI/external APIs, or enter training datasets.
- Phase 9A internal trial operations, observation templates, and outcome review are local administrator preparation only and are not public recruitment, production release, App Store/TestFlight, backend forms, analytics, camera, AR, AI analysis, OpenAI/external API usage, or training approval.
- Phase 9A participant coverage uses broad participant types only and cannot collect real names, contact information, health information, sensitive identity information, photos, face embeddings, biometric identifiers, backend records, analytics records, or training data.
- Phase 9A operations, observation notes, outcome review, sessions, preferences, recommendations, and admin panels cannot mutate `UserAppTemplatePackage`, write real user records into `project-state`, or enter training datasets.
- Phase 9B internal trial result review, issue taxonomy, and decision framework are local administrator review aids only and are not production analytics, public recruitment, production release, App Store/TestFlight, backend forms, analytics, camera, AR, AI analysis, OpenAI/external API usage, or training approval.
- Phase 9B review signals are anonymous/mock/example summaries only and cannot collect real names, contact information, health information, sensitive identity information, photos, face embeddings, biometric identifiers, backend records, analytics records, or training data.
- Phase 9B result review, issue taxonomy, decision framework, sessions, preferences, recommendations, and admin panels cannot mutate `UserAppTemplatePackage`, write real user records into `project-state`, or enter training datasets.
- Phase 9C internal trial iteration plan, backlog, and priority framework are local administrator planning aids only and are not a formal production roadmap, backend issue tracker, production analytics, public recruitment, production release, App Store/TestFlight, backend forms, analytics, camera, AR, AI analysis, OpenAI/external API usage, or training approval.
- Phase 9C iteration inputs are anonymous/mock/example summaries only and cannot collect real names, contact information, health information, sensitive identity information, photos, face embeddings, biometric identifiers, backend records, analytics records, AI analysis records, or training data.
- Phase 9C iteration plan, backlog, priority framework, sessions, preferences, recommendations, and admin panels cannot mutate `UserAppTemplatePackage`, write real user records into `project-state`, or enter training datasets.
- Phase 9D internal trial learning summary, product decision gate, and next phase recommendation are local administrator decision aids only and are not production analytics, public recruitment, production release, App Store/TestFlight, backend forms, analytics, camera, AR, AI analysis, OpenAI/external API usage, training, production roadmap approval, or real user record collection approval.
- Phase 9D learning and decision inputs are anonymous/mock/example summaries only and cannot collect real names, contact information, health information, sensitive identity information, photos, face embeddings, biometric identifiers, backend records, analytics records, AI analysis records, or training data.
- Phase 9D decision gates and next phase recommendations cannot mutate `UserAppTemplatePackage`, write real user records into `project-state`, approve production app build work, or enter training datasets.
- A compatibility target such as `ios-app-v0` or `web-app-v0` describes intended consumers only; it does not create an iOS app, Web app, backend, or online release.
- Rejected, archived, or deprecated library entries must not enter publish packages by default.
- Legacy runtime areas no longer carry new mainline features.
- Phase 10A FaceMesh-driven makeup intelligence creates local candidate and
  draft artifacts only. It must not be treated as final makeup recognition,
  production user guidance, automatic template publishing, training data,
  backend analytics, OpenAI/external API output, camera capture, AR, or a
  mutation path for `UserAppTemplatePackage`.
- Local MediaPipe runtime assets under `public/mediapipe/**` are machine-local
  ignored assets and must not be staged or committed.

## Module Boundaries

- Import CLIs create source image packages.
- Template Studio may inspect source image package state, create analysis seeds, and manage production batches through supported storage boundaries.
- Vision analysis and mask editing generate evidence and correction inputs.
- Production QA reports diagnose readiness and operator next actions; they do not replace review.
- Template Library conversion reads reviewed production tasks; it does not read source image packages directly.
- Publish Package export reads validated library entries; it does not create backend publication.
- User app contract export reads validated publish packages; it does not implement the user app.
- Prototype consumer preview reads validated `UserAppTemplatePackage` data; it does not implement the user app.
- User App MVP Shell reads validated `UserAppTemplatePackage` data and renders a local shell; it does not become a production user app.
- Step guidance UX hardening reads the shell view model and contract validation results; it does not create new durable app data, camera data, AR state, backend records, or training data.
- Photo intake and personalization placeholders read local placeholder contracts only; they do not read real user photos, do not request camera permissions, do not call analysis runtimes, and do not persist user data.
- Local onboarding and preferences read only local shell state; they do not read `SourceImagePackage`, do not request camera permissions, do not create accounts, do not sync to a backend, and do not write user records into `project-state`.
- Template discovery and recommendation placeholders read `UserAppTemplatePackage` plus non-sensitive local preferences only; they do not read real photos, do not call recommendation services, do not create user profiles, and do not write recommendation records into `project-state`.
- Local session persistence reads User App Shell local state only; it does not create accounts, does not sync to backend/cloud, does not store real photos or sensitive profile data, and does not write user session records into `project-state`.
- App readiness and mobile QA read User App Shell local state and `UserAppTemplatePackage`-derived view models only; they do not create production app state, do not mutate packages, do not train models, and do not create durable user records.
- Browser/mobile QA reads the local User App Shell, source copy, and deterministic QA metadata only; it does not create production app state, does not mutate packages, does not train models, and does not create durable user records.
- Product route planning reads Phase 7H QA evidence and app contract documents only; it does not create production app state, app repository state, backend state, analytics, user records, camera/photo records, AR state, ecommerce/community/paid state, native app state, or training data.
- PWA/mobile polish reads the local shell, manifest metadata, and deterministic readiness models only; it does not create production app state, service worker state, backend state, analytics, user records, camera/photo records, AR state, native app state, or training data.
- Trial pack planning reads local shell readiness, PWA/MVP polish readiness, and mock/example feedback structures only; it does not create production app state, backend records, analytics records, real user trial records, camera/photo records, AR state, native app state, or training data.
- Template content QA reads `UserAppTemplatePackage` content and deterministic QA fixtures only; it does not create production app state, backend records, analytics records, AI-generated content, real user trial records, camera/photo records, AR state, native app state, or training data.
- MVP release readiness and trial go/no-go read Phase 8A-8D readiness evidence only; they do not create production app state, backend records, analytics records, AI-generated content, real user trial records, camera/photo records, AR state, native app state, or training data.
- Internal trial operations, observation templates, and outcome review read Phase 8C-8E readiness evidence and local mock/example summaries only; they do not create production app state, backend records, analytics records, real user participant records, camera/photo records, AR state, native app state, or training data.
- Internal trial result review, issue taxonomy, and decision framework read anonymous/mock trial result signals only; they do not create production app state, backend records, analytics records, real user participant records, camera/photo records, AR state, native app state, AI analysis state, or training data.
- Internal trial iteration plan, backlog, and priority framework read anonymous/mock review outputs only; they do not create production roadmap state, backend issue tracker records, analytics records, real user participant records, camera/photo records, AR state, native app state, AI analysis state, or training data.
- Internal trial learning summary, product decision gate, and next phase recommendation read anonymous/mock learning summaries only; they do not approve production app development, create backend records, analytics records, AI analysis records, real participant records, camera/photo records, AR state, native app state, or training data.
- Internal trial evidence collection protocol, checklist, and quality gate read anonymous/mock evidence preparation only; they do not collect real participant records, photos, contact information, health information, sensitive identity information, biometrics, backend records, analytics records, AI analysis records, camera/photo records, AR state, native app state, upload data, or training data.
- Anonymous internal trial dry run pack, checklist, and review read Phase 9F preparation outputs and anonymous/mock dry run rehearsal state only; they do not launch a real trial, collect real participant records, photos, contact information, health information, sensitive identity information, biometrics, backend records, analytics records, AI analysis records, camera/photo records, AR state, native app state, upload data, or training data.
- Anonymous internal trial evidence review, gap review, and decision input read anonymous post-launch handoff summaries only; they do not create production analytics, backend records, AI analysis records, real participant records, camera/photo records, AR state, native app state, upload data, training data, MVP validation approval, production app approval, or production release approval.
- Anonymous internal trial follow-up iteration, gap action plan, and follow-up readiness read anonymous evidence review outputs only; they do not create production roadmap approval, production analytics, backend records, AI analysis records, real participant records, camera/photo records, AR state, native app state, upload data, training data, MVP validation approval, production app approval, or production release approval.
- Dataset review decides whether corrected artifacts can become materialized training data.
- Training reads materialized datasets, not UI state and not raw source packages.
- Export reads validated model artifacts and export readiness metadata.

## External Boundaries

- No OpenAI API usage is required for current mainline behavior.
- MediaPipe assets may exist for local vision work, but Phase 7C/7D/7E/7F user-side placeholder, preference, discovery, recommendation, and session work does not send user photos, preferences, recommendations, or session inputs to MediaPipe or any face analysis runtime.
- PyTorch, TensorFlow, ONNX Runtime, backend services, and databases are not part of the current MVP foundation.

## Phase 9E Evidence Boundary

Phase 9E evidence pack, evidence summary, and sufficiency gate are local administrator decision aids only. They must not become production analytics, backend record collection, public recruitment, AI analysis, training, production app approval, production roadmap approval, or production release approval.

Evidence cannot include real names, contact information, photos, health information, sensitive identity information, face embeddings, biometric identifiers, backend records, analytics records, AI analysis records, upload requests, or training labels. Evidence cannot mutate `UserAppTemplatePackage` and cannot write real user trial records into project-state.

## Phase 9F Evidence Collection Preparation Boundary

Phase 9F protocol, checklist, and quality gate are local administrator preparation aids only. They must not become real data collection, public recruitment, backend record collection, production analytics, AI analysis, training, MVP validation approval, production app approval, production roadmap approval, or production release approval.

Evidence collection preparation cannot request or store real names, contact information, photos, health information, sensitive identity information, face embeddings, biometric identifiers, backend records, analytics records, AI analysis records, uploads, account credentials, payment information, or training labels. Preparation cannot mutate `UserAppTemplatePackage` and cannot write real user trial records into project-state.

## Phase 9G Anonymous Dry Run Boundary

Phase 9G dry run pack, checklist, and review are local administrator rehearsal aids only. They must not become real trial launch, public recruitment, backend record collection, production analytics, AI analysis, training, MVP validation approval, production app approval, production roadmap approval, or production release approval.

Dry run rehearsal cannot request or store real names, contact information, photos, health information, sensitive identity information, face embeddings, biometric identifiers, backend records, analytics records, AI analysis records, uploads, account credentials, payment information, or training labels. Dry run review cannot mutate `UserAppTemplatePackage` and cannot write real user trial records into project-state.

## Phase 9H Anonymous Internal Trial Launch Boundary

Phase 9H launch pack, launch readiness, and post-launch handoff are local administrator launch preparation aids only. They may prepare a small-scope anonymous internal trial, but they must not become public recruitment, production app launch, backend record collection, production analytics, AI analysis, training, MVP validation approval, production app approval, production roadmap approval, or production release approval.

Phase 9H may record only anonymous local observation summaries and aggregate handoff fields. It must not collect real names, contacts, photos, health information, sensitive identity information, biometric identifiers, face embeddings, camera data, uploaded images, backend records, analytics records, AI analysis records, training labels, or real user trial records in project-state.

## Phase 9I Anonymous Internal Trial Evidence Review Boundary

Phase 9I evidence review, gap review, and decision input are local administrator review aids only. They may review anonymous post-launch summaries, evidence completeness, evidence gaps, privacy incidents, stopped or paused sessions, learning signals, and next-step inputs, but they must not become production analytics, backend record collection, AI analysis, training, public recruitment, MVP validation approval, production app approval, production roadmap approval, or production release approval.

Phase 9I may use only anonymous local summaries and mock/example fixtures. It must not collect or store real names, contacts, photos, health information, sensitive identity information, biometric identifiers, face embeddings, camera data, uploaded images, backend records, analytics records, AI analysis records, training labels, or real user trial records in project-state.

## Phase 9J Anonymous Internal Trial Follow-up Iteration Boundary

Phase 9J follow-up iteration, gap action plan, and follow-up readiness are local
administrator planning aids only. They may convert anonymous evidence review
outputs into conservative next actions, but they must not become production
roadmap approval, production analytics, backend record collection, AI analysis,
training, public recruitment, MVP validation approval, production app approval,
or production release approval.

Phase 9J may use only anonymous local summaries and mock/example fixtures. It
must not collect or store real names, contacts, photos, health information,
sensitive identity information, biometric identifiers, face embeddings, camera
data, uploaded images, backend records, analytics records, AI analysis records,
training labels, upload data, or real user trial records in project-state.

## Phase 10B Template Draft Review Boundary

Phase 10B draft QA, human review, review queue, workflow stepper, and candidate
handoff are local administrator aids only. They must not become final makeup
recognition, automatic publishing, backend workflow, AI approval, production
user app behavior, training approval, or App Store/TestFlight readiness.

Vision Analysis owns image understanding, FaceMesh runtime state, overlay/mask,
region QA, image quality, MediaPipe missing-assets recovery, mock fallback, and
readiness to enter Template Workbench.

Template Workbench owns candidate attributes, generated step drafts, template
drafts, draft QA, human review checklist, decisions, revision/rejection/blocking,
and candidate handoff.

Approve means template library candidate only. It cannot publish, cannot write a
formal template library entry by itself, cannot generate `UserAppTemplatePackage`,
cannot call OpenAI/external AI/CV APIs, cannot train models, and cannot persist
real user data.

## Phase 10C Template Library Candidate Packaging Boundary

Phase 10C candidate package, validation, and handoff are local administrator
packaging aids only. They must not become published templates, formal Template
Library writes, backend records, production app behavior, AI approval, training
approval, or App Store/TestFlight readiness.

Candidate packages can preserve QA trace, human review trace, reviewed
candidate attributes, reviewed draft steps, privacy trace, warnings, and
blocked reasons. They cannot contain image bytes, base64, object URLs, local
image paths, real personal data, health data, contact data, biometric data,
MediaPipe runtime assets, product shade claims, medical claims, unsupported
final claims, or `UserAppTemplatePackage` mutation markers.

Candidate handoff can recommend candidate library review, copy polish, region
fix, step revision, privacy review, example-only retention, or blocking. It
cannot publish, cannot write a formal library entry, and cannot generate
`UserAppTemplatePackage`.

## Phase 10D Candidate-to-App Package Contract Preparation Boundary

Phase 10D contract preparation, validation, mapping preview, and handoff are
local administrator aids only. They must not become formal
`UserAppTemplatePackage` generation, a user app package registry write, user app
publication, backend records, production app behavior, AI approval, training
approval, or App Store/TestFlight readiness.

Candidate-to-app preparation can preserve title, summary, style tags,
difficulty, estimated time, suitable scenarios, tools, product placeholders,
reviewed steps, region guidance, QA trace, human review trace, privacy trace,
and candidate lineage as preview mappings. It cannot contain raw image
references, base64, object URLs, local paths, MediaPipe runtime assets, real
personal data, health data, contact data, biometric data, product shade claims,
medical claims, unsupported final claims, or `UserAppTemplatePackage` mutation
markers.

Candidate-to-app handoff can recommend user app package draft preview, copy
polish, step revision, region guidance revision, privacy review,
template-library-candidate-only retention, or blocking. It cannot generate a
formal `UserAppTemplatePackage`, cannot publish to the user app, and cannot
write a user app package registry.

## Phase 10E User App Package Draft Preview Boundary

Phase 10E draft preview, validation, and handoff are local administrator aids
only. They must not become formal `UserAppTemplatePackage` generation, a user
app package registry write, user app publication, backend records, production
app behavior, AI approval, training approval, or App Store/TestFlight readiness.

User App Package Draft Preview can preserve title, summary, style tags,
difficulty, estimated time, suitable scenarios, tools, product placeholders,
step guidance, region guidance, privacy notice, QA trace, human review trace,
candidate trace, and 10D contract trace. It cannot contain raw image references,
base64, object URLs, local paths, MediaPipe runtime assets, real personal data,
health data, contact data, biometric data, product shade claims, medical claims,
unsupported final claims, automatic publish markers, registry write markers, or
`UserAppTemplatePackage` mutation markers.

User App Package Draft Preview handoff can recommend a later official user app
package draft gate, copy revision, step guidance revision, region guidance
revision, privacy notice revision, admin-preview-only retention, or blocking. It
cannot generate a formal `UserAppTemplatePackage`, cannot publish to the user
app, and cannot write a user app package registry.

## Phase 10F Official User App Package Draft Gate Boundary

Phase 10F official draft gate and handoff are local administrator aids only.
They must not become formal `UserAppTemplatePackage` generation, a user app
package registry write, user app publication, backend records, production app
behavior, AI approval, training approval, or App Store/TestFlight readiness.

Official User App Package Draft Gate can decide whether a Phase 10E draft
preview is eligible for a future builder. It checks source preview validation,
user-facing title and summary, step guidance, region guidance, tools checklist,
privacy notice, QA trace, human review trace, candidate trace, contract trace,
raw image boundaries, personal data boundaries, medical claims, product shade
claims, unsupported final claims, registry writes, automatic publishing, formal
`UserAppTemplatePackage` mutation, and JSON round-trip stability.

Gate handoff can recommend a future official draft builder, user-facing copy
revision, step guidance revision, region guidance revision, privacy review,
preview-only retention, or blocking. It cannot generate a formal
`UserAppTemplatePackage`, cannot publish to the user app, and cannot write a
user app package registry.

## Phase 10G Official UserAppTemplatePackage Draft Builder Boundary

Phase 10G official draft builder, validation, and handoff are local
administrator aids only. Draft ready means eligible for a future draft publish
gate; it is not publication, production readiness, a registry write, or a User
App Shell package replacement.

The builder can create a draft-only object with title, summary, style tags,
difficulty, estimated time, scenarios, tools, product placeholders, step
sequence, region guidance, privacy notice, QA trace, human review trace,
candidate trace, contract trace, preview trace, and gate trace.

The builder and validation must block missing source gate readiness, missing
step sequence, missing privacy notice, raw image references, base64, object
URLs, local paths, MediaPipe runtime assets, personal data, health data, contact
data, biometric data, product shade claims, medical claims, unsupported final
claims, automatic publish markers, registry write markers, production package
markers, and `UserAppTemplatePackage` mutation markers.

Draft handoff can recommend a future draft publish gate, user-facing copy
revision, step guidance revision, region guidance revision, privacy notice
revision, draft-only retention, or blocking. It cannot publish, cannot write a
user app package registry, and cannot replace the current User App Shell
package.

## Phase 10H UserAppTemplatePackage Draft Publish Gate Boundary

Phase 10H draft publish gate and handoff are local administrator aids only.
Gate ready means eligible for future registry preparation; it is not
publication, production readiness, a registry write, or a User App Shell package
replacement.

The gate checks source official draft validation, `draftOnly`, `publishBlocked`,
title and summary, step sequence, region guidance, tools checklist, privacy
notice, QA trace, human review trace, candidate trace, contract trace, preview
trace, gate trace, raw image boundaries, personal data boundaries, medical
claims, product shade claims, unsupported final claims, automatic publish
markers, registry write markers, User App Shell package replacement, production
package markers, User App contract boundary safety, and JSON round-trip
stability.

Draft publish gate handoff can recommend future registry preparation, user
facing copy revision, step guidance revision, region guidance revision, privacy
notice revision, draft-only retention, or blocking. It cannot publish, cannot
write a user app package registry, and cannot replace the current User App
Shell package.
