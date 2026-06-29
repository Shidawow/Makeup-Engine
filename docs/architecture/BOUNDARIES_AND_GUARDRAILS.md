# Boundaries And Guardrails

## Phase 13C Guardrails

Phase 13C sprint planning must remain local and planning-only:

- sprint planning is not final roadmap
- founder/internal feedback is not real user research
- no analytics
- no backend or database
- no real user feedback collection
- no real user photos, base64, local photo paths, personal data, or biometrics
- no registry write or registry mutation
- no publish
- no production writer
- no User App Shell package replacement
- no camera, AR, OpenAI API, external AI API, or model training
- no fully automatic high-quality makeup extraction claim

Every `do_in_13d` item must keep owner role and acceptance criteria. Production
gaps must remain deferred unless a future explicit phase re-scopes them.

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
- Phase 10K controlled registry writer draft is dry-run-only. It must not
  execute registry writes, publish, create a production package, replace the
  current User App Shell package, call backend/API services, call OpenAI or
  external AI/CV APIs, train models, or treat writer readiness as authorization.
- Phase 10L explicit registry write authorization gate is authorization-gate
  metadata only. It must not authorize or execute registry writes, publish,
  create a production package, replace the current User App Shell package, call
  backend/API services, call OpenAI or external AI/CV APIs, train models, or
  treat gate readiness as real write approval.
- Phase 10M controlled registry write execution design is design/dry-run-only
  metadata only. It must not authorize or execute registry writes, publish,
  create a production package, replace the current User App Shell package, call
  backend/API services, call OpenAI or external AI/CV APIs, train models, or
  treat design readiness as real write implementation approval.

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

## Phase 10K Controlled Registry Writer Draft Boundary

Phase 10K controlled writer draft, validation, and handoff are local
administrator dry-run aids only. They may produce a proposed registry entry
preview, existing entry preview, write plan, diff preview, rollback plan, and
handoff for a future explicit authorization gate, but they must not execute a
registry write, publish, create a production package, replace the current User
App Shell package, or authorize mutation.

Phase 10K may use only Phase 10J gate-ready or gate-ready-with-warnings sources.
It must preserve dry-run-only, actual-write-blocked, publish-blocked,
package-replacement-blocked, no-production-package, trace, privacy, User App
contract boundary, and JSON round-trip stability. It must block raw image
references, local paths, object URLs, base64, MediaPipe runtime asset names,
personal data, product shade claims, medical claims, unsupported final claims,
actual registry write markers, production package markers, User App Shell
package replacement markers, and unstable JSON.

## Phase 10L Explicit Registry Write Authorization Gate Boundary

Phase 10L explicit authorization gate, checklist, and handoff are local
administrator aids only. Gate ready means eligible for future controlled write
execution design; it is not actual write authorization, registry write
execution, publication, production readiness, production package creation, or a
User App Shell package replacement.

Phase 10L may use only Phase 10K writer-validation-ready or
writer-validation-ready-with-warnings sources. It must preserve dry-run-only,
actual-write-blocked, publish-blocked, package-replacement-blocked, production
write disabled, future owner authorization required, no-production-package,
trace, privacy, User App contract boundary, and JSON round-trip stability. It
must block raw image references, local paths, object URLs, base64, MediaPipe
runtime asset names, personal data, product shade claims, medical claims,
unsupported final claims, actual registry write markers, production package
markers, User App Shell package replacement markers, missing reviewer
acknowledgement, missing owner authorization requirement, and unstable JSON.

## Phase 10M Controlled Registry Write Execution Design Boundary

Phase 10M controlled execution design, validation, and handoff are local
administrator aids only. Design ready means eligible for a future real write
implementation gate; it is not actual write authorization, registry write
execution, publication, production readiness, production package creation, or a
User App Shell package replacement.

