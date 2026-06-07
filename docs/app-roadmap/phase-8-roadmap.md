# Phase 8 Roadmap

Phase 8 turns the local contract-driven User App MVP Shell evidence into a controlled user-app product route. The roadmap keeps production app work gated and keeps Makeup Engine focused on template production.

## Phase Sequence

| Phase | Name | Goal | Boundary |
| --- | --- | --- | --- |
| 8A | Product Route Decision / App MVP Planning | Decide the app technology route, MVP scope, ownership boundary, and V1 non-goals. | Docs, project-state, and tests only. No production app, backend, database, camera, AR, native app, OpenAI API, training, or repo bootstrap. |
| 8B | PWA / Mobile Web MVP Polish | Polish the local shell with mobile-first user path, PWA metadata, PWA readiness, MVP polish readiness, Chinese copy, and admin QA separation. | Local shell polish only. No service worker, offline cache, backend, database, camera, AR, native app, OpenAI API, analytics, training, ecommerce, community, paid, or production release scope. |
| 8C | User App MVP Trial Pack | Define the first trial-ready `UserAppTemplatePackage` set and sample guidance coverage for user testing. | Content/package selection only unless explicitly expanded. No real user photos, backend, camera, AR, or training from trial users. |
| 8D | Template Content QA for Real User Trial | QA template copy, region instructions, warnings, tools/products, and mobile guidance clarity for a limited trial. | QA and content readiness only. Do not treat QA as app store, backend, camera, AR, accessibility certification, or production release approval. |
| 8E | MVP Release Readiness Gate | Decide whether the MVP is ready for a controlled release path and what later implementation phase is allowed. | Gate decision only unless owner explicitly approves implementation scope. Native, backend, camera, AR, analytics, paid, and app store work stay separate gates. |
| 9A | Internal Trial Operations Pack | Prepare internal trial operations materials after 8E go/go-with-warnings. | Operations docs only. No backend form, analytics collection, camera, AR, App Store/TestFlight, production release, or real user record storage. |
| 9B | Internal Trial Result Review Framework | Review anonymous/mock internal trial signals and classify issues. | Review framework only. No backend collection, production analytics, AI analysis, public recruitment, training, or real user record storage. |
| 9C | Internal Trial Iteration Plan | Convert review decisions into next-iteration workstreams, backlog, and priority. | Iteration planning only. No formal production roadmap, backend issue tracker, production analytics, AI analysis, training, or real user record storage. |

## 8A Completed Decision

- React Web / PWA MVP first.
- Future native, backend, camera, AR, OpenAI API, training, ecommerce, community, and paid scopes deferred.
- Makeup Engine remains template production and contract export owner.
- `UserAppTemplatePackage` remains the handoff contract.
- Future production User App should be a separate app surface or repository only after a later explicit phase gate.

## 8B Entry Criteria

Before starting 8B:

- Phase 8A docs and project-state are current.
- `lastCompletedPhase` is `8A`.
- `nextRecommendedPhase` is `8B`.
- `nextRecommendedPhaseName` is `PWA / Mobile Web MVP Polish`.
- Validation has passed for typecheck, build, project status, context pack, JSON status, JSON context, and Phase 8A scoped docs tests.

## 8B Completed Result

- Lightweight manifest, theme color, and SVG icon placeholder exist.
- PWA readiness and MVP polish readiness reports exist.
- The local shell has a mobile-first home and touch-friendly guidance controls.
- Ordinary user path and administrator QA path are separated.
- Chinese privacy copy keeps local-only, no-upload, and no-training boundaries visible.
- No production PWA runtime, backend, analytics, camera, AR, native app, external API, training, or release scope was added.

## 8C Entry Criteria

- `lastCompletedPhase` is `8B`.
- `nextRecommendedPhase` is `8C`.
- Phase 8B scoped tests and validation have passed.
- The trial pack remains content/package selection only unless explicitly expanded.

## 8C Completed Result

- Local MVP trial pack tasks cover opening the shell, browsing recommendation, selecting template, reading detail, starting guidance, completing at least three steps, viewing tools/products, viewing regions, setting or skipping preferences, reading privacy, and restoring local progress.
- Trial feedback form covers understanding, willingness to follow, step count, tool usefulness, recommendation usefulness, privacy clarity, confusing step, continued use, non-sensitive business interest, and free text.
- Trial readiness checks cover tasks, feedback, privacy, local-only boundary, PWA carryover, mobile shell carryover, user path readiness, and admin QA separation.
- Admin trial panels are available in the local shell without disrupting the ordinary user path.
- No production app, backend, camera, AR, analytics, training, App Store/TestFlight, online release, or real user record collection was added.

## 8D Entry Criteria

- `lastCompletedPhase` is `8C`.
- `nextRecommendedPhase` is `8D`.
- Trial pack, feedback, and readiness scoped tests have passed.
- The next phase remains content QA only unless explicitly expanded.

## 8D Completed Result

- Template content QA checks user-facing title, summary, steps, actionability, regions, tools, products, duration, difficulty, recommendation reasons, privacy/placeholder copy, internal technical terms, and trial suitability.
- Trial template selection separates trial-ready, backup warning, and blocked templates.
- Trial content readiness combines Phase 8C trial pack readiness, feedback readiness, content QA, template selection, privacy boundary, and local-only boundary.
- Admin content QA panels are available in the local shell without disrupting the ordinary user path.
- No production app, backend, camera, AR, analytics, OpenAI/external API usage, AI generation, training, App Store/TestFlight, online release, or real user record collection was added.