Phase 10M may use only Phase 10L authorization-gate-ready or
authorization-gate-ready-with-warnings sources. It must preserve
design/dry-run-only, actual-write-blocked, publish-blocked,
package-replacement-blocked, audit plan, rollback execution design, write lock
requirements, future owner authorization required, no-production-package, trace,
privacy, User App contract boundary, and JSON round-trip stability. It must
block raw image references, local paths, object URLs, base64, MediaPipe runtime
asset names, personal data, product shade claims, medical claims, unsupported
final claims, actual registry write markers, production package markers, User
App Shell package replacement markers, missing audit plan, missing rollback
design, missing write lock requirements, missing owner authorization trace, and
unstable JSON.

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

## Phase 10I UserAppTemplatePackage Registry Preparation Boundary

Phase 10I registry preparation, validation, and handoff are local administrator
aids only. Preparation ready means eligible for a future registry write gate; it
is not registry write execution, publication, production readiness, or a User
App Shell package replacement.

The preparation can create a registry entry preview with package id/version
candidates, title, summary, style tags, difficulty, estimated time, step count,
safety flags, privacy notice, QA trace, human review trace, candidate trace,
contract trace, preview trace, official draft trace, and publish gate trace.

Validation must block missing Phase 10H source gate readiness, missing
registry entry preview, missing package id/version candidates, missing
`draftOnly`, missing `publishBlocked`, missing `registryWriteBlocked`, raw image
references, base64, object URLs, local paths, MediaPipe runtime assets, personal
data, health data, contact data, biometric data, product shade claims, medical
claims, unsupported final claims, actual registry write markers, User App Shell
package replacement markers, production package markers, and unstable JSON.

Registry preparation handoff can recommend a future registry write gate,
package metadata revision, versioning review, privacy review, User App Shell
boundary review, preview-only retention, or blocking. It cannot write the
registry, cannot publish, cannot mark a production package, and cannot replace
the current User App Shell package.

## Phase 10J UserAppTemplatePackage Registry Write Gate Boundary

Phase 10J registry write gate and handoff are local administrator aids only.
Gate ready means eligible for a future controlled registry writer draft; it is
not registry write execution, publication, production readiness, production
package creation, or a User App Shell package replacement.

The gate checks Phase 10I registry preparation validation readiness, registry
entry preview presence, package id/version candidates, `draftOnly`,
`publishBlocked`, `registryWriteBlocked`, QA trace, human review trace,
candidate trace, contract trace, preview trace, publish gate trace, registry
preparation trace, raw image boundaries, personal data boundaries, medical
claims, product shade claims, unsupported final claims, actual registry write
markers, User App Shell package replacement markers, production package
markers, User App contract boundary safety, and JSON round-trip stability.

Registry write gate handoff can recommend a future controlled registry writer,
package metadata revision, versioning review, privacy review, User App Shell
boundary review, preview-only retention, or blocking. It cannot write the
registry, cannot publish, cannot mark a production package, and cannot replace
the current User App Shell package.

## Phase 10N Real Registry Write Implementation Gate Boundary

Phase 10N real registry write implementation gate, checklist, and handoff are
local administrator aids only. Gate ready means eligible for a future real
implementation draft; it is not actual write authorization, not a production
writer implementation, not registry write execution, not publication, not
production readiness, not production package creation, and not a User App Shell
package replacement.

The gate checks Phase 10M execution validation readiness, dry-run-only,
actual-write-blocked, publish-blocked, package-replacement-blocked, audit plan,
rollback design, write lock requirements, owner authorization trace, future
explicit approval, trace preservation, raw image boundaries, personal data
boundaries, medical claims, product shade claims, unsupported final claims,
actual registry write markers, production writer or production package markers,
User App Shell package replacement markers, and JSON round-trip stability.

Implementation gate handoff can recommend a future real implementation draft,
execution plan revision, audit plan revision, rollback design revision, write
lock review, owner authorization review, execution-design-only retention, or
blocking. It cannot implement or execute the writer, cannot write the registry,
cannot publish, cannot mark a production package, and cannot replace the
current User App Shell package.