## 8E Entry Criteria

- `lastCompletedPhase` is `8D`.
- `nextRecommendedPhase` is `8E`.
- Template content QA, trial template selection, and trial content readiness scoped tests have passed.
- The next phase remains release readiness gate only unless explicitly expanded.

## 8E Completed Result

- MVP release readiness summarizes 8A route, 8B PWA/mobile polish, 8C trial pack, 8D content QA, privacy boundaries, browser/mobile QA evidence, known limitations, and production non-goals.
- Trial go/no-go returns go, go with warnings, or no-go for internal small-scope trial preparation.
- Admin release gate panels are available in the local shell without disrupting the ordinary user path.
- The current next recommended phase is Phase 9A Internal Trial Operations Pack.
- No production app, backend, camera, AR, analytics, OpenAI/external API usage, AI generation, training, App Store/TestFlight, online release, real user record collection, service worker, offline cache, push notification, background sync, install tracking, or new runtime dependency was added.

## 9A Entry Criteria

- `lastCompletedPhase` is `8E`.
- `nextRecommendedPhase` is `9A`.
- MVP release readiness and trial go/no-go scoped tests have passed.
- The next phase remains internal trial operations preparation only unless explicitly expanded.

## 9A Completed Result

- Internal trial operations define broad participant types, session plan, checklist, risks, boundaries, and readiness status.
- Observation guide defines anonymous experience signals and mock/example summaries.
- Outcome review recommends continuing internal trials, revising content, revising shell, blocking for privacy/scope, or entering Phase 9B.
- Admin operations panels are available in the local shell without disrupting the ordinary user path.
- The current next recommended phase is Phase 9B Internal Trial Result Review Framework.
- No public recruitment, production app, backend, camera, AR, analytics, OpenAI/external API usage, AI analysis, training, App Store/TestFlight, online release, real user record collection, or new runtime dependency was added.

## 9B Entry Criteria

- `lastCompletedPhase` is `9A`.
- `nextRecommendedPhase` is `9B`.
- Internal trial operations, observation, outcome review, and documentation scoped tests have passed.
- The next phase remains internal trial result review only unless explicitly expanded.

## 9B Completed Result

- Internal trial result review defines anonymous/mock review dimensions.
- Issue taxonomy classifies content, Shell, guidance, recommendation, privacy, trial ops, template selection, boundary, and unknown issues.
- Decision framework can continue trials, revise content, revise Shell, revise trial pack, pause for privacy/scope, or enter Phase 9C.
- Admin result review panels are available in the local shell without disrupting the ordinary user path.
- The current next recommended phase is Phase 9C Internal Trial Iteration Plan.
- No production analytics, public recruitment, backend, camera, AR, AI analysis, OpenAI/external API usage, training, App Store/TestFlight, online release, real user record collection, or new runtime dependency was added.

## 9C Entry Criteria

- `lastCompletedPhase` is `9B`.
- `nextRecommendedPhase` is `9C`.
- Internal trial result review, issue taxonomy, decision framework, and documentation scoped tests have passed.
- The next phase remains internal trial iteration planning only unless explicitly expanded.

## 9C Completed Result

- Internal trial iteration plan defines workstreams, goals, actions, risks, and iteration status.
- Iteration backlog creates owner-area action items with severity, confidence, actionability, fix type, target iteration, acceptance criteria, and blocked reason.
- Priority framework scores P0/P1/P2/P3/observe-more and forces privacy/boundary risks to P0.
- Admin iteration panels are available in the local shell without disrupting the ordinary user path.
- The current next recommended phase is Phase 9D Internal Trial Learning Summary & Product Decision Gate.
- No formal production roadmap, backend issue tracker, production analytics, public recruitment, backend, camera, AR, AI analysis, OpenAI/external API usage, training, App Store/TestFlight, online release, real user record collection, or new runtime dependency was added.

## Persistent Guardrails

- Do not treat Makeup Engine as the production user app.
- Do not let future User App state mutate `UserAppTemplatePackage`.
- Do not let `SourceImagePackage` directly enter the User App.
- Do not collect, upload, analyze, store, export, or train on real user photos.
- Do not add backend, database, accounts, cloud sync, analytics, camera, AR, OpenAI API, external APIs, native app implementation, ecommerce, community, paid features, model training, online publication, or app store release scope without a later explicit gate.
- Do not treat Phase 9A internal trial operations, observation templates, or outcome review as public recruitment, production release, backend forms, analytics, camera/AR readiness, AI analysis, OpenAI/external API approval, training, App Store/TestFlight, or real user data collection approval.
- Do not treat Phase 9B internal trial result review, issue taxonomy, or decision framework as production analytics, backend collection, public recruitment, AI analysis, OpenAI/external API approval, training, App Store/TestFlight, or real user data collection approval.
- Do not treat Phase 9C internal trial iteration plan, backlog, or priority framework as a formal production roadmap, backend issue tracker, production analytics, public recruitment, AI analysis, OpenAI/external API approval, training, App Store/TestFlight, or real user data collection approval.