## Phase 10O Real Registry Write Implementation Draft Boundary

Phase 10O real registry write implementation draft, validation, and handoff are
local administrator aids only. Draft ready means eligible for a future final
real write review gate; it is not actual registry write, not production writer
readiness, not registry write execution, not publication, not production
readiness, not production package creation, and not a User App Shell package
replacement.

The draft checks Phase 10N implementation gate readiness, dry-run-only,
actual-write-blocked, publish-blocked, package-replacement-blocked,
production-writer-blocked, writer interface draft, transaction draft, write lock
draft, audit event draft, rollback command draft, trace preservation, raw image
boundaries, personal data boundaries, medical claims, product shade claims,
unsupported final claims, actual registry write markers, production writer or
production package markers, User App Shell package replacement markers, and JSON
round-trip stability.

Implementation draft handoff can recommend a future final real write review
gate, writer interface revision, transaction revision, write lock revision,
audit event revision, rollback command revision, owner authorization review,
implementation-draft-only retention, or blocking. It cannot create or execute a
production writer, cannot write the registry, cannot publish, cannot mark a
production package, and cannot replace the current User App Shell package.

## Phase 10P Final Real Write Review Gate Boundary

Phase 10P final real write review gate, checklist, and handoff are local
administrator aids only. Gate ready means eligible for a future real write
execution authorization phase; it is not actual registry write authorization,
not production writer readiness, not registry write execution, not publication,
not production readiness, not production package creation, and not a User App
Shell package replacement.

The owner authorization evidence is review-gate-only:

`授权范围：A。只授权进入 Phase 10P 最终真实写入复核闸门，不授权真实写入 registry，不授权发布，不授权替换当前 User App Shell package。`

The gate checks Phase 10O implementation draft validation readiness, owner
authorization scope, dry-run-only, actual-write-blocked, publish-blocked,
package-replacement-blocked, production-writer-blocked, writer interface draft,
transaction draft, write lock draft, audit event draft, rollback command draft,
production write disabled state, future separate approval, trace preservation,
raw image boundaries, personal data boundaries, medical claims, product shade
claims, unsupported final claims, actual registry write markers, production
writer or production package markers, User App Shell package replacement
markers, and JSON round-trip stability.

Final review handoff can recommend a future real write execution authorization
phase, writer interface revision, transaction revision, write lock revision,
audit event revision, rollback command revision, owner authorization
clarification, final-review-only retention, or blocking. It cannot authorize or
execute a registry write, cannot create or execute a production writer, cannot
publish, cannot mark a production package, and cannot replace the current User
App Shell package.

## Phase 10Q Real Write Execution Authorization Boundary

Phase 10Q real write execution authorization, checklist, and handoff are local
administrator aids only. Authorization ready means eligible for a future real
write execution plan; it is not actual registry write authorization, not
production writer readiness, not registry write execution, not publication, not
production readiness, not production package creation, and not a User App Shell
package replacement.

The owner authorization evidence is Phase-10Q-only:

`授权范围：A。只授权进入 Phase 10Q — Real Write Execution Authorization，不授权真实写入 registry，不授权发布，不授权替换当前 User App Shell package，不授权创建 production writer。`

The authorization model checks Phase 10P final review gate readiness, owner
authorization scope, dry-run-only, actual-write-blocked, publish-blocked,
package-replacement-blocked, production-writer-blocked, production write
disabled state, future separate approval, trace preservation, raw image
boundaries, personal data boundaries, medical claims, product shade claims,
unsupported final claims, actual registry write markers, production package
markers, User App Shell package replacement markers, production writer creation
markers, and JSON round-trip stability.

Execution authorization handoff can recommend a future real write execution
plan, authorization scope clarification, final review revision, actual-write
owner authorization request, authorization-model-only retention, or blocking. It
cannot authorize or execute a registry write, cannot create or execute a
production writer, cannot publish, cannot mark a production package, and cannot
replace the current User App Shell package.

## Phase 10R Real Write Execution Plan Boundary

Phase 10R real write execution plan, validation, and handoff are local
administrator aids only. Plan ready means eligible for a future guarded
execution simulator; it is not actual registry write authorization, not registry
write execution, not production writer readiness, not production writer
creation, not publication, not production readiness, not production package
creation, and not a User App Shell package replacement.

The plan checks Phase 10Q execution authorization readiness, dry-run-only,
actual-write-blocked, publish-blocked, package-replacement-blocked,
production-writer-blocked, execution sequence, preflight plan, write lock plan,
audit plan, rollback plan, failure handling plan, dry-run verification plan,
trace preservation, raw image boundaries, personal data boundaries, medical
claims, product shade claims, unsupported final claims, actual registry write
markers, production package markers, User App Shell package replacement
markers, production writer creation markers, and JSON round-trip stability.

Execution plan handoff can recommend a future guarded execution simulator,
execution sequence revision, preflight revision, write lock revision, audit plan
revision, rollback plan revision, failure handling revision, actual-write owner
authorization request, execution-plan-only retention, or blocking. It cannot
authorize or execute a registry write, cannot create or execute a production
writer, cannot publish, cannot mark a production package, and cannot replace
the current User App Shell package.

## Phase 10S Guarded Real Write Execution Simulator Boundary

Phase 10S guarded real write execution simulator, validation, and handoff are local administrator aids only. Simulation ready means eligible for a future guarded simulator review gate; it is not actual registry write authorization, not registry write execution, not registry mutation, not production writer readiness, not production writer creation, not publication, not production readiness, not production package creation, and not a User App Shell package replacement.

The simulator checks Phase 10R execution plan validation readiness, simulation mode, dry-run-only, actual-write-blocked, publish-blocked, package-replacement-blocked, production-writer-blocked, registry-mutation-blocked, simulated preflight, simulated write lock, simulated operation, simulated audit events, simulated rollback, simulated failure handling, trace preservation, raw image boundaries, personal data boundaries, medical claims, product shade claims, unsupported final claims, actual registry write markers, registry mutation markers, production package markers, User App Shell package replacement markers, production writer creation markers, and JSON round-trip stability.

Simulator handoff can recommend a future guarded simulator review gate, simulation section revisions, actual-write owner authorization request, simulator-only retention, or blocking. It cannot authorize or execute a registry write, cannot mutate registry state, cannot create or execute a production writer, cannot publish, cannot mark a production package, and cannot replace the current User App Shell package.

## Phase 10T Guarded Simulator Review Gate Boundary

Phase 10T guarded simulator review gate, checklist, and handoff are local
administrator aids only. Review gate ready means eligible for a future real
write approval boundary; it is not actual registry write authorization, not
registry write execution, not registry mutation, not production writer
readiness, not production writer creation, not publication, not production
readiness, not production package creation, and not a User App Shell package
replacement.

The review gate checks Phase 10S simulation validation readiness,
dry-run-only, actual-write-blocked, publish-blocked, package-replacement-blocked,
production-writer-blocked, registry-mutation-blocked, simulated preflight
review, simulated write lock review, simulated operation review, simulated
audit event review, simulated rollback review, simulated failure handling
review, future separate owner approval, trace preservation, raw image
boundaries, personal data boundaries, medical claims, product shade claims,
unsupported final claims, actual registry write markers, registry mutation
markers, production package markers, User App Shell package replacement
markers, production writer creation markers, and JSON round-trip stability.

Review handoff can recommend a future real write approval boundary, simulator
section revisions, actual-write owner authorization request, simulator-review
retention, or blocking. It cannot authorize or execute a registry write, cannot
mutate registry state, cannot create or execute a production writer, cannot
publish, cannot mark a production package, and cannot replace the current User
App Shell package.

## Phase 10U Real Write Approval Boundary

Phase 10U adds a local administrator-only Real Write Approval Boundary after Phase 10T guarded simulator review gate readiness. It records approval scope, checklist, audit requirements, rollback approval requirements, blocked reasons, and handoff for a future Phase 10V authorization request only. It does not authorize actual registry write, registry mutation, publication, current User App Shell package replacement, production package creation, backend work, OpenAI/external API usage, camera/AR scope, training, or production writer creation.

## Phase 11A User App MVP Experience Reset

Phase 11A pauses the registry chain after Phase 10U and returns active work to
the ordinary-user User App MVP experience. The ordinary-user path must hide
registry, write gate, publish gate, simulator, approval boundary, production
writer, Pipeline Trace, FaceMesh debug JSON, candidate package, and draft
validation terminology by default.

Phase 11A must not resume Phase 10V, execute real registry writes, mutate
registry state, publish, create a production writer, replace the current User
App Shell package, add backend/database/login/payment/camera/AR/OpenAI/external
API scope, or train models.

## Phase 11B User App Guided Step Experience Polish

Phase 11B is ordinary-user User App MVP shell polish only. It may improve
preparation, step guidance, mobile touch actions, progress feedback, and
completion summaries, but it must not resume Phase 10V, execute real registry
writes, mutate registry state, publish, create a production writer, replace the
current User App Shell package, add backend/database/login/payment/camera/AR/
OpenAI/external API scope, or train models.

Phase 11B ordinary-user paths must keep registry, write gate, publish gate,
simulator, approval boundary, production writer, Pipeline Trace, debug JSON,
Template Studio admin-only terms, and production readiness wording hidden by
default.

## Phase 11C User App Visual Guidance & Template Content Polish

Phase 11C is ordinary-user User App MVP shell polish only. It may improve local
Chinese template content, step preview, region guidance, preparation copy,
region badges, intensity reminders, technique breakdowns, final checks, and
completion summaries, but it must not resume Phase 10V, execute real registry
writes, mutate registry state, publish, create a production writer, replace the
current User App Shell package, add backend/database/login/payment/camera/AR/
OpenAI/external API scope, or train models.

Phase 11C ordinary-user paths must keep registry, write gate, publish gate,
simulator, approval boundary, production writer, Pipeline Trace, debug JSON,
Template Studio admin-only terms, and production readiness wording hidden by
default.

## Phase 11D User App Demo Readiness & Operator QA

Phase 11D is local demo and operator-QA packaging only. It may document demo
steps, operator checks, known limitations, forbidden terms, mobile checks,
Vision Analysis notes, Template Studio notes, and Git hygiene checks.

Phase 11D must not resume Phase 10V, execute real registry writes, mutate
registry state, publish, create a production writer, replace the current User
App Shell package, add backend/database/login/payment/camera/AR/OpenAI or
external API scope, upload real photos, store real user data, or train models.

Phase 11D ordinary-user paths must keep registry, write gate, publish gate,
simulator, approval boundary, production writer, Pipeline Trace, debug JSON,
Template Studio, published/write/production-ready wording, `Confidence 95%`,
and raw model confidence wording hidden by default.

## Phase 12A Photo-to-Template Draft Reality Check

Phase 12A is an operator-only reality audit. It may classify fields as
real_from_photo, facemesh_derived, region_qa_derived, pixel_rule_derived,
semantic_rule_derived, template_rule_derived, demo_fixture, placeholder,
human_required, or unsupported.

Phase 12A must not claim fully automatic high-quality makeup extraction from
arbitrary photos. It must keep Readiness Score labeled as rule-based detection
usability scoring, not model raw confidence.

Phase 12A must not mark demo fixtures, placeholders, template copy, app preview
copy, or unsupported makeup semantics as real_from_photo.

Phase 12A must not resume Phase 10V, execute real registry writes, mutate
registry state, publish, create a production writer, replace the current User
App Shell package, add backend/database/login/payment/camera/AR/OpenAI or
external API scope, upload real photos, store real user data, or train models.

Phase 12A ordinary-user paths must not expose Photo-to-Template Reality Check,
field source matrix, Template Studio, registry/write/publish/simulator/
production writer, or automatic extraction operator terminology by default.

## Phase 12B Makeup Semantic Extraction Baseline

Phase 12B is an operator-only semantic candidate baseline. It may create
`MakeupSemanticExtractionReport` and `MakeupSemanticCandidate` values from
local FaceMesh region QA, local pixel analysis, weighted color samples,
skin-baseline contrast, edge/brightness signals, cosmetic region parameters,
and deterministic rules.

Phase 12B source labels must remain explicit:
`region_pixel_derived`, `facemesh_region_derived`, `color_rule_derived`,
`brightness_rule_derived`, `saturation_rule_derived`,
`semantic_rule_derived`, `insufficient_evidence`, and
`human_review_required`.

Phase 12B must keep every semantic output candidate-only and human-review
required. It must not claim final recognition, AI-confirmed extraction, product
shade matching, medical or skin diagnosis, fully automatic high-quality makeup
extraction, registry readiness, publish readiness, production readiness, or
User App Shell package replacement.

Phase 12B must not resume Phase 10V, execute real registry writes, mutate
registry state, publish, create a production writer, replace the current User
App Shell package, add backend/database/login/payment/camera/AR/OpenAI or
external API scope, upload real photos, store real user data, or train models.

Phase 12B ordinary-user paths must not expose Makeup Semantic Extraction
Baseline, semantic candidate source labels, Template Studio, registry/write/
publish/simulator/production writer, or automatic extraction operator
terminology by default.

## Phase 12C Photo-to-Template Draft Integration & Human Review Editing

Phase 12C is an operator-only draft integration and human review editing layer.
It may bind Phase 12B semantic candidates to draft fields and allow local
review decisions, but every output remains candidate-only, draft-only,
human-review-required, and not final.

Phase 12C must preserve source type, confidence band, evidence, limitations,
original candidate value, editable draft value, reviewer decision, reviewer
note, `humanReviewRequired`, and `notFinal` for every bound field.

Phase 12C must block final recognition claims, AI-confirmed claims, fully
automatic high-quality extraction claims, product shade hard claims, medical or
skin diagnosis claims, registry write claims, publish claims, production writer
claims, User App Shell replacement claims, and `UserAppTemplatePackage`
mutation markers.

Phase 12C must not resume Phase 10V, execute real registry writes, mutate
registry state, publish, create a production writer, replace the current User
App Shell package, add backend/database/login/payment/camera/AR/OpenAI or
external API scope, upload real photos, store real user data, or train models.

Phase 12C ordinary-user paths must not expose semantic candidate source type,
confidence band, evidence, limitations, reviewer notes, draft integration,
human review editing, Template Studio, registry/write/publish/simulator/
production writer, or automatic extraction operator terminology by default.

## Phase 12D Photo-to-Template Operator Workflow & Draft Preview QA

Phase 12D is an operator-only workflow and draft preview QA layer. It may show
workflow step status, next action, blocked reasons, allowed handoff, forbidden
destinations, and user-visible draft preview QA checks, but every output remains
draft-preview-only and human-review-required.

Phase 12D must block internal source type, confidence band, evidence,
limitations, reviewer decision, reviewer note, `humanReviewRequired`, and
`notFinal` from ordinary user-facing preview copy.

Phase 12D must block final recognition claims, AI-confirmed claims, fully
automatic high-quality extraction claims, product shade hard claims, medical or
skin diagnosis claims, registry write claims, publish claims, production writer
claims, User App Shell replacement claims, and `UserAppTemplatePackage`
mutation markers.

Phase 12D must not resume Phase 10V, execute real registry writes, mutate
registry state, publish, create a production writer, replace the current User
App Shell package, add backend/database/login/payment/camera/AR/OpenAI or
external API scope, upload real photos, store real user data, or train models.

Phase 12D ordinary-user paths must not expose Photo-to-Template Operator
Workflow, Draft Preview QA, sourceType, confidenceBand, evidence, limitations,
reviewerDecision, reviewer notes, Template Studio, registry/write/publish/
simulator/production writer, or automatic extraction operator terminology by
default.

## Phase 12E Photo-to-Template End-to-End Demo Script & Acceptance Trial

Phase 12E is an operator/founder demo script and acceptance trial layer. It may
show demo route status, checklist status, forbidden claim checks, privacy
checks, validation evidence, and next action, but every output remains
demo-readiness-only, draft-preview-only, and human-review-required.

Phase 12E must not be treated as production readiness, registry readiness,
publish readiness, fully automatic extraction, final recognition, or
`UserAppTemplatePackage` mutation.

Phase 12E must not resume Phase 10V, execute real registry writes, mutate
registry state, publish, create a production writer, replace the current User
App Shell package, add backend/database/login/payment/camera/AR/OpenAI or
external API scope, upload real photos, store real user data, or train models.

Phase 12E ordinary-user paths must not expose Acceptance Trial, Operator
Workflow, Draft Preview QA, sourceType, confidenceBand, evidence, limitations,
reviewerDecision, reviewerNote, humanReviewRequired, notFinal, Template Studio,
registry/write/publish/simulator/production writer, Pipeline Trace, debug JSON,
or automatic extraction operator terminology by default.

## Phase 13A MVP Trial Content Pack & Founder Demo Review

Phase 13A is a founder-demo-only content and review layer. Trial content can be
shown as MVP demo content, but it is not official Template Library content and
is not production readiness.

Phase 13A must block ordinary user exposure of Founder Demo Review, trial
content pack, sourceLabel, demo_fixture, notFromAutomaticExtraction,
humanReviewRecommended, Acceptance Trial, Operator Workflow, Draft Preview QA,
Template Studio, registry/write/publish/simulator/production writer, Pipeline
Trace, debug JSON, or automatic extraction operator terminology by default.

Phase 13A must block fully automatic high-quality extraction claims,
AI-confirmed final recognition claims, product shade hard claims, medical or
skin diagnosis claims, registry write claims, publish claims, production writer
claims, User App Shell replacement claims, and `UserAppTemplatePackage`
mutation markers.

Phase 13A must not resume Phase 10V, execute real registry writes, mutate
registry state, publish, create a production writer, replace the current User
App Shell package, add backend/database/login/payment/camera/AR/OpenAI or
external API scope, upload real photos, store real user data, or train models.

## Phase 13B Founder Trial Feedback Capture & MVP Gap Prioritization

Phase 13B founder feedback is founder/internal-only. It must not be treated as
real user research, analytics, public market validation, production readiness,
or a final product roadmap.

Phase 13B must not collect personal data, real user photos, base64 images,
local photo paths, biometric data, backend records, analytics ids, or training
data.

Phase 13B must separate MVP demo gaps from production gaps. Production gaps can
be recorded, but they are deferred and cannot become current registry, publish,
production writer, backend, analytics, or User App Shell replacement work.

Phase 13B ordinary-user paths must not expose Founder Trial Feedback, MVP Gap
Prioritization, internal feedback categories, priority decisions, Template
Studio, registry/write/publish/simulator/production writer, Pipeline Trace,
debug JSON, or automatic extraction operator terminology by default.

Phase 13B must not resume Phase 10V, execute real registry writes, mutate
registry state, publish, create a production writer, replace the current User
App Shell package, add backend/database/login/payment/camera/AR/OpenAI or
external API scope, upload real photos, store real user data, or train models.
